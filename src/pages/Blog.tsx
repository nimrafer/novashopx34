import { Link } from "react-router-dom";
import { Calendar, Clock, ArrowLeft } from "lucide-react";
import ShopHeader from "@/components/shop/ShopHeader";
import ShopFooter from "@/components/shop/ShopFooter";
import SEOHead from "@/components/seo/SEOHead";
import { getBlogPostsArray, categories } from "@/data/blogPosts";
import { LazyImage } from "@/components/ui/lazy-image";
import { useState } from "react";

const blogPosts = getBlogPostsArray();

const Blog = () => {
  const [selectedCategory, setSelectedCategory] = useState("همه");

  const filteredPosts = selectedCategory === "همه"
    ? blogPosts
    : blogPosts.filter(post => post.category === selectedCategory);

  return (
    <>
      <SEOHead
        title="بلاگ نوا | مقالات آموزشی هوش مصنوعی"
        description="مقالات آموزشی و مقایسه ای درباره چت جی پی تی (ChatGPT)، جمینای (Gemini)، پرپلکسیتی (Perplexity)، گراک (Grok) و ابزارهای کاربردی هوش مصنوعی."
        keywords="بلاگ هوش مصنوعی، آموزش چت جی پی تی، آموزش Gemini، آموزش Perplexity، مقالات AI فارسی"
        canonicalUrl="https://nova-shop.co/blog"
        jsonLd={{
          "@context": "https://schema.org",
          "@type": "Blog",
          "name": "بلاگ نوا",
          "description": "مقالات آموزشی درباره هوش مصنوعی و ابزارهای AI",
          "url": "https://nova-shop.co/blog",
          "publisher": {
            "@type": "Organization",
            "name": "Nova AI Shop"
          }
        }}
      />

      <div className="min-h-screen bg-background text-foreground" dir="rtl">
        <ShopHeader />

        {/* Hero Section */}
        <section className="pt-32 pb-12 px-4">
          <div className="container mx-auto max-w-6xl text-center">
            <h1 className="text-4xl md:text-5xl font-black mb-5 text-foreground">
              بلاگ نوا
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto leading-8">
              راهنمای خرید، مقایسه ابزارها و آموزش‌های کاربردی دنیای هوش مصنوعی — به زبان ساده و فارسی.
            </p>
          </div>
        </section>

        {/* Categories */}
        <section className="px-4 pb-10">
          <div className="container mx-auto max-w-6xl">
            <div className="flex flex-wrap justify-center gap-3">
              {categories.map((category) => (
                <button
                  key={category}
                  onClick={() => setSelectedCategory(category)}
                  className={`px-4 py-2 rounded-full text-sm font-semibold transition-all ${selectedCategory === category
                      ? "bg-accent text-accent-foreground"
                      : "bg-card hover:border-accent/40 text-muted-foreground hover:text-foreground border border-border/70"
                    }`}
                >
                  {category}
                </button>
              ))}
            </div>
          </div>
        </section>

        {/* Blog Posts Grid */}
        <section className="px-4 pb-20">
          <div className="container mx-auto max-w-6xl">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {filteredPosts.map((post) => (
                <Link
                  key={post.id}
                  to={`/blog/${post.id}`}
                  className="group rounded-2xl bg-card border border-border/70 overflow-hidden transition-all duration-300 hover:border-accent/40 hover:shadow-[0_24px_48px_-32px_hsl(165_52%_33%/0.45)]"
                >
                  {/* Image */}
                  <div className={`aspect-[2/1] bg-muted/40 border-b border-border/60 flex items-center justify-center overflow-hidden${post.image.startsWith("/blog-images/") ? "" : " p-6"}`}>
                    <LazyImage
                      src={post.image}
                      alt={post.heroAlt || post.title}
                      className={`group-hover:scale-105 transition-transform duration-500 ${post.image.startsWith("/blog-images/") ? "w-full h-full" : "w-16 h-16"}`}
                      imgClassName={post.image.startsWith("/blog-images/") ? "!object-cover" : undefined}
                    />
                  </div>

                  {/* Content */}
                  <div className="p-6">
                    <span className="inline-block px-3 py-1 bg-accent/10 text-accent text-xs font-semibold rounded-full mb-3">
                      {post.category}
                    </span>

                    <h2 className="text-base font-bold mb-2.5 group-hover:text-accent transition-colors line-clamp-2 leading-7 text-foreground">
                      {post.title}
                    </h2>

                    <p className="text-sm text-muted-foreground mb-4 line-clamp-2 leading-7">
                      {post.excerpt}
                    </p>

                    <div className="flex items-center justify-between text-xs text-muted-foreground pt-4 border-t border-border/60">
                      <span className="flex items-center gap-1.5">
                        <Calendar className="w-3.5 h-3.5" aria-hidden="true" />
                        {post.date}
                      </span>
                      <span className="flex items-center gap-1.5">
                        <Clock className="w-3.5 h-3.5" aria-hidden="true" />
                        {post.readTime}
                      </span>
                      <span className="inline-flex items-center gap-1 font-semibold text-accent">
                        خواندن
                        <ArrowLeft className="w-3.5 h-3.5 transition-transform duration-300 group-hover:-translate-x-0.5" aria-hidden="true" />
                      </span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>

            {filteredPosts.length === 0 && (
              <div className="text-center py-20 text-muted-foreground">
                <p>هیچ مقاله‌ای در این دسته‌بندی یافت نشد.</p>
              </div>
            )}
          </div>
        </section>

        {/* SEO Text Section */}
        <section className="px-4 pb-20">
          <div className="container mx-auto max-w-4xl">
            <div className="rounded-2xl bg-card border border-border/70 p-8">
              <h2 className="text-2xl font-black mb-6 text-center text-foreground">یادگیری هوش مصنوعی با نوا</h2>
              <div className="max-w-none text-muted-foreground text-sm leading-8 space-y-4">
                <p>
                  در بلاگ نوا، جدیدترین مقالات آموزشی درباره ابزارهای هوش مصنوعی را می‌خوانید. از آموزش
                  <Link to="/services/chatgpt" className="text-accent hover:underline mx-1 font-semibold">چت جی پی تی (ChatGPT)</Link>
                  و
                  <Link to="/services/gemini" className="text-accent hover:underline mx-1 font-semibold">جمینای (Gemini)</Link>
                  گرفته تا نکات پیشرفته استفاده از
                  <Link to="/services/cursor" className="text-accent hover:underline mx-1 font-semibold">کرسور (Cursor)</Link>
                  برای برنامه‌نویسی.
                </p>
                <p>
                  همچنین مقالات مقایسه‌ای بین ابزارهای مختلف مثل
                  <Link to="/services/gemini" className="text-accent hover:underline mx-1 font-semibold">جمینای (Gemini)</Link>،
                  <Link to="/services/grok" className="text-accent hover:underline mx-1 font-semibold">گراک (Grok)</Link>
                  و
                  <Link to="/services/perplexity" className="text-accent hover:underline mx-1 font-semibold">پرپلکسیتی (Perplexity)</Link>
                  را منتشر می‌کنیم تا بتوانید بهترین انتخاب را داشته باشید.
                </p>
                <p>
                  برای دسترسی به این ابزارها، می‌توانید اشتراک‌های
                  <Link to="/services/spotify" className="text-accent hover:underline mx-1 font-semibold">Spotify Premium</Link>
                  و
                  <Link to="/services/telegram-premium" className="text-accent hover:underline mx-1 font-semibold">Telegram Premium</Link>
                  را نیز از نوا تهیه کنید.
                </p>
              </div>
            </div>
          </div>
        </section>

        <ShopFooter />
      </div>
    </>
  );
};

export default Blog;
