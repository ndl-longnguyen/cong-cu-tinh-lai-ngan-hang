import { getBanks } from "../data-access/banks";
import { syncBankRates, SyncBankResult } from "./sync-bank";
import { queryGeminiBatchRates } from "./gemini";
import { getSupabaseAdminClient } from "../supabase/server";

export interface FullSyncResult {
  runId: string;
  status: "completed" | "already_running" | "failed" | "quota_limited";
  totalBanks: number;
  processedBanks: number;
  successBanks: number;
  partialBanks: number;
  failedBanks: number;
  needsReviewBanks: number;
  details: SyncBankResult[];
  error?: string;
}

/**
 * ĐIỀU PHỐI TIẾN TRÌNH BATCH SYNC:
 * Gom 30 ngân hàng thành các batch 8 - 10 ngân hàng/lần gọi.
 * Toàn bộ 30 ngân hàng chỉ tốn đúng 3 - 4 requests/ngày -> An toàn tuyệt đối cho Free Tier!
 */
export async function syncAllBanks(batchSize: number = 10): Promise<FullSyncResult> {
  const supabase = getSupabaseAdminClient();
  const allBanks = await getBanks();
  let runId = `local-${Date.now()}`;

  // 1. Kiểm tra Concurrency: Chống 2 task sync chạy đồng thời
  if (supabase) {
    const fifteenMinutesAgo = new Date(Date.now() - 15 * 60 * 1000).toISOString();
    const { data: runningRuns } = await supabase
      .from("rate_sync_runs")
      .select("id, started_at")
      .eq("status", "running")
      .gte("started_at", fifteenMinutesAgo);

    if (runningRuns && runningRuns.length > 0) {
      console.warn("Another rate sync task is already running. Skipping execution.");
      return {
        runId: runningRuns[0].id,
        status: "already_running",
        totalBanks: allBanks.length,
        processedBanks: 0,
        successBanks: 0,
        partialBanks: 0,
        failedBanks: 0,
        needsReviewBanks: 0,
        details: [],
        error: "Một phiên đồng bộ khác đang chạy trong 15 phút gần nhất.",
      };
    }

    // Tạo bản ghi bắt đầu tiến trình sync
    const { data: createdRun } = await supabase
      .from("rate_sync_runs")
      .insert({
        status: "running",
        total_banks: allBanks.length,
        started_at: new Date().toISOString(),
      })
      .select("id")
      .single();

    if (createdRun) {
      runId = createdRun.id;
    }
  }

  const details: SyncBankResult[] = [];
  let successCount = 0;
  let partialCount = 0;
  let failedCount = 0;
  let needsReviewCount = 0;
  let isQuotaHalted = false;

  // 2. Chia 30 ngân hàng thành các batch nhỏ 8 - 10 ngân hàng
  const chunks: (typeof allBanks)[] = [];
  for (let i = 0; i < allBanks.length; i += batchSize) {
    chunks.push(allBanks.slice(i, i + batchSize));
  }

  console.log(`[Batch Sync] Bắt đầu đồng bộ ${allBanks.length} ngân hàng qua ${chunks.length} batch requests...`);

  for (let cIdx = 0; cIdx < chunks.length; cIdx++) {
    const batchBanks = chunks[cIdx];
    console.log(`\n[Batch Sync ${cIdx + 1}/${chunks.length}] Đang gửi 1 request gom ${batchBanks.length} ngân hàng: ${batchBanks.map((b) => b.short_name).join(", ")}`);

    let batchResultMap = new Map<string, any>();
    try {
      // GỌI DUY NHẤT 1 REQUEST CHO CẢ NHÓM 10 NGÂN HÀNG!
      batchResultMap = await queryGeminiBatchRates(batchBanks);
    } catch (batchErr: any) {
      if (batchErr?.name === "GeminiQuotaExceededError") {
        console.warn(`[Quota Guard] Đã chạm giới hạn quota Free Tier. Dừng gửi thêm request.`);
        isQuotaHalted = true;
        break;
      }
      console.error(`[Batch ${cIdx + 1} Error]:`, batchErr.message || batchErr);
    }

    // Xử lý kiểm định và lưu DB cho từng ngân hàng trong batch
    for (const bank of batchBanks) {
      try {
        const prefetched = batchResultMap.get(bank.id);
        const result = await syncBankRates(bank, prefetched);
        details.push(result);

        if (result.status === "success") successCount++;
        else if (result.status === "partial") partialCount++;
        else if (result.status === "needs_review") needsReviewCount++;
        else failedCount++;

        // Lưu kết quả chi tiết từng ngân hàng vào DB
        if (supabase && runId && !runId.startsWith("local-")) {
          await supabase.from("rate_sync_bank_results").insert({
            sync_run_id: runId,
            bank_id: bank.id,
            status: result.status,
            old_rate_count: result.oldRateCount,
            new_rate_count: result.newRateCount,
            source_url: result.sourceUrl,
            error: result.error,
          });
        }
      } catch (bankErr: any) {
        failedCount++;
        details.push({
          bankId: bank.id,
          bankCode: bank.code,
          status: "failed",
          oldRateCount: 0,
          newRateCount: 0,
          error: bankErr.message || "Unexpected failure",
        });
      }
    }

    // Nghỉ 2000ms giữa các batch
    if (cIdx < chunks.length - 1) {
      await new Promise((resolve) => setTimeout(resolve, 2000));
    }
  }

  const finalStatus = isQuotaHalted ? "quota_limited" : "completed";

  // 3. Cập nhật trạng thái hoàn thành của tiến trình
  if (supabase && runId && !runId.startsWith("local-")) {
    await supabase
      .from("rate_sync_runs")
      .update({
        status: finalStatus,
        success_banks: successCount,
        partial_banks: partialCount,
        failed_banks: failedCount,
        finished_at: new Date().toISOString(),
      })
      .eq("id", runId);
  }

  return {
    runId,
    status: finalStatus,
    totalBanks: allBanks.length,
    processedBanks: details.length,
    successBanks: successCount,
    partialBanks: partialCount,
    failedBanks: failedCount,
    needsReviewBanks: needsReviewCount,
    details,
    error: isQuotaHalted
      ? "Đã đạt giới hạn quota Gemini Free Tier. Hệ thống tự động sử dụng biểu lãi suất chuẩn hóa."
      : undefined,
  };
}
