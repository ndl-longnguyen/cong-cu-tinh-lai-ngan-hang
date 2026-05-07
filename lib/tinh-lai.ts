// Các hàm tính toán lãi suất
import type {
  KetQuaTinhLai,
  ChiTietThang,
  KetQuaLaiKep,
  ChiTietNam,
  KetQuaTinhVay,
  DongAmortization,
} from "@/types";

/**
 * Tính lãi suất tiết kiệm (lãi đơn)
 * @param soTienGoc - Số tiền gốc ban đầu
 * @param laiSuat - Lãi suất %/năm
 * @param kyHan - Kỳ hạn (tháng)
 * @param guiThemHangThang - Số tiền gửi thêm hàng tháng (tùy chọn)
 */
export function tinhLaiTietKiem(
  soTienGoc: number,
  laiSuat: number,
  kyHan: number,
  guiThemHangThang: number = 0
): KetQuaTinhLai {
  const laiSuatThang = laiSuat / 100 / 12;
  const chiTietTheoThang: ChiTietThang[] = [];
  
  let soDu = soTienGoc;
  let tongLai = 0;

  for (let thang = 1; thang <= kyHan; thang++) {
    // Tính lãi trong tháng
    const tienLai = soDu * laiSuatThang;
    tongLai += tienLai;
    
    // Cộng tiền gửi thêm (nếu có)
    if (thang > 1 && guiThemHangThang > 0) {
      soDu += guiThemHangThang;
    }
    
    chiTietTheoThang.push({
      thang,
      soDu: soDu + tienLai,
      tienLai,
      tongLai,
    });
    
    // Cập nhật số dư cho tháng tiếp theo (lãi cộng vào gốc)
    soDu += tienLai;
  }

  const tongTienGuiThem = guiThemHangThang * (kyHan - 1);
  
  return {
    soTienGoc,
    laiSuat,
    kyHan,
    tongTienLai: tongLai,
    tongTienNhan: soTienGoc + tongTienGuiThem + tongLai,
    chiTietTheoThang,
  };
}

/**
 * Tính lãi kép
 * @param soTienGoc - Số tiền gốc ban đầu
 * @param laiSuat - Lãi suất %/năm
 * @param soNam - Số năm
 * @param tanSuatGhepLai - Tần suất ghép lãi
 */
export function tinhLaiKep(
  soTienGoc: number,
  laiSuat: number,
  soNam: number,
  tanSuatGhepLai: "hang-thang" | "hang-quy" | "hang-nam" = "hang-nam"
): KetQuaLaiKep {
  // Số lần ghép lãi trong năm
  const n = tanSuatGhepLai === "hang-thang" ? 12 : tanSuatGhepLai === "hang-quy" ? 4 : 1;
  const r = laiSuat / 100;
  
  const chiTietTheoNam: ChiTietNam[] = [];
  
  for (let nam = 1; nam <= soNam; nam++) {
    // Lãi kép: A = P(1 + r/n)^(nt)
    const soDuLaiKep = soTienGoc * Math.pow(1 + r / n, n * nam);
    
    // Lãi đơn: A = P(1 + rt)
    const soDuLaiDon = soTienGoc * (1 + r * nam);
    
    chiTietTheoNam.push({
      nam,
      soDuLaiKep,
      soDuLaiDon,
      chenhLech: soDuLaiKep - soDuLaiDon,
    });
  }
  
  const ketQuaCuoiCung = chiTietTheoNam[soNam - 1];
  
  return {
    soTienGoc,
    laiSuat,
    soNam,
    tanSuatGhepLai,
    tongTienLaiKep: ketQuaCuoiCung.soDuLaiKep - soTienGoc,
    tongTienLaiDon: ketQuaCuoiCung.soDuLaiDon - soTienGoc,
    tongTienNhanLaiKep: ketQuaCuoiCung.soDuLaiKep,
    tongTienNhanLaiDon: ketQuaCuoiCung.soDuLaiDon,
    chenhLech: ketQuaCuoiCung.chenhLech,
    chiTietTheoNam,
  };
}

