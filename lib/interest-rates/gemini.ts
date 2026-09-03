import { GeminiBankRateResult, GeminiBankRateResultSchema } from "./schema";
import { MasterBank } from "../data-access/seed-data";
import { buildRateSearchPrompt } from "./prompt";

const GEMINI_API_KEY = process.env.GEMINI_API_KEY || "";
const GEMINI_RATE_MODEL = process.env.GEMINI_RATE_MODEL || "gemini-2.5-flash-lite";

/**
 * Trích xuất khối JSON từ phản hồi văn bản của mô hình
 */
function extractJsonBlock(text: string): string {
  // Tìm block ```json ... ```
  const jsonMatch = text.match(/```(?:json)?\s*([\s\S]*?)\s*```/);
  if (jsonMatch && jsonMatch[1]) {
    return jsonMatch[1].trim();
  }

  // Tìm vị trí mở { và đóng } đầu/cuối
  const firstBrace = text.indexOf("{");
  const lastBrace = text.lastIndexOf("}");
  if (firstBrace !== -1 && lastBrace !== -1 && lastBrace > firstBrace) {
    return text.substring(firstBrace, lastBrace + 1).trim();
  }

  return text.trim();
}

/**
 * Gọi Gemini API kết hợp Google Search Grounding để tra cứu lãi suất ngân hàng
 */
export async function queryGeminiRatesForBank(
  bank: MasterBank,
  retryCount: number = 2
): Promise<GeminiBankRateResult> {
  if (!GEMINI_API_KEY) {
    console.warn("GEMINI_API_KEY is not configured. Returning not_found status.");
    return {
      bankCode: bank.code,
      status: "not_found",
      source: null,
      rates: [],
    };
  }

  const prompt = buildRateSearchPrompt(bank);
  const endpoint = `https://generativelanguage.googleapis.com/v1beta/models/${GEMINI_RATE_MODEL}:generateContent?key=${GEMINI_API_KEY}`;

  for (let attempt = 1; attempt <= retryCount + 1; attempt++) {
    try {
      const response = await fetch(endpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          contents: [
            {
              parts: [{ text: prompt }],
            },
          ],
          tools: [
            {
              googleSearch: {}, // Kích hoạt Google Search Grounding để AI tra cứu thời gian thực
            },
          ],
          generationConfig: {
            temperature: 0.1, // Nhiệt độ thấp tối đa hoá độ chính xác
          },
        }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        if (response.status === 429) {
          console.error(`Gemini quota exceeded for bank ${bank.code}:`, errorText);
          return {
            bankCode: bank.code,
            status: "not_found",
            source: null,
            rates: [],
          };
        }
        throw new Error(`Gemini API returned status ${response.status}: ${errorText}`);
      }

      const resultData = await response.json();
      const rawText =
        resultData?.candidates?.[0]?.content?.parts?.[0]?.text || "";

      if (!rawText) {
        throw new Error("Empty text response from Gemini API");
      }

      const cleanedJson = extractJsonBlock(rawText);
      const parsedJson = JSON.parse(cleanedJson);

      // Validate bằng Zod Schema
      const validated = GeminiBankRateResultSchema.safeParse(parsedJson);
      if (!validated.success) {
        console.warn(`Zod schema mismatch for bank ${bank.code}:`, validated.error.issues);
        if (attempt <= retryCount) continue;
        return {
          bankCode: bank.code,
          status: "not_found",
          source: null,
          rates: [],
        };
      }

      return validated.data;
    } catch (err) {
      console.error(`Error querying Gemini for bank ${bank.code} (attempt ${attempt}/${retryCount + 1}):`, err);
      if (attempt > retryCount) {
        return {
          bankCode: bank.code,
          status: "not_found",
          source: null,
          rates: [],
        };
      }
      // Nghỉ ngắn trước khi retry
      await new Promise((resolve) => setTimeout(resolve, 1000 * attempt));
    }
  }

  return {
    bankCode: bank.code,
    status: "not_found",
    source: null,
    rates: [],
  };
}
