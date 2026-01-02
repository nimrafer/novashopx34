import { Link } from "react-router-dom";
import { Calendar, Clock, ArrowLeft, User, Tag } from "lucide-react";
import ShopHeader from "@/components/shop/ShopHeader";
import ShopFooter from "@/components/shop/ShopFooter";
import SEOHead from "@/components/seo/SEOHead";

interface BlogPost {
  id: string;
  title: string;
  excerpt: string;
  content: string;
  image: string;
  category: string;
  author: string;
  date: string;
  readTime: string;
  tags: string[];
}

const blogPosts: BlogPost[] = [
  {
    id: "chatgpt-guide",
    title: "راهنمای کامل استفاده از ChatGPT برای مبتدیان",
    excerpt: "در این مقاله با تمام قابلیت‌های ChatGPT آشنا می‌شوید و یاد می‌گیرید چگونه از این ابزار هوش مصنوعی به بهترین شکل استفاده کنید.",
    content: "",
    image: "/logos/chatgpt.png",
    category: "آموزش",
    author: "تیم نوا",
    date: "۱۴۰۳/۱۰/۱۵",
    readTime: "۸ دقیقه",
    tags: ["ChatGPT", "هوش مصنوعی", "آموزش"]
  },
  {
    id: "claude-vs-chatgpt",
    title: "مقایسه Claude و ChatGPT: کدام یک بهتر است؟",
    excerpt: "بررسی جامع تفاوت‌ها، مزایا و معایب دو چت‌بات محبوب هوش مصنوعی Claude و ChatGPT.",
    content: "",
    image: "/logos/claude.png",
    category: "مقایسه",
    author: "تیم نوا",
    date: "۱۴۰۳/۱۰/۱۲",
    readTime: "۱۰ دقیقه",
    tags: ["Claude", "ChatGPT", "مقایسه"]
  },
  {
    id: "cursor-coding",
    title: "برنامه‌نویسی با Cursor: انقلابی در کدنویسی",
    excerpt: "Cursor یک IDE هوشمند است که با استفاده از هوش مصنوعی، سرعت برنامه‌نویسی شما را چند برابر می‌کند.",
    content: "",
    image: "/logos/cursor.png",
    category: "برنامه‌نویسی",
    author: "تیم نوا",
    date: "۱۴۰۳/۱۰/۱۰",
    readTime: "۱۲ دقیقه",
    tags: ["Cursor", "برنامه‌نویسی", "IDE"]
  },
  {
    id: "gemini-features",
    title: "قابلیت‌های جدید Gemini گوگل",
    excerpt: "آشنایی با آخرین ویژگی‌های Gemini گوگل و نحوه استفاده از آن‌ها برای افزایش بهره‌وری.",
    content: "",
    image: "/logos/gemini.png",
    category: "اخبار",
    author: "تیم نوا",
    date: "۱۴۰۳/۱۰/۰۸",
    readTime: "۶ دقیقه",
    tags: ["Gemini", "گوگل", "هوش مصنوعی"]
  },
  {
    id: "ai-productivity",
    title: "۱۰ روش افزایش بهره‌وری با هوش مصنوعی",
    excerpt: "با استفاده از این ۱۰ روش ساده، می‌توانید بهره‌وری خود را با کمک ابزارهای هوش مصنوعی به شدت افزایش دهید.",
    content: "",
    image: "/logos/grok.png",
    category: "بهره‌وری",
    author: "تیم نوا",
    date: "۱۴۰۳/۱۰/۰۵",
    readTime: "۷ دقیقه",
    tags: ["بهره‌وری", "هوش مصنوعی", "نکات"]
  },
  {
    id: "perplexity-research",
    title: "تحقیق حرفه‌ای با Perplexity AI",
    excerpt: "Perplexity یک موتور جستجوی هوشمند است که می‌تواند تحقیقات شما را سریع‌تر و دقیق‌تر انجام دهد.",
    content: "",
    image: "/logos/perplexity.png",
    category: "آموزش",
    author: "تیم نوا",
    date: "۱۴۰۳/۱۰/۰۱",
    readTime: "۹ دقیقه",
    tags: ["Perplexity", "تحقیق", "جستجو"]
  }
];

