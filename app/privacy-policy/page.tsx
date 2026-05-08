import { Metadata } from "next";
import { Breadcrumb } from "@/components/chung/Breadcrumb";

export const metadata: Metadata = {
  title: "Chính sách bảo mật",
  description: "Thông tin về cách chúng tôi thu thập và bảo vệ dữ liệu của bạn.",
};

export default function Page() {
  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
      <Breadcrumb items={[{ name: "Chính sách bảo mật", href: "/privacy-policy" }]} />

      <div className="max-w-3xl mx-auto py-12 prose prose-blue">
        <h1>Chính sách bảo mật</h1>
        <p className="text-muted-foreground">Cập nhật lần cuối: Tháng 5/2026</p>
        
        <p>
          Chào mừng bạn đến với Lãi Suất Ngân Hàng. Chúng tôi cam kết bảo vệ quyền riêng tư và dữ liệu cá nhân của bạn. 
          Chính sách này giải thích cách chúng tôi xử lý thông tin khi bạn sử dụng dịch vụ của chúng tôi.
        </p>

        <h2>1. Thông tin chúng tôi thu thập</h2>
        <p>
          Chúng tôi không yêu cầu bạn đăng ký tài khoản để sử dụng các công cụ tính toán. Tuy nhiên, chúng tôi có thể thu thập một số thông tin kỹ thuật tự động:
        </p>
        <ul>
          <li>Địa chỉ IP và loại trình duyệt.</li>
          <li>Các trang bạn đã truy cập trên website của chúng tôi.</li>
          <li>Thời gian và ngày truy cập.</li>
        </ul>

        <h2>2. Sử dụng thông tin</h2>
        <p>Chúng tôi sử dụng thông tin thu thập được để:</p>
        <ul>
          <li>Cải thiện chất lượng dịch vụ và trải nghiệm người dùng.</li>
          <li>Phân tích lưu lượng truy cập để tối ưu hóa nội dung.</li>
          <li>Đảm bảo an ninh cho hệ thống.</li>
        </ul>

        <h2>3. Cookies</h2>
        <p>
          Chúng tôi sử dụng cookies để ghi nhớ tùy chọn của bạn (ví dụ: cài đặt tính toán gần nhất) và để phân tích dữ liệu web thông qua các công cụ như Google Analytics.
        </p>

        <h2>4. Liên kết bên thứ ba</h2>
        <p>
          Website của chúng tôi có thể chứa liên kết đến trang web của các ngân hàng. Chúng tôi không chịu trách nhiệm về chính sách bảo mật của các trang web bên thứ ba đó.
        </p>

        <h2>5. Thay đổi chính sách</h2>
        <p>
          Chúng tôi có quyền cập nhật chính sách này bất kỳ lúc nào. Mọi thay đổi sẽ được thông báo bằng cách cập nhật ngày "Cập nhật lần cuối" ở đầu trang.
        </p>
      </div>
    </div>
  );
}
