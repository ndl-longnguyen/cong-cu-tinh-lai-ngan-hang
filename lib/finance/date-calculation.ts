/**
 * Kiểm tra xem một năm có phải năm nhuận hay không
 */
export function isLeapYear(year: number): boolean {
  return (year % 4 === 0 && year % 100 !== 0) || year % 400 === 0;
}

/**
 * Lấy số ngày trong một tháng cụ thể của một năm
 */
export function getDaysInMonth(year: number, month: number): number {
  // month: 0-indexed (0 = Jan, 1 = Feb, ...)
  return new Date(year, month + 1, 0).getDate();
}

/**
 * Đếm số ngày thực tế giữa 2 mốc thời gian (Actual Calendar Days)
 */
export function countActualDays(startDate: Date, endDate: Date): number {
  // Chuẩn hóa về 00:00:00 UTC để tránh sai số múi giờ và daylight saving
  const startUtc = Date.UTC(
    startDate.getFullYear(),
    startDate.getMonth(),
    startDate.getDate()
  );
  const endUtc = Date.UTC(
    endDate.getFullYear(),
    endDate.getMonth(),
    endDate.getDate()
  );

  const diffMs = endUtc - startUtc;
  return Math.max(0, Math.round(diffMs / (1000 * 60 * 60 * 24)));
}

/**
 * Tính ngày đáo hạn dựa trên ngày gửi và số tháng kỳ hạn
 * Xử lý chính xác các trường hợp tràn ngày cuối tháng (vd: 31/01 + 1 tháng -> 28/02 hoặc 29/02 năm nhuận)
 */
export function getMaturityDate(startDate: Date, months: number): Date {
  const year = startDate.getFullYear();
  const month = startDate.getMonth();
  const day = startDate.getDate();

  const targetDate = new Date(year, month + months, 1);
  const targetYear = targetDate.getFullYear();
  const targetMonth = targetDate.getMonth();

  const maxDaysInTargetMonth = getDaysInMonth(targetYear, targetMonth);
  const finalDay = Math.min(day, maxDaysInTargetMonth);

  return new Date(targetYear, targetMonth, finalDay);
}

/**
 * Định dạng Date object sang chuỗi YYYY-MM-DD
 */
export function formatDateISO(date: Date): string {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}
