// Các hàm định dạng dữ liệu

/**
 * Định dạng số tiền VND
 * @param soTien - Số tiền cần định dạng
 * @param coKyHieu - Có hiển thị ký hiệu đ không
 */
export function dinhDangTien(soTien: number, coKyHieu: boolean = true): string {
  const formatted = new Intl.NumberFormat("vi-VN").format(Math.round(soTien));
  return coKyHieu ? `${formatted}đ` : formatted;
}

/**
 * Định dạng số tiền VND rút gọn (triệu, tỷ)
 */
export function dinhDangTienRutGon(soTien: number): string {
  if (soTien >= 1_000_000_000) {
    return `${(soTien / 1_000_000_000).toFixed(1)} tỷ`;
  }
  if (soTien >= 1_000_000) {
    return `${(soTien / 1_000_000).toFixed(1)} triệu`;
  }
  if (soTien >= 1_000) {
    return `${(soTien / 1_000).toFixed(0)} nghìn`;
  }
  return dinhDangTien(soTien);
}

/**
 * Định dạng phần trăm
 * @param giaTri - Giá trị phần trăm
 * @param soChSoThapPhan - Số chữ số thập phân
 */
export function dinhDangPhanTram(giaTri: number, soChSoThapPhan: number = 1): string {
  return `${giaTri.toFixed(soChSoThapPhan)}%`;
}

/**
 * Định dạng ngày tháng
 * @param ngay - Chuỗi ngày hoặc Date object
 * @param kieuDinhDang - Kiểu định dạng
 */
export function dinhDangNgay(
  ngay: string | Date,
  kieuDinhDang: "day-month-year" | "full" | "relative" = "day-month-year"
): string {
  const date = typeof ngay === "string" ? new Date(ngay) : ngay;

  if (kieuDinhDang === "full") {
    return new Intl.DateTimeFormat("vi-VN", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    }).format(date);
  }

  if (kieuDinhDang === "relative") {
    const now = new Date();
    const diffTime = now.getTime() - date.getTime();
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays === 0) return "Hôm nay";
    if (diffDays === 1) return "Hôm qua";
    if (diffDays < 7) return `${diffDays} ngày trước`;
    if (diffDays < 30) return `${Math.floor(diffDays / 7)} tuần trước`;
    if (diffDays < 365) return `${Math.floor(diffDays / 30)} tháng trước`;
    return `${Math.floor(diffDays / 365)} năm trước`;
  }

  // Default: day-month-year
  return new Intl.DateTimeFormat("vi-VN", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  }).format(date);
}

/**
 * Định dạng kỳ hạn
 * @param kyHan - Số tháng
 */
export function dinhDangKyHan(kyHan: number): string {
  if (kyHan < 12) {
    return `${kyHan} tháng`;
  }
  const nam = Math.floor(kyHan / 12);
  const thang = kyHan % 12;
  if (thang === 0) {
    return nam === 1 ? "1 năm" : `${nam} năm`;
  }
  return `${nam} năm ${thang} tháng`;
}

/**
 * Định dạng hình thức gửi tiền
 */
export function dinhDangHinhThuc(hinhThuc: "online" | "tai-quay"): string {
  return hinhThuc === "online" ? "Online" : "Tại quầy";
}

/**
 * Định dạng thời gian đọc
 */
export function dinhDangThoiGianDoc(phut: number): string {
  return `${phut} phút đọc`;
}

/**
 * Tạo slug từ text
 */
export function taoSlug(text: string): string {
  return text
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "") // Bỏ dấu
    .replace(/đ/g, "d")
    .replace(/Đ/g, "d")
    .replace(/[^a-z0-9]+/g, "-") // Thay ký tự đặc biệt bằng -
    .replace(/^-+|-+$/g, ""); // Xóa - đầu cuối
}

/**
 * Rút gọn text
 */
export function rutGonText(text: string, maxLength: number = 150): string {
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength).trim() + "...";
}

/**
 * Parse số từ input string
 */
export function parseSoTien(input: string): number {
  // Xóa các ký tự không phải số
  const cleaned = input.replace(/[^\d]/g, "");
  return parseInt(cleaned, 10) || 0;
}

/**
 * Validate số tiền
 */
export function validateSoTien(soTien: number, min: number = 0, max?: number): boolean {
  if (soTien < min) return false;
  if (max && soTien > max) return false;
  return true;
}

/**
 * Validate lãi suất
 */
export function validateLaiSuat(laiSuat: number): boolean {
  return laiSuat > 0 && laiSuat <= 100;
}

/**
 * Validate kỳ hạn
 */
export function validateKyHan(kyHan: number, min: number = 1, max: number = 360): boolean {
  return kyHan >= min && kyHan <= max;
}
