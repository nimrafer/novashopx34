import { useParams, Link } from "react-router-dom";
import { useMemo } from "react";
import {
  Calendar,
  Clock,
  ArrowRight,
  ArrowLeft,
  RefreshCw,
  Tag,
  CheckCircle2,
  ListTree,
} from "lucide-react";
import ShopHeader from "@/components/shop/ShopHeader";
import ShopFooter from "@/components/shop/ShopFooter";
import SEOHead from "@/components/seo/SEOHead";
import { Button } from "@/components/ui/button";
import { blogPosts, getBlogPostsArray } from "@/data/blogPosts";
import { marked } from "marked";

/** Map a post to the most relevant service page for the closing CTA. */
const CTA_SERVICES: Array<[RegExp, string, string]> = [
  [/chatgpt|gpt5|sora|prompt/, "/services/chatgpt", "مشاهده پلن‌های ChatGPT"],
  [/gemini|veo|nano-banana/, "/services/gemini", "مشاهده پلن‌های Gemini"],
  [/claude/, "/services/claude", "مشاهده پلن‌های Claude"],
  [/cursor/, "/services/cursor", "مشاهده پلن‌های Cursor"],
  [/perplexity/, "/services/perplexity", "مشاهده پلن‌های Perplexity"],
  [/grok/, "/services/grok", "مشاهده پلن‌های Grok"],
  [/spotify/, "/services/spotify", "مشاهده پلن‌های Spotify"],
  [/telegram/, "/services/telegram-premium", "مشاهده پلن‌های تلگرام پریمیوم"],
];

const ctaFor = (id: string): [string, string] => {
  for (const [pattern, href, label] of CTA_SERVICES) {
    if (pattern.test(id)) return [href, label];
  }
  return ["/", "مشاهده همه سرویس‌ها"];
};

