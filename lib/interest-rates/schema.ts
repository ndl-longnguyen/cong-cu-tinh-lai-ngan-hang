import { z } from "zod";

export const GeminiRateItemSchema = z.object({
  currency: z.literal("VND").default("VND"),
  channel: z.enum(["online", "counter"]),
  termValue: z.number().int().positive(),
  termUnit: z.enum(["day", "month", "year"]),
  rate: z.number().min(0).max(30),
  paymentMethod: z.enum(["maturity", "monthly", "quarterly", "upfront"]).default("maturity"),
  minAmount: z.number().nullable().optional(),
  maxAmount: z.number().nullable().optional(),
  customerSegment: z.string().nullable().optional().default("individual"),
  note: z.string().nullable().optional(),
});

export const GeminiRateSourceSchema = z.object({
  url: z.string(),
  title: z.string().nullable().optional(),
  publishedAt: z.string().nullable().optional(),
  accessedAt: z.string().nullable().optional(),
});

export const GeminiBankRateResultSchema = z.object({
  bankCode: z.string(),
  status: z.enum(["success", "partial", "not_found"]),
  source: GeminiRateSourceSchema.nullable(),
  rates: z.array(GeminiRateItemSchema).default([]),
});

export const GeminiBatchBankRateResultSchema = z.array(GeminiBankRateResultSchema);

export type GeminiRateItem = z.infer<typeof GeminiRateItemSchema>;
export type GeminiRateSource = z.infer<typeof GeminiRateSourceSchema>;
export type GeminiBankRateResult = z.infer<typeof GeminiBankRateResultSchema>;
export type GeminiBatchBankRateResult = z.infer<typeof GeminiBatchBankRateResultSchema>;
