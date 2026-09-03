import { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { Breadcrumb } from "@/components/chung/Breadcrumb";
import { layBaiVietTheoSlug, layTatCaBaiViet, layBaiVietLienQuan } from "@/lib/lay-du-lieu";
import { dinhDangNgay, dinhDangThoiGianDoc } from "@/lib/dinh-dang";
import { Calendar, Clock, User, Tag, ChevronRight, Share2 } from "lucide-react";

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  const posts = layTatCaBaiViet();
  return posts.map((post) => ({
    slug: post.slug,
  }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const post = layBaiVietTheoSlug(slug);
  if (!post) return {};

  return {
    title: post.tieuDe,
    description: post.moTa,
  };
}

export default async function Page({ params }: Props) {
  const { slug } = await params;
  const post = layBaiVietTheoSlug(slug);
  if (!post) notFound();

  const relatedPosts = layBaiVietLienQuan(post, 3);

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
      <Breadcrumb
        items={[
          { name: "Blog", href: "/blog" },
          { name: post.tieuDe, href: `/blog/${post.slug}` },
        ]}
      />

      <div className="grid lg:grid-cols-12 gap-12 mt-8">
        {/* Main Content */}
        <main className="lg:col-span-8">
          <header className="mb-8">
            <div className="flex flex-wrap gap-2 mb-4">
              {post.tags.map((tag) => (
                <span
                  key={tag}
                  className="px-3 py-1 bg-primary/10 text-primary text-xs font-bold rounded-full uppercase"
                >
                  {tag}
                </span>
              ))}
            </div>
            <h1 className="text-3xl md:text-5xl font-bold text-foreground leading-tight mb-6">
              {post.tieuDe}
            </h1>
            <div className="flex flex-wrap items-center gap-6 text-sm text-muted-foreground border-b border-border pb-8">
              <div className="flex items-center gap-2">
                <div className="h-8 w-8 rounded-full bg-muted flex items-center justify-center">
                  <User className="h-4 w-4" />
                </div>
                <span className="font-medium text-foreground">{post.tacGia}</span>
              </div>
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4" />
                {dinhDangNgay(post.ngayDang)}
              </div>
              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4" />
                {dinhDangThoiGianDoc(post.thoiGianDoc)}
              </div>
            </div>
          </header>

          <div
            className="prose prose-lg prose-blue max-w-none mb-12
            prose-headings:font-bold prose-headings:text-foreground
            prose-p:text-muted-foreground prose-p:leading-relaxed
            prose-strong:text-foreground prose-strong:font-bold
            prose-img:rounded-2xl prose-img:shadow-md"
            dangerouslySetInnerHTML={{ __html: post.noiDung }}
          />

          {/* FAQ Section if available */}
          {post.faq && post.faq.length > 0 && (
            <section className="bg-muted/30 border border-border rounded-2xl p-8 mb-12">
              <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
                <Tag className="h-6 w-6 text-primary" />
                Câu hỏi thường gặp
              </h2>
              <div className="space-y-6">
                {post.faq.map((item, index) => (
                  <div key={index} className="space-y-2">
                    <h3 className="font-bold text-foreground">{item.cauHoi}</h3>
                    <p className="text-muted-foreground text-sm leading-relaxed">
                      {item.traLoi}
                    </p>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Social Share */}
          <div className="flex items-center gap-4 border-t border-b border-border py-6 mb-12">
            <span className="text-sm font-bold text-foreground flex items-center gap-2">
              <Share2 className="h-4 w-4" />
              Chia sẻ bài viết:
            </span>
            <div className="flex gap-2">
              <button className="h-10 w-10 rounded-full bg-primary/10 text-primary flex items-center justify-center hover:bg-primary hover:text-white transition-all">
                <Share2 className="h-5 w-5" />
              </button>
            </div>
          </div>
        </main>

        {/* Sidebar */}
        <aside className="lg:col-span-4 space-y-8">
          {/* Related Posts */}
          <div className="bg-card border border-border rounded-2xl p-6 shadow-sm">
            <h3 className="text-lg font-bold mb-6">Bài viết liên quan</h3>
            <div className="space-y-6">
              {relatedPosts.map((rp) => (
                <Link key={rp.id} href={`/blog/${rp.slug}`} className="group block">
                  <div className="text-xs text-primary font-bold mb-1 uppercase">
                    {rp.tags[0]}
                  </div>
                  <h4 className="font-bold text-foreground group-hover:text-primary transition-colors line-clamp-2 leading-snug">
                    {rp.tieuDe}
                  </h4>
                  <div className="text-[10px] text-muted-foreground mt-2">
                    {dinhDangNgay(rp.ngayDang)}
                  </div>
                </Link>
              ))}
            </div>
          </div>

          {/* Sticky CTA */}
          <div className="sticky top-24 bg-primary rounded-2xl p-8 text-primary-foreground shadow-lg overflow-hidden relative">
            <div className="relative z-10">
              <h3 className="text-xl font-bold mb-4 leading-tight">
                Bạn đang tìm kiếm lãi suất tốt nhất?
              </h3>
              <p className="text-primary-foreground/80 text-sm mb-6 leading-relaxed">
                So sánh ngay hơn 30 ngân hàng để tìm ra mức lãi suất cao nhất cho khoản tiền gửi của bạn.
              </p>
              <Link
                href="/lai-suat"
                className="inline-flex items-center justify-center gap-2 w-full py-3 bg-white text-primary font-bold rounded-xl hover:bg-white/90 transition-colors shadow-sm"
              >
                Bắt đầu so sánh
                <ChevronRight className="h-4 w-4" />
              </Link>
            </div>
            {/* Background decoration */}
            <div className="absolute top-0 right-0 -mr-8 -mt-8 h-32 w-32 bg-white/10 rounded-full blur-2xl" />
            <div className="absolute bottom-0 left-0 -ml-8 -mb-8 h-32 w-32 bg-black/10 rounded-full blur-2xl" />
          </div>
        </aside>
      </div>
    </div>
  );
}
