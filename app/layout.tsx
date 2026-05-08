import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import Script from "next/script";
import "./globals.css";
import { Header } from "@/components/chung/Header";
import { Footer } from "@/components/chung/Footer";
import { JsonLd, taoSchemaOrganization, taoSchemaWebsite } from "@/lib/schema-structured-data";

const inter = Inter({
  subsets: ["latin", "vietnamese"],
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: {
    default: "Lãi Suất Ngân Hàng Mới Nhất 2026 | So Sánh & Tính Toán Online",
    template: "%s | Lãi Suất Ngân Hàng",
  },
  description:
    "Cập nhật lãi suất ngân hàng mới nhất hôm nay tháng 5/2026. So sánh lãi suất tiết kiệm 30+ ngân hàng Việt Nam, công cụ tính lãi suất chính xác, nhanh chóng.",
  keywords: [
    "lãi suất ngân hàng",
    "lãi suất ngân hàng mới nhất",
    "lãi suất ngân hàng hôm nay",
    "lãi suất tiết kiệm",
    "so sánh lãi suất",
    "tính lãi tiết kiệm",
    "lãi suất 2026",
    "ngân hàng việt nam",
    "tính lãi kép",
    "tính khoản vay",
    "lãi suất cao nhất",
  ],
  authors: [{ name: "Lãi Suất Ngân Hàng" }],
  creator: "Lãi Suất Ngân Hàng",
  publisher: "Lãi Suất Ngân Hàng",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || "https://laisuatnganghang.vn"),
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  icons: {
    icon: "/icon.png",
    apple: "/icon.png",
  },
  openGraph: {
    type: "website",
    locale: "vi_VN",
    siteName: "Lãi Suất Ngân Hàng",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "Lãi Suất Ngân Hàng Việt Nam",
      },
    ],
  },
};

export const viewport: Viewport = {
  themeColor: "#1e40af",
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="vi" className={`${inter.variable} bg-background`}>
      <head>
        <link rel="canonical" href={process.env.NEXT_PUBLIC_SITE_URL || "https://laisuatnganhang.vn"} />
        <JsonLd data={[taoSchemaOrganization(), taoSchemaWebsite()]} />
        <Script
          async
          src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-9166964727480227"
          crossOrigin="anonymous"
          strategy="afterInteractive"
        />
      </head>
      <body className="font-sans min-h-screen flex flex-col">
        <Header />
        <main className="flex-1">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
