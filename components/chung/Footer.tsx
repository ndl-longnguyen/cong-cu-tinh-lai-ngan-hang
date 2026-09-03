import Link from "next/link";
import Image from "next/image";

const footerLinks = {
  congCu: [
    { name: "Tính lãi tiết kiệm", href: "/cong-cu/tinh-lai-tiet-kiem" },
    { name: "Tính lãi kép", href: "/cong-cu/tinh-lai-kep" },
    { name: "Tính khoản vay", href: "/cong-cu/tinh-vay" },
    { name: "Bảng lãi suất", href: "/lai-suat" },
  ],
  nganHang: [
    { name: "Vietcombank", href: "/ngan-hang/vietcombank" },
    { name: "VietinBank", href: "/ngan-hang/vietinbank" },
    { name: "BIDV", href: "/ngan-hang/bidv" },
    { name: "Techcombank", href: "/ngan-hang/techcombank" },
    { name: "MB Bank", href: "/ngan-hang/mbbank" },
    { name: "Tất cả ngân hàng", href: "/lai-suat" },
  ],
  thongTin: [
    { name: "Giới thiệu", href: "/about" },
    { name: "Liên hệ", href: "/contact" },
    { name: "Blog", href: "/blog" },
  ],
  phapLy: [
    { name: "Chính sách bảo mật", href: "/privacy-policy" },
    { name: "Điều khoản sử dụng", href: "/terms" },
    { name: "Miễn trừ trách nhiệm", href: "/disclaimer" },
  ],
};

export function Footer() {
  return (
    <footer className="border-t border-border bg-muted/30">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Main Footer */}
        <div className="py-12 grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-8">
          {/* Brand */}
          <div className="col-span-2 md:col-span-4 lg:col-span-1">
            <Link href="/" className="flex items-center gap-2.5 mb-4 group">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-white border border-border shadow-xs overflow-hidden group-hover:scale-105 transition-transform">
                <Image
                  src="/icon.png"
                  alt="Logo Lãi Suất Ngân Hàng"
                  width={36}
                  height={36}
                  className="h-full w-full object-contain"
                />
              </div>
              <div>
                <span className="text-lg font-bold text-foreground tracking-tight">Lãi Suất</span>
                <span className="text-lg font-bold text-primary tracking-tight"> Ngân Hàng</span>
              </div>
            </Link>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Tra cứu và so sánh lãi suất tiết kiệm ngân hàng Việt Nam. Công cụ tính lãi online miễn phí.
            </p>
          </div>

          {/* Công cụ */}
          <div>
            <h3 className="text-sm font-semibold text-foreground mb-4">Công cụ</h3>
            <ul className="space-y-3">
              {footerLinks.congCu.map((link) => (
                <li key={link.name}>
                  <Link
                    href={link.href}
                    className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Ngân hàng */}
          <div>
            <h3 className="text-sm font-semibold text-foreground mb-4">Ngân hàng</h3>
            <ul className="space-y-3">
              {footerLinks.nganHang.map((link) => (
                <li key={link.name}>
                  <Link
                    href={link.href}
                    className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Thông tin */}
          <div>
            <h3 className="text-sm font-semibold text-foreground mb-4">Thông tin</h3>
            <ul className="space-y-3">
              {footerLinks.thongTin.map((link) => (
                <li key={link.name}>
                  <Link
                    href={link.href}
                    className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Pháp lý */}
          <div>
            <h3 className="text-sm font-semibold text-foreground mb-4">Pháp lý</h3>
            <ul className="space-y-3">
              {footerLinks.phapLy.map((link) => (
                <li key={link.name}>
                  <Link
                    href={link.href}
                    className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom Footer */}
        <div className="border-t border-border py-6">
          <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
            <p className="text-sm text-muted-foreground text-center sm:text-left">
              &copy; {new Date().getFullYear()} Lãi Suất Ngân Hàng. Bảo lưu mọi quyền.
            </p>
            <p className="text-xs text-muted-foreground text-center sm:text-right max-w-md">
              Thông tin lãi suất chỉ mang tính chất tham khảo. Vui lòng liên hệ ngân hàng để xác nhận chính xác.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
