import { roundMoney } from "./rounding";

export interface LoanInstallment {
  period: number;
  principalPaid: number;
  interestPaid: number;
  totalPaid: number;
  remainingPrincipal: number;
}

export interface LoanCalculationResult {
  principal: number;
  baseRate: number;
  termMonths: number;
  method: "du-no-giam-dan" | "tra-goc-deu";
  firstMonthPayment: number;
  totalInterest: number;
  totalPaid: number;
  schedule: LoanInstallment[];
}

export interface LoanOptions {
  promoMonths?: number; // Số tháng hưởng lãi suất ưu đãi
  promoRate?: number; // Lãi suất ưu đãi (%/năm)
}

/**
 * Tính khoản vay theo phương thức DƯ NỢ GIẢM DẦN
 * Tiền gốc chia đều mỗi kỳ, tiền lãi tính trên dư nợ thực tế còn lại.
 */
export function calculateReducingBalanceLoan(
  principal: number,
  annualRate: number,
  termMonths: number,
  options?: LoanOptions
): LoanCalculationResult {
  if (principal <= 0 || termMonths <= 0) {
    return {
      principal: 0,
      baseRate: annualRate,
      termMonths,
      method: "du-no-giam-dan",
      firstMonthPayment: 0,
      totalInterest: 0,
      totalPaid: 0,
      schedule: [],
    };
  }

  const basePrincipalPerMonth = roundMoney(principal / termMonths);
  const schedule: LoanInstallment[] = [];
  let remainingPrincipal = principal;
  let totalInterest = 0;
  let totalPaid = 0;

  for (let m = 1; m <= termMonths; m++) {
    // Kiểm tra có áp dụng lãi suất ưu đãi cho các tháng đầu không
    const effectiveRate =
      options?.promoMonths && m <= options.promoMonths && options.promoRate !== undefined
        ? options.promoRate
        : annualRate;

    const monthlyRate = effectiveRate / 100 / 12;
    const interestPaid = roundMoney(remainingPrincipal * monthlyRate);

    // Kỳ cuối: Điều chỉnh tiền gốc để triệt tiêu toàn bộ số dư còn lại về chính xác 0
    const principalPaid = m === termMonths ? remainingPrincipal : basePrincipalPerMonth;
    const totalMonth = principalPaid + interestPaid;

    remainingPrincipal -= principalPaid;
    totalInterest += interestPaid;
    totalPaid += totalMonth;

    schedule.push({
      period: m,
      principalPaid,
      interestPaid,
      totalPaid: totalMonth,
      remainingPrincipal: Math.max(0, remainingPrincipal),
    });
  }

  return {
    principal,
    baseRate: annualRate,
    termMonths,
    method: "du-no-giam-dan",
    firstMonthPayment: schedule[0]?.totalPaid || 0,
    totalInterest,
    totalPaid,
    schedule,
  };
}

/**
 * Tính khoản vay theo phương thức TRẢ GÓP ĐỀU (PMT / Niên Kim)
 * Tổng số tiền trả (gốc + lãi) cố định mỗi tháng.
 * Xử lý an toàn trường hợp rate = 0 (tránh chia cho 0).
 */
export function calculateAnnuityLoan(
  principal: number,
  annualRate: number,
  termMonths: number,
  options?: LoanOptions
): LoanCalculationResult {
  if (principal <= 0 || termMonths <= 0) {
    return {
      principal: 0,
      baseRate: annualRate,
      termMonths,
      method: "tra-goc-deu",
      firstMonthPayment: 0,
      totalInterest: 0,
      totalPaid: 0,
      schedule: [],
    };
  }

  // Edge case: Lãi suất 0% (trả góp 0%)
  if (annualRate <= 0 && (!options?.promoRate || options.promoRate <= 0)) {
    const monthlyPayment = roundMoney(principal / termMonths);
    const schedule: LoanInstallment[] = [];
    let rem = principal;

    for (let m = 1; m <= termMonths; m++) {
      const principalPaid = m === termMonths ? rem : monthlyPayment;
      rem -= principalPaid;
      schedule.push({
        period: m,
        principalPaid,
        interestPaid: 0,
        totalPaid: principalPaid,
        remainingPrincipal: Math.max(0, rem),
      });
    }

    return {
      principal,
      baseRate: 0,
      termMonths,
      method: "tra-goc-deu",
      firstMonthPayment: schedule[0]?.totalPaid || 0,
      totalInterest: 0,
      totalPaid: principal,
      schedule,
    };
  }

  const schedule: LoanInstallment[] = [];
  let remainingPrincipal = principal;
  let totalInterest = 0;
  let totalPaid = 0;

  // Công thức PMT chuẩn: M = P * [r(1+r)^n] / [(1+r)^n - 1]
  const baseMonthlyRate = annualRate / 100 / 12;
  const standardPMT = roundMoney(
    principal *
      (baseMonthlyRate * Math.pow(1 + baseMonthlyRate, termMonths)) /
      (Math.pow(1 + baseMonthlyRate, termMonths) - 1)
  );

  for (let m = 1; m <= termMonths; m++) {
    const isPromo =
      options?.promoMonths && m <= options.promoMonths && options.promoRate !== undefined;
    const effectiveRate = isPromo ? options.promoRate! : annualRate;
    const monthlyRate = effectiveRate / 100 / 12;

    const interestPaid = roundMoney(remainingPrincipal * monthlyRate);

    // Tính PMT cho tháng này
    let currentPMT = standardPMT;
    if (isPromo) {
      currentPMT = roundMoney(
        principal *
          (monthlyRate * Math.pow(1 + monthlyRate, termMonths)) /
          (Math.pow(1 + monthlyRate, termMonths) - 1)
      );
    }

    let principalPaid = currentPMT - interestPaid;

    // Kỳ cuối: Điều chỉnh chính xác số dư nợ còn lại về 0
    if (m === termMonths || principalPaid > remainingPrincipal) {
      principalPaid = remainingPrincipal;
      currentPMT = principalPaid + interestPaid;
    }

    remainingPrincipal -= principalPaid;
    totalInterest += interestPaid;
    totalPaid += currentPMT;

    schedule.push({
      period: m,
      principalPaid,
      interestPaid,
      totalPaid: currentPMT,
      remainingPrincipal: Math.max(0, remainingPrincipal),
    });
  }

  return {
    principal,
    baseRate: annualRate,
    termMonths,
    method: "tra-goc-deu",
    firstMonthPayment: schedule[0]?.totalPaid || 0,
    totalInterest,
    totalPaid,
    schedule,
  };
}
