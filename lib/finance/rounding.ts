/**
 * Làm tròn tiền VND về số nguyên chuẩn xác
 */
export function roundMoney(amount: number): number {
  if (isNaN(amount) || !isFinite(amount)) return 0;
  return Math.round(amount);
}

/**
 * Làm tròn tỷ lệ phần trăm đến số chữ số thập phân chỉ định
 */
export function roundRate(rate: number, decimals: number = 2): number {
  if (isNaN(rate) || !isFinite(rate)) return 0;
  const factor = Math.pow(10, decimals);
  return Math.round(rate * factor) / factor;
}
