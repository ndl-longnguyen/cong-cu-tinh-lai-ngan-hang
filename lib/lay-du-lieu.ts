// Các hàm lấy dữ liệu từ JSON
import type { NganHang, LaiSuat, BaiViet, BoLocLaiSuat } from "@/types";
import nganHangData from "@/data/ngan-hang.json";
import laiSuatData from "@/data/lai-suat.json";
import baiVietData from "@/data/bai-viet.json";

// ==================== NGÂN HÀNG ====================

/**
 * Lấy danh sách tất cả ngân hàng
 */
export function layDanhSachNganHang(): NganHang[] {
  return nganHangData as NganHang[];
}

/**
 * Lấy thông tin ngân hàng theo slug
 */
export function layNganHangTheoSlug(slug: string): NganHang | undefined {
  return (nganHangData as NganHang[]).find((nh) => nh.slug === slug);
}

/**
 * Lấy thông tin ngân hàng theo ID
 */
export function layNganHangTheoId(id: string): NganHang | undefined {
  return (nganHangData as NganHang[]).find((nh) => nh.id === id);
}

/**
 * Tìm kiếm ngân hàng theo tên
 */
export function timKiemNganHang(tuKhoa: string): NganHang[] {
  const tuKhoaLower = tuKhoa.toLowerCase();
  return (nganHangData as NganHang[]).filter(
    (nh) =>
      nh.ten.toLowerCase().includes(tuKhoaLower) ||
      nh.tenVietTat.toLowerCase().includes(tuKhoaLower)
  );
}

// ==================== LÃI SUẤT ====================

/**
 * Lấy tất cả lãi suất
 */
export function layTatCaLaiSuat(): LaiSuat[] {
  return laiSuatData as LaiSuat[];
}

/**
 * Lấy lãi suất theo ngân hàng
 */
export function layLaiSuatTheoNganHang(nganHangId: string): LaiSuat[] {
  return (laiSuatData as LaiSuat[]).filter((ls) => ls.nganHangId === nganHangId);
}

/**
 * Lấy lãi suất theo kỳ hạn
 */
export function layLaiSuatTheoKyHan(kyHan: number): LaiSuat[] {
  return (laiSuatData as LaiSuat[]).filter((ls) => ls.kyHan === kyHan);
}

/**
 * Lấy lãi suất theo hình thức (online/tại quầy)
 */
export function layLaiSuatTheoHinhThuc(hinhThuc: "online" | "tai-quay"): LaiSuat[] {
  return (laiSuatData as LaiSuat[]).filter((ls) => ls.hinhThuc === hinhThuc);
}

/**
 * Lọc và sắp xếp lãi suất theo nhiều tiêu chí
 */
export function locLaiSuat(boLoc: BoLocLaiSuat): LaiSuat[] {
  let ketQua = laiSuatData as LaiSuat[];

  // Lọc theo kỳ hạn
  if (boLoc.kyHan && boLoc.kyHan.length > 0) {
    ketQua = ketQua.filter((ls) => boLoc.kyHan!.includes(ls.kyHan));
  }

  // Lọc theo hình thức
  if (boLoc.hinhThuc && boLoc.hinhThuc.length > 0) {
    ketQua = ketQua.filter((ls) => boLoc.hinhThuc!.includes(ls.hinhThuc));
  }

  // Lọc theo ngân hàng
  if (boLoc.nganHangId && boLoc.nganHangId.length > 0) {
    ketQua = ketQua.filter((ls) => boLoc.nganHangId!.includes(ls.nganHangId));
  }

  // Tìm kiếm theo tên ngân hàng
  if (boLoc.timKiem) {
    const tuKhoaLower = boLoc.timKiem.toLowerCase();
    const nganHangPhuhop = (nganHangData as NganHang[])
      .filter(
        (nh) =>
          nh.ten.toLowerCase().includes(tuKhoaLower) ||
          nh.tenVietTat.toLowerCase().includes(tuKhoaLower)
      )
      .map((nh) => nh.id);
    ketQua = ketQua.filter((ls) => nganHangPhuhop.includes(ls.nganHangId));
  }

  // Sắp xếp
  if (boLoc.sapXep) {
    switch (boLoc.sapXep) {
      case "lai-suat-cao":
        ketQua.sort((a, b) => b.laiSuat - a.laiSuat);
        break;
      case "lai-suat-thap":
        ketQua.sort((a, b) => a.laiSuat - b.laiSuat);
        break;
      case "ten-az":
        ketQua.sort((a, b) => {
          const nhA = layNganHangTheoId(a.nganHangId);
          const nhB = layNganHangTheoId(b.nganHangId);
          return (nhA?.tenVietTat || "").localeCompare(nhB?.tenVietTat || "");
        });
        break;
      case "ten-za":
        ketQua.sort((a, b) => {
          const nhA = layNganHangTheoId(a.nganHangId);
          const nhB = layNganHangTheoId(b.nganHangId);
          return (nhB?.tenVietTat || "").localeCompare(nhA?.tenVietTat || "");
        });
        break;
    }
  }

  return ketQua;
}

