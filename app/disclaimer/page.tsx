import { Metadata } from "next";
import { Breadcrumb } from "@/components/chung/Breadcrumb";
import { AlertTriangle, ShieldCheck, HelpCircle } from "lucide-react";

export const metadata: Metadata = {
  title: "Tuyên Bố Miễn Trừ Trách Nhiệm | Lãi Suất Ngân Hàng",
  description:
    "Tuyên bố miễn trừ trách nhiệm về thông tin biểu lãi suất và các công cụ tính toán tài chính trên website Lãi Suất Ngân Hàng.",
};

export default function Page() {
  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
      <Breadcrumb items={[{ name: "Miễn trừ trách nhiệm", href: "/disclaimer" }]} />

      <div className="max-w-3xl mx-auto py-10">
        <div className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-amber-500/10 mb-4">
          <AlertTriangle className="h-6 w-6 text-amber-600" />
        </div>
        <h1 className="text-3xl md:text-4xl font-bold mb-6 text-foreground">
          Tuyên bố miễn trừ trách nhiệm
        </h1>

        <div className="prose prose-blue max-w-none space-y-6 text-sm leading-relaxed text-muted-foreground">
          <p className="text-base text-foreground font-medium leading-relaxed">
            Chào mừng bạn đến với website <strong>Lãi Suất Ngân Hàng</strong>. Xin vui lòng đọc kỹ bản Tuyên bố miễn trừ trách nhiệm này trước khi sử dụng các dữ liệu và công cụ tính toán trên hệ thống.
          </p>

          <div className="p-5 rounded-2xl bg-card border border-border space-y-3">
            <h2 className="text-lg font-bold text-foreground flex items-center gap-2">
              <ShieldCheck className="h-5 w-5 text-primary" />
              1. Bản chất dịch vụ và tính pháp lý
            </h2>
            <p>
              Website <strong>Lãi Suất Ngân Hàng</strong> là một cổng thông tin và công cụ hỗ trợ tính toán tài chính độc lập. Chúng tôi <strong>không phải là ngân hàng, tổ chức tín dụng hay đơn vị tư vấn tài chính có thẩm quyền</strong>. Chúng tôi không thực hiện huy động vốn, mở tài khoản hay cung cấp bất kỳ dịch vụ cho vay trực tiếp nào.
            </p>
          </div>

          <div className="p-5 rounded-2xl bg-card border border-border space-y-3">
            <h2 className="text-lg font-bold text-foreground flex items-center gap-2">
              <ShieldCheck className="h-5 w-5 text-primary" />
              2. Nguồn gốc dữ liệu biểu lãi suất
            </h2>
            <p>
              Toàn bộ dữ liệu lãi suất trên website được tổng hợp và đối chiếu từ các nguồn công khai chính thức (website, biểu phí niêm yết của các ngân hàng thương mại tại Việt Nam). Mặc dù hệ thống luôn nỗ lực cập nhật dữ liệu mới nhất hàng ngày, biểu lãi suất thực tế có thể thay đổi bất kỳ lúc nào theo quyết định của từng ngân hàng mà không cần báo trước.
            </p>
          </div>

          <div className="p-5 rounded-2xl bg-card border border-border space-y-3">
            <h2 className="text-lg font-bold text-foreground flex items-center gap-2">
              <HelpCircle className="h-5 w-5 text-primary" />
              3. Tính chất tham khảo của các công cụ tính toán
            </h2>
            <p>
              Các công cụ tính lãi tiết kiệm, lãi kép và khoản vay trả góp được xây dựng theo các công thức toán học và quy định chung của Ngân hàng Nhà nước. Tuy nhiên, các con số hiển thị mang tính chất <strong>tham khảo và ước tính</strong>. Số tiền thực nhận hoặc thực trả tại quầy giao dịch có thể có chênh lệch nhỏ tùy thuộc vào:
            </p>
            <ul className="list-disc pl-5 space-y-1">
              <li>Chính sách làm tròn riêng của hệ thống Core Banking từng ngân hàng.</li>
              <li>Các chương trình khuyến mãi, thỏa thuận số dư lớn, hoặc khách hàng VIP.</li>
              <li>Các khoản phí phát sinh (phí bảo hiểm khoản vay, phí quản lý tài khoản, thuế TNCN đối với doanh nghiệp...).</li>
            </ul>
          </div>

          <div className="p-5 rounded-2xl bg-card border border-border space-y-3">
            <h2 className="text-lg font-bold text-foreground">
              4. Khuyến nghị dành cho người dùng
            </h2>
            <p>
              Trước khi đưa ra bất kỳ quyết định tài chính quan trọng nào (như mở sổ tiết kiệm, ký hợp đồng vay vốn, tất toán khoản vay), người dùng nên liên hệ trực tiếp với chi nhánh hoặc tổng đài chính thức của ngân hàng liên quan để nhận được thông tin chính xác và đầy đủ nhất.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