const categories = ["همه", "آموزش", "مقایسه", "برنامه‌نویسی", "اخبار", "بهره‌وری"];

const Blog = () => {
  return (
    <>
      <SEOHead
        title="بلاگ نوا | مقالات آموزشی هوش مصنوعی"
        description="مقالات آموزشی درباره هوش مصنوعی، ChatGPT، Claude، Cursor و سایر ابزارهای AI. راهنمای استفاده و نکات کاربردی."
        keywords="بلاگ هوش مصنوعی، آموزش ChatGPT، آموزش Claude، مقالات AI، هوش مصنوعی فارسی"
        canonicalUrl="https://nova-ai.shop/blog"
        jsonLd={{
          "@context": "https://schema.org",
          "@type": "Blog",
          "name": "بلاگ نوا",
          "description": "مقالات آموزشی درباره هوش مصنوعی و ابزارهای AI",
          "url": "https://nova-ai.shop/blog",
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
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                    category === "همه"
                      ? "bg-primary text-primary-foreground"
                      : "bg-card hover:bg-primary/20 text-muted-foreground hover:text-foreground"
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
              {blogPosts.map((post) => (
                <Link
                  key={post.id}
                  to={`/blog/${post.id}`}
                  className="group glass rounded-2xl overflow-hidden glass-hover"
                >
                  {/* Image */}
                  <div className="aspect-video bg-gradient-to-br from-primary/20 to-purple-500/20 flex items-center justify-center p-8">
                    <img
                      src={post.image}
                      alt={post.title}
                      className="w-20 h-20 object-contain group-hover:scale-110 transition-transform duration-300"
                    />
                  </div>
                  
                  {/* Content */}
                  <div className="p-6">
                    {/* Category */}
                    <span className="inline-block px-3 py-1 bg-primary/20 text-primary text-xs font-medium rounded-full mb-3">
                      {post.category}
                    </span>
                    
                    {/* Title */}
                    <h2 className="text-lg font-bold mb-3 group-hover:text-primary transition-colors line-clamp-2">
                      {post.title}
                    </h2>
                    
                    {/* Excerpt */}
                    <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
                      {post.excerpt}
                    </p>
                    
                    {/* Meta */}
                    <div className="flex items-center justify-between text-xs text-muted-foreground">
                      <div className="flex items-center gap-2">
                        <Calendar className="w-4 h-4" />
                        <span>{post.date}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Clock className="w-4 h-4" />
                        <span>{post.readTime}</span>
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* SEO Text Section */}
        <section className="px-4 pb-20">
          <div className="container mx-auto max-w-4xl">
            <div className="glass rounded-2xl p-8">
              <h2 className="text-2xl font-bold mb-6 text-center">یادگیری هوش مصنوعی با نوا</h2>
              <div className="prose prose-invert max-w-none text-muted-foreground text-sm leading-relaxed space-y-4">
                <p>
                  در بلاگ نوا، جدیدترین مقالات آموزشی درباره ابزارهای هوش مصنوعی را می‌خوانید. از آموزش 
                  <Link to="/services/chatgpt" className="text-primary hover:underline mx-1">ChatGPT</Link>
                  و 
                  <Link to="/services/claude" className="text-primary hover:underline mx-1">Claude</Link>
                  گرفته تا نکات پیشرفته استفاده از 
                  <Link to="/services/cursor" className="text-primary hover:underline mx-1">Cursor</Link>
                  برای برنامه‌نویسی.
                </p>
                <p>
                  همچنین مقالات مقایسه‌ای بین ابزارهای مختلف مثل 
                  <Link to="/services/gemini" className="text-primary hover:underline mx-1">Gemini</Link>،
                  <Link to="/services/grok" className="text-primary hover:underline mx-1">Grok</Link>
                  و 
                  <Link to="/services/perplexity" className="text-primary hover:underline mx-1">Perplexity</Link>
                  را منتشر می‌کنیم تا بتوانید بهترین انتخاب را داشته باشید.
                </p>
                <p>
                  برای دسترسی به این ابزارها، می‌توانید اشتراک‌های 
                  <Link to="/services/spotify" className="text-primary hover:underline mx-1">Spotify Premium</Link>
                  و 
                  <Link to="/services/telegram-premium" className="text-primary hover:underline mx-1">Telegram Premium</Link>
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
