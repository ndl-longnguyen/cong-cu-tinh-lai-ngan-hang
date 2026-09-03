import { roundMoney } from "./rounding";
import { countActualDays, getMaturityDate } from "./date-calculation";

export interface FixedTermDepositResult {
  principal: number;
  annualRate: number;
  months: number;
  depositDate: Date;
  maturityDate: Date;
  actualDays: number;
  interest: number;
  totalMaturity: number;
  monthlyBreakdown: {
    month: number;
    interestInMonth: number;
    cumulativeInterest: number;
    balance: number;
  }[];
}

export interface RecurringSavingsResult {
  initialPrincipal: number;
  monthlyContribution: number;
  annualRate: number;
  months: number;
  totalContributed: number;
  totalInterest: number;
  totalMaturity: number;
  monthlyBreakdown: {
    month: number;
    contributedThisMonth: number;
    interestInMonth: number;
    cumulativeInterest: number;
    balance: number;
  }[];
}

/**
 * Tính tiền lãi gửi tiết kiệm có kỳ hạn chuẩn quy tắc 365 ngày của Ngân hàng Nhà nước Việt Nam
 * Công thức: Tiền lãi = Tiền gốc * (Lãi suất / 100) * (Số ngày gửi thực tế / 365)
 */
export function calculateDepositInterestActualDays(
  principal: number,
  annualRate: number,
  actualDays: number
): { interest: number; totalMaturity: number } {
  if (principal <= 0 || annualRate <= 0 || actualDays <= 0) {
    return { interest: 0, totalMaturity: Math.max(0, principal) };
  }

  const interest = roundMoney(principal * (annualRate / 100) * (actualDays / 365));
  return {
    interest,
    totalMaturity: principal + interest,
  };
}

/**
 * Tính tiền gửi tiết kiệm có kỳ hạn nhận lãi cuối kỳ theo số tháng
 */
export function calculateFixedTermDeposit(
  principal: number,
  annualRate: number,
  months: number,
  depositDate: Date = new Date()
): FixedTermDepositResult {
  const maturityDate = getMaturityDate(depositDate, months);
  const actualDays = countActualDays(depositDate, maturityDate);
  const { interest, totalMaturity } = calculateDepositInterestActualDays(
    principal,
    annualRate,
    actualDays
  );

  // Sinh bảng chi tiết từng tháng để hiển thị trực quan
  const monthlyBreakdown = [];
  const interestPerMonthEstimated = interest / months;
  let runningCumulative = 0;

  for (let m = 1; m <= months; m++) {
    const isLastMonth = m === months;
    const interestThisMonth = isLastMonth
      ? interest - runningCumulative
      : roundMoney(interestPerMonthEstimated);

    runningCumulative += interestThisMonth;

    monthlyBreakdown.push({
      month: m,
      interestInMonth: interestThisMonth,
      cumulativeInterest: runningCumulative,
      balance: principal + (isLastMonth ? interest : 0),
    });
  }

  return {
    principal,
    annualRate,
    months,
    depositDate,
    maturityDate,
    actualDays,
    interest,
    totalMaturity,
    monthlyBreakdown,
  };
}

/**
 * Tính tiền gửi tiết kiệm tích lũy (gửi thêm hàng tháng, lãi tái tục)
 */
export function calculateRecurringSavings(
  initialPrincipal: number,
  monthlyContribution: number,
  annualRate: number,
  months: number
): RecurringSavingsResult {
  const monthlyRate = annualRate / 100 / 12;
  let currentBalance = initialPrincipal;
  let totalInterest = 0;
  let totalContributed = initialPrincipal;

  const monthlyBreakdown = [];

  for (let m = 1; m <= months; m++) {
    // Nếu từ tháng 2 có gửi thêm tiền
    const contribution = m > 1 ? monthlyContribution : 0;
    currentBalance += contribution;
    totalContributed += contribution;

    const interestThisMonth = roundMoney(currentBalance * monthlyRate);
    totalInterest += interestThisMonth;
    currentBalance += interestThisMonth; // Tái tục nhập gốc

    monthlyBreakdown.push({
      month: m,
      contributedThisMonth: contribution,
      interestInMonth: interestThisMonth,
      cumulativeInterest: totalInterest,
      balance: currentBalance,
    });
  }

  return {
    initialPrincipal,
    monthlyContribution,
    annualRate,
    months,
    totalContributed,
    totalInterest,
    totalMaturity: currentBalance,
    monthlyBreakdown,
  };
}
