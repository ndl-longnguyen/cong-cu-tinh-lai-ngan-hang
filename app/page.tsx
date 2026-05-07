import Link from "next/link";
import {
  Calculator,
  TrendingUp,
  CreditCard,
  Percent,
  Building2,
  ArrowRight,
  CheckCircle,
  Shield,
  Clock,
  Search,
  Zap,
} from "lucide-react";
import { JsonLd, taoSchemaFAQ } from "@/lib/schema-structured-data";

const congCu = [
  {
    name: "Tính lãi tiết kiệm",
    href: "/cong-cu/tinh-lai-tiet-kiem",
    icon: Percent,
    description: "Tính tiền lãi và tổng tiền nhận khi gửi tiết kiệm ngân hàng",
    color: "bg-blue-500",
  },
  {
    name: "Tính lãi kép",
    href: "/cong-cu/tinh-lai-kep",
    icon: TrendingUp,
    description: "So sánh sức mạnh của lãi kép so với lãi đơn theo thời gian",
    color: "bg-emerald-500",
  },
  {
    name: "Tính khoản vay",
    href: "/cong-cu/tinh-vay",
    icon: CreditCard,
    description: "Tính tiền trả hàng tháng và lịch trả nợ chi tiết",
    color: "bg-amber-500",
  },
];

const tinhNang = [
  {
    icon: Calculator,
    title: "Tính toán chính xác",
    description: "Công thức tính lãi chuẩn theo quy định ngân hàng Việt Nam",
  },
  {
    icon: Shield,
    title: "Miễn phí & An toàn",
    description: "Hoàn toàn miễn phí, không cần đăng ký, không lưu thông tin",
  },
  {
    icon: Clock,
    title: "Cập nhật thường xuyên",
    description: "Lãi suất được cập nhật liên tục từ các ngân hàng uy tín",
  },
];

const nganHangNoiBat = [
  { name: "Vietcombank", slug: "vietcombank" },
  { name: "VietinBank", slug: "vietinbank" },
  { name: "BIDV", slug: "bidv" },
  { name: "Techcombank", slug: "techcombank" },
  { name: "MB Bank", slug: "mbbank" },
  { name: "ACB", slug: "acb" },
];

