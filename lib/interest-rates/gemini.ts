import { GeminiBankRateResult, GeminiBankRateResultSchema } from "./schema";
import { MasterBank, BANK_VERIFIED_DEPOSIT_URLS } from "../data-access/seed-data";
import { buildRateSearchPrompt } from "./prompt";

/**
 * Trích xuất khối JSON từ phản hồi văn bản của mô hình
 */
function extractJsonBlock(text: string): string | null {
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

  return null;
}

/**
 * Gọi Gemini API kết hợp Google Search Grounding để tra cứu lãi suất ngân hàng
 */
export async function queryGeminiRatesForBank(
  bank: MasterBank,
  retryCount: number = 2
): Promise<GeminiBankRateResult> {
  const apiKey = process.env.GEMINI_API_KEY;
  const model = process.env.GEMINI_RATE_MODEL || "gemini-2.5-flash-lite";

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
            maxOutputTokens: 2048,
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
      if (!cleanedJson) {
        console.warn(`No JSON block found in Gemini output for ${bank.code}. Attempt ${attempt}`);
        if (attempt <= retryCount) {
          await new Promise((resolve) => setTimeout(resolve, 1500 * attempt));
          continue;
        }
        return {
          bankCode: bank.code,
          status: "not_found",
          source: null,
          rates: [],
        };
      }

      const parsedJson = JSON.parse(cleanedJson);

      // Đảm bảo trường source có URL hợp lệ từ website thật của ngân hàng
      if (parsedJson.source && (!parsedJson.source.url || parsedJson.source.url.includes("..."))) {
        parsedJson.source.url = verifiedFallbackUrl;
      }

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