/**
 * Tính khoản vay - Phương pháp dư nợ giảm dần
 * @param soTienVay - Số tiền vay
 * @param laiSuat - Lãi suất %/năm
 * @param kyHan - Kỳ hạn vay (tháng)
 */
export function tinhVayDuNoGiamDan(
  soTienVay: number,
  laiSuat: number,
  kyHan: number
): KetQuaTinhVay {
  const laiSuatThang = laiSuat / 100 / 12;
  const tienGocMoiThang = soTienVay / kyHan;
  
  const bangAmortization: DongAmortization[] = [];
  let duNoConLai = soTienVay;
  let tongTienLai = 0;
  let tongTienTra = 0;
  
  for (let ky = 1; ky <= kyHan; ky++) {
    const tienLai = duNoConLai * laiSuatThang;
    const tienGoc = tienGocMoiThang;
    const tongTra = tienGoc + tienLai;
    
    duNoConLai -= tienGoc;
    tongTienLai += tienLai;
    tongTienTra += tongTra;
    
    bangAmortization.push({
      ky,
      tienGoc,
      tienLai,
      tongTra,
      duNoConLai: Math.max(0, duNoConLai),
    });
  }
  
  // Tiền trả hàng tháng trung bình
  const tienTraHangThang = tongTienTra / kyHan;
  
  return {
    soTienVay,
    laiSuat,
    kyHan,
    kieuTinh: "du-no-giam-dan",
    tienTraHangThang,
    tongTienTra,
    tongTienLai,
    bangAmortization,
  };
}

/**
 * Tính khoản vay - Phương pháp trả góp đều (PMT)
 * @param soTienVay - Số tiền vay
 * @param laiSuat - Lãi suất %/năm
 * @param kyHan - Kỳ hạn vay (tháng)
 */
export function tinhVayTraGocDeu(
  soTienVay: number,
  laiSuat: number,
  kyHan: number
): KetQuaTinhVay {
  const laiSuatThang = laiSuat / 100 / 12;
  
  // Công thức PMT: M = P * [r(1+r)^n] / [(1+r)^n - 1]
  const tienTraHangThang =
    soTienVay *
    (laiSuatThang * Math.pow(1 + laiSuatThang, kyHan)) /
    (Math.pow(1 + laiSuatThang, kyHan) - 1);
  
  const bangAmortization: DongAmortization[] = [];
  let duNoConLai = soTienVay;
  let tongTienLai = 0;
  
  for (let ky = 1; ky <= kyHan; ky++) {
    const tienLai = duNoConLai * laiSuatThang;
    const tienGoc = tienTraHangThang - tienLai;
    
    duNoConLai -= tienGoc;
    tongTienLai += tienLai;
    
    bangAmortization.push({
      ky,
      tienGoc,
      tienLai,
      tongTra: tienTraHangThang,
      duNoConLai: Math.max(0, duNoConLai),
    });
  }
  
  return {
    soTienVay,
    laiSuat,
    kyHan,
    kieuTinh: "tra-goc-deu",
    tienTraHangThang,
    tongTienTra: tienTraHangThang * kyHan,
    tongTienLai,
    bangAmortization,
  };
}

/**
 * Tính thời gian nhân đôi tiền (Quy tắc 72)
 * @param laiSuat - Lãi suất %/năm
 */
export function tinhThoiGianNhanDoi(laiSuat: number): number {
  return 72 / laiSuat;
}

/**
 * So sánh lãi suất giữa các ngân hàng
 * @param soTien - Số tiền gửi
 * @param kyHan - Kỳ hạn (tháng)
 * @param danhSachLaiSuat - Danh sách lãi suất các ngân hàng
 */
export function soSanhLaiSuat(
  soTien: number,
  kyHan: number,
  danhSachLaiSuat: { nganHang: string; laiSuat: number }[]
): { nganHang: string; laiSuat: number; tongTienNhan: number }[] {
  return danhSachLaiSuat.map(({ nganHang, laiSuat }) => {
    const ketQua = tinhLaiTietKiem(soTien, laiSuat, kyHan);
    return {
      nganHang,
      laiSuat,
      tongTienNhan: ketQua.tongTienNhan,
    };
  }).sort((a, b) => b.tongTienNhan - a.tongTienNhan);
}
