# TÀI LIỆU KỸ THUẬT: FINANCE ENGINE (ĐỘNG CƠ TÍNH TOÁN TÀI CHÍNH)

> **Module**: Finance Engine  
> **Tập tin**: `lib/finance/deposit.ts`, `lib/finance/loan.ts`, `lib/finance/compound.ts`, `lib/finance/date-calculation.ts`, `lib/finance/rounding.ts`  
> **Nguyên tắc**: Pure Functions, không side-effects, độc lập UI, bao phủ 100% bởi Unit Tests.  

---

## 1. TIỀN GỬI TIẾT KIỆM (DEPOSIT CALCULATION)

### 1.1. Công thức tính lãi chuẩn Thông tư NHNN:
Không làm tròn chia 12 tháng đơn giản, tiền lãi được tính chính xác theo số ngày thực tế:
$$\text{Tiền lãi} = \text{Tiền gốc} \times \frac{\text{Lãi suất}}{100} \times \frac{\text{Số ngày gửi thực tế}}{365}$$

### 1.2. Xử lý ngày tháng & năm nhuận (`date-calculation.ts`):
- Đếm số ngày thực tế (`countActualDays`) dựa trên khoảng cách UTC giữa `startDate` và `endDate`.
- Tính ngày đáo hạn (`getMaturityDate`):
  - 31/01 trong năm thường (2025) gửi 1 tháng $\rightarrow$ đáo hạn 28/02/2025.
  - 31/01 trong năm nhuận (2024, 2028) gửi 1 tháng $\rightarrow$ đáo hạn 29/02/2024.
  - 31/03 gửi 1 tháng $\rightarrow$ đáo hạn 30/04.

### 1.3. Tiết kiệm tích lũy định kỳ (`calculateRecurringSavings`):
Tách biệt hoàn toàn khỏi tiền gửi kỳ hạn chuẩn. Mỗi tháng số tiền gửi thêm được cộng vào số dư, tiền lãi tháng sinh ra được tự động nhập gốc để tính lãi cho tháng tiếp theo.

---

## 2. KHOẢN VAY TRẢ GÓP (LOAN AMORTIZATION)

### 2.1. Phương thức Dư nợ giảm dần:
- Tiền gốc trả đều mỗi tháng:
  $$P_{m} = \text{roundMoney}\left(\frac{\text{Số tiền vay}}{n}\right)$$
- Tiền lãi của kỳ $k$:
  $$I_k = \text{roundMoney}\left(D_{k-1} \times \frac{r}{100 \times 12}\right)$$
- Tổng tiền trả trong kỳ $k$:
  $$M_k = P_m + I_k$$
- **Điều chỉnh kỳ cuối**: Kỳ thứ $n$ thanh toán đúng bằng số dư nợ còn lại $D_{n-1}$ để triệt tiêu hoàn toàn dư nợ gốc về chính xác 0đ.

### 2.2. Phương thức Trả góp đều (PMT / Niên kim):
- Tổng số tiền trả cố định mỗi tháng:
  $$M = P \times \frac{r_m (1 + r_m)^n}{(1 + r_m)^n - 1} \quad \left(\text{với } r_m = \frac{r}{100 \times 12}\right)$$
- **Xử lý đặc biệt khi $r = 0$**: Khi vay trả góp 0%, công thức chuyển về:
  $$M = \frac{P}{n}$$
  Tránh triệt để lỗi chia cho 0 (`0/0 = NaN`).
- Tiền lãi trả trong kỳ: $I_k = D_{k-1} \times r_m$.
- Tiền gốc trả trong kỳ: $P_k = M - I_k$.
- Kỳ cuối cùng cân bằng số tiền gốc để đưa số dư nợ $D_n = 0$.

### 2.3. Hỗ trợ đa kỳ lãi suất (Ưu đãi ban đầu + Thả nổi):
Hỗ trợ tham số `LoanOptions: { promoMonths, promoRate }`. Trong khoảng thời gian $m \le \text{promoMonths}$, hệ thống áp dụng `promoRate`, sau đó tự động chuyển sang `baseRate`.

---

## 3. LÃI KÉP (COMPOUND INTEREST)

- Công thức toán học chuẩn:
  $$A = P \left(1 + \frac{r}{n}\right)^{nt}$$
  - $n = 12$ (ghép lãi hàng tháng)
  - $n = 4$ (ghép lãi hàng quý)
  - $n = 1$ (ghép lãi hàng năm)
- Lãi đơn đối chứng:
  $$A_{simple} = P (1 + r \times t)$$
- Thặng dư chênh lệch do lãi kép:
  $$\Delta = A - A_{simple}$$
- Nội dung hiển thị giải thích bản chất tài chính trung lập, không gán ghép danh ngôn không có căn cứ.