/**
 * Lấy top ngân hàng có lãi suất cao nhất theo kỳ hạn
 */
export function layTopLaiSuatCao(
  kyHan: number,
  hinhThuc: "online" | "tai-quay" = "online",
  soLuong: number = 5
): (LaiSuat & { nganHang: NganHang })[] {
  const laiSuatLoc = (laiSuatData as LaiSuat[])
    .filter((ls) => ls.kyHan === kyHan && ls.hinhThuc === hinhThuc)
    .sort((a, b) => b.laiSuat - a.laiSuat)
    .slice(0, soLuong);

  return laiSuatLoc.map((ls) => ({
    ...ls,
    nganHang: layNganHangTheoId(ls.nganHangId)!,
  }));
}

/**
 * Lấy lãi suất cao nhất của một ngân hàng
 */
export function layLaiSuatCaoNhatCuaNganHang(
  nganHangId: string,
  hinhThuc?: "online" | "tai-quay"
): LaiSuat | undefined {
  let laiSuatNganHang = layLaiSuatTheoNganHang(nganHangId);
  
  if (hinhThuc) {
    laiSuatNganHang = laiSuatNganHang.filter((ls) => ls.hinhThuc === hinhThuc);
  }
  
  return laiSuatNganHang.sort((a, b) => b.laiSuat - a.laiSuat)[0];
}

// ==================== BÀI VIẾT ====================

/**
 * Lấy tất cả bài viết
 */
export function layTatCaBaiViet(): BaiViet[] {
  return baiVietData as BaiViet[];
}

/**
 * Lấy bài viết theo slug
 */
export function layBaiVietTheoSlug(slug: string): BaiViet | undefined {
  return (baiVietData as BaiViet[]).find((bv) => bv.slug === slug);
}

/**
 * Lấy bài viết theo tag
 */
export function layBaiVietTheoTag(tag: string): BaiViet[] {
  return (baiVietData as BaiViet[]).filter((bv) =>
    bv.tags.some((t) => t.toLowerCase() === tag.toLowerCase())
  );
}

/**
 * Lấy bài viết liên quan
 */
export function layBaiVietLienQuan(baiVietHienTai: BaiViet, soLuong: number = 3): BaiViet[] {
  // Tìm bài viết có chung tag
  const baiVietLienQuan = (baiVietData as BaiViet[])
    .filter((bv) => bv.id !== baiVietHienTai.id)
    .map((bv) => {
      const soDiemChung = bv.tags.filter((tag) =>
        baiVietHienTai.tags.includes(tag)
      ).length;
      return { ...bv, soDiemChung };
    })
    .sort((a, b) => b.soDiemChung - a.soDiemChung)
    .slice(0, soLuong);

  return baiVietLienQuan;
}

/**
 * Lấy bài viết mới nhất
 */
export function layBaiVietMoiNhat(soLuong: number = 5): BaiViet[] {
  return (baiVietData as BaiViet[])
    .sort((a, b) => new Date(b.ngayDang).getTime() - new Date(a.ngayDang).getTime())
    .slice(0, soLuong);
}

/**
 * Tìm kiếm bài viết
 */
export function timKiemBaiViet(tuKhoa: string): BaiViet[] {
  const tuKhoaLower = tuKhoa.toLowerCase();
  return (baiVietData as BaiViet[]).filter(
    (bv) =>
      bv.tieuDe.toLowerCase().includes(tuKhoaLower) ||
      bv.moTa.toLowerCase().includes(tuKhoaLower) ||
      bv.tags.some((tag) => tag.toLowerCase().includes(tuKhoaLower))
  );
}

// ==================== THỐNG KÊ ====================

/**
 * Lấy thống kê tổng quan
 */
export function layThongKe() {
  const danhSachNganHang = nganHangData as NganHang[];
  const danhSachLaiSuat = laiSuatData as LaiSuat[];
  const danhSachBaiViet = baiVietData as BaiViet[];

  const laiSuatOnline12Thang = danhSachLaiSuat.filter(
    (ls) => ls.kyHan === 12 && ls.hinhThuc === "online"
  );

  return {
    tongSoNganHang: danhSachNganHang.length,
    tongSoBaiViet: danhSachBaiViet.length,
    laiSuatCaoNhat: Math.max(...laiSuatOnline12Thang.map((ls) => ls.laiSuat)),
    laiSuatThapNhat: Math.min(...laiSuatOnline12Thang.map((ls) => ls.laiSuat)),
    laiSuatTrungBinh:
      laiSuatOnline12Thang.reduce((sum, ls) => sum + ls.laiSuat, 0) /
      laiSuatOnline12Thang.length,
  };
}
