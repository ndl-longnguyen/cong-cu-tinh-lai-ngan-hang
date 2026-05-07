// SEO utilities và metadata generation
import type { Metadata } from "next";
import type { NganHang, BaiViet } from "@/types";

const SITE_NAME = "Lãi Suất Ngân Hàng";
const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://laisuatnganghang.vn";
const DEFAULT_OG_IMAGE = "/og-image.jpg";

/**
 * Tạo metadata cho trang chủ
 */
export function layMetadataTrangChu(): Metadata {
  return {
    title: "Lãi Suất Ngân Hàng Việt Nam 2026 | So Sánh & Tính Toán Online",
    description:
      "Tra cứu lãi suất tiết kiệm ngân hàng Việt Nam mới nhất 2026. So sánh lãi suất 30+ ngân hàng, công cụ tính lãi tiết kiệm, lãi kép, vay trực tuyến miễn phí.",
    keywords: [
      "lãi suất ngân hàng",
      "lãi suất tiết kiệm",
      "so sánh lãi suất",
      "tính lãi tiết kiệm",
      "lãi suất 2026",
      "ngân hàng việt nam",
    ],
    openGraph: {
      title: "Lãi Suất Ngân Hàng Việt Nam 2026 | So Sánh & Tính Toán",
      description:
        "Tra cứu và so sánh lãi suất tiết kiệm 30+ ngân hàng. Công cụ tính lãi online miễn phí.",
      url: SITE_URL,
      siteName: SITE_NAME,
      images: [{ url: `${SITE_URL}${DEFAULT_OG_IMAGE}`, width: 1200, height: 630 }],
      locale: "vi_VN",
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title: "Lãi Suất Ngân Hàng Việt Nam 2026",
      description: "So sánh lãi suất tiết kiệm 30+ ngân hàng. Tính lãi online miễn phí.",
      images: [`${SITE_URL}${DEFAULT_OG_IMAGE}`],
    },
    alternates: {
      canonical: SITE_URL,
    },
  };
}

/**
 * Tạo metadata cho trang lãi suất
 */
export function layMetadataLaiSuat(): Metadata {
  return {
    title: "Bảng Lãi Suất Tiết Kiệm Ngân Hàng 2026 | So Sánh Chi Tiết",
    description:
      "Bảng lãi suất tiết kiệm cập nhật mới nhất tháng 5/2026. So sánh lãi suất online và tại quầy của 30+ ngân hàng Việt Nam.",
    keywords: [
      "bảng lãi suất",
      "lãi suất tiết kiệm",
      "so sánh lãi suất ngân hàng",
      "lãi suất online",
      "lãi suất tại quầy",
    ],
    openGraph: {
      title: "Bảng Lãi Suất Tiết Kiệm Ngân Hàng 2026",
      description: "So sánh lãi suất tiết kiệm 30+ ngân hàng Việt Nam cập nhật mới nhất.",
      url: `${SITE_URL}/lai-suat`,
      siteName: SITE_NAME,
      type: "website",
    },
    alternates: {
      canonical: `${SITE_URL}/lai-suat`,
    },
  };
}

/**
 * Tạo metadata cho trang chi tiết ngân hàng
 */
export function layMetadataNganHang(nganHang: NganHang): Metadata {
  const title = `Lãi Suất ${nganHang.tenVietTat} ${new Date().getFullYear()} | ${nganHang.ten}`;
  const description = `Cập nhật lãi suất tiết kiệm ${nganHang.tenVietTat} mới nhất. ${nganHang.moTa}. So sánh kỳ hạn 1, 3, 6, 12 tháng.`;

  return {
    title,
    description,
    keywords: [
      `lãi suất ${nganHang.tenVietTat.toLowerCase()}`,
      `${nganHang.tenVietTat.toLowerCase()} tiết kiệm`,
      `lãi suất ${nganHang.ten.toLowerCase()}`,
      "lãi suất ngân hàng",
    ],
    openGraph: {
      title,
      description,
      url: `${SITE_URL}/ngan-hang/${nganHang.slug}`,
      siteName: SITE_NAME,
      type: "website",
    },
    alternates: {
      canonical: `${SITE_URL}/ngan-hang/${nganHang.slug}`,
    },
  };
}

/**
 * Tạo metadata cho trang công cụ tính lãi
 */
