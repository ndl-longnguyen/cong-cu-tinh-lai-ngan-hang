import { z } from "zod";

export const GeminiRateItemSchema = z.object({
  currency: z.literal("VND").default("VND"),
  channel: z.enum(["online", "counter"]),
  termValue: z.number().int().positive(),
  termUnit: z.enum(["day", "month", "year"]),
  rate: z.number().min(0).max(30),
  paymentMethod: z.enum(["maturity", "monthly", "quarterly", "upfront"]).default("maturity"),
  minAmount: z.number().optional(),
  maxAmount: z.number().optional(),
  customerSegment: z.string().optional().default("individual"),
  note: z.string().optional(),
});

export const GeminiRateSourceSchema = z.object({
  url: z.string().url(),
  title: z.string().optional(),
  publishedAt: z.string().optional(),
  accessedAt: z.string(),
});

export const GeminiBankRateResultSchema = z.object({
  bankCode: z.string(),
  status: z.enum(["success", "partial", "not_found"]),
  source: GeminiRateSourceSchema.nullable(),
  rates: z.array(GeminiRateItemSchema).default([]),
});

export type GeminiRateItem = z.infer<typeof GeminiRateItemSchema>;
export type GeminiRateSource = z.infer<typeof GeminiRateSourceSchema>;
export type GeminiBankRateResult = z.infer<typeof GeminiBankRateResultSchema>;
