// Structured Data / Schema.org utilities
import type { NganHang, BaiViet, CauHoiThuongGap } from "@/types";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://laisuatnganghang.vn";
const SITE_NAME = "Lãi Suất Ngân Hàng";

/**
 * Tạo Organization Schema
 */
export function taoSchemaOrganization() {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: SITE_NAME,
    url: SITE_URL,
    logo: `${SITE_URL}/logo.png`,
    description:
      "Website tra cứu và so sánh lãi suất tiết kiệm ngân hàng Việt Nam. Công cụ tính lãi online miễn phí.",
    sameAs: [],
    contactPoint: {
      "@type": "ContactPoint",
      contactType: "customer service",
      availableLanguage: "Vietnamese",
    },
  };
}

/**
 * Tạo WebSite Schema (cho search box)
 */
export function taoSchemaWebsite() {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: SITE_NAME,
    url: SITE_URL,
    description: "Tra cứu lãi suất ngân hàng Việt Nam",
    potentialAction: {
      "@type": "SearchAction",
      target: {
        "@type": "EntryPoint",
        urlTemplate: `${SITE_URL}/lai-suat?q={search_term_string}`,
      },
      "query-input": "required name=search_term_string",
    },
  };
}

/**
 * Tạo Breadcrumb Schema
 */
export function taoSchemaBreadcrumb(
  items: { name: string; url: string }[]
) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: item.url.startsWith("http") ? item.url : `${SITE_URL}${item.url}`,
    })),
  };
}

/**
 * Tạo FAQ Schema
 */
export function taoSchemaFAQ(questions: CauHoiThuongGap[]) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: questions.map((q) => ({
      "@type": "Question",
      name: q.cauHoi,
      acceptedAnswer: {
        "@type": "Answer",
        text: q.traLoi,
      },
    })),
  };
}

/**
 * Tạo Article Schema
 */
export function taoSchemaArticle(baiViet: BaiViet) {
  return {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: baiViet.tieuDe,
    description: baiViet.moTa,
    image: baiViet.anhDaiDien ? `${SITE_URL}${baiViet.anhDaiDien}` : undefined,
    datePublished: baiViet.ngayDang,
    dateModified: baiViet.ngayCapNhat,
    author: {
      "@type": "Person",
      name: baiViet.tacGia,
    },
    publisher: {
      "@type": "Organization",
      name: SITE_NAME,
      logo: {
        "@type": "ImageObject",
        url: `${SITE_URL}/logo.png`,
      },
    },
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": `${SITE_URL}/blog/${baiViet.slug}`,
    },
  };
}

/**
 * Tạo FinancialProduct Schema cho ngân hàng
 */
export function taoSchemaFinancialProduct(
  nganHang: NganHang,
  laiSuat: number,
  kyHan: number
) {
  return {
    "@context": "https://schema.org",
    "@type": "FinancialProduct",
    name: `Tiết kiệm ${nganHang.tenVietTat} ${kyHan} tháng`,
    description: `Sản phẩm tiết kiệm ${kyHan} tháng của ${nganHang.ten}`,
    provider: {
      "@type": "BankOrCreditUnion",
      name: nganHang.ten,
      url: nganHang.website,
    },
    annualPercentageRate: laiSuat,
    interestRate: {
      "@type": "QuantitativeValue",
      value: laiSuat,
      unitText: "PERCENT",
    },
  };
}

/**
 * Tạo BankOrCreditUnion Schema
 */
export function taoSchemaNganHang(nganHang: NganHang) {
  return {
    "@context": "https://schema.org",
    "@type": "BankOrCreditUnion",
    name: nganHang.ten,
    alternateName: nganHang.tenVietTat,
    url: nganHang.website,
    logo: `${SITE_URL}${nganHang.logo}`,
    description: nganHang.moTaChiTiet,
    foundingDate: nganHang.thanhLap.toString(),
  };
}

/**
 * Tạo Table Schema cho bảng lãi suất
 */
export function taoSchemaTable(
  tenBang: string,
  headers: string[],
  rows: string[][]
) {
  return {
    "@context": "https://schema.org",
    "@type": "Table",
    name: tenBang,
    about: "Bảng lãi suất tiết kiệm ngân hàng",
  };
}

/**
 * Tạo SoftwareApplication Schema cho công cụ tính
 */
export function taoSchemaCongCu(
  ten: string,
  moTa: string,
  url: string
) {
  return {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    name: ten,
    description: moTa,
    url: `${SITE_URL}${url}`,
    applicationCategory: "FinanceApplication",
    operatingSystem: "Web Browser",
    offers: {
      "@type": "Offer",
      price: "0",
      priceCurrency: "VND",
    },
  };
}

/**
 * Tạo HowTo Schema cho hướng dẫn
 */
export function taoSchemaHowTo(
  ten: string,
  moTa: string,
  buoc: { ten: string; moTa: string }[]
) {
  return {
    "@context": "https://schema.org",
    "@type": "HowTo",
    name: ten,
    description: moTa,
    step: buoc.map((b, index) => ({
      "@type": "HowToStep",
      position: index + 1,
      name: b.ten,
      text: b.moTa,
    })),
  };
}

/**
 * Component để render JSON-LD script
 */
export function JsonLd({ data }: { data: object | object[] }) {
  const jsonLdArray = Array.isArray(data) ? data : [data];
  
  return (
    <>
      {jsonLdArray.map((item, index) => (
        <script
          key={index}
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(item) }}
        />
      ))}
    </>
  );
}
