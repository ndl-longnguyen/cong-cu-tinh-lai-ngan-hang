import { Metadata } from "next";
import { Breadcrumb } from "@/components/chung/Breadcrumb";
import { Info, Shield, CheckCircle } from "lucide-react";

export const metadata: Metadata = {
  title: "Giới thiệu về Lãi Suất Ngân Hàng",
  description: "Tìm hiểu về sứ mệnh cung cấp thông tin tài chính minh bạch và chính xác cho người dùng Việt Nam.",
};

export default function Page() {
  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
      <Breadcrumb items={[{ name: "Giới thiệu", href: "/about" }]} />

      <div className="max-w-3xl mx-auto py-12">
        <h1 className="text-4xl font-bold mb-8">Về chúng tôi</h1>
        
        <div className="prose prose-blue max-w-none">
          <p className="text-lg text-muted-foreground mb-6">
            Lãi Suất Ngân Hàng được thành lập với mục tiêu trở thành cổng thông tin tài chính cá nhân tin cậy nhất tại Việt Nam.
          </p>

          <h2 className="text-2xl font-bold mt-12 mb-6">Sứ mệnh của chúng tôi</h2>
          <p>
            Chúng tôi hiểu rằng việc quản lý tài chính cá nhân là một thách thức. Với hàng chục ngân hàng và hàng trăm gói sản phẩm khác nhau, người dùng thường gặp khó khăn trong việc tìm kiếm mức lãi suất tốt nhất. 
            Sứ mệnh của chúng tôi là minh bạch hóa thông tin, cung cấp các công cụ tính toán chính xác để mọi người có thể đưa ra quyết định tài chính sáng suốt nhất.
          </p>

          <div className="grid sm:grid-cols-2 gap-6 my-12 not-prose">
            <div className="p-6 rounded-xl border border-border bg-card">
              <CheckCircle className="h-8 w-8 text-secondary mb-4" />
              <h3 className="font-bold mb-2">Chính xác</h3>
              <p className="text-sm text-muted-foreground">Dữ liệu được cập nhật liên tục từ các nguồn tin cậy và website chính thức của các ngân hàng.</p>
            </div>
            <div className="p-6 rounded-xl border border-border bg-card">
              <Shield className="h-8 w-8 text-primary mb-4" />
              <h3 className="font-bold mb-2">Trung lập</h3>
              <p className="text-sm text-muted-foreground">Chúng tôi không thuộc sở hữu của bất kỳ ngân hàng nào, đảm bảo sự khách quan tuyệt đối trong so sánh.</p>
            </div>
          </div>

          <h2 className="text-2xl font-bold mt-12 mb-6">Giá trị cốt lõi</h2>
          <ul>
            <li><strong>Người dùng là trọng tâm:</strong> Mọi tính năng đều hướng tới trải nghiệm người dùng tốt nhất.</li>
            <li><strong>Minh bạch:</strong> Thông tin rõ ràng, không ẩn giấu các điều khoản phụ.</li>
            <li><strong>Sáng tạo:</strong> Liên tục cải tiến công cụ để việc tính toán trở nên đơn giản hơn.</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
