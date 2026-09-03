import { getBanks } from "../data-access/banks";
import { syncBankRates, SyncBankResult } from "./sync-bank";
import { getSupabaseAdminClient } from "../supabase/server";

export interface FullSyncResult {
  runId: string;
  status: "completed" | "already_running" | "failed";
  totalBanks: number;
  successBanks: number;
  partialBanks: number;
  failedBanks: number;
  needsReviewBanks: number;
  details: SyncBankResult[];
  error?: string;
}

/**
 * Điều phối toàn bộ tiến trình đồng bộ lãi suất hàng ngày cho toàn bộ ngân hàng
 */
export async function syncAllBanks(): Promise<FullSyncResult> {
  const supabase = getSupabaseAdminClient();
  const banks = await getBanks();
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
        totalBanks: banks.length,
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
        total_banks: banks.length,
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

  // 2. Chạy sync từng ngân hàng với nguyên tắc Failure Isolation
  for (const bank of banks) {
    try {
      const result = await syncBankRates(bank);
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

      // Nghỉ ngắn 500ms giữa các request để bảo vệ quota Free Tier
      await new Promise((resolve) => setTimeout(resolve, 500));
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

  // 3. Cập nhật trạng thái hoàn thành của tiến trình
  if (supabase && runId && !runId.startsWith("local-")) {
    await supabase
      .from("rate_sync_runs")
      .update({
        status: "completed",
        success_banks: successCount,
        partial_banks: partialCount,
        failed_banks: failedCount,
        finished_at: new Date().toISOString(),
      })
      .eq("id", runId);
  }

  return {
    runId,
    status: "completed",
    totalBanks: banks.length,
    successBanks: successCount,
    partialBanks: partialCount,
    failedBanks: failedCount,
    needsReviewBanks: needsReviewCount,
    details,
  };
}
