import { getSupabaseServerClient } from "@/lib/supabase/server";
import { BASELINE_RATES, MASTER_BANKS, MasterRate, MasterBank } from "./seed-data";

export interface RateWithBank extends MasterRate {
  bank: MasterBank;
  trend?: "up" | "down" | "unchanged";
  trendDiff?: number;
}

export interface RateHistoryItem {
  id: string;
  bank_id: string;
  channel: "online" | "counter";
  term_value: number;
  term_unit: string;
  old_rate?: number;
  new_rate: number;
  source_url?: string;
  detected_at: string;
}

/**
 * Lấy toàn bộ biểu lãi suất hiện hành kèm thông tin ngân hàng
 */
export async function getLatestRates(): Promise<RateWithBank[]> {
  try {
    const supabase = getSupabaseServerClient();
    if (supabase) {
      const { data, error } = await supabase
        .from("deposit_rates")
        .select("*, banks (*)")
        .order("interest_rate", { ascending: false });

      if (!error && data && data.length > 0) {
        return data.map((row: any) => ({
          id: row.id,
          bank_id: row.bank_id,
          currency: row.currency,
          channel: row.channel,
          term_value: row.term_value,
          term_unit: row.term_unit,
          interest_rate: Number(row.interest_rate),
          payment_method: row.payment_method,
          min_amount: Number(row.min_amount || 0),
          max_amount: row.max_amount ? Number(row.max_amount) : undefined,
          customer_segment: row.customer_segment,
          note: row.note,
          source_url: row.source_url,
          verified_at: row.verified_at,
          bank: row.banks,
        }));
      }
    }
  } catch (err) {
    console.warn("Could not load rates from Supabase, using last-known-good fallback", err);
  }

  // Fallback to baseline rates
  const bankMap = new Map<string, MasterBank>(MASTER_BANKS.map((b) => [b.id, b]));
  return BASELINE_RATES.map((r) => ({
    ...r,
    bank: bankMap.get(r.bank_id) || {
      id: r.bank_id,
      code: r.bank_id.toUpperCase(),
      name: r.bank_id,
      short_name: r.bank_id,
      slug: r.bank_id,
      official_website: "",
      official_domain: "",
      logo: "",
      color: "#1e40af",
      established_year: 2000,
      active: true,
    },
  }));
}

/**
 * Lấy biểu lãi suất của một ngân hàng cụ thể
 */
export async function getRatesByBank(bankId: string): Promise<MasterRate[]> {
  try {
    const supabase = getSupabaseServerClient();
    if (supabase) {
      const { data, error } = await supabase
        .from("deposit_rates")
        .select("*")
        .eq("bank_id", bankId)
        .order("term_value", { ascending: true });

      if (!error && data && data.length > 0) {
        return data.map((row: any) => ({
          ...row,
          interest_rate: Number(row.interest_rate),
          min_amount: Number(row.min_amount || 0),
        }));
      }
    }
  } catch (err) {
    console.warn(`Could not load rates for bank ${bankId} from Supabase, using fallback`, err);
  }

  return BASELINE_RATES.filter((r) => r.bank_id === bankId);
}

/**
 * Lọc biểu lãi suất theo kỳ hạn (tháng) và hình thức
 */
export async function getRatesByTerm(
  termValue: number,
  channel?: "online" | "counter"
): Promise<RateWithBank[]> {
  const allRates = await getLatestRates();
  return allRates.filter((r) => {
    const matchTerm = r.term_value === termValue && r.term_unit === "month";
    const matchChannel = channel ? r.channel === channel : true;
    return matchTerm && matchChannel;
  });
}

/**
 * Lấy top các ngân hàng có lãi suất tốt nhất theo kỳ hạn
 */
export async function getBestRates(
  termValue: number = 12,
  channel: "online" | "counter" = "online",
  limit: number = 5
): Promise<RateWithBank[]> {
  const matchingRates = await getRatesByTerm(termValue, channel);
  return matchingRates.sort((a, b) => b.interest_rate - a.interest_rate).slice(0, limit);
}

/**
 * Lấy lịch sử biến động lãi suất của một ngân hàng
 */
export async function getRateHistory(bankId: string, limit: number = 20): Promise<RateHistoryItem[]> {
  try {
    const supabase = getSupabaseServerClient();
    if (supabase) {
      const { data, error } = await supabase
        .from("deposit_rate_history")
        .select("*")
        .eq("bank_id", bankId)
        .order("detected_at", { ascending: false })
        .limit(limit);

      if (!error && data) {
        return data.map((row: any) => ({
          id: row.id,
          bank_id: row.bank_id,
          channel: row.channel,
          term_value: row.term_value,
          term_unit: row.term_unit,
          old_rate: row.old_rate ? Number(row.old_rate) : undefined,
          new_rate: Number(row.new_rate),
          source_url: row.source_url,
          detected_at: row.detected_at,
        }));
      }
    }
  } catch (err) {
    console.warn(`Could not load rate history for bank ${bankId}, returning empty`, err);
  }
  return [];
}
