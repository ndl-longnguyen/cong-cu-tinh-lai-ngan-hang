import { Metadata } from "next";
import { notFound } from "next/navigation";
import { Breadcrumb } from "@/components/chung/Breadcrumb";
import { layNganHangTheoSlug, layDanhSachNganHang, layLaiSuatTheoNganHang } from "@/lib/lay-du-lieu";
import { dinhDangPhanTram, dinhDangTien } from "@/lib/dinh-dang";
import { Globe, Phone, MapPin, Calendar, Info, ArrowRight } from "lucide-react";
import Link from "next/link";

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  const nganHangs = layDanhSachNganHang();
  return nganHangs.map((nh) => ({
    slug: nh.slug,
  }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const nh = layNganHangTheoSlug(slug);
  if (!nh) return {};

  return {
    title: `Lãi suất ngân hàng ${nh.ten} mới nhất 2026`,
    description: `Cập nhật biểu lãi suất tiết kiệm ngân hàng ${nh.ten} (${nh.tenVietTat}) mới nhất. Tra cứu lãi suất online và tại quầy chi tiết các kỳ hạn.`,
  };
}

export default async function Page({ params }: Props) {
  const { slug } = await params;
  const nh = layNganHangTheoSlug(slug);
  if (!nh) notFound();

  const laiSuats = layLaiSuatTheoNganHang(nh.id);
  const laiOnline = laiSuats.filter(ls => ls.hinhThuc === 'online').sort((a, b) => a.kyHan - b.kyHan);
  const laiTaiQuay = laiSuats.filter(ls => ls.hinhThuc === 'tai-quay').sort((a, b) => a.kyHan - b.kyHan);

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
      <Breadcrumb
        items={[
          { name: "Lãi suất", href: "/lai-suat" },
          { name: nh.tenVietTat, href: `/ngan-hang/${nh.slug}` },
        ]}
      />

      {/* Hero Section */}
      <div className="bg-card border border-border rounded-2xl p-8 mb-8 shadow-sm">
        <div className="flex flex-col md:flex-row gap-8 items-start">
          <div className="h-24 w-24 rounded-2xl bg-muted flex items-center justify-center text-2xl font-bold text-primary shrink-0 border border-border">
            {nh.tenVietTat}
          </div>
          <div className="flex-1">
            <h1 className="text-3xl font-bold text-foreground mb-4">
              Lãi suất ngân hàng {nh.ten} ({nh.tenVietTat})
            </h1>
            <p className="text-muted-foreground leading-relaxed mb-6">
              {nh.moTaChiTiet || `Thông tin chi tiết về biểu lãi suất tiền gửi tiết kiệm mới nhất của ngân hàng ${nh.ten}.`}
            </p>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
              <a href={nh.website} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-sm text-muted-foreground hover:text-primary">
                <Globe className="h-4 w-4" />
                Website chính thức
              </a>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Calendar className="h-4 w-4" />
                Thành lập: {nh.thanhLap}
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
            <div className="px-6 py-4 border-b border-border bg-blue-50/50">
              <h3 className="font-semibold text-blue-900 flex items-center gap-2">
                <Globe className="h-5 w-5" />
                Lãi suất gửi tiết kiệm Online
              </h3>
            </div>
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-muted/30">
                  <th className="px-6 py-3 border-b border-border">Kỳ hạn</th>
                  <th className="px-6 py-3 border-b border-border text-center">Lãi suất (%/năm)</th>
                  <th className="px-6 py-3 border-b border-border text-right">Hành động</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {laiOnline.map((ls) => (
                  <tr key={ls.id} className="hover:bg-muted/20">
                    <td className="px-6 py-4 font-medium">{ls.kyHan} tháng</td>
                    <td className="px-6 py-4 text-center">
                      <span className="text-secondary font-bold text-lg">{dinhDangPhanTram(ls.laiSuat)}</span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <Link href="/cong-cu/tinh-lai-tiet-kiem" className="text-primary hover:underline text-xs">
                        Tính tiền lãi
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
              <h3 className="font-semibold text-orange-900 flex items-center gap-2">
                <MapPin className="h-5 w-5" />
                Lãi suất gửi tại quầy
              </h3>
            </div>
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-muted/30">
                  <th className="px-6 py-3 border-b border-border">Kỳ hạn</th>
                  <th className="px-6 py-3 border-b border-border text-center">Lãi suất (%/năm)</th>
                  <th className="px-6 py-3 border-b border-border text-right">Hành động</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {laiTaiQuay.map((ls) => (
                  <tr key={ls.id} className="hover:bg-muted/20">
                    <td className="px-6 py-4 font-medium">{ls.kyHan} tháng</td>
                    <td className="px-6 py-4 text-center">
                      <span className="text-orange-600 font-bold text-lg">{dinhDangPhanTram(ls.laiSuat)}</span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <Link href="/cong-cu/tinh-lai-tiet-kiem" className="text-primary hover:underline text-xs">
                        Tính tiền lãi
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Sidebar Info */}
        <div className="space-y-6">
          <div className="bg-card border border-border rounded-2xl p-6 shadow-sm">
            <h3 className="font-bold text-lg mb-4">Lưu ý của {nh.tenVietTat}</h3>
            <div className="space-y-4">
              <div className="flex gap-3">
                <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                  <Info className="h-4 w-4 text-primary" />
                </div>
                <p className="text-sm text-muted-foreground">
                  Số tiền gửi tối thiểu thường là 1.000.000 VND đối với hình thức gửi tiết kiệm có kỳ hạn.
                </p>
              </div>
              <div className="flex gap-3">
                <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                  <Info className="h-4 w-4 text-primary" />
                </div>
                <p className="text-sm text-muted-foreground">
                  Lãi suất thực tế có thể thay đổi dựa trên số dư tiền gửi (ví dụ: gửi trên 1 tỷ đồng có thể được thỏa thuận lãi suất cao hơn).
                </p>
              </div>
            </div>
            <Link 
              href="/lai-suat" 
              className="mt-6 w-full flex items-center justify-center gap-2 py-3 rounded-xl border border-border hover:bg-muted transition-colors text-sm font-medium"
            >
              So sánh với ngân hàng khác
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>

          <div className="bg-primary rounded-2xl p-6 text-primary-foreground shadow-md">
            <h3 className="font-bold text-lg mb-2">Bạn muốn tối ưu tiền lãi?</h3>
            <p className="text-sm text-primary-foreground/80 mb-6">
              Sử dụng công cụ tính lãi kép để xem số tiền của bạn sẽ tăng trưởng như thế nào nếu tái đầu tư liên tục.
            </p>
            <Link 
              href="/cong-cu/tinh-lai-kep" 
              className="block w-full text-center py-3 rounded-xl bg-white text-primary font-bold hover:bg-white/90 transition-colors"
            >
              Thử ngay
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
