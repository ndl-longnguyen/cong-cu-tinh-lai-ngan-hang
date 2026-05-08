import { Metadata } from "next";
import { Breadcrumb } from "@/components/chung/Breadcrumb";
import { BangLaiSuat } from "@/components/lai-suat/BangLaiSuat";
import { Building2 } from "lucide-react";

export const metadata: Metadata = {
  title: "So sánh lãi suất ngân hàng mới nhất hôm nay 2026",
  description:
    "Bảng tổng hợp lãi suất gửi tiết kiệm của 30+ ngân hàng Việt Nam. Cập nhật mới nhất lãi suất Vietcombank, Agribank, BIDV, Techcombank...",
  keywords: ["so sánh lãi suất", "lãi suất ngân hàng hôm nay", "lãi suất tiết kiệm mới nhất"],
};

export default function Page() {
  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
      <Breadcrumb
        items={[
          { name: "Lãi suất", href: "/lai-suat" },
        ]}
      />

      <div className="mb-10">
        <div className="inline-flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 mb-4">
          <Building2 className="h-6 w-6 text-primary" />
        </div>
        <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
          Bảng so sánh lãi suất ngân hàng
        </h1>
        <p className="text-lg text-muted-foreground max-w-3xl">
          Cập nhật lãi suất gửi tiết kiệm mới nhất tháng 5/2026 từ hơn 30 ngân hàng tại Việt Nam. 
          Sử dụng bộ lọc để tìm mức lãi suất cao nhất theo kỳ hạn mong muốn.
        </p>
      </div>

      <BangLaiSuat />

      {/* SEO Content */}
      <div className="mt-20 prose max-w-none">
        <h2 className="text-2xl font-bold mb-6">Kinh nghiệm chọn ngân hàng gửi tiết kiệm</h2>
        <div className="grid md:grid-cols-3 gap-6 not-prose">
          <div className="p-5 rounded-xl border border-border bg-card">
            <h3 className="font-semibold mb-2">Độ uy tín (An toàn)</h3>
            <p className="text-sm text-muted-foreground">
              Nhóm Big4 (Agribank, Vietcombank, VietinBank, BIDV) luôn an toàn nhất nhưng lãi suất thường thấp hơn các ngân hàng TMCP.
            </p>
          </div>
          <div className="p-5 rounded-xl border border-border bg-card">
            <h3 className="font-semibold mb-2">Lãi suất (Lợi nhuận)</h3>
            <p className="text-sm text-muted-foreground">
              Các ngân hàng quy mô vừa và nhỏ thường có chương trình ưu đãi lãi suất để thu hút vốn, có thể cao hơn 1-2% so với ngân hàng lớn.
            </p>
          </div>
          <div className="p-5 rounded-xl border border-border bg-card">
            <h3 className="font-semibold mb-2">Dịch vụ & Tiện ích</h3>
            <p className="text-sm text-muted-foreground">
              Ưu tiên các ngân hàng có ứng dụng Mobile Banking tốt, cho phép gửi và tất toán online linh hoạt 24/7.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
