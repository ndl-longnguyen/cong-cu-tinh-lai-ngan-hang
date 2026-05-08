import { Metadata } from "next";
import { Breadcrumb } from "@/components/chung/Breadcrumb";
import { TinhLaiTietKiem } from "@/components/cong-cu/TinhLaiTietKiem";
import { Calculator } from "lucide-react";

export const metadata: Metadata = {
  title: "Công cụ tính lãi suất tiết kiệm chính xác nhất 2026",
  description:
    "Công cụ tính tiền lãi tiết kiệm online, tính tổng tiền nhận được sau kỳ hạn gửi. Hỗ trợ tính lãi đơn, lãi cộng dồn và gửi thêm hàng tháng.",
  keywords: ["tính lãi tiết kiệm", "công cụ tính lãi", "tính tiền gửi ngân hàng", "lãi suất tiết kiệm"],
};

export default function Page() {
  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
      <Breadcrumb
        items={[
          { name: "Công cụ", href: "/" },
          { name: "Tính lãi tiết kiệm", href: "/cong-cu/tinh-lai-tiet-kiem" },
        ]}
      />

      <div className="mb-10">
        <div className="inline-flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 mb-4">
          <Calculator className="h-6 w-6 text-primary" />
        </div>
        <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
          Công cụ tính lãi suất tiết kiệm
        </h1>
        <p className="text-lg text-muted-foreground max-w-3xl">
          Giúp bạn tính toán chính xác số tiền lãi nhận được khi gửi tiết kiệm tại các ngân hàng Việt Nam. 
          Công cụ hỗ trợ cả hình thức gửi một lần và gửi thêm định kỳ hàng tháng.
        </p>
      </div>

      <TinhLaiTietKiem />

      {/* Kiến thức Section */}
      <div className="mt-20 prose max-w-none">
        <h2 className="text-2xl font-bold mb-6">Cách tính lãi suất tiết kiệm ngân hàng</h2>
        <div className="grid md:grid-cols-2 gap-8 not-prose">
          <div className="bg-card border border-border rounded-xl p-6">
            <h3 className="font-semibold text-lg mb-3">Công thức tính lãi cuối kỳ</h3>
            <div className="bg-muted p-4 rounded-lg font-mono text-sm mb-4">
              Tiền lãi = Số tiền gửi x Lãi suất (%/năm) x (Số ngày gửi / 365)
            </div>
            <p className="text-muted-foreground text-sm">
              Đây là hình thức phổ biến nhất, tiền lãi được tính trên số dư gốc ban đầu và chỉ được nhận vào ngày cuối cùng của kỳ hạn.
            </p>
          </div>
          <div className="bg-card border border-border rounded-xl p-6">
            <h3 className="font-semibold text-lg mb-3">Lưu ý khi gửi tiết kiệm</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li className="flex items-start gap-2">
                <span className="h-1.5 w-1.5 rounded-full bg-primary mt-1.5 shrink-0" />
                Lãi suất niêm yết thường là lãi suất tính theo năm (365 ngày).
              </li>
              <li className="flex items-start gap-2">
                <span className="h-1.5 w-1.5 rounded-full bg-primary mt-1.5 shrink-0" />
                Nếu rút trước hạn, bạn thường chỉ nhận được lãi suất không kỳ hạn (rất thấp).
              </li>
              <li className="flex items-start gap-2">
                <span className="h-1.5 w-1.5 rounded-full bg-primary mt-1.5 shrink-0" />
                Gửi online thường có lãi suất cao hơn gửi tại quầy từ 0.1% - 0.5%.
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
