import { describe, it, expect } from "vitest";
import {
  calculateDepositInterestActualDays,
  calculateFixedTermDeposit,
} from "../lib/finance/deposit";
import {
  countActualDays,
  getMaturityDate,
  isLeapYear,
} from "../lib/finance/date-calculation";
import {
  calculateReducingBalanceLoan,
  calculateAnnuityLoan,
} from "../lib/finance/loan";
import { calculateCompoundInterest } from "../lib/finance/compound";
import { roundMoney, roundRate } from "../lib/finance/rounding";

describe("Finance Engine - Date Calculations", () => {
  it("xác định chính xác năm nhuận và năm không nhuận", () => {
    expect(isLeapYear(2024)).toBe(true);
    expect(isLeapYear(2028)).toBe(true);
    expect(isLeapYear(2000)).toBe(true);
    expect(isLeapYear(2025)).toBe(false);
    expect(isLeapYear(2026)).toBe(false);
    expect(isLeapYear(1900)).toBe(false);
  });

  it("đếm chính xác số ngày thực tế giữa 2 mốc thời gian", () => {
    const d1 = new Date(2024, 0, 1); // 01/01/2024
    const d2 = new Date(2024, 0, 31); // 31/01/2024
    expect(countActualDays(d1, d2)).toBe(30);

    // Năm nhuận 2024 có 366 ngày
    const dStart2024 = new Date(2024, 0, 1);
    const dEnd2024 = new Date(2025, 0, 1);
    expect(countActualDays(dStart2024, dEnd2024)).toBe(366);

    // Năm thường 2025 có 365 ngày
    const dStart2025 = new Date(2025, 0, 1);
    const dEnd2025 = new Date(2026, 0, 1);
    expect(countActualDays(dStart2025, dEnd2025)).toBe(365);
  });

  it("tính ngày đáo hạn chuẩn xác khi gặp tháng 2 nhuận và không nhuận", () => {
    // 31/01/2024 (năm nhuận) + 1 tháng -> 29/02/2024
    const start2024 = new Date(2024, 0, 31);
    const maturity2024 = getMaturityDate(start2024, 1);
    expect(maturity2024.getMonth()).toBe(1); // Feb
    expect(maturity2024.getDate()).toBe(29);

    // 31/01/2025 (năm không nhuận) + 1 tháng -> 28/02/2025
    const start2025 = new Date(2025, 0, 31);
    const maturity2025 = getMaturityDate(start2025, 1);
    expect(maturity2025.getMonth()).toBe(1); // Feb
    expect(maturity2025.getDate()).toBe(28);
  });
});

describe("Finance Engine - Tiền gửi tiết kiệm (Actual Days / 365)", () => {
  it("tính tiền lãi chính xác cho 365 ngày tròn", () => {
    // 100,000,000 VND lãi 5.0%/năm trong 365 ngày = 5,000,000 VND
    const res = calculateDepositInterestActualDays(100_000_000, 5.0, 365);
    expect(res.interest).toBe(5_000_000);
    expect(res.totalMaturity).toBe(105_000_000);
  });

  it("xử lý an toàn khi lãi suất = 0 hoặc tiền gốc = 0", () => {
    expect(calculateDepositInterestActualDays(100_000_000, 0, 30).interest).toBe(0);
    expect(calculateDepositInterestActualDays(0, 5.0, 30).interest).toBe(0);
    expect(calculateDepositInterestActualDays(100_000_000, 5.0, 0).interest).toBe(0);
  });

  it("tính lãi có kỳ hạn 12 tháng với ngày thực tế", () => {
    const res = calculateFixedTermDeposit(100_000_000, 6.0, 12, new Date(2025, 0, 1));
    expect(res.actualDays).toBe(365);
    expect(res.interest).toBe(6_000_000);
    expect(res.monthlyBreakdown.length).toBe(12);
  });
});

describe("Finance Engine - Khoản vay trả góp", () => {
  it("Dư nợ giảm dần: dư nợ kỳ cuối cùng phải bằng chính xác 0", () => {
    const res = calculateReducingBalanceLoan(120_000_000, 10.0, 12);
    expect(res.schedule.length).toBe(12);
    const lastInstallment = res.schedule[res.schedule.length - 1];
    expect(lastInstallment.remainingPrincipal).toBe(0);
  });

  it("Trả góp đều PMT: xử lý an toàn trường hợp lãi suất 0% (không chia cho 0)", () => {
    const res = calculateAnnuityLoan(12_000_000, 0, 12);
    expect(res.totalInterest).toBe(0);
    expect(res.totalPaid).toBe(12_000_000);
    expect(res.firstMonthPayment).toBe(1_000_000);
    expect(res.schedule[11].remainingPrincipal).toBe(0);
  });

  it("Trả góp đều PMT: dư nợ kỳ cuối cùng phải bằng chính xác 0 (triệt tiêu số dư còn lại)", () => {
    const res = calculateAnnuityLoan(500_000_000, 10.5, 60);
    expect(res.schedule.length).toBe(60);
    const lastInstallment = res.schedule[59];
    expect(lastInstallment.remainingPrincipal).toBe(0);
  });

  it("Khoản vay dài hạn 360 tháng (30 năm): không bị tràn số và triệt tiêu dư nợ cuối", () => {
    const res = calculateAnnuityLoan(1_000_000_000, 8.5, 360);
    expect(res.schedule.length).toBe(360);
    expect(res.schedule[359].remainingPrincipal).toBe(0);
  });
});

describe("Finance Engine - Lãi Kép", () => {
  it("lãi kép tạo ra số dư cao hơn lãi đơn sau 5 năm", () => {
    const res = calculateCompoundInterest(100_000_000, 7.0, 5, "hang-thang");
    expect(res.compoundTotalMaturity).toBeGreaterThan(res.simpleTotalMaturity);
    expect(res.difference).toBeGreaterThan(0);
  });
});

describe("Finance Engine - Rounding", () => {
  it("làm tròn chuẩn số tiền VND và lãi suất", () => {
    expect(roundMoney(123456.4)).toBe(123456);
    expect(roundMoney(123456.6)).toBe(123457);
    expect(roundRate(5.6789, 2)).toBe(5.68);
    expect(roundRate(5.6789, 1)).toBe(5.7);
  });
});