const BlogPost = () => {
  const { slug } = useParams<{ slug: string }>();
  const post = slug ? blogPosts[slug] : null;

  // Render markdown once, then give every h2 a stable id for the TOC anchors.
  const { renderedContent, toc } = useMemo(() => {
    if (!post) return { renderedContent: "", toc: [] as { id: string; text: string }[] };
    let html = marked.parse(post.content, { gfm: true, breaks: true }) as string;
    // The pack ships a richer alt in front-matter than the inline markdown one;
    // image alt text is worth real SEO, so prefer it on the hero image.
    if (post.heroAlt) {
      html = html.replace(/<img([^>]*?)alt="[^"]*"/, `<img$1alt="${post.heroAlt.replace(/"/g, "&quot;")}"`);
    }
    const headings: { id: string; text: string }[] = [];
    let index = 0;
    html = html.replace(/<h2>([\s\S]*?)<\/h2>/g, (_match, inner: string) => {
      const id = `sec-${index++}`;
      headings.push({ id, text: inner.replace(/<[^>]+>/g, "") });
      return `<h2 id="${id}">${inner}</h2>`;
    });
    return { renderedContent: html, toc: headings };
  }, [post]);

  const related = useMemo(() => {
    if (!post) return [];
    return getBlogPostsArray()
      .filter((p) => p.id !== post.id && p.category === post.category)
      .slice(0, 3);
  }, [post]);

  if (!post) {
    return (
      <div className="min-h-screen bg-background text-foreground flex items-center justify-center" dir="rtl">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">مقاله یافت نشد</h1>
          <Link to="/blog" className="text-accent hover:underline">
            بازگشت به بلاگ
          </Link>
        </div>
      </div>
    );
  }

  const [ctaHref, ctaLabel] = ctaFor(post.id);

  return (
    <>
      <SEOHead
        title={post.metaTitle || `${post.title} | بلاگ نوا`}
        description={post.metaDescription || post.excerpt}
        keywords={post.tags.join("، ")}
        canonicalUrl={`https://nova-shop.co/blog/${post.id}`}
        ogImage={post.image}
        ogType="article"
      />

      <div className="min-h-screen bg-background text-foreground" dir="rtl">
        <ShopHeader />

        <article className="pt-28 pb-20 px-4">
          <div className="container mx-auto max-w-3xl">
            {/* Breadcrumb */}
            <nav aria-label="مسیر صفحه" className="flex items-center flex-wrap gap-1.5 text-sm text-muted-foreground mb-8">
              <Link to="/" className="hover:text-foreground">خانه</Link>
              <span aria-hidden="true">/</span>
              <Link to="/blog" className="hover:text-foreground">بلاگ</Link>
              <span aria-hidden="true">/</span>
              <span className="text-foreground font-medium line-clamp-1">{post.title}</span>
            </nav>

            {/* Header */}
            <header className="mb-8">
              <Link
                to="/blog"
                className="inline-block px-3 py-1 bg-accent/10 text-accent text-sm font-semibold rounded-full mb-4"
              >
                {post.category}
              </Link>
              <h1 className="text-3xl md:text-4xl font-black mb-5 leading-snug text-foreground">
                {post.title}
              </h1>
              <div className="flex flex-wrap items-center gap-x-5 gap-y-2 text-sm text-muted-foreground">
                <span className="font-medium text-foreground">{post.author}</span>
                <span className="flex items-center gap-1.5">
                  <Calendar className="w-4 h-4" aria-hidden="true" />
                  {post.date}
                </span>
                {post.modifiedISO && (
                  <span className="flex items-center gap-1.5">
                    <RefreshCw className="w-4 h-4" aria-hidden="true" />
                    به‌روزرسانی: {new Date(post.modifiedISO).toLocaleDateString("fa-IR")}
                  </span>
                )}
                <span className="flex items-center gap-1.5">
                  <Clock className="w-4 h-4" aria-hidden="true" />
                  {post.readTime} مطالعه
                </span>
              </div>
            </header>

            {/* Key takeaways — the extractable answer box */}
            {post.takeaways && post.takeaways.length > 0 && (
              <section aria-label="خلاصه کلیدی" className="rounded-2xl bg-accent/[0.06] border border-accent/20 p-6 mb-8">
                <h2 className="text-base font-black text-foreground mb-4">خلاصه کلیدی</h2>
                <ul className="space-y-3">
                  {post.takeaways.map((item) => (
                    <li key={item} className="flex items-start gap-3 text-sm leading-7 text-foreground/90">
                      <CheckCircle2 className="w-4 h-4 text-accent shrink-0 mt-1.5" aria-hidden="true" />
                      {item}
                    </li>
                  ))}
                </ul>
              </section>
            )}

            {/* Table of contents */}
            {toc.length > 2 && (
              <nav aria-label="فهرست مطالب" className="rounded-2xl bg-card border border-border/70 p-6 mb-10">
                <p className="flex items-center gap-2 text-base font-black text-foreground mb-3">
                  <ListTree className="w-4 h-4 text-accent" aria-hidden="true" />
                  در این مقاله می‌خوانید
                </p>
                <ol className="space-y-2 text-sm">
                  {toc.map((item) => (
                    <li key={item.id}>
                      <a href={`#${item.id}`} className="text-muted-foreground hover:text-accent transition-colors">
                        {item.text}
                      </a>
                    </li>
                  ))}
                </ol>
              </nav>
            )}

            {/* Content */}
            <div
              className="mb-12 [&_img]:w-full [&_img]:rounded-2xl [&_img]:border [&_img]:border-border/60 [&_img]:my-6 [&_h2]:text-2xl [&_h2]:font-black [&_h2]:text-foreground [&_h2]:mt-10 [&_h2]:mb-4 [&_h2]:scroll-mt-24 [&_h3]:text-lg [&_h3]:font-bold [&_h3]:text-foreground [&_h3]:mt-7 [&_h3]:mb-3 [&_p]:text-muted-foreground [&_p]:leading-8 [&_p]:mb-4 [&_li]:text-muted-foreground [&_li]:leading-8 [&_ul]:list-disc [&_ul]:pr-5 [&_ul]:space-y-1.5 [&_ul]:mb-4 [&_ol]:list-decimal [&_ol]:pr-5 [&_ol]:space-y-1.5 [&_ol]:mb-4 [&_strong]:text-foreground [&_a]:text-accent [&_a]:font-semibold [&_a]:underline [&_a]:underline-offset-4 [&_table]:w-full [&_table]:border-collapse [&_table]:my-6 [&_table]:text-sm [&_th]:border [&_th]:border-border [&_th]:bg-muted/60 [&_th]:p-3 [&_th]:font-bold [&_td]:border [&_td]:border-border [&_td]:p-3 [&_blockquote]:border-r-4 [&_blockquote]:border-accent/40 [&_blockquote]:pr-4 [&_blockquote]:text-muted-foreground"
              dangerouslySetInnerHTML={{ __html: renderedContent }}
            />

            {/* FAQ */}
            {post.faqs && post.faqs.length > 0 && (
              <section aria-label="سؤالات متداول" className="mb-12">
                <h2 className="text-2xl font-black text-foreground mb-5">سؤالات متداول</h2>
                <div className="space-y-3">
                  {post.faqs.map((faq) => (
                    <details key={faq.question} className="group rounded-2xl bg-card border border-border/70 open:border-accent/40">
                      <summary className="flex items-center justify-between gap-3 cursor-pointer list-none p-5 font-bold text-foreground">
                        {faq.question}
                        <ArrowLeft className="w-4 h-4 text-muted-foreground transition-transform duration-200 group-open:-rotate-90 shrink-0" aria-hidden="true" />
                      </summary>
                      <p className="px-5 pb-5 text-sm leading-8 text-muted-foreground">{faq.answer}</p>
                    </details>
                  ))}
                </div>
              </section>
            )}

            {/* Tags */}
            <div className="flex flex-wrap items-center gap-2 mb-12">
              <Tag className="w-4 h-4 text-muted-foreground" aria-hidden="true" />
              {post.tags.map((tag) => (
                <span key={tag} className="px-3 py-1 bg-muted rounded-full text-xs font-medium text-muted-foreground">
                  {tag}
                </span>
              ))}
            </div>

            {/* CTA */}
            <div className="rounded-2xl bg-accent text-accent-foreground p-8 text-center mb-14">
              <h2 className="text-xl font-black mb-3">آماده استفاده از این ابزارها هستید؟</h2>
              <p className="text-accent-foreground/80 mb-6 leading-7">
                اشتراک اصلی با پرداخت ریالی، تحویل سریع و گارانتی تعویض — بدون دردسر پرداخت ارزی.
              </p>
              <Button asChild size="lg" className="bg-primary text-primary-foreground hover:bg-primary/90 font-bold">
                <Link to={ctaHref}>{ctaLabel}</Link>
              </Button>
            </div>

            {/* Related posts */}
            {related.length > 0 && (
              <section aria-label="مطالب مرتبط">
                <h2 className="text-xl font-black text-foreground mb-5">مطالب مرتبط</h2>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  {related.map((p) => (
                    <Link
                      key={p.id}
                      to={`/blog/${p.id}`}
                      className="group rounded-2xl bg-card border border-border/70 p-5 transition-all duration-300 hover:border-accent/40"
                    >
                      <h3 className="font-bold text-sm leading-6 text-foreground mb-3 line-clamp-2 group-hover:text-accent transition-colors">
                        {p.title}
                      </h3>
                      <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-accent">
                        خواندن مقاله
                        <ArrowLeft className="w-3.5 h-3.5" aria-hidden="true" />
                      </span>
                    </Link>
                  ))}
                </div>
              </section>
            )}

            {/* Back link */}
            <div className="mt-12">
              <Link to="/blog" className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors">
                <ArrowRight className="w-4 h-4" aria-hidden="true" />
                بازگشت به همه مقالات
              </Link>
            </div>
          </div>
        </article>

        <ShopFooter />
      </div>
    </>
  );
};

export default BlogPost;
