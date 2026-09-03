import { config } from "dotenv";
config(); // Nạp biến môi trường từ .env

import { MASTER_BANKS } from "../lib/data-access/seed-data";
import { syncBankRates } from "../lib/interest-rates/sync-bank";
import { getSupabaseAdminClient } from "../lib/supabase/server";

async function run() {
  const bankId = process.argv[2] || "vietcombank";
  const bank = MASTER_BANKS.find((b) => b.id === bankId || b.code.toLowerCase() === bankId.toLowerCase());

  if (!bank) {
    console.error(`Không tìm thấy ngân hàng với mã/id: "${bankId}". Danh sách gợi ý: vietcombank, techcombank, bidv, agribank, mbbank, acb...`);
    process.exit(1);
  }

  console.log(`=======================================================`);
  console.log(`BẮT ĐẦU TEST FLOW ĐỒNG BỘ LÃI SUẤT QUA GEMINI & LƯU DB`);
  console.log(`Ngân hàng: ${bank.name} (${bank.short_name} - ${bank.code})`);
  console.log(`Official Domain: ${bank.official_domain}`);
  console.log(`=======================================================\n`);

  // 1. Kiểm tra kết nối Supabase
  const supabase = getSupabaseAdminClient();
  if (!supabase) {
    console.error("LỖI: Chưa cấu hình SUPABASE_SERVICE_ROLE_KEY hoặc URL trong .env");
    process.exit(1);
  }

  console.log("1. Kiểm tra bảng 'banks' trên Supabase...");
  const { data: bankRow, error: bankErr } = await supabase
    .from("banks")
    .select("id, name")
    .eq("id", bank.id)
    .maybeSingle();

  if (bankErr) {
    console.warn("CẢNH BÁO DATABASE:", bankErr.message);
    console.warn("-> Các bảng trên Supabase chưa được khởi tạo!");
    console.warn("-> Vui lòng chạy file 'supabase/migrations/20260903_init_interest_rates.sql' trên Supabase SQL Editor.\n");
  } else if (!bankRow) {
    console.log(`-> Bảng 'banks' đã tồn tại nhưng chưa có ngân hàng '${bank.id}'. Đang tự động nạp dữ liệu ngân hàng...`);
    await supabase.from("banks").upsert({
      id: bank.id,
      code: bank.code,
      name: bank.name,
      short_name: bank.short_name,
      slug: bank.slug,
      official_website: bank.official_website,
      official_domain: bank.official_domain,
      established_year: bank.established_year,
      active: true,
    });
    console.log("-> Đã nạp thành công ngân hàng vào DB!");
  } else {
    console.log("-> Ngân hàng đã có sẵn trong bảng 'banks'.");
  }

  // 2. Chạy Sync Bank Rates qua Gemini
  console.log("\n2. Đang gửi yêu cầu tới Gemini AI với Google Search Grounding...");
  const startTime = Date.now();
  const syncResult = await syncBankRates(bank);
  const elapsed = ((Date.now() - startTime) / 1000).toFixed(2);

  console.log(`\n=======================================================`);
  console.log(`KẾT QUẢ ĐỒNG BỘ (${elapsed}s)`);
  console.log(`=======================================================`);
  const isSuccess = syncResult.status === "success" || syncResult.status === "partial";
  console.log(`- Kết quả: ${isSuccess ? "THÀNH CÔNG" : "CHƯA HOÀN TẤT"}`);
  console.log(`- Trạng thái nguồn: ${syncResult.status}`);
  console.log(`- Số mức lãi suất mới: ${syncResult.newRateCount}`);
  console.log(`- Số mức lãi suất cũ: ${syncResult.oldRateCount}`);
  console.log(`- URL nguồn xác minh: ${syncResult.sourceUrl || "N/A"}`);
  if (syncResult.error) {
    console.log(`- Chi tiết: ${syncResult.error}`);
  }

  // 3. Kiểm tra dữ liệu thực tế vừa lưu trong Supabase
  if (!bankErr) {
    console.log(`\n3. Truy vấn bảng 'deposit_rates' trên Supabase vừa lưu...`);
    const { data: savedRates, error: readErr } = await supabase
      .from("deposit_rates")
      .select("term_value, term_unit, channel, interest_rate, verified_at, source_url")
      .eq("bank_id", bank.id)
      .order("term_value", { ascending: true })
      .limit(10);

    if (readErr) {
      console.error("Lỗi đọc lại từ DB:", readErr.message);
    } else {
      console.log(`-> Tìm thấy ${savedRates?.length || 0} bản ghi trong DB:`);
      console.table(savedRates);
    }
  }

  console.log(`\nHoàn thành bài kiểm tra!`);
}

run().catch(console.error);
