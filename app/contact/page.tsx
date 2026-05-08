import { Metadata } from "next";
import { Breadcrumb } from "@/components/chung/Breadcrumb";
import { Mail, MessageSquare, MapPin, Send } from "lucide-react";

export const metadata: Metadata = {
  title: "Liên hệ với chúng tôi",
  description: "Chúng tôi luôn sẵn sàng lắng nghe ý kiến đóng góp và phản hồi từ bạn.",
};

export default function Page() {
  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
      <Breadcrumb items={[{ name: "Liên hệ", href: "/contact" }]} />

      <div className="max-w-5xl mx-auto py-12">
        <div className="grid md:grid-cols-2 gap-12">
          <div>
            <h1 className="text-4xl font-bold mb-6">Liên hệ</h1>
            <p className="text-lg text-muted-foreground mb-8">
              Bạn có câu hỏi, góp ý hoặc muốn hợp tác? Hãy gửi tin nhắn cho chúng tôi. Chúng tôi sẽ phản hồi sớm nhất có thể.
            </p>

            <div className="space-y-6">
              <div className="flex items-start gap-4">
                <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                  <Mail className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <div className="font-bold">Email</div>
                  <div className="text-muted-foreground">contact@laisuatnganhang.vn</div>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                  <MessageSquare className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <div className="font-bold">Hỗ trợ</div>
                  <div className="text-muted-foreground">Phản hồi trong vòng 24h làm việc</div>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-card border border-border rounded-2xl p-8 shadow-sm">
            <form className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1.5">Họ và tên</label>
                <input type="text" className="w-full rounded-lg border border-input px-4 py-2 bg-background focus:ring-2 focus:ring-primary/20 outline-none" placeholder="Nguyễn Văn A" />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1.5">Email</label>
                <input type="email" className="w-full rounded-lg border border-input px-4 py-2 bg-background focus:ring-2 focus:ring-primary/20 outline-none" placeholder="email@example.com" />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1.5">Nội dung</label>
                <textarea className="w-full rounded-lg border border-input px-4 py-2 bg-background focus:ring-2 focus:ring-primary/20 outline-none h-32" placeholder="Nhập tin nhắn của bạn..."></textarea>
              </div>
              <button type="submit" className="w-full flex items-center justify-center gap-2 bg-primary text-primary-foreground py-3 rounded-lg font-bold hover:bg-primary/90 transition-colors">
                Gửi tin nhắn
                <Send className="h-4 w-4" />
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