export default function TrangChu() {
  return (
    <>
      {/* Schema Structured Data */}
      <JsonLd
        data={taoSchemaFAQ([
          {
            cauHoi: "Ngân hàng nào có lãi suất cao nhất hiện nay?",
            traLoi:
              "Hiện nay, các ngân hàng TMCP như ABBank, PVcomBank, HDBank thường xuyên dẫn đầu về lãi suất tiết kiệm với mức từ 6.5% - 9.5%/năm tùy kỳ hạn và điều kiện số dư.",
          },
          {
            cauHoi: "Lãi suất ngân hàng hôm nay có biến động gì không?",
            traLoi:
              "Lãi suất ngân hàng hôm nay tháng 5/2026 có xu hướng ổn định tại nhóm Big4 và điều chỉnh nhẹ tại một số ngân hàng thương mại cổ phần.",
          },
          {
            cauHoi: "Cách tính lãi suất tiết kiệm ngân hàng chính xác nhất?",
            traLoi:
              "Công thức chuẩn: Tiền lãi = Số tiền gửi x Lãi suất (%/năm) / 365 x Số ngày gửi thực tế. Bạn có thể sử dụng công cụ tính lãi của chúng tôi để nhận kết quả nhanh nhất.",
          },
        ])}
      />

      <div className="flex flex-col">

      {/* Hero Section */}
      <section className="relative py-16 md:py-24 bg-gradient-to-b from-primary/5 to-background">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto">
            <h1 className="text-foreground mb-6">
              Lãi suất ngân hàng <span className="text-primary">mới nhất hôm nay</span> - Công cụ tính lãi 2026
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground mb-8 leading-relaxed">
              Tra cứu, so sánh lãi suất tiết kiệm và tính toán chi tiết tiền lãi
              từ hơn 30 ngân hàng tại Việt Nam. Nhanh chóng, chính xác và hoàn
              toàn miễn phí.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/cong-cu/tinh-lai-tiet-kiem"
                className="inline-flex items-center justify-center gap-2 rounded-lg bg-primary px-6 py-3 text-base font-medium text-primary-foreground hover:bg-primary/90 transition-colors"
              >
                <Calculator className="h-5 w-5" />
                Tính lãi ngay
              </Link>
              <Link
                href="/lai-suat"
                className="inline-flex items-center justify-center gap-2 rounded-lg border border-border bg-background px-6 py-3 text-base font-medium text-foreground hover:bg-muted transition-colors"
              >
                <Building2 className="h-5 w-5" />
                Xem bảng lãi suất
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Công cụ Section */}
      <section className="py-16 md:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-foreground mb-4">Công cụ tính lãi suất online chính xác</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Sử dụng các công cụ tính toán chuyên nghiệp để so sánh và lên kế hoạch tài chính hiệu quả nhất cho năm 2026.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {congCu.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className="group relative rounded-xl border border-border bg-card p-6 hover:border-primary/50 hover:shadow-lg transition-all"
              >
                <div
                  className={`inline-flex h-12 w-12 items-center justify-center rounded-lg ${item.color} mb-4`}
                >
                  <item.icon className="h-6 w-6 text-white" />
                </div>
                <h3 className="text-lg font-semibold text-foreground mb-2">
                  {item.name}
                </h3>
                <p className="text-muted-foreground text-sm mb-4">
                  {item.description}
                </p>
                <span className="inline-flex items-center text-sm font-medium text-primary group-hover:gap-2 transition-all">
                  Sử dụng ngay
                  <ArrowRight className="h-4 w-4 ml-1" />
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Tính năng Section */}
      <section className="py-16 md:py-20 bg-muted/30">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-foreground mb-4">Tại sao chọn chúng tôi?</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Công cụ tính lãi suất được thiết kế đặc biệt cho người dùng Việt
              Nam
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {tinhNang.map((item) => (
              <div key={item.title} className="text-center">
                <div className="inline-flex h-14 w-14 items-center justify-center rounded-full bg-primary/10 mb-4">
                  <item.icon className="h-7 w-7 text-primary" />
                </div>
                <h3 className="text-lg font-semibold text-foreground mb-2">
                  {item.title}
                </h3>
                <p className="text-muted-foreground">{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Ngân hàng Section */}
      <section className="py-16 md:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-foreground mb-4">So sánh lãi suất ngân hàng tháng 5/2026</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Cập nhật biểu lãi suất mới nhất từ Agribank, Vietcombank, BIDV và các ngân hàng TMCP hàng đầu.
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {nganHangNoiBat.map((bank) => (
              <Link
                key={bank.slug}
                href={`/ngan-hang/${bank.slug}`}
                className="flex items-center justify-center rounded-lg border border-border bg-card p-4 h-20 hover:border-primary/50 hover:shadow-md transition-all"
              >
                <span className="text-sm font-medium text-foreground text-center">
                  {bank.name}
                </span>
              </Link>
            ))}
          </div>

          <div className="text-center mt-8">
            <Link
              href="/lai-suat"
              className="inline-flex items-center gap-2 text-primary font-medium hover:underline"
            >
              Xem tất cả ngân hàng
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 md:py-20 bg-primary">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto">
            <h2 className="text-primary-foreground mb-4">
              Bắt đầu tính lãi ngay hôm nay
            </h2>
            <p className="text-primary-foreground/80 mb-8">
              Chỉ cần nhập số tiền và kỳ hạn, bạn sẽ nhận được kết quả chi tiết
              trong vài giây
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/cong-cu/tinh-lai-tiet-kiem"
                className="inline-flex items-center justify-center gap-2 rounded-lg bg-white px-6 py-3 text-base font-medium text-primary hover:bg-white/90 transition-colors"
              >
                <Calculator className="h-5 w-5" />
                Tính lãi tiết kiệm
              </Link>
              <Link
                href="/cong-cu/tinh-vay"
                className="inline-flex items-center justify-center gap-2 rounded-lg border border-white/30 bg-transparent px-6 py-3 text-base font-medium text-primary-foreground hover:bg-white/10 transition-colors"
              >
                <CreditCard className="h-5 w-5" />
                Tính khoản vay
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Lợi ích Section */}
      <section className="py-16 md:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-foreground mb-6">
                Lên kế hoạch tài chính thông minh
              </h2>
              <p className="text-muted-foreground mb-6 leading-relaxed">
                Việc tính toán chính xác tiền lãi giúp bạn đưa ra quyết định tài
                chính sáng suốt hơn. Dù bạn đang gửi tiết kiệm hay vay mua nhà,
                công cụ của chúng tôi sẽ giúp bạn hiểu rõ mọi con số.
              </p>
              <ul className="space-y-3">
                {[
                  "So sánh lãi suất giữa các ngân hàng",
                  "Tính toán chi tiết từng tháng",
                  "Lên kế hoạch tiết kiệm dài hạn",
                  "Đánh giá khả năng trả nợ",
                ].map((item) => (
                  <li key={item} className="flex items-center gap-3">
                    <CheckCircle className="h-5 w-5 text-secondary shrink-0" />
                    <span className="text-foreground">{item}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div className="bg-muted/50 rounded-2xl p-8">
              <div className="space-y-6">
                <div className="bg-card rounded-lg p-4 border border-border">
                  <div className="text-sm text-muted-foreground mb-1">
                    Số tiền gửi
                  </div>
                  <div className="text-2xl font-bold text-foreground">
                    100,000,000 VND
                  </div>
                </div>
                <div className="bg-card rounded-lg p-4 border border-border">
                  <div className="text-sm text-muted-foreground mb-1">
                    Kỳ hạn 12 tháng
                  </div>
                  <div className="text-2xl font-bold text-primary">
                    + 5,500,000 VND
                  </div>
                  <div className="text-sm text-muted-foreground">
                    Lãi suất 5.5%/năm
                  </div>
                </div>
                <Link
                  href="/cong-cu/tinh-lai-tiet-kiem"
                  className="block w-full text-center rounded-lg bg-primary px-4 py-3 text-sm font-medium text-primary-foreground hover:bg-primary/90 transition-colors"
                >
                  Tính lãi với số tiền của bạn
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
      </div>
    </>
  );
}
