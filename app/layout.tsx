import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
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
    default: "Lãi Suất Ngân Hàng Việt Nam 2026 | So Sánh & Tính Toán Online",
    template: "%s | Lãi Suất Ngân Hàng",
  },
  description:
    "Tra cứu lãi suất tiết kiệm ngân hàng Việt Nam mới nhất 2026. So sánh lãi suất 30+ ngân hàng, công cụ tính lãi tiết kiệm, lãi kép, vay trực tuyến miễn phí.",
  keywords: [
    "lãi suất ngân hàng",
    "lãi suất tiết kiệm",
    "so sánh lãi suất",
    "tính lãi tiết kiệm",
    "lãi suất 2026",
    "ngân hàng việt nam",
    "tính lãi kép",
    "tính khoản vay",
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
  openGraph: {
    type: "website",
    locale: "vi_VN",
    siteName: "Lãi Suất Ngân Hàng",
  },
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
        <JsonLd data={[taoSchemaOrganization(), taoSchemaWebsite()]} />
      </head>
      <body className="font-sans min-h-screen flex flex-col">
        <Header />
        <main className="flex-1">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
