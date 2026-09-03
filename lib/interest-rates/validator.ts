import { GeminiRateItem } from "./schema";

export const MAX_REASONABLE_RATE = 20.0; // 20%/năm là trần kiểm định bất thường
export const MAX_ALLOWED_RATE_DELTA = 3.0; // Biến động quá 3% trong 1 kỳ kiểm tra sẽ bị gắn cờ

export interface ValidationResult {
  isValid: boolean;
  needsReview: boolean;
  reasons: string[];
  validatedRates: GeminiRateItem[];
}

/**
 * Kiểm định tính hợp lý và phát hiện dị thường của dữ liệu lãi suất
 */
export function validateRates(
  rates: GeminiRateItem[],
  existingRatesMap?: Map<string, number>
): ValidationResult {
  const reasons: string[] = [];
  const validatedRates: GeminiRateItem[] = [];
  let needsReview = false;

  // Dùng Set để chống trùng lặp theo (channel, termValue, termUnit, paymentMethod)
  const seenKeys = new Set<string>();

  for (const item of rates) {
    const key = `${item.channel}-${item.termValue}-${item.termUnit}-${item.paymentMethod}`;

    if (seenKeys.has(key)) {
      continue; // Bỏ qua record trùng lặp
    }
    seenKeys.add(key);

    // 1. Kiểm tra giới hạn hợp lý
    if (item.rate < 0 || item.rate > MAX_REASONABLE_RATE) {
      reasons.push(
        `Lãi suất ${item.rate}% cho kỳ hạn ${item.termValue} ${item.termUnit} (${item.channel}) vượt ngưỡng an toàn [0 - ${MAX_REASONABLE_RATE}%].`
      );
      needsReview = true;
      continue;
    }

    // 2. So sánh phát hiện biến động bất thường (Anomaly Detection)
    if (existingRatesMap && existingRatesMap.has(key)) {
      const prevRate = existingRatesMap.get(key)!;
      const delta = Math.abs(item.rate - prevRate);

      if (delta > MAX_ALLOWED_RATE_DELTA) {
        reasons.push(
          `Cảnh báo biến động lớn: ${item.channel} kỳ hạn ${item.termValue} ${item.termUnit} thay đổi ${delta.toFixed(2)}% (Cũ: ${prevRate}%, Mới: ${item.rate}%).`
        );
        needsReview = true;
        // Giữ lại mức cũ nếu biến động quá sốc để bảo vệ người dùng
        continue;
      }
    }

    validatedRates.push(item);
  }

  const isValid = validatedRates.length > 0 && !needsReview;

  return {
    isValid,
    needsReview,
    reasons,
    validatedRates,
  };
}
