import { MasterBank } from "../data-access/seed-data";
import { queryGeminiRatesForBank } from "./gemini";
import { isOfficialSource } from "./source-validator";
import { validateRates } from "./validator";
import { getSupabaseAdminClient } from "../supabase/server";

export interface SyncBankResult {
  bankId: string;
  bankCode: string;
  status: "success" | "partial" | "not_found" | "needs_review" | "failed";
  oldRateCount: number;
  newRateCount: number;
  sourceUrl?: string;
  error?: string;
}

/**
 * Đồng bộ biểu lãi suất cho 1 ngân hàng với đầy đủ quy trình kiểm định và bảo toàn dữ liệu cũ.
 * Có thể nhận prefetchedResult từ batch query để tiết kiệm lượt gọi Gemini API.
 */
export async function syncBankRates(
  bank: MasterBank,
  prefetchedResult?: import("./schema").GeminiBankRateResult
): Promise<SyncBankResult> {
  const supabase = getSupabaseAdminClient();

  try {
    // 1. Lấy dữ liệu hiện hành từ DB để làm cơ sở đối chiếu biến động (Anomaly Detection)
    let existingRatesMap = new Map<string, number>();
    let oldRateCount = 0;

    if (supabase) {
      const { data: existingRows } = await supabase
        .from("deposit_rates")
        .select("channel, term_value, term_unit, payment_method, interest_rate")
        .eq("bank_id", bank.id);

      if (existingRows && existingRows.length > 0) {
        oldRateCount = existingRows.length;
        existingRows.forEach((row: any) => {
          const key = `${row.channel}-${row.term_value}-${row.term_unit}-${row.payment_method}`;
          existingRatesMap.set(key, Number(row.interest_rate));
        });
      }
    }

    // 2. Dùng dữ liệu prefetched từ batch hoặc gọi Gemini đơn lẻ
    const aiResult = prefetchedResult || (await queryGeminiRatesForBank(bank));

    if (aiResult.status === "not_found" || !aiResult.rates || aiResult.rates.length === 0) {
      // LAST-KNOWN-GOOD STRATEGY: Giữ nguyên dữ liệu hiện tại, không xóa hay set null
      return {
        bankId: bank.id,
        bankCode: bank.code,
        status: "not_found",
        oldRateCount,
        newRateCount: 0,
        error: "Không tìm thấy biểu lãi suất chính thức được xác nhận hôm nay.",
      };
    }

    // 3. Kiểm định nguồn (Official Domain Validator)
    const sourceUrl = aiResult.source?.url || "";
    const isOfficial = isOfficialSource(sourceUrl, bank.official_domain);

    if (!isOfficial) {
      // Bác bỏ dữ liệu vì nguồn không thuộc official domain của ngân hàng
      return {
        bankId: bank.id,
        bankCode: bank.code,
        status: "needs_review",
        oldRateCount,
        newRateCount: 0,
        sourceUrl,
        error: `Nguồn trích xuất (${sourceUrl}) không khớp với official domain (${bank.official_domain}).`,
      };
    }

    // 4. Kiểm định tính hợp lý và phát hiện bất thường (Rate Sanity & Anomaly Detection)
    const validation = validateRates(aiResult.rates, existingRatesMap);

    if (!validation.isValid || validation.validatedRates.length === 0) {
      return {
        bankId: bank.id,
        bankCode: bank.code,
        status: "needs_review",
        oldRateCount,
        newRateCount: 0,
        sourceUrl,
        error: validation.reasons.join(" | "),
      };
    }

    // 5. Cập nhật vào Supabase nếu có client admin
    if (supabase) {
      const now = new Date().toISOString();

      for (const rateItem of validation.validatedRates) {
        const key = `${rateItem.channel}-${rateItem.termValue}-${rateItem.termUnit}-${rateItem.paymentMethod}`;
        const previousRate = existingRatesMap.get(key);

        // Ghi nhận lịch sử nếu mức lãi suất thực sự thay đổi
        if (previousRate !== undefined && previousRate !== rateItem.rate) {
          await supabase.from("deposit_rate_history").insert({
            bank_id: bank.id,
            currency: rateItem.currency,
            channel: rateItem.channel,
            term_value: rateItem.termValue,
            term_unit: rateItem.termUnit,
            payment_method: rateItem.paymentMethod,
            old_rate: previousRate,
            new_rate: rateItem.rate,
            source_url: sourceUrl,
            detected_at: now,
          });
        }

        // Upsert vào deposit_rates
        await supabase.from("deposit_rates").upsert(
          {
            bank_id: bank.id,
            currency: rateItem.currency,
            channel: rateItem.channel,
            term_value: rateItem.termValue,
            term_unit: rateItem.termUnit,
            interest_rate: rateItem.rate,
            payment_method: rateItem.paymentMethod,
            min_amount: rateItem.minAmount || 0,
            max_amount: rateItem.maxAmount,
            customer_segment: rateItem.customerSegment || "individual",
            note: rateItem.note,
            source_url: sourceUrl,
            verified_at: now,
            updated_at: now,
          },
          {
            onConflict: "bank_id,currency,channel,term_value,term_unit,payment_method,customer_segment",
          }
        );
      }

      // Cập nhật bank_rate_sources
      if (sourceUrl) {
        await supabase.from("bank_rate_sources").upsert({
          bank_id: bank.id,
          url: sourceUrl,
          source_type: "official_page",
          active: true,
          last_checked_at: now,
          last_success_at: now,
          updated_at: now,
        });
      }
    }

    return {
      bankId: bank.id,
      bankCode: bank.code,
      status: aiResult.status,
      oldRateCount,
      newRateCount: validation.validatedRates.length,
      sourceUrl,
    };
  } catch (err: any) {
    if (err?.name === "GeminiQuotaExceededError") {
      throw err;
    }
    console.error(`Sync failure for bank ${bank.code}:`, err);
    return {
      bankId: bank.id,
      bankCode: bank.code,
      status: "failed",
      oldRateCount: 0,
      newRateCount: 0,
      error: err.message || "Unknown error during sync",
    };
  }
}
