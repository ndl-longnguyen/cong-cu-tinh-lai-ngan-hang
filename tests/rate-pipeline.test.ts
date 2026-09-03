import { describe, it, expect } from "vitest";
import { isOfficialSource } from "../lib/interest-rates/source-validator";
import { validateRates } from "../lib/interest-rates/validator";
import { GeminiBankRateResultSchema } from "../lib/interest-rates/schema";

describe("Rate Pipeline - Official Domain Validator", () => {
  const officialDomain = "vietcombank.com.vn";

  it("chấp nhận URL thuộc đúng domain chính thức của ngân hàng", () => {
    expect(
      isOfficialSource("https://vietcombank.com.vn/khach-hang-ca-nhan/lai-suat", officialDomain)
    ).toBe(true);
    expect(
      isOfficialSource("https://www.vietcombank.com.vn/bieu-phi-lai-suat", officialDomain)
    ).toBe(true);
    expect(
      isOfficialSource("https://ebank.vietcombank.com.vn/deposit/rates", officialDomain)
    ).toBe(true);
  });

  it("tuyệt đối từ chối các URL giả mạo, diễn đàn, báo lá cải hoặc external domains", () => {
    expect(
      isOfficialSource("https://fake-vietcombank.com.vn/lai-suat", officialDomain)
    ).toBe(false);
    expect(
      isOfficialSource("https://vietcombank.com.vn.phishing.org/login", officialDomain)
    ).toBe(false);
    expect(
      isOfficialSource("https://cafef.vn/lai-suat-vietcombank-thang-5.chn", officialDomain)
    ).toBe(false);
    expect(
      isOfficialSource("https://tinhte.vn/thread/lai-suat-ngan-hang", officialDomain)
    ).toBe(false);
    expect(isOfficialSource("", officialDomain)).toBe(false);
  });
});

describe("Rate Pipeline - Rate Sanity & Anomaly Detection", () => {
  it("chấp nhận các mức lãi suất hợp lý trong khoảng 0% - 20%", () => {
    const rates = [
      {
        currency: "VND" as const,
        channel: "online" as const,
        termValue: 12,
        termUnit: "month" as const,
        rate: 5.6,
        paymentMethod: "maturity" as const,
      },
    ];
    const res = validateRates(rates);
    expect(res.isValid).toBe(true);
    expect(res.needsReview).toBe(false);
    expect(res.validatedRates.length).toBe(1);
  });

  it("loại bỏ các mức lãi suất phi lý (âm hoặc trên 20%)", () => {
    const rates = [
      {
        currency: "VND" as const,
        channel: "online" as const,
        termValue: 12,
        termUnit: "month" as const,
        rate: 25.5, // Quá cao
        paymentMethod: "maturity" as const,
      },
      {
        currency: "VND" as const,
        channel: "counter" as const,
        termValue: 6,
        termUnit: "month" as const,
        rate: -1.0, // Số âm
        paymentMethod: "maturity" as const,
      },
    ];
    const res = validateRates(rates);
    expect(res.isValid).toBe(false);
    expect(res.needsReview).toBe(true);
    expect(res.validatedRates.length).toBe(0);
  });

  it("phát hiện biến động bất thường (Anomaly Detection) khi delta > 3.0%", () => {
    const existingRates = new Map<string, number>();
    existingRates.set("online-12-month-maturity", 5.0);

    // AI trả về 15.0% (tăng vọt 10%) -> Bắt buộc gắn cờ needsReview và không ghi đè DB
    const incomingRates = [
      {
        currency: "VND" as const,
        channel: "online" as const,
        termValue: 12,
        termUnit: "month" as const,
        rate: 15.0,
        paymentMethod: "maturity" as const,
      },
    ];

    const res = validateRates(incomingRates, existingRates);
    expect(res.needsReview).toBe(true);
    expect(res.validatedRates.length).toBe(0);
    expect(res.reasons[0]).toContain("Cảnh báo biến động lớn");
  });

  it("chấp nhận biến động thông thường (ví dụ tăng nhẹ từ 5.0% lên 5.2%)", () => {
    const existingRates = new Map<string, number>();
    existingRates.set("online-12-month-maturity", 5.0);

    const incomingRates = [
      {
        currency: "VND" as const,
        channel: "online" as const,
        termValue: 12,
        termUnit: "month" as const,
        rate: 5.2,
        paymentMethod: "maturity" as const,
      },
    ];

    const res = validateRates(incomingRates, existingRates);
    expect(res.isValid).toBe(true);
    expect(res.needsReview).toBe(false);
    expect(res.validatedRates.length).toBe(1);
  });
});

describe("Rate Pipeline - Zod Schema Validation", () => {
  it("validate thành công kết quả có cấu trúc từ AI", () => {
    const sampleAiOutput = {
      bankCode: "VCB",
      status: "success",
      source: {
        url: "https://vietcombank.com.vn/lai-suat",
        title: "Biểu lãi suất Vietcombank",
        accessedAt: "2026-09-03",
      },
      rates: [
        {
          currency: "VND",
          channel: "online",
          termValue: 12,
          termUnit: "month",
          rate: 4.6,
          paymentMethod: "maturity",
        },
      ],
    };

    const parsed = GeminiBankRateResultSchema.safeParse(sampleAiOutput);
    expect(parsed.success).toBe(true);
  });

  it("từ chối dữ liệu thiếu trường bắt buộc hoặc sai channel", () => {
    const invalidAiOutput = {
      bankCode: "VCB",
      status: "success",
      source: null,
      rates: [
        {
          channel: "invalid_channel", // Sai channel
          termValue: 12,
          rate: 4.6,
        },
      ],
    };

    const parsed = GeminiBankRateResultSchema.safeParse(invalidAiOutput);
    expect(parsed.success).toBe(false);
  });
});
