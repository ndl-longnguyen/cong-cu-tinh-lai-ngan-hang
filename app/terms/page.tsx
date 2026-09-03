import { Metadata } from "next";
import { Breadcrumb } from "@/components/chung/Breadcrumb";
import { FileText, CheckCircle2 } from "lucide-react";

export const metadata: Metadata = {
  title: "Điều Khoản Sử Dụng | Lãi Suất Ngân Hàng",
  description: "Các điều khoản và điều kiện khi sử dụng dịch vụ trên website Lãi Suất Ngân Hàng.",
};

export default function Page() {
  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
      <Breadcrumb items={[{ name: "Điều khoản sử dụng", href: "/terms" }]} />

      <div className="max-w-3xl mx-auto py-10">
        <div className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/10 mb-4">
          <FileText className="h-6 w-6 text-primary" />
        </div>
        <h1 className="text-3xl md:text-4xl font-bold mb-6 text-foreground">
          Điều khoản sử dụng
        </h1>

        <div className="prose prose-blue max-w-none space-y-6 text-sm leading-relaxed text-muted-foreground">
          <p className="text-base text-foreground font-medium leading-relaxed">
            Việc truy cập và sử dụng website <strong>Lãi Suất Ngân Hàng</strong> đồng nghĩa với việc bạn đồng ý tuân thủ toàn bộ các điều khoản và điều kiện dưới đây.
          </p>

          <div className="p-5 rounded-2xl bg-card border border-border space-y-3">
            <h2 className="text-lg font-bold text-foreground">1. Quyền sở hữu trí tuệ</h2>
            <p>
              Giao diện, mã nguồn, thuật toán tính toán và các bài viết phân tích trên website thuộc quyền sở hữu của ban quản trị Lãi Suất Ngân Hàng. Nhãn hiệu, logo và tên thương mại của các ngân hàng (như Vietcombank, BIDV, Agribank...) thuộc quyền sở hữu của các tổ chức tương ứng và chỉ được trích dẫn nhằm mục đích cung cấp thông tin tra cứu khách quan cho người tiêu dùng.
            </p>
          </div>

          <div className="p-5 rounded-2xl bg-card border border-border space-y-3">
            <h2 className="text-lg font-bold text-foreground">2. Quy định sử dụng công cụ</h2>
            <p>
              Người dùng được tự do sử dụng các công cụ tính lãi suất tiết kiệm, lãi kép và khoản vay cho mục đích cá nhân phi thương mại. Nghiêm cấm các hành vi sử dụng bot, crawler tự động tấn công từ chối dịch vụ hoặc sao chép mã nguồn trái phép.
            </p>
          </div>

          <div className="p-5 rounded-2xl bg-card border border-border space-y-3">
            <h2 className="text-lg font-bold text-foreground">3. Giới hạn trách nhiệm</h2>
            <p>
              Ban quản trị không chịu trách nhiệm đối với bất kỳ tổn thất, thiệt hại trực tiếp hay gián tiếp phát sinh từ việc sử dụng các thông tin hoặc công cụ trên website. Người dùng tự chịu trách nhiệm về các quyết định tài chính của mình.
            </p>
          </div>

          <div className="p-5 rounded-2xl bg-card border border-border space-y-3">
            <h2 className="text-lg font-bold text-foreground">4. Thay đổi điều khoản</h2>
            <p>
              Chúng tôi có quyền sửa đổi, bổ sung các điều khoản này vào bất kỳ thời điểm nào nhằm phù hợp với quy định pháp luật và định hướng phát triển của hệ thống.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
