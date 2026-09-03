# CÔNG CỤ TÍNH LÃI NGÂN HÀNG VIỆT NAM

Hệ thống tra cứu, so sánh biểu lãi suất của 30+ ngân hàng Việt Nam và bộ công cụ tính toán tài chính cá nhân chuẩn xác (Tiền gửi tiết kiệm, Lãi kép, Khoản vay trả góp).

---

## 🌟 ĐIỂM NỔI BẬT TRONG BẢN NÂNG CẤP

1. **Dữ liệu thực tế có nguồn kiểm chứng**:
   - Tích hợp **Google Gemini API** (`gemini-2.5-flash-lite`) với công cụ **Google Search Grounding** tự động tra cứu biểu lãi suất niêm yết mới nhất.
   - **Quy trình kiểm định đa tầng**: Bắt buộc nguồn trích xuất phải thuộc `official_domain` của ngân hàng, kiểm tra trần lãi suất an toàn ($0\% - 20\%$) và phát hiện biến động bất thường ($\Delta > 3\%$).
   - **Nguyên tắc Last-Known-Good**: Bảo toàn dữ liệu đã xác thực gần nhất nếu gặp lỗi mạng, hạn ngạch API hoặc nguồn chưa kiểm chứng.
2. **Đồng bộ tự động mỗi ngày (Vercel Cron)**:
   - Tự động kích hoạt vào **08:00 mỗi ngày theo giờ Việt Nam (01:00 UTC)** qua endpoint `/api/cron/update-bank-rates`.
   - Bảo mật tuyệt đối bằng token `CRON_SECRET`.
   - Tự động revalidate cache sau khi đồng bộ thành công.
3. **Động cơ tính toán tài chính chuẩn xác (Finance Engine)**:
   - **Tiền gửi tiết kiệm**: Tính chính xác theo số ngày thực tế / 365 ngày (Thông tư NHNN), xử lý chuẩn xác tháng 2 và năm nhuận.
   - **Khoản vay trả góp**: Hỗ trợ 2 phương thức (Dư nợ giảm dần & Trả góp đều PMT), hỗ trợ gói ưu đãi lãi suất ban đầu, xử lý an toàn trường hợp $r = 0\%$, triệt tiêu hoàn toàn số dư nợ kỳ cuối về 0đ.
   - **Lãi kép**: Mô phỏng tăng trưởng theo cấp số nhân và đối chứng trực quan với lãi đơn.
4. **Giao diện hiện đại & Tính năng so sánh**:
   - Dual-mode Calculator: Cho phép chọn theo ngân hàng (tự nạp lãi suất & nguồn) hoặc tự nhập số liệu.
   - Bảng so sánh lợi nhuận thực tế giữa các ngân hàng với số tiền và kỳ hạn tùy chọn.
   - Hiển thị đầy đủ badge thời gian xác minh và liên kết trỏ trực tiếp đến website chính thức của từng ngân hàng.

---

## 🛠️ TECH STACK

- **Framework**: Next.js 15 (App Router, Turbopack)
- **UI & State**: React 19, TypeScript 5, Tailwind CSS 4
- **Database**: Supabase PostgreSQL (Row-Level Security, Migrations)
- **AI & Data Grounding**: Google Gemini API Free Tier (`gemini-2.5-flash-lite`)
- **Icons**: Lucide React
- **Testing**: Vitest (Unit testing 100% logic tài chính & validation pipeline)

---

## 🚀 HƯỚNG DẪN CÀI ĐẶT & CHẠY DỰ ÁN

### 1. Cài đặt Dependencies
```bash
npm install
```

### 2. Cấu hình biến môi trường
Tạo file `.env` dựa trên mẫu `.env.example`:
```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=your_publishable_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_secret_key

# Google Gemini API
GEMINI_API_KEY=your_gemini_api_key
GEMINI_RATE_MODEL=gemini-2.5-flash-lite

# Vercel Cron Security
CRON_SECRET=your_cron_secret_token

# Canonical URL
NEXT_PUBLIC_SITE_URL=https://laisuatnganhang.vn
```

### 3. Chạy Migration Database (Supabase)
Chạy toàn bộ nội dung file SQL trong thư mục:
`supabase/migrations/20260903_init_interest_rates.sql`
vào **SQL Editor** trên Supabase Dashboard. File này sẽ tạo 6 bảng dữ liệu, thiết lập RLS policies và khởi tạo dữ liệu ban đầu cho 30 ngân hàng.

### 4. Chạy Unit Tests
```bash
npm test
```
Chạy bộ 20 unit tests kiểm định toàn bộ Finance Engine và Rate Validation Pipeline.

### 5. Khởi động môi trường Development
```bash
npm run dev
```
Truy cập ứng dụng tại: `http://localhost:3000`.

### 6. Build Production
```bash
npm run build
```

---

## 📂 TÀI LIỆU CHI TIẾT
- [Tài liệu Kiến trúc Pipeline Đồng bộ Lãi suất (INTEREST_RATE_SYNC.md)](docs/INTEREST_RATE_SYNC.md)
- [Tài liệu Động cơ Tính toán Tài chính (FINANCE_ENGINE.md)](docs/FINANCE_ENGINE.md)
- [Báo cáo Phân tích Source Code gốc (PHAN_TICH_SOURCE_CODE.md)](PHAN_TICH_SOURCE_CODE.md)

---

## 📄 GIẤY PHÉP & MIỄN TRỪ TRÁCH NHIỆM
Dữ liệu biểu lãi suất trên website được tổng hợp từ các nguồn công khai chính thức của các tổ chức tín dụng. Kết quả tính toán mang tính chất tham khảo mô phỏng. Người dùng nên xác nhận trực tiếp với phòng giao dịch ngân hàng trước khi đưa ra quyết định tài chính.
