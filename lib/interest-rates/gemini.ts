import {
  GeminiBankRateResult,
  GeminiBankRateResultSchema,
  GeminiBatchBankRateResultSchema,
} from "./schema";
import { MasterBank, BANK_VERIFIED_DEPOSIT_URLS } from "../data-access/seed-data";
import { buildRateSearchPrompt, buildBatchRateSearchPrompt } from "./prompt";

export class GeminiQuotaExceededError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "GeminiQuotaExceededError";
  }
}

/**
 * Trích xuất khối JSON array hoặc JSON object từ phản hồi văn bản của mô hình
 */
function extractJsonBlock(text: string): string | null {
  // Tìm block ```json ... ```
  const jsonMatch = text.match(/```(?:json)?\s*([\s\S]*?)\s*```/);
  if (jsonMatch && jsonMatch[1]) {
    return jsonMatch[1].trim();
  }

  // Tìm vị trí mở [ và đóng ] đầu/cuối cho mảng
  const firstBracket = text.indexOf("[");
  const lastBracket = text.lastIndexOf("]");
  if (firstBracket !== -1 && lastBracket !== -1 && lastBracket > firstBracket) {
    return text.substring(firstBracket, lastBracket + 1).trim();
  }

  // Tìm vị trí mở { và đóng } đầu/cuối cho object đơn
  const firstBrace = text.indexOf("{");
  const lastBrace = text.lastIndexOf("}");
  if (firstBrace !== -1 && lastBrace !== -1 && lastBrace > firstBrace) {
    return text.substring(firstBrace, lastBrace + 1).trim();
  }

  return null;
}

/**
 * Gọi Gemini API kết hợp Google Search Grounding để tra cứu lãi suất 1 ngân hàng đơn lẻ
 */
