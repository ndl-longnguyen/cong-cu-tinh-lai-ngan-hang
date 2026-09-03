import { Metadata } from "next";
import { notFound } from "next/navigation";
import { Breadcrumb } from "@/components/chung/Breadcrumb";
import { getBankBySlug, getBanks } from "@/lib/data-access/banks";
import { getRatesByBank } from "@/lib/data-access/rates";
import { dinhDangPhanTram } from "@/lib/dinh-dang";
import { Globe, Calendar, Info, ArrowRight, ShieldCheck, ExternalLink } from "lucide-react";
import Link from "next/link";

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  const banks = await getBanks();
  return banks.map((nh) => ({
    slug: nh.slug,
  }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const nh = await getBankBySlug(slug);
  if (!nh) return {};

  return {
    title: `Lãi Suất Ngân Hàng ${nh.short_name} (${nh.code}) Mới Nhất 2026 | Nguồn Chính Thức`,
    description: `Cập nhật biểu lãi suất tiền gửi tiết kiệm ngân hàng ${nh.name} (${nh.short_name}) mới nhất. Tra cứu lãi suất online và tại quầy chi tiết các kỳ hạn từ 1 đến 36 tháng.`,
  };
}

export default async function Page({ params }: Props) {
  const { slug } = await params;
  const nh = await getBankBySlug(slug);
  if (!nh) notFound();

  const laiSuats = await getRatesByBank(nh.id);
  const laiOnline = laiSuats
    .filter((ls) => ls.channel === "online")
    .sort((a, b) => a.term_value - b.term_value);
  const laiTaiQuay = laiSuats
    .filter((ls) => ls.channel === "counter")
    .sort((a, b) => a.term_value - b.term_value);

  const latestVerifiedDate = laiSuats[0]?.verified_at || "Mới nhất";
  const officialSourceUrl = laiSuats[0]?.source_url || nh.official_website;

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
      <Breadcrumb
        items={[
          { name: "Lãi suất", href: "/lai-suat" },
          { name: nh.short_name, href: `/ngan-hang/${nh.slug}` },
        ]}
      />

      {/* Hero Section */}
      <div className="bg-card border border-border rounded-3xl p-6 sm:p-8 mb-8 shadow-sm">
        <div className="flex flex-col md:flex-row gap-6 items-start">
          <div className="h-20 w-20 rounded-2xl bg-muted flex items-center justify-center text-xl font-bold text-primary shrink-0 border border-border">
            {nh.code || nh.short_name.substring(0, 3)}
          </div>
          <div className="flex-1">
            <div className="flex flex-wrap items-center gap-2 mb-2">
              <span className="text-xs px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 font-semibold border border-emerald-200 inline-flex items-center gap-1">
                <ShieldCheck className="h-3.5 w-3.5" />
                Xác minh: {latestVerifiedDate}
              </span>
              <span className="text-xs px-2.5 py-0.5 rounded-full bg-blue-50 text-blue-700 font-semibold border border-blue-200">
                Mã: {nh.code}
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold text-foreground mb-3">
              Biểu lãi suất ngân hàng {nh.name} ({nh.short_name})
            </h1>
            <p className="text-sm text-muted-foreground leading-relaxed mb-5">
              Cập nhật biểu lãi suất tiền gửi tiết kiệm VND mới nhất của {nh.short_name}. Mọi số liệu được đối chiếu trực tiếp từ website chính thức {nh.official_domain}.
            </p>
            <div className="flex flex-wrap items-center gap-4 text-xs">
              <a
                href={nh.official_website}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1.5 text-muted-foreground hover:text-primary font-medium underline"
              >
                <Globe className="h-3.5 w-3.5" />
                {nh.official_domain}
                <ExternalLink className="h-2.5 w-2.5" />
              </a>
              <div className="flex items-center gap-1.5 text-muted-foreground">
                <Calendar className="h-3.5 w-3.5" />
                Năm thành lập: {nh.established_year}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Interest Tables */}
        <div className="lg:col-span-2 space-y-8">
          {/* Online Table */}
          <div className="bg-card border border-border rounded-2xl shadow-sm overflow-hidden">
            <div className="px-6 py-4 border-b border-border bg-blue-50/50 flex items-center justify-between">
              <h3 className="font-semibold text-blue-900 flex items-center gap-2">
                <Globe className="h-4 w-4" />
                Lãi suất gửi tiết kiệm Online (Trực tuyến)
              </h3>
              <span className="text-xs text-blue-700 font-medium">Khuyên dùng</span>
            </div>
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-muted/40 text-xs text-muted-foreground">
                  <th className="px-6 py-3 border-b border-border text-left">Kỳ hạn</th>
                  <th className="px-6 py-3 border-b border-border text-center">Lãi suất (%/năm)</th>
                  <th className="px-6 py-3 border-b border-border text-right">Tính thử tiền lãi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {laiOnline.map((ls) => (
                  <tr key={ls.id} className="hover:bg-muted/20 transition-colors">
                    <td className="px-6 py-3.5 font-medium">{ls.term_value} {ls.term_unit === 'month' ? 'tháng' : ls.term_unit}</td>
                    <td className="px-6 py-3.5 text-center">
                      <span className="text-secondary font-bold text-base">
                        {dinhDangPhanTram(ls.interest_rate)}
                      </span>
                    </td>
                    <td className="px-6 py-3.5 text-right">
                      <Link
                        href={`/cong-cu/tinh-lai-tiet-kiem?bank=${nh.id}&term=${ls.term_value}`}
                        className="text-primary hover:underline text-xs font-semibold inline-flex items-center gap-1"
                      >
                        Tính lãi
                        <ArrowRight className="h-3 w-3" />
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* At Counter Table */}
          <div className="bg-card border border-border rounded-2xl shadow-sm overflow-hidden">
            <div className="px-6 py-4 border-b border-border bg-orange-50/50">
              <h3 className="font-semibold text-orange-900">
                Lãi suất gửi tiết kiệm tại quầy giao dịch
              </h3>
            </div>
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-muted/40 text-xs text-muted-foreground">
                  <th className="px-6 py-3 border-b border-border text-left">Kỳ hạn</th>
                  <th className="px-6 py-3 border-b border-border text-center">Lãi suất (%/năm)</th>
                  <th className="px-6 py-3 border-b border-border text-right">Tính thử tiền lãi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {laiTaiQuay.map((ls) => (
                  <tr key={ls.id} className="hover:bg-muted/20 transition-colors">
                    <td className="px-6 py-3.5 font-medium">{ls.term_value} {ls.term_unit === 'month' ? 'tháng' : ls.term_unit}</td>
                    <td className="px-6 py-3.5 text-center">
                      <span className="text-orange-600 font-bold text-base">
                        {dinhDangPhanTram(ls.interest_rate)}
                      </span>
                    </td>
                    <td className="px-6 py-3.5 text-right">
                      <Link
                        href={`/cong-cu/tinh-lai-tiet-kiem?bank=${nh.id}&term=${ls.term_value}`}
                        className="text-primary hover:underline text-xs font-semibold inline-flex items-center gap-1"
                      >
                        Tính lãi
                        <ArrowRight className="h-3 w-3" />
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          <div className="bg-card border border-border rounded-2xl p-6 shadow-sm space-y-4">
            <h3 className="font-bold text-foreground text-base">Nguồn kiểm chứng chính thức</h3>
            <div className="text-xs text-muted-foreground space-y-2 leading-relaxed">
              <p>
                Dữ liệu lãi suất của <strong>{nh.short_name}</strong> được trích xuất và giám sát liên tục từ domain <strong>{nh.official_domain}</strong>.
              </p>
              {officialSourceUrl && (
                <a
                  href={officialSourceUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 text-primary underline font-medium"
                >
                  Truy cập trang công bố biểu phí & lãi suất
                  <ExternalLink className="h-3 w-3" />
                </a>
              )}
            </div>
            <div className="pt-3 border-t border-border">
              <Link
                href="/lai-suat"
                className="w-full py-2.5 rounded-xl border border-border text-center block text-xs font-semibold hover:bg-muted transition-colors"
              >
                So sánh với các ngân hàng khác
              </Link>
            </div>
          </div>

          <div className="bg-primary rounded-2xl p-6 text-primary-foreground shadow-md space-y-3">
            <h3 className="font-bold text-base">Tối ưu kế hoạch tài chính</h3>
            <p className="text-xs text-primary-foreground/80 leading-relaxed">
              Sử dụng công cụ tính lãi kép để hình dung sức mạnh tăng trưởng tài sản khi tái tục liên tục toàn bộ tiền lãi.
            </p>
            <Link
              href="/cong-cu/tinh-lai-kep"
              className="inline-block w-full text-center py-2.5 rounded-xl bg-white text-primary text-xs font-bold hover:bg-white/90 transition-colors shadow-sm"
            >
              Thử nghiệm Lãi Kép
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
