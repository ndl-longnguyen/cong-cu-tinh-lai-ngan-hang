import { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { Breadcrumb } from "@/components/chung/Breadcrumb";
import { layTatCaBaiViet } from "@/lib/lay-du-lieu";
import { dinhDangNgay, dinhDangThoiGianDoc } from "@/lib/dinh-dang";
import { BookOpen, Calendar, Clock, ArrowRight, Tag } from "lucide-react";

export const metadata: Metadata = {
  title: "Blog Tài Chính & Lãi Suất Ngân Hàng | Kiến Thức Mới Nhất 2026",
  description:
    "Tổng hợp bài viết hữu ích về tài chính cá nhân, kinh nghiệm gửi tiết kiệm, cách tính lãi suất và cập nhật thị trường ngân hàng Việt Nam.",
};

export default function Page() {
  const posts = layTatCaBaiViet();

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
      <Breadcrumb items={[{ name: "Blog", href: "/blog" }]} />

      <div className="mb-12 text-center">
        <h1 className="text-4xl font-bold text-foreground mb-4">Blog Tài Chính</h1>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
          Cập nhật kiến thức mới nhất về lãi suất, kinh nghiệm gửi tiết kiệm và quản lý tài chính cá nhân thông minh.
        </p>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
        {posts.map((post) => (
          <article
            key={post.id}
            className="flex flex-col bg-card border border-border rounded-2xl overflow-hidden hover:shadow-lg transition-all group"
          >
            {/* Image Placeholder */}
            <div className="aspect-video bg-muted relative overflow-hidden">
              <div className="absolute inset-0 flex items-center justify-center text-muted-foreground group-hover:scale-110 transition-transform duration-500">
                <BookOpen className="h-12 w-12 opacity-20" />
              </div>
              <div className="absolute top-4 left-4">
                <span className="px-3 py-1 bg-primary text-primary-foreground text-xs font-bold rounded-full">
                  {post.tags[0]}
                </span>
              </div>
            </div>

            <div className="p-6 flex-1 flex flex-col">
              <div className="flex items-center gap-4 text-xs text-muted-foreground mb-3">
                <div className="flex items-center gap-1">
                  <Calendar className="h-3 w-3" />
                  {dinhDangNgay(post.ngayDang)}
                </div>
                <div className="flex items-center gap-1">
                  <Clock className="h-3 w-3" />
                  {dinhDangThoiGianDoc(post.thoiGianDoc)}
                </div>
              </div>

              <h2 className="text-xl font-bold text-foreground mb-3 line-clamp-2 group-hover:text-primary transition-colors">
                <Link href={`/blog/${post.slug}`}>{post.tieuDe}</Link>
              </h2>

              <p className="text-sm text-muted-foreground line-clamp-3 mb-6 flex-1">
                {post.moTa}
              </p>

              <Link
                href={`/blog/${post.slug}`}
                className="inline-flex items-center gap-2 text-sm font-bold text-primary group-hover:gap-3 transition-all"
              >
                Đọc bài viết
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </article>
        ))}
      </div>

      {/* Newsletter Section */}
      <div className="mt-20 bg-primary/5 border border-primary/10 rounded-3xl p-8 md:p-12 text-center">
        <h3 className="text-2xl font-bold mb-4">Đừng bỏ lỡ các tin tức mới nhất</h3>
        <p className="text-muted-foreground mb-8 max-w-md mx-auto">
          Đăng ký nhận bản tin để cập nhật biến động lãi suất hàng tuần trực tiếp qua email của bạn.
        </p>
        <div className="flex flex-col sm:flex-row gap-3 max-w-lg mx-auto">
          <input
            type="email"
            placeholder="Email của bạn..."
            className="flex-1 px-6 py-3 rounded-xl border border-input bg-background focus:ring-2 focus:ring-primary/20 outline-none"
          />
          <button className="px-8 py-3 bg-primary text-primary-foreground font-bold rounded-xl hover:bg-primary/90 transition-colors">
            Đăng ký ngay
          </button>
        </div>
      </div>
    </div>
  );
}
