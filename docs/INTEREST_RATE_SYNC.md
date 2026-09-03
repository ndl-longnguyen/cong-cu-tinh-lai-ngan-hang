# TÀI LIỆU KỸ THUẬT: PIPELINE ĐỒNG BỘ LÃI SUẤT TỰ ĐỘNG

> **Module**: Interest Rate Sync Pipeline  
> **Lập lịch**: 08:00 mỗi ngày theo giờ Việt Nam (`Asia/Ho_Chi_Minh` UTC+7 / `01:00 UTC`)  
> **Phương thức**: Vercel Cron → `GET /api/cron/update-bank-rates`  
> **Công nghệ lõi**: Gemini API (`gemini-2.5-flash-lite`) + Google Search Grounding + Supabase PostgreSQL  

---

## 1. NGUYÊN TẮC CỐT LÕI (CORE PRINCIPLES)

1. **GEMINI KHÔNG PHẢI SOURCE OF TRUTH**:
   - Gemini chỉ đóng vai trò tìm kiếm, đọc, trích xuất và chuẩn hóa dữ liệu từ internet.
   - Tuyệt đối cấm suy diễn, đoán mò, hoặc sử dụng dữ liệu huấn luyện lịch sử để điền vào số liệu hiện hành.
2. **CHỈ CHẤP NHẬN NGUỒN CHÍNH THỨC (OFFICIAL DOMAIN ONLY)**:
   - Mọi mức lãi suất trả về phải có URL nguồn thuộc danh sách `official_domain` đã đăng ký của ngân hàng (ví dụ: `vietcombank.com.vn`, `techcombank.com.vn`).
   - Mọi URL từ blog cá nhân, diễn đàn, báo mạng không chính thức đều bị bộ lọc `source-validator.ts` loại bỏ ngay lập tức.
3. **CHIẾN LƯỢC BẢO TOÀN DỮ LIỆU TỐT GẦN NHẤT (LAST-KNOWN-GOOD STRATEGY)**:
   - Nếu xảy ra bất kỳ sự cố nào: Gemini timeout, hết hạn ngạch (quota exceeded), lỗi mạng, nguồn không chính thức, hoặc phát hiện biến động bất thường...
   - **Hệ thống KHÔNG BAO GIỜ xóa hoặc gán NULL/0 cho dữ liệu hiện tại**. Dữ liệu đã xác minh trước đó vẫn được giữ nguyên và hiển thị cho người dùng kèm thời gian xác minh gần nhất.
4. **CÔ LẬP LỖI TỪNG NGÂN HÀNG (FAILURE ISOLATION)**:
   - Tiến trình đồng bộ được thực hiện độc lập theo từng ngân hàng. Nếu 1 ngân hàng bị lỗi, hệ thống ghi log và tiếp tục đồng bộ các ngân hàng còn lại, không để 1 lỗi làm gián đoạn toàn bộ tiến trình.

---

## 2. QUY TRÌNH KIỂM ĐỊNH ĐA TẦNG (VALIDATION PIPELINE)

```
                       Gemini API (Search Grounding)
                                    │
                                    ▼
                         [1. Schema Validation]
                       (Zod Parse & Type Checking)
                                    │
                                    ▼
                     [2. Official Domain Validation]
                 (Chỉ chấp nhận domain chính thống của bank)
                                    │
                                    ▼
                        [3. Rate Sanity Check]
                       (Chặn số âm, trần tối đa 20%)
                                    │
                                    ▼
                      [4. Anomaly Detection (Delta)]
                   (Nếu chênh lệch > 3% so với hôm qua
                        --> Gắn cờ needs_review)
                                    │
                         ┌──────────┴──────────┐
                     Hợp lệ                 Bất thường
                         │                     │
                         ▼                     ▼
             [5. Atomic Upsert DB]     [Giữ Last-Known-Good]
           (Ghi nhận history nếu đổi)   (Ghi log kiểm toán)
```

---

## 3. CÁC BẢNG DỮ LIỆU TRÊN SUPABASE

1. **`banks`**: Danh mục 30+ ngân hàng Việt Nam kèm official domain, website, logo.
2. **`bank_rate_sources`**: Nhật ký các đường link biểu phí & lãi suất chính thức.
3. **`deposit_rates`**: Bảng dữ liệu lãi suất hiện hành phục vụ hiển thị trên Website.
4. **`deposit_rate_history`**: Lưu vết lịch sử biến động lãi suất khi và chỉ khi có sự thay đổi thực tế.
5. **`rate_sync_runs`**: Ghi nhận thời gian bắt đầu, kết thúc, tổng số ngân hàng, số lượng thành công/thất bại của mỗi phiên Cron.
6. **`rate_sync_bank_results`**: Chi tiết kết quả đồng bộ của từng ngân hàng trong phiên.

---

## 4. HƯỚNG DẪN KIỂM TRA THỦ CÔNG (TESTING CRON)

### Gửi request kiểm tra xác thực CRON_SECRET:
```bash
# 1. Thử request không có secret (Kỳ vọng: 401 Unauthorized)
curl -i http://localhost:3000/api/cron/update-bank-rates

# 2. Request hợp lệ kèm CRON_SECRET
curl -i -H "Authorization: Bearer your_cron_secret" http://localhost:3000/api/cron/update-bank-rates
```
