import { roundMoney } from "./rounding";

export interface CompoundInterestResult {
  principal: number;
  annualRate: number;
  years: number;
  frequency: "hang-thang" | "hang-quy" | "hang-nam";
  compoundInterestTotal: number;
  simpleInterestTotal: number;
  compoundTotalMaturity: number;
  simpleTotalMaturity: number;
  difference: number;
  yearlyBreakdown: {
    year: number;
    compoundBalance: number;
    simpleBalance: number;
    difference: number;
  }[];
}

/**
 * Tính lãi kép theo công thức chuẩn: A = P * (1 + r/n)^(n*t)
 */
export function calculateCompoundInterest(
  principal: number,
  annualRate: number,
  years: number,
  frequency: "hang-thang" | "hang-quy" | "hang-nam" = "hang-nam"
): CompoundInterestResult {
  const n = frequency === "hang-thang" ? 12 : frequency === "hang-quy" ? 4 : 1;
  const r = annualRate / 100;

  const yearlyBreakdown = [];

  for (let year = 1; year <= years; year++) {
    // Lãi kép: A = P(1 + r/n)^(nt)
    const compoundBalance = roundMoney(principal * Math.pow(1 + r / n, n * year));

    // Lãi đơn: A = P(1 + rt)
    const simpleBalance = roundMoney(principal * (1 + r * year));

    yearlyBreakdown.push({
      year,
      compoundBalance,
      simpleBalance,
      difference: compoundBalance - simpleBalance,
    });
  }

  const finalYear = yearlyBreakdown[years - 1] || {
    compoundBalance: principal,
    simpleBalance: principal,
    difference: 0,
  };

  return {
    principal,
    annualRate,
    years,
    frequency,
    compoundInterestTotal: finalYear.compoundBalance - principal,
    simpleInterestTotal: finalYear.simpleBalance - principal,
    compoundTotalMaturity: finalYear.compoundBalance,
    simpleTotalMaturity: finalYear.simpleBalance,
    difference: finalYear.difference,
    yearlyBreakdown,
  };
}
