import { Link } from "react-router-dom";
import { Calendar, Clock } from "lucide-react";
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
        <section className="pt-32 pb-16 px-4">
          <div className="container mx-auto max-w-6xl text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-l from-primary via-purple-400 to-primary bg-clip-text text-transparent">
              بلاگ نوا
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              مقالات آموزشی و کاربردی درباره هوش مصنوعی و ابزارهای AI
            </p>
          </div>
        </section>

        {/* Categories */}
        <section className="px-4 pb-8">
          <div className="container mx-auto max-w-6xl">
            <div className="flex flex-wrap justify-center gap-3">
              {categories.map((category) => (
                <button
                  key={category}
                  onClick={() => setSelectedCategory(category)}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${selectedCategory === category
                      ? "bg-primary text-primary-foreground shadow-lg shadow-primary/25"
                      : "bg-card hover:bg-primary/20 text-muted-foreground hover:text-foreground border border-border/50"
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
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredPosts.map((post) => (
                <Link
                  key={post.id}
                  to={`/blog/${post.id}`}
                  className="group glass rounded-2xl overflow-hidden glass-hover border border-border/50 hover:border-primary/50 transition-all duration-300"
                >
                  {/* Image */}
                  <div className="aspect-video bg-gradient-to-br from-primary/5 to-purple-500/5 flex items-center justify-center p-8 relative overflow-hidden">
                    <div className="absolute inset-0 bg-grid-white/5 [mask-image:linear-gradient(0deg,white,rgba(255,255,255,0.6))] -z-10" />
                    <LazyImage
                      src={post.image}
                      alt={post.title}
                      className="w-24 h-24 object-contain group-hover:scale-110 transition-transform duration-500 drop-shadow-2xl"
                    />
                  </div>

                  {/* Content */}
                  <div className="p-6">
                    {/* Category */}
                    <span className="inline-block px-3 py-1 bg-primary/10 text-primary text-xs font-medium rounded-full mb-3 border border-primary/20">
                      {post.category}
                    </span>

                    {/* Title */}
                    <h2 className="text-lg font-bold mb-3 group-hover:text-primary transition-colors line-clamp-2 leading-tight">
                      {post.title}
                    </h2>

                    {/* Excerpt */}
                    <p className="text-sm text-muted-foreground mb-4 line-clamp-2 leading-relaxed">
                      {post.excerpt}
                    </p>

                    {/* Meta */}
                    <div className="flex items-center justify-between text-xs text-muted-foreground pt-4 border-t border-border/50">
                      <div className="flex items-center gap-2">
                        <Calendar className="w-3.5 h-3.5" />
                        <span>{post.date}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Clock className="w-3.5 h-3.5" />
                        <span>{post.readTime}</span>
                      </div>
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
            <div className="glass rounded-2xl p-8 border border-border/50">
              <h2 className="text-2xl font-bold mb-6 text-center">یادگیری هوش مصنوعی با نوا</h2>
              <div className="prose prose-invert max-w-none text-muted-foreground text-sm leading-relaxed space-y-4">
                <p>
                  در بلاگ نوا، جدیدترین مقالات آموزشی درباره ابزارهای هوش مصنوعی را می‌خوانید. از آموزش
                  <Link to="/services/chatgpt" className="text-primary hover:underline mx-1 font-medium">چت جی پی تی (ChatGPT)</Link>
                  و
                  <Link to="/services/gemini" className="text-primary hover:underline mx-1 font-medium">جمینای (Gemini)</Link>
                  گرفته تا نکات پیشرفته استفاده از
                  <Link to="/services/cursor" className="text-primary hover:underline mx-1 font-medium">کرسور (Cursor)</Link>
                  برای برنامه‌نویسی.
                </p>
                <p>
                  همچنین مقالات مقایسه‌ای بین ابزارهای مختلف مثل
                  <Link to="/services/gemini" className="text-primary hover:underline mx-1 font-medium">جمینای (Gemini)</Link>،
                  <Link to="/services/grok" className="text-primary hover:underline mx-1 font-medium">گراک (Grok)</Link>
                  و
                  <Link to="/services/perplexity" className="text-primary hover:underline mx-1 font-medium">پرپلکسیتی (Perplexity)</Link>
                  را منتشر می‌کنیم تا بتوانید بهترین انتخاب را داشته باشید.
                </p>
                <p>
                  برای دسترسی به این ابزارها، می‌توانید اشتراک‌های
                  <Link to="/services/spotify" className="text-primary hover:underline mx-1 font-medium">Spotify Premium</Link>
                  و
                  <Link to="/services/telegram-premium" className="text-primary hover:underline mx-1 font-medium">Telegram Premium</Link>
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
