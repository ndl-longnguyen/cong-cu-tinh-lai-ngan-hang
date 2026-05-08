import { Metadata } from "next";
import { Breadcrumb } from "@/components/chung/Breadcrumb";
import { TinhVay } from "@/components/cong-cu/TinhVay";
import { CreditCard } from "lucide-react";

export const metadata: Metadata = {
  title: "Công cụ tính khoản vay (Trả góp) Online chính xác nhất 2026",
  description:
    "Công cụ tính tiền trả hàng tháng cho các khoản vay mua nhà, mua xe. Hỗ trợ tính theo dư nợ giảm dần và trả góp đều (PMT).",
  keywords: ["tính khoản vay", "tính lãi vay", "tính trả góp", "vay mua nhà", "vay mua xe"],
};

export default function Page() {
  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
      <Breadcrumb
        items={[
          { name: "Công cụ", href: "/" },
          { name: "Tính khoản vay", href: "/cong-cu/tinh-vay" },
        ]}
      />

      <div className="mb-10">
        <div className="inline-flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 mb-4">
          <CreditCard className="h-6 w-6 text-primary" />
        </div>
        <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
          Công cụ tính toán khoản vay
        </h1>
        <p className="text-lg text-muted-foreground max-w-3xl">
          Giúp bạn lập kế hoạch trả nợ chính xác cho các khoản vay ngân hàng. 
          Hỗ trợ tính toán lịch trả nợ chi tiết theo cả hai phương thức phổ biến nhất hiện nay.
        </p>
      </div>

      <TinhVay />

      {/* Kiến thức Section */}
      <div className="mt-20 prose max-w-none">
        <h2 className="text-2xl font-bold mb-6">Phân biệt các hình thức trả nợ</h2>
        <div className="grid md:grid-cols-2 gap-8 not-prose">
          <div className="bg-card border border-border rounded-xl p-6">
            <h3 className="font-semibold text-lg mb-3">Dư nợ giảm dần</h3>
            <p className="text-sm text-muted-foreground mb-4">
              Tiền gốc được chia đều hàng tháng. Tiền lãi tính trên số dư thực tế còn lại.
            </p>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li className="flex items-center gap-2">
                <span className="h-1.5 w-1.5 rounded-full bg-green-500 shrink-0" />
                Tổng tiền trả giảm dần qua các tháng.
              </li>
              <li className="flex items-center gap-2">
                <span className="h-1.5 w-1.5 rounded-full bg-green-500 shrink-0" />
                Tổng lãi phải trả thấp hơn so với trả góp đều.
              </li>
              <li className="flex items-center gap-2">
                <span className="h-1.5 w-1.5 rounded-full bg-green-500 shrink-0" />
                Áp lực tài chính lớn hơn ở những tháng đầu.
              </li>
            </ul>
          </div>
          <div className="bg-card border border-border rounded-xl p-6">
            <h3 className="font-semibold text-lg mb-3">Trả góp đều (Annuity/PMT)</h3>
            <p className="text-sm text-muted-foreground mb-4">
              Tổng số tiền (Gốc + Lãi) trả hàng tháng là một con số cố định.
            </p>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li className="flex items-center gap-2">
                <span className="h-1.5 w-1.5 rounded-full bg-blue-500 shrink-0" />
                Dễ dàng quản lý tài chính vì số tiền trả cố định.
              </li>
              <li className="flex items-center gap-2">
                <span className="h-1.5 w-1.5 rounded-full bg-blue-500 shrink-0" />
                Trong những tháng đầu, tiền lãi chiếm tỷ trọng lớn.
              </li>
              <li className="flex items-center gap-2">
                <span className="h-1.5 w-1.5 rounded-full bg-blue-500 shrink-0" />
                Tổng lãi phải trả thường cao hơn dư nợ giảm dần.
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
