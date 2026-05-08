import { Metadata } from "next";
import { Breadcrumb } from "@/components/chung/Breadcrumb";
import { TinhLaiKep } from "@/components/cong-cu/TinhLaiKep";
import { TrendingUp } from "lucide-react";

export const metadata: Metadata = {
  title: "Công cụ tính lãi kép (Compound Interest) Online chính xác nhất",
  description:
    "Công cụ tính lãi kép, giúp bạn thấy sức mạnh của việc tái đầu tư lãi suất theo thời gian. So sánh lãi kép và lãi đơn chi tiết qua từng năm.",
  keywords: ["tính lãi kép", "compound interest calculator", "sức mạnh lãi kép", "lãi chồng lãi"],
};

export default function Page() {
  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
      <Breadcrumb
        items={[
          { name: "Công cụ", href: "/" },
          { name: "Tính lãi kép", href: "/cong-cu/tinh-lai-kep" },
        ]}
      />

      <div className="mb-10">
        <div className="inline-flex h-12 w-12 items-center justify-center rounded-xl bg-secondary/10 mb-4">
          <TrendingUp className="h-6 w-6 text-secondary" />
        </div>
        <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
          Công cụ tính lãi kép
        </h1>
        <p className="text-lg text-muted-foreground max-w-3xl">
          Lãi kép là việc tiền lãi sinh ra từ vốn gốc lại tiếp tục được cộng vào vốn để tính lãi cho kỳ tiếp theo. 
          Công cụ này giúp bạn hình dung tài sản của mình sẽ tăng trưởng như thế nào trong dài hạn.
        </p>
      </div>

      <TinhLaiKep />

      {/* Kiến thức Section */}
      <div className="mt-20 prose max-w-none">
        <h2 className="text-2xl font-bold mb-6">Kiến thức về lãi kép</h2>
        <div className="grid md:grid-cols-2 gap-8 not-prose">
          <div className="bg-card border border-border rounded-xl p-6">
            <h3 className="font-semibold text-lg mb-3">Công thức tính lãi kép</h3>
            <div className="bg-muted p-4 rounded-lg font-mono text-sm mb-4">
              A = P(1 + r/n)^(nt)
            </div>
            <div className="text-sm text-muted-foreground space-y-1">
              <p><strong>A:</strong> Số tiền nhận được cuối kỳ</p>
              <p><strong>P:</strong> Số tiền gốc ban đầu</p>
              <p><strong>r:</strong> Lãi suất hàng năm (số thập phân)</p>
              <p><strong>n:</strong> Số lần ghép lãi trong một năm</p>
              <p><strong>t:</strong> Số năm đầu tư</p>
            </div>
          </div>
          <div className="bg-card border border-border rounded-xl p-6">
            <h3 className="font-semibold text-lg mb-3">3 yếu tố quyết định lãi kép</h3>
            <ul className="space-y-3 text-sm text-muted-foreground">
              <li className="flex items-start gap-2">
                <span className="font-bold text-secondary">01.</span>
                <span><strong>Thời gian:</strong> Càng đầu tư lâu, sức mạnh lãi kép càng lớn ở những năm cuối.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="font-bold text-secondary">02.</span>
                <span><strong>Lãi suất:</strong> Chỉ cần chênh lệch 1-2% mỗi năm cũng tạo ra kết quả rất khác biệt sau 10-20 năm.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="font-bold text-secondary">03.</span>
                <span><strong>Sự đều đặn:</strong> Kiên trì tái đầu tư và không rút lãi ra giữa chừng là chìa khóa thành công.</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