export function layMetadataCongCu(loaiCongCu: "tinh-lai-tiet-kiem" | "tinh-lai-kep" | "tinh-vay"): Metadata {
  const congCuConfig = {
    "tinh-lai-tiet-kiem": {
      title: "Công Cụ Tính Lãi Tiết Kiệm Online 2026 | Tính Lãi Ngân Hàng",
      description:
        "Công cụ tính lãi suất tiết kiệm online miễn phí. Nhập số tiền, kỳ hạn, lãi suất để xem tiền lãi và tổng tiền nhận được.",
      keywords: ["tính lãi tiết kiệm", "công cụ tính lãi", "calculator lãi suất", "tính lãi ngân hàng"],
    },
    "tinh-lai-kep": {
      title: "Công Cụ Tính Lãi Kép Online | Sức Mạnh Của Compound Interest",
      description:
        "Tính lãi kép online miễn phí. So sánh lãi đơn vs lãi kép, xem biểu đồ tăng trưởng tài sản theo thời gian.",
      keywords: ["tính lãi kép", "lãi kép", "compound interest", "đầu tư dài hạn"],
    },
    "tinh-vay": {
      title: "Công Cụ Tính Khoản Vay Ngân Hàng | Tính Tiền Trả Hàng Tháng",
      description:
        "Tính toán khoản vay ngân hàng online. Xem chi tiết tiền gốc, lãi, lịch trả nợ theo phương pháp dư nợ giảm dần.",
      keywords: ["tính khoản vay", "calculator vay", "tính lãi vay", "lịch trả nợ"],
    },
  };

  const config = congCuConfig[loaiCongCu];

  return {
    title: config.title,
    description: config.description,
    keywords: config.keywords,
    openGraph: {
      title: config.title,
      description: config.description,
      url: `${SITE_URL}/cong-cu/${loaiCongCu}`,
      siteName: SITE_NAME,
      type: "website",
    },
    alternates: {
      canonical: `${SITE_URL}/cong-cu/${loaiCongCu}`,
    },
  };
}

/**
 * Tạo metadata cho trang blog
 */
export function layMetadataBlog(): Metadata {
  return {
    title: "Blog Tài Chính | Kiến Thức Lãi Suất & Tiết Kiệm",
    description:
      "Bài viết hữu ích về lãi suất ngân hàng, cách tính lãi tiết kiệm, lãi kép, vay vốn và kiến thức tài chính cá nhân.",
    keywords: ["blog tài chính", "kiến thức lãi suất", "tiết kiệm tiền", "đầu tư cá nhân"],
    openGraph: {
      title: "Blog Tài Chính | Kiến Thức Lãi Suất & Tiết Kiệm",
      description: "Bài viết hữu ích về lãi suất ngân hàng và tài chính cá nhân.",
      url: `${SITE_URL}/blog`,
      siteName: SITE_NAME,
      type: "website",
    },
    alternates: {
      canonical: `${SITE_URL}/blog`,
    },
  };
}

/**
 * Tạo metadata cho bài viết blog
 */
export function layMetadataBaiViet(baiViet: BaiViet): Metadata {
  return {
    title: baiViet.tieuDe,
    description: baiViet.moTa,
    keywords: baiViet.tags,
    authors: [{ name: baiViet.tacGia }],
    openGraph: {
      title: baiViet.tieuDe,
      description: baiViet.moTa,
      url: `${SITE_URL}/blog/${baiViet.slug}`,
      siteName: SITE_NAME,
      type: "article",
      publishedTime: baiViet.ngayDang,
      modifiedTime: baiViet.ngayCapNhat,
      authors: [baiViet.tacGia],
      images: baiViet.anhDaiDien ? [{ url: `${SITE_URL}${baiViet.anhDaiDien}` }] : undefined,
    },
    twitter: {
      card: "summary_large_image",
      title: baiViet.tieuDe,
      description: baiViet.moTa,
      images: baiViet.anhDaiDien ? [`${SITE_URL}${baiViet.anhDaiDien}`] : undefined,
    },
    alternates: {
      canonical: `${SITE_URL}/blog/${baiViet.slug}`,
    },
  };
}

/**
 * Tạo metadata cho các trang thông tin
 */
export function layMetadataThongTin(loaiTrang: "about" | "contact" | "privacy" | "terms" | "disclaimer"): Metadata {
  const trangConfig = {
    about: {
      title: "Giới Thiệu | Lãi Suất Ngân Hàng Việt Nam",
      description: "Tìm hiểu về website tra cứu lãi suất ngân hàng Việt Nam. Sứ mệnh cung cấp thông tin lãi suất chính xác, miễn phí.",
    },
    contact: {
      title: "Liên Hệ | Lãi Suất Ngân Hàng Việt Nam",
      description: "Liên hệ với chúng tôi để góp ý, hợp tác hoặc báo lỗi. Chúng tôi luôn sẵn sàng hỗ trợ bạn.",
    },
    privacy: {
      title: "Chính Sách Bảo Mật | Lãi Suất Ngân Hàng Việt Nam",
      description: "Chính sách bảo mật và quyền riêng tư của website. Cách chúng tôi thu thập và sử dụng thông tin.",
    },
    terms: {
      title: "Điều Khoản Sử Dụng | Lãi Suất Ngân Hàng Việt Nam",
      description: "Điều khoản và điều kiện sử dụng website tra cứu lãi suất ngân hàng.",
    },
    disclaimer: {
      title: "Tuyên Bố Miễn Trừ Trách Nhiệm | Lãi Suất Ngân Hàng",
      description: "Tuyên bố miễn trừ trách nhiệm về thông tin lãi suất và các công cụ tính toán trên website.",
    },
  };

  const config = trangConfig[loaiTrang];

  return {
    title: config.title,
    description: config.description,
    alternates: {
      canonical: `${SITE_URL}/${loaiTrang === "privacy" ? "privacy-policy" : loaiTrang}`,
    },
  };
}
