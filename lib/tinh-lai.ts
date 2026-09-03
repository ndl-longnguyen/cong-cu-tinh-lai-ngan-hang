// Compatibility Layer: Cung cấp API tương thích ngược trỏ tới lib/finance/ mới
import type {
  KetQuaTinhLai,
  KetQuaLaiKep,
  KetQuaTinhVay,
  DongAmortization,
} from "@/types";
import { calculateFixedTermDeposit, calculateRecurringSavings } from "./finance/deposit";
import { calculateCompoundInterest } from "./finance/compound";
import { calculateReducingBalanceLoan, calculateAnnuityLoan } from "./finance/loan";

/**
 * Tính lãi suất tiết kiệm (chuẩn quy tắc 365 ngày)
 */
export function tinhLaiTietKiem(
  soTienGoc: number,
  laiSuat: number,
  kyHan: number,
  guiThemHangThang: number = 0
): KetQuaTinhLai {
  if (guiThemHangThang > 0) {
    const res = calculateRecurringSavings(soTienGoc, guiThemHangThang, laiSuat, kyHan);
    return {
      soTienGoc,
      laiSuat,
      kyHan,
      tongTienLai: res.totalInterest,
      tongTienNhan: res.totalMaturity,
      chiTietTheoThang: res.monthlyBreakdown.map((m) => ({
        thang: m.month,
        soDu: m.balance,
        tienLai: m.interestInMonth,
        tongLai: m.cumulativeInterest,
      })),
    };
  }

  const res = calculateFixedTermDeposit(soTienGoc, laiSuat, kyHan);
  return {
    soTienGoc,
    laiSuat,
    kyHan,
    tongTienLai: res.interest,
    tongTienNhan: res.totalMaturity,
    chiTietTheoThang: res.monthlyBreakdown.map((m) => ({
      thang: m.month,
      soDu: m.balance,
      tienLai: m.interestInMonth,
      tongLai: m.cumulativeInterest,
    })),
  };
}

/**
 * Tính lãi kép
 */
export function tinhLaiKep(
  soTienGoc: number,
  laiSuat: number,
  soNam: number,
  tanSuatGhepLai: "hang-thang" | "hang-quy" | "hang-nam" = "hang-nam"
): KetQuaLaiKep {
  const res = calculateCompoundInterest(soTienGoc, laiSuat, soNam, tanSuatGhepLai);
  return {
    soTienGoc,
    laiSuat,
    soNam,
    tanSuatGhepLai,
    tongTienLaiKep: res.compoundInterestTotal,
    tongTienLaiDon: res.simpleInterestTotal,
    tongTienNhanLaiKep: res.compoundTotalMaturity,
    tongTienNhanLaiDon: res.simpleTotalMaturity,
    chenhLech: res.difference,
    chiTietTheoNam: res.yearlyBreakdown.map((y) => ({
      nam: y.year,
      soDuLaiKep: y.compoundBalance,
      soDuLaiDon: y.simpleBalance,
      chenhLech: y.difference,
    })),
  };
}

/**
 * Tính khoản vay - Dư nợ giảm dần
 */
export function tinhVayDuNoGiamDan(
  soTienVay: number,
  laiSuat: number,
  kyHan: number
): KetQuaTinhVay {
  const res = calculateReducingBalanceLoan(soTienVay, laiSuat, kyHan);
  return {
    soTienVay,
    laiSuat,
    kyHan,
    kieuTinh: "du-no-giam-dan",
    tienTraHangThang: res.firstMonthPayment,
    tongTienTra: res.totalPaid,
    tongTienLai: res.totalInterest,
    bangAmortization: res.schedule.map(
      (s): DongAmortization => ({
        ky: s.period,
        tienGoc: s.principalPaid,
        tienLai: s.interestPaid,
        tongTra: s.totalPaid,
        duNoConLai: s.remainingPrincipal,
      })
    ),
  };
}

/**
 * Tính khoản vay - Trả góp đều (PMT)
 */
export function tinhVayTraGocDeu(
  soTienVay: number,
  laiSuat: number,
  kyHan: number
): KetQuaTinhVay {
  const res = calculateAnnuityLoan(soTienVay, laiSuat, kyHan);
  return {
    soTienVay,
    laiSuat,
    kyHan,
    kieuTinh: "tra-goc-deu",
    tienTraHangThang: res.firstMonthPayment,
    tongTienTra: res.totalPaid,
    tongTienLai: res.totalInterest,
    bangAmortization: res.schedule.map(
      (s): DongAmortization => ({
        ky: s.period,
        tienGoc: s.principalPaid,
        tienLai: s.interestPaid,
        tongTra: s.totalPaid,
        duNoConLai: s.remainingPrincipal,
      })
    ),
  };
}

/**
 * Tính thời gian nhân đôi tiền (Quy tắc 72)
 */
export function tinhThoiGianNhanDoi(laiSuat: number): number {
  if (laiSuat <= 0) return 0;
  return 72 / laiSuat;
}

/**
 * So sánh lãi suất giữa các ngân hàng
 */
export function soSanhLaiSuat(
  soTien: number,
  kyHan: number,
  danhSachLaiSuat: { nganHang: string; laiSuat: number }[]
): { nganHang: string; laiSuat: number; tongTienNhan: number }[] {
  return danhSachLaiSuat
    .map(({ nganHang, laiSuat }) => {
      const ketQua = tinhLaiTietKiem(soTien, laiSuat, kyHan);
      return {
        nganHang,
        laiSuat,
        tongTienNhan: ketQua.tongTienNhan,
      };
    })
    .sort((a, b) => b.tongTienNhan - a.tongTienNhan);
}
