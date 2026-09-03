import { Metadata } from "next";
import { Breadcrumb } from "@/components/chung/Breadcrumb";
import { BangLaiSuat } from "@/components/lai-suat/BangLaiSuat";
import { SoSanhLaiSuatTietKiem } from "@/components/lai-suat/SoSanhLaiSuatTietKiem";
import { Building2, ShieldCheck } from "lucide-react";

export const metadata: Metadata = {
  title: "Bảng So Sánh Lãi Suất Ngân Hàng Mới Nhất 2026 | Nguồn Chính Thức",
  description:
    "Bảng tra cứu và so sánh lãi suất tiền gửi tiết kiệm của hơn 30 ngân hàng Việt Nam. Cập nhật liên tục từ website chính thức của Vietcombank, BIDV, Agribank, Techcombank, VPBank, MB...",
  keywords: [
    "so sánh lãi suất",
    "lãi suất ngân hàng hôm nay",
    "lãi suất tiết kiệm mới nhất",
    "lãi suất cao nhất",
    "ngân hàng việt nam",
  ],
};

export default function Page() {
  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8 space-y-10">
      <Breadcrumb items={[{ name: "Lãi suất", href: "/lai-suat" }]} />

      <div>
        <div className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/10 mb-4">
          <Building2 className="h-6 w-6 text-primary" />
        </div>
        <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-3">
          Biểu lãi suất tiết kiệm các ngân hàng Việt Nam
        </h1>
        <p className="text-muted-foreground max-w-3xl leading-relaxed">
          Tổng hợp biểu lãi suất tiền gửi tiết kiệm VND dành cho khách hàng cá nhân từ hơn 30 ngân hàng. Dữ liệu được xác minh đối chiếu trực tiếp từ các kênh công bố chính thức của từng ngân hàng.
        </p>
      </div>

      {/* Bộ công cụ so sánh lợi nhuận thực tế */}
      <SoSanhLaiSuatTietKiem />

      {/* Bảng tra cứu chi tiết */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold text-foreground">
            Bảng tra cứu chi tiết theo kỳ hạn
          </h2>
          <div className="flex items-center gap-1.5 text-xs text-emerald-700 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
            <ShieldCheck className="h-4 w-4" />
            <span>Nguồn chính thức đã xác minh</span>
          </div>
        </div>
        <BangLaiSuat />
      </div>

      {/* SEO Content & Kinh nghiệm tài chính */}
      <div className="pt-10 border-t border-border prose max-w-none">
        <h2 className="text-2xl font-bold mb-6">Kinh nghiệm chọn ngân hàng gửi tiết kiệm hiệu quả</h2>
        <div className="grid md:grid-cols-3 gap-6 not-prose">
          <div className="p-6 rounded-2xl border border-border bg-card shadow-sm space-y-2">
            <h3 className="font-bold text-foreground">01. Uy tín & An toàn</h3>
            <p className="text-xs text-muted-foreground leading-relaxed">
              Nhóm ngân hàng quốc doanh (Big4: Agribank, Vietcombank, BIDV, VietinBank) mang tính an toàn cao nhất, tuy nhiên lãi suất niêm yết thường thấp hơn khối TMCP từ 0.5% - 1.5%.
            </p>
          </div>
          <div className="p-6 rounded-2xl border border-border bg-card shadow-sm space-y-2">
            <h3 className="font-bold text-foreground">02. Tối ưu kỳ hạn gửi</h3>
            <p className="text-xs text-muted-foreground leading-relaxed">
              Các kỳ hạn 6 đến 12 tháng thường mang lại điểm cân bằng tối ưu giữa lãi suất và tính thanh khoản. Hãy chia nhỏ thành nhiều sổ tiết kiệm thay vì gửi dồn một sổ.
            </p>
          </div>
          <div className="p-6 rounded-2xl border border-border bg-card shadow-sm space-y-2">
            <h3 className="font-bold text-foreground">03. Ưu tiên gửi Online</h3>
            <p className="text-xs text-muted-foreground leading-relaxed">
              Gửi tiết kiệm trên ứng dụng Mobile Banking của ngân hàng hầu hết đều được cộng thêm từ 0.1% đến 0.5%/năm so với gửi trực tiếp tại quầy.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