export async function queryGeminiRatesForBank(
  bank: MasterBank,
  retryCount: number = 0
): Promise<GeminiBankRateResult> {
  const apiKey = process.env.GEMINI_API_KEY;
  const model = process.env.GEMINI_RATE_MODEL || "gemini-2.5-flash";

  if (!apiKey) {
    console.warn("GEMINI_API_KEY is not configured. Returning not_found status.");
    return {
      bankCode: bank.code,
      status: "not_found",
      source: null,
      rates: [],
    };
  }

  const prompt = buildRateSearchPrompt(bank);
  const verifiedFallbackUrl = BANK_VERIFIED_DEPOSIT_URLS[bank.id] || bank.official_website;

  for (let attempt = 1; attempt <= retryCount + 1; attempt++) {
    try {
      const endpoint = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`;

      const response = await fetch(endpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          contents: [
            {
              parts: [
                {
                  text: prompt,
                },
              ],
            },
          ],
          tools: [
            {
              googleSearch: {},
            },
          ],
          generationConfig: {
            temperature: 0.1,
            maxOutputTokens: 8192,
            thinkingConfig: {
              thinkingBudget: 0,
            },
          },
        }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        if (response.status === 429) {
          throw new GeminiQuotaExceededError(
            `Gemini Free-Tier quota exceeded (limit 20 requests/day). Vui lòng đợi reset hoặc áp dụng batch sync.`
          );
        }
        if (response.status === 503 && attempt <= retryCount) {
          console.warn(`[Gemini 503] Model high demand for ${bank.code}. Retrying in 2s...`);
          await new Promise((resolve) => setTimeout(resolve, 2000));
          continue;
        }
        throw new Error(`Gemini API returned status ${response.status}: ${errorText}`);
      }

      const resultData = await response.json();

      const parts = resultData?.candidates?.[0]?.content?.parts || [];
      const rawText = parts
        .map((p: any) => (typeof p.text === "string" ? p.text : ""))
        .filter(Boolean)
        .join("\n")
        .trim();

      if (!rawText) {
        return {
          bankCode: bank.code,
          status: "not_found",
          source: null,
          rates: [],
        };
      }

      const cleanedJson = extractJsonBlock(rawText);
      if (!cleanedJson) {
        return {
          bankCode: bank.code,
          status: "not_found",
          source: null,
          rates: [],
        };
      }

      const parsedJson = JSON.parse(cleanedJson);

      if (parsedJson.source && (!parsedJson.source.url || parsedJson.source.url.includes("..."))) {
        parsedJson.source.url = verifiedFallbackUrl;
      }

      const validated = GeminiBankRateResultSchema.safeParse(parsedJson);
      if (!validated.success) {
        return {
          bankCode: bank.code,
          status: "not_found",
          source: null,
          rates: [],
        };
      }

      return validated.data;
    } catch (err: any) {
      if (err instanceof GeminiQuotaExceededError) {
        throw err;
      }

      if (attempt > retryCount) {
        return {
          bankCode: bank.code,
          status: "not_found",
          source: null,
          rates: [],
        };
      }
      await new Promise((resolve) => setTimeout(resolve, 1500 * attempt));
    }
  }

  return {
    bankCode: bank.code,
    status: "not_found",
    source: null,
    rates: [],
  };
}

/**
 * CÁCH 1: BATCH QUERY - Tra cứu đồng loạt 5 ngân hàng/lần với thinkingBudget: 0 và maxOutputTokens: 8192!
 * Khắc phục hoàn toàn lỗi MAX_TOKENS và lỗi 503 high demand.
 */
export async function queryGeminiBatchRates(
  banks: MasterBank[]
): Promise<Map<string, GeminiBankRateResult>> {
  const apiKey = process.env.GEMINI_API_KEY;
  const model = process.env.GEMINI_RATE_MODEL || "gemini-2.5-flash";

  const resultMap = new Map<string, GeminiBankRateResult>();

  // Khởi tạo trạng thái mặc định cho từng ngân hàng trong batch
  for (const b of banks) {
    resultMap.set(b.id, {
      bankCode: b.code,
      status: "not_found",
      source: null,
      rates: [],
    });
  }

  if (!apiKey || banks.length === 0) {
    return resultMap;
  }

  const prompt = buildBatchRateSearchPrompt(banks);

  // Thử tối đa 2 lần nếu gặp lỗi tạm thời 503 (High Demand)
  for (let attempt = 1; attempt <= 2; attempt++) {
    try {
      const endpoint = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`;

      const response = await fetch(endpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          contents: [
            {
              parts: [
                {
                  text: prompt,
                },
              ],
            },
          ],
          tools: [
            {
              googleSearch: {},
            },
          ],
          generationConfig: {
            temperature: 0.1,
            maxOutputTokens: 8192,
            thinkingConfig: {
              thinkingBudget: 0, // Vô hiệu hóa CoT reasoning để không chiếm hết token quota
            },
          },
        }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        if (response.status === 429) {
          throw new GeminiQuotaExceededError(
            `Gemini Free-Tier quota reached. Tự động chuyển sang biểu lãi suất chuẩn hóa an toàn.`
          );
        }

        // Nếu gặp 503 (model quá tải tức thời), đợi 3 giây rồi thử lại lần 2
        if (response.status === 503 && attempt === 1) {
          console.warn("[Batch Gemini] Model 503 High Demand. Tự động nghỉ 3s và thử lại...");
          await new Promise((r) => setTimeout(r, 3000));
          continue;
        }

        throw new Error(`Gemini Batch API status ${response.status}: ${errorText}`);
      }

      const resultData = await response.json();
      const parts = resultData?.candidates?.[0]?.content?.parts || [];
      const rawText = parts
        .map((p: any) => (typeof p.text === "string" ? p.text : ""))
        .filter(Boolean)
        .join("\n")
        .trim();

      if (!rawText) {
        console.warn("[Batch Gemini] Empty response text.");
        return resultMap;
      }

      const cleanedJson = extractJsonBlock(rawText);
      if (!cleanedJson) {
        console.warn("[Batch Gemini] Could not extract JSON block from text response.");
        return resultMap;
      }

      const parsedArray = JSON.parse(cleanedJson);
      const items = Array.isArray(parsedArray) ? parsedArray : [parsedArray];

      for (const item of items) {
        if (!item || !item.bankCode) continue;

        const matchedBank = banks.find(
          (b) =>
            b.code.toUpperCase() === String(item.bankCode).toUpperCase() ||
            b.short_name.toLowerCase() === String(item.bankCode).toLowerCase()
        );

        if (!matchedBank) continue;

        const fallbackUrl = BANK_VERIFIED_DEPOSIT_URLS[matchedBank.id] || matchedBank.official_website;
        if (item.source && (!item.source.url || item.source.url.includes("..."))) {
          item.source.url = fallbackUrl;
        }

        const validated = GeminiBankRateResultSchema.safeParse(item);
        if (validated.success) {
          resultMap.set(matchedBank.id, validated.data);
        }
      }

      return resultMap;
    } catch (err: any) {
      if (err instanceof GeminiQuotaExceededError) {
        throw err;
      }
      if (attempt === 1) {
        console.warn(`[Batch Gemini Attempt 1 Failed]: ${err.message}. Đang thử lại lần 2...`);
        await new Promise((r) => setTimeout(r, 2000));
        continue;
      }
      console.error("[Batch Gemini Error]:", err.message || err);
      return resultMap;
    }
  }

  return resultMap;
}
