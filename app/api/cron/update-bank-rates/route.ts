import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { syncAllBanks } from "@/lib/interest-rates/sync-all-banks";

export const dynamic = "force-dynamic";
export const maxDuration = 300; // Cho phép chạy tối đa 300s trên Vercel Serverless

export async function GET(request: Request) {
  const authHeader = request.headers.get("authorization");
  const cronSecret = process.env.CRON_SECRET;

  // 1. Kiểm định bảo mật CRON_SECRET
  if (cronSecret) {
    const expectedAuth = `Bearer ${cronSecret}`;
    if (authHeader !== expectedAuth) {
      return NextResponse.json(
        { error: "Unauthorized. Invalid or missing CRON_SECRET." },
        { status: 401 }
      );
    }
  } else if (process.env.NODE_ENV === "production") {
    // Nếu trên production mà chưa cấu hình CRON_SECRET thì chặn để đảm bảo an toàn
    return NextResponse.json(
      { error: "CRON_SECRET is not configured on production server." },
      { status: 401 }
    );
  }

  try {
    // 2. Chạy tiến trình đồng bộ lãi suất toàn bộ ngân hàng
    const syncResult = await syncAllBanks();

    // 3. Revalidate cache của các trang hiển thị dữ liệu
    try {
      revalidatePath("/lai-suat");
      revalidatePath("/ngan-hang/[slug]", "page");
      revalidatePath("/cong-cu/tinh-lai-tiet-kiem");
      revalidatePath("/");
    } catch (cacheErr) {
      console.warn("Revalidation warning:", cacheErr);
    }

    return NextResponse.json({
      status: syncResult.status,
      runId: syncResult.runId,
      total: syncResult.totalBanks,
      success: syncResult.successBanks,
      partial: syncResult.partialBanks,
      failed: syncResult.failedBanks,
      needsReview: syncResult.needsReviewBanks,
    });
  } catch (error: any) {
    console.error("Cron rate sync failed:", error);
    return NextResponse.json(
      { error: error.message || "Internal server error during sync" },
      { status: 500 }
    );
  }
}
