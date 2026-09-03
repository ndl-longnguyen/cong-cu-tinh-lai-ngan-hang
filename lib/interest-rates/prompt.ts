import { MasterBank } from "../data-access/seed-data";

/**
 * Sinh prompt nghiêm ngặt cho Gemini API kết hợp Google Search Grounding
 */
export function buildRateSearchPrompt(bank: MasterBank): string {
  const currentDate = new Date().toISOString().split("T")[0];

  return `
You are a financial data verification agent specialized in Vietnamese banking.
Task: Find CURRENT publicly available VND personal deposit interest rates (Lãi suất tiết kiệm cá nhân VND) for the bank: "${bank.name}" (${bank.short_name}, Bank Code: ${bank.code}).

Official bank domain: "${bank.official_domain}"
Official website: "${bank.official_website}"
Today's Date: ${currentDate}

CRITICAL RULES:
1. ONLY return data from official sources. Your primary source MUST be within the domain "${bank.official_domain}" or official State Bank of Vietnam publications.
2. NEVER guess, infer, interpolate, or invent any interest rate.
3. If an interest rate for a specific term is not explicitly stated on the official page, DO NOT include it.
4. Distinguish clearly between:
   - "online" (Gửi tiết kiệm trực tuyến / e-banking)
   - "counter" (Gửi tại quầy giao dịch)
5. Distinguish terms accurately: 1 month, 2 months, 3 months, 6 months, 9 months, 12 months, 18 months, 24 months, 36 months.
6. Rate values must be positive numbers representing %/year (e.g., 4.6 for 4.6%/year).
7. If no official rates can be verified for today, return status: "not_found" and rates: [].
8. If only some terms can be verified, return status: "partial".
9. If full official schedule is verified, return status: "success".

OUTPUT FORMAT:
You must reply ONLY with a raw JSON object (without markdown code blocks, or with standard \`\`\`json block) matching this schema:
{
  "bankCode": "${bank.code}",
  "status": "success" | "partial" | "not_found",
  "source": {
    "url": "https://${bank.official_domain}/...",
    "title": "Title of the official page",
    "publishedAt": "YYYY-MM-DD",
    "accessedAt": "${currentDate}"
  },
  "rates": [
    {
      "currency": "VND",
      "channel": "online" | "counter",
      "termValue": 1,
      "termUnit": "month",
      "rate": 4.6,
      "paymentMethod": "maturity",
      "minAmount": 1000000,
      "customerSegment": "individual",
      "note": "Optional notes"
    }
  ]
}
`.trim();
}
