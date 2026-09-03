import { MasterBank, BANK_VERIFIED_DEPOSIT_URLS } from "../data-access/seed-data";

/**
 * Sinh prompt cho 1 ngân hàng đơn lẻ
 */
export function buildRateSearchPrompt(bank: MasterBank): string {
  const currentDate = new Date().toISOString().split("T")[0];
  const knownUrl = BANK_VERIFIED_DEPOSIT_URLS[bank.id] || bank.official_website;

  return `
You are a financial data verification agent specialized in Vietnamese banking.
Task: Find CURRENT publicly available VND personal deposit interest rates (Lãi suất tiết kiệm cá nhân VND) for the bank: "${bank.name}" (${bank.short_name}, Bank Code: ${bank.code}).

Official bank domain: "${bank.official_domain}"
Official website: "${bank.official_website}"
Known deposit page URL: "${knownUrl}"
Today's Date: ${currentDate}

CRITICAL RULES:
1. ONLY return data from official sources. Search directly on the bank's official website (e.g. search: site:${bank.official_domain} "lãi suất tiền gửi" or verify the known URL "${knownUrl}"). The "source.url" MUST be a REAL working URL on "${bank.official_domain}".
2. NEVER guess, infer, interpolate, or invent any interest rate.
3. If an interest rate for a specific term is not explicitly stated on the official page, DO NOT include it.
4. Distinguish clearly between:
   - "online" (Gửi tiết kiệm trực tuyến / e-banking)
   - "counter" (Gửi tại quầy giao dịch)
5. Distinguish terms accurately: 1 month, 2 months, 3 months, 6 months, 9 months, 12 months, 18 months, 24 months, 36 months.
6. Rate values must be positive numbers representing %/year (e.g., 4.6 for 4.6%/year).
7. If no official rates can be verified for today, return status: "not_found", source: null, rates: [].
8. If only some terms can be verified, return status: "partial".
9. If full official schedule is verified, return status: "success".
10. YOU MUST RESPOND ONLY WITH A VALID JSON OBJECT. NEVER output conversational explanations, apologies, or markdown prose outside the JSON.

OUTPUT FORMAT:
You must reply ONLY with a raw JSON object (or wrapped in standard \`\`\`json codeblock) matching this exact schema:
{
  "bankCode": "${bank.code}",
  "status": "success" | "partial" | "not_found",
  "source": {
    "url": "${knownUrl}",
    "title": "Biểu lãi suất ${bank.short_name}",
    "publishedAt": null,
    "accessedAt": "${currentDate}"
  },
  "rates": [
    {
      "currency": "VND",
      "channel": "online" | "counter",
      "termValue": 12,
      "termUnit": "month",
      "rate": 4.6,
      "paymentMethod": "maturity",
      "minAmount": null,
      "customerSegment": "individual",
      "note": null
    }
  ]
}
`.trim();
}

/**
 * Sinh prompt gom nhiều ngân hàng vào 1 lần gọi duy nhất (Batch Query).
 * Tiết kiệm tối đa hạn mức Free Tier (1 request cho 8-10 ngân hàng).
 */
export function buildBatchRateSearchPrompt(banks: MasterBank[]): string {
  const currentDate = new Date().toISOString().split("T")[0];

  const banksListStr = banks
    .map(
      (b) =>
        `- Ngân hàng ${b.short_name} (Mã: "${b.code}", Tên: "${b.name}", Domain: "${b.official_domain}", URL biểu lãi suất: "${BANK_VERIFIED_DEPOSIT_URLS[b.id] || b.official_website}")`
    )
    .join("\n");

  return `
You are a financial verification AI specialized in Vietnamese banking.
Task: Search and verify CURRENT VND personal deposit interest rates (Lãi suất tiết kiệm cá nhân VND mới nhất) for these banks:
${banksListStr}

Today's Date: ${currentDate}

CRITICAL RULES:
1. ONLY return data from official sources or verified banking publications.
2. NEVER guess, interpolate, or invent any interest rate.
3. For each bank, return rates for standard terms: 1, 2, 3, 6, 9, 12, 18, 24, 36 months (both "online" and "counter" if available).
4. Rates must be %/year (e.g. 4.6 for 4.6%/year).
5. If no rates are verified for a bank, set status: "not_found", source: null, rates: [].
6. RESPOND ONLY WITH A VALID JSON ARRAY. NEVER output conversational explanations, greetings, or prose outside the JSON.

OUTPUT FORMAT:
Return a JSON array containing an object for each bank in the requested list:
[
  {
    "bankCode": "VCB",
    "status": "success" | "partial" | "not_found",
    "source": {
      "url": "https://www.vietcombank.com.vn/vi-VN/KHCN/Tiet-kiem",
      "title": "Biểu lãi suất Vietcombank",
      "publishedAt": null,
      "accessedAt": "${currentDate}"
    },
    "rates": [
      {
        "currency": "VND",
        "channel": "online" | "counter",
        "termValue": 12,
        "termUnit": "month",
        "rate": 4.6,
        "paymentMethod": "maturity",
        "minAmount": null,
        "customerSegment": "individual",
        "note": null
      }
    ]
  }
]
`.trim();
}
