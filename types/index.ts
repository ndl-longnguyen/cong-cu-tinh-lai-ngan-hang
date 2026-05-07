// Types cho toàn bộ dự án - Công cụ tính lãi suất ngân hàng Việt Nam

// Thông tin ngân hàng
export interface NganHang {
  id: string;
  ten: string;
  tenVietTat: string;
  slug: string;
  logo: string;
  moTa: string;
  moTaChiTiet: string;
  website: string;
  mauThuongHieu: string;
  thanhLap: number;
  tinhTrang: "hoat-dong" | "ngung-hoat-dong";
}

// Lãi suất tiết kiệm
export interface LaiSuat {
  id: string;
  nganHangId: string;
  kyHan: number; // số tháng
  laiSuat: number; // phần trăm (%/năm)
  hinhThuc: "online" | "tai-quay";
  soTienToiThieu: number;
  ghiChu?: string;
  capNhatLuc: string;
}

// Bài viết blog
export interface BaiViet {
  id: string;
  tieuDe: string;
  slug: string;
  moTa: string;
  noiDung: string;
  anhDaiDien: string;
  tacGia: string;
  ngayDang: string;
  ngayCapNhat: string;
  tags: string[];
  faq: CauHoiThuongGap[];
  thoiGianDoc: number; // phút
  baiVietLienQuan: string[]; // slugs
}

// FAQ
export interface CauHoiThuongGap {
  cauHoi: string;
  traLoi: string;
}

// Kết quả tính lãi tiết kiệm
export interface KetQuaTinhLai {
  soTienGoc: number;
  laiSuat: number;
  kyHan: number;
  tongTienLai: number;
  tongTienNhan: number;
  chiTietTheoThang: ChiTietThang[];
}

export interface ChiTietThang {
  thang: number;
  soDu: number;
  tienLai: number;
  tongLai: number;
}

// Kết quả tính lãi kép
export interface KetQuaLaiKep {
  soTienGoc: number;
  laiSuat: number;
  soNam: number;
  tanSuatGhepLai: "hang-thang" | "hang-quy" | "hang-nam";
  tongTienLaiKep: number;
  tongTienLaiDon: number;
  tongTienNhanLaiKep: number;
  tongTienNhanLaiDon: number;
  chenhLech: number;
  chiTietTheoNam: ChiTietNam[];
}

export interface ChiTietNam {
  nam: number;
  soDuLaiKep: number;
  soDuLaiDon: number;
  chenhLech: number;
}

// Kết quả tính khoản vay
export interface KetQuaTinhVay {
  soTienVay: number;
  laiSuat: number;
  kyHan: number; // tháng
  kieuTinh: "du-no-giam-dan" | "tra-goc-deu";
  tienTraHangThang: number;
  tongTienTra: number;
  tongTienLai: number;
  bangAmortization: DongAmortization[];
}

export interface DongAmortization {
  ky: number;
  tienGoc: number;
  tienLai: number;
  tongTra: number;
  duNoConLai: number;
}

// SEO Metadata
export interface MetadataTrang {
  title: string;
  description: string;
  keywords: string[];
  ogImage?: string;
  canonical?: string;
}

// Schema Structured Data
export interface SchemaOrganization {
  name: string;
  url: string;
  logo: string;
  description: string;
  contactPoint?: {
    telephone: string;
    contactType: string;
  };
}

export interface SchemaArticle {
  headline: string;
  description: string;
  image: string;
  datePublished: string;
  dateModified: string;
  author: string;
}

export interface SchemaBreadcrumb {
  items: {
    name: string;
    url: string;
  }[];
}

export interface SchemaFAQ {
  questions: CauHoiThuongGap[];
}

// Filter & Sort options
export interface BoLocLaiSuat {
  kyHan?: number[];
  hinhThuc?: ("online" | "tai-quay")[];
  nganHangId?: string[];
  sapXep?: "lai-suat-cao" | "lai-suat-thap" | "ten-az" | "ten-za";
  timKiem?: string;
}

// Pagination
export interface PhanTrang<T> {
  duLieu: T[];
  tongSo: number;
  trang: number;
  soMoiTrang: number;
  tongTrang: number;
}
