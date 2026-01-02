import { useParams, Link } from "react-router-dom";
import { Calendar, Clock, ArrowRight, User, Tag, Share2 } from "lucide-react";
import ShopHeader from "@/components/shop/ShopHeader";
import ShopFooter from "@/components/shop/ShopFooter";
import SEOHead from "@/components/seo/SEOHead";
import { Button } from "@/components/ui/button";

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

const blogPosts: Record<string, BlogPost> = {
  "chatgpt-guide": {
    id: "chatgpt-guide",
    title: "راهنمای کامل استفاده از ChatGPT برای مبتدیان",
    excerpt: "در این مقاله با تمام قابلیت‌های ChatGPT آشنا می‌شوید.",
    content: `
## ChatGPT چیست؟

ChatGPT یک مدل زبانی بزرگ (LLM) است که توسط شرکت OpenAI توسعه داده شده است. این ابزار هوش مصنوعی می‌تواند مکالمات طبیعی داشته باشد، به سوالات پاسخ دهد، متن بنویسد و حتی کد برنامه‌نویسی تولید کند.

## قابلیت‌های اصلی ChatGPT

### ۱. مکالمه طبیعی
ChatGPT می‌تواند مکالمات روان و طبیعی به زبان فارسی و انگلیسی داشته باشد.

### ۲. نوشتن متن
از نوشتن ایمیل گرفته تا مقاله و داستان، ChatGPT می‌تواند انواع متون را تولید کند.

### ۳. کدنویسی
این ابزار می‌تواند کد برنامه‌نویسی به زبان‌های مختلف بنویسد و دیباگ کند.

### ۴. تحلیل و خلاصه‌سازی
ChatGPT می‌تواند متون طولانی را خلاصه کند و تحلیل‌های دقیق ارائه دهد.

## نکات استفاده بهتر از ChatGPT

1. **پرامپت‌های دقیق بنویسید**: هرچه درخواست شما دقیق‌تر باشد، پاسخ بهتری دریافت می‌کنید.
2. **از زمینه استفاده کنید**: ChatGPT می‌تواند زمینه مکالمات قبلی را به خاطر بسپارد.
3. **بازخورد دهید**: اگر پاسخ مناسب نبود، بازخورد دهید تا پاسخ بهتری دریافت کنید.

## اشتراک ChatGPT Plus

برای دسترسی به قابلیت‌های پیشرفته مثل GPT-4o و پردازش تصویر، نیاز به اشتراک Plus دارید که می‌توانید از نوا تهیه کنید.
    `,
    image: "/logos/chatgpt.png",
    category: "آموزش",
    author: "تیم نوا",
    date: "۱۴۰۳/۱۰/۱۵",
    readTime: "۸ دقیقه",
    tags: ["ChatGPT", "هوش مصنوعی", "آموزش"]
  },
  "claude-vs-chatgpt": {
    id: "claude-vs-chatgpt",
    title: "مقایسه Claude و ChatGPT: کدام یک بهتر است؟",
    excerpt: "بررسی جامع تفاوت‌ها، مزایا و معایب دو چت‌بات محبوب هوش مصنوعی.",
    content: `
## مقدمه

Claude و ChatGPT دو مورد از محبوب‌ترین چت‌بات‌های هوش مصنوعی هستند. در این مقاله به مقایسه جامع این دو ابزار می‌پردازیم.

## Claude چیست؟

Claude توسط شرکت Anthropic توسعه داده شده و به خاطر پاسخ‌های دقیق و ایمن‌تر شناخته می‌شود.

## ChatGPT چیست؟

ChatGPT محصول OpenAI است و یکی از اولین و محبوب‌ترین چت‌بات‌های هوش مصنوعی به شمار می‌رود.

## مقایسه ویژگی‌ها

| ویژگی | Claude | ChatGPT |
|-------|--------|---------|
| طول متن | ۱۰۰ هزار توکن | ۱۲۸ هزار توکن |
| پردازش تصویر | بله | بله |
| تولید تصویر | خیر | بله |
| کدنویسی | عالی | عالی |
| دقت | بسیار بالا | بالا |

## نتیجه‌گیری

هر دو ابزار قدرتمند هستند. Claude برای کارهای تحلیلی و متنی بهتر است و ChatGPT برای کارهای خلاقانه و تولید محتوا مناسب‌تر است.
    `,
    image: "/logos/claude.png",
    category: "مقایسه",
    author: "تیم نوا",
    date: "۱۴۰۳/۱۰/۱۲",
    readTime: "۱۰ دقیقه",
    tags: ["Claude", "ChatGPT", "مقایسه"]
  },
  "cursor-coding": {
    id: "cursor-coding",
    title: "برنامه‌نویسی با Cursor: انقلابی در کدنویسی",
    excerpt: "Cursor یک IDE هوشمند است که با استفاده از هوش مصنوعی، سرعت برنامه‌نویسی شما را چند برابر می‌کند.",
    content: `
## Cursor چیست؟

Cursor یک ویرایشگر کد هوشمند است که بر پایه VS Code ساخته شده و با قدرت هوش مصنوعی، تجربه برنامه‌نویسی را متحول می‌کند.

## ویژگی‌های کلیدی Cursor

### ۱. تکمیل هوشمند کد
Cursor می‌تواند چندین خط کد را پیش‌بینی و تکمیل کند.

### ۲. چت با کد
می‌توانید درباره کدتان سوال بپرسید و توضیحات دریافت کنید.

### ۳. ویرایش با دستور
با دادن دستور طبیعی، می‌توانید کد را ویرایش کنید.

### ۴. دیباگ هوشمند
Cursor می‌تواند باگ‌ها را شناسایی و رفع کند.

## چرا Cursor بهتر از Copilot است؟

Cursor علاوه بر تکمیل کد، قابلیت‌های پیشرفته‌تری مثل چت با کد و ویرایش با دستور دارد.

## نحوه شروع با Cursor

1. Cursor را دانلود و نصب کنید
2. اشتراک Pro را فعال کنید
3. تنظیمات را شخصی‌سازی کنید
4. شروع به کدنویسی کنید!
    `,
    image: "/logos/cursor.png",
    category: "برنامه‌نویسی",
    author: "تیم نوا",
    date: "۱۴۰۳/۱۰/۱۰",
    readTime: "۱۲ دقیقه",
    tags: ["Cursor", "برنامه‌نویسی", "IDE"]
  },
  "gemini-features": {
    id: "gemini-features",
    title: "قابلیت‌های جدید Gemini گوگل",
    excerpt: "آشنایی با آخرین ویژگی‌های Gemini گوگل و نحوه استفاده از آن‌ها.",
    content: `
## Gemini چیست؟

Gemini جدیدترین مدل هوش مصنوعی گوگل است که جایگزین Bard شده و قابلیت‌های پیشرفته‌تری دارد.

## ویژگی‌های Gemini

### ۱. چند وجهی (Multimodal)
Gemini می‌تواند متن، تصویر، صوت و ویدیو را پردازش کند.

### ۲. یکپارچگی با گوگل
به طور کامل با سرویس‌های گوگل مثل Gmail، Docs و Drive یکپارچه است.

### ۳. Gemini Advanced
نسخه پیشرفته با قدرت بیشتر و دسترسی به آخرین مدل‌ها.

## مقایسه نسخه‌ها

- **Gemini رایگان**: دسترسی پایه به مدل‌های استاندارد
- **Gemini Advanced**: دسترسی به مدل‌های پیشرفته و 2TB فضای Google One
    `,
    image: "/logos/gemini.png",
    category: "اخبار",
    author: "تیم نوا",
    date: "۱۴۰۳/۱۰/۰۸",
    readTime: "۶ دقیقه",
    tags: ["Gemini", "گوگل", "هوش مصنوعی"]
  },
  "ai-productivity": {
    id: "ai-productivity",
    title: "۱۰ روش افزایش بهره‌وری با هوش مصنوعی",
    excerpt: "با استفاده از این ۱۰ روش ساده، می‌توانید بهره‌وری خود را با کمک ابزارهای هوش مصنوعی به شدت افزایش دهید.",
    content: `
## مقدمه

هوش مصنوعی می‌تواند بهره‌وری شما را به شکل چشمگیری افزایش دهد. در این مقاله ۱۰ روش کاربردی را معرفی می‌کنیم.

## ۱. خلاصه‌سازی جلسات
از ChatGPT برای خلاصه کردن یادداشت‌های جلسات استفاده کنید.

## ۲. نوشتن ایمیل‌های حرفه‌ای
با Claude ایمیل‌های حرفه‌ای و موثر بنویسید.

## ۳. تحقیق سریع
از Perplexity برای تحقیقات سریع و دقیق استفاده کنید.

## ۴. کدنویسی سریع‌تر
با Cursor سرعت کدنویسی را چند برابر کنید.

## ۵. ترجمه حرفه‌ای
از Gemini برای ترجمه‌های دقیق و روان استفاده کنید.

## ۶. تحلیل داده‌ها
ChatGPT می‌تواند داده‌های شما را تحلیل و نمودار بسازد.

## ۷. ایده‌پردازی
از Grok برای ایده‌پردازی و طوفان فکری استفاده کنید.

## ۸. مدیریت وظایف
با هوش مصنوعی لیست کارها را اولویت‌بندی کنید.

## ۹. یادگیری مداوم
از ابزارهای AI برای یادگیری مهارت‌های جدید استفاده کنید.

## ۱۰. اتوماسیون کارها
کارهای تکراری را به هوش مصنوعی بسپارید.
    `,
    image: "/logos/grok.png",
    category: "بهره‌وری",
    author: "تیم نوا",
    date: "۱۴۰۳/۱۰/۰۵",
    readTime: "۷ دقیقه",
    tags: ["بهره‌وری", "هوش مصنوعی", "نکات"]
  },
  "perplexity-research": {
    id: "perplexity-research",
    title: "تحقیق حرفه‌ای با Perplexity AI",
    excerpt: "Perplexity یک موتور جستجوی هوشمند است که می‌تواند تحقیقات شما را سریع‌تر و دقیق‌تر انجام دهد.",
    content: `
## Perplexity چیست؟

Perplexity یک موتور جستجوی مبتنی بر هوش مصنوعی است که پاسخ‌های دقیق با منابع معتبر ارائه می‌دهد.

## تفاوت Perplexity با گوگل

برخلاف گوگل که لیستی از لینک‌ها نشان می‌دهد، Perplexity پاسخ کامل و مستقیم ارائه می‌دهد.

## ویژگی‌های Perplexity Pro

### ۱. جستجوی پیشرفته
استفاده از مدل‌های قوی‌تر برای پاسخ‌های دقیق‌تر.

### ۲. آپلود فایل
می‌توانید فایل‌ها را آپلود کنید و درباره آن‌ها سوال بپرسید.

### ۳. Spaces
فضای کاری شخصی برای پروژه‌های تحقیقاتی.

## نحوه استفاده بهینه

1. سوالات دقیق و مشخص بپرسید
2. از فیلترهای جستجو استفاده کنید
3. منابع را بررسی کنید
4. سوالات پیگیری بپرسید
    `,
    image: "/logos/perplexity.png",
    category: "آموزش",
    author: "تیم نوا",
    date: "۱۴۰۳/۱۰/۰۱",
    readTime: "۹ دقیقه",
    tags: ["Perplexity", "تحقیق", "جستجو"]
  }
};

const BlogPost = () => {
  const { slug } = useParams<{ slug: string }>();
  const post = slug ? blogPosts[slug] : null;

  if (!post) {
    return (
      <div className="min-h-screen bg-background text-foreground flex items-center justify-center" dir="rtl">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">مقاله یافت نشد</h1>
          <Link to="/blog" className="text-primary hover:underline">
            بازگشت به بلاگ
          </Link>
        </div>
      </div>
    );
  }

  return (
    <>
      <SEOHead
        title={`${post.title} | بلاگ نوا`}
        description={post.excerpt}
        keywords={post.tags.join("، ")}
        canonicalUrl={`https://nova-ai.shop/blog/${post.id}`}
        ogImage={post.image}
        jsonLd={{
          "@context": "https://schema.org",
          "@type": "BlogPosting",
          "headline": post.title,
          "description": post.excerpt,
          "image": post.image,
          "author": {
            "@type": "Person",
            "name": post.author
          },
          "publisher": {
            "@type": "Organization",
            "name": "Nova AI Shop"
          },
          "datePublished": post.date
        }}
      />
      
      <div className="min-h-screen bg-background text-foreground" dir="rtl">
        <ShopHeader />
        
        <article className="pt-32 pb-20 px-4">
          <div className="container mx-auto max-w-4xl">
            {/* Back Link */}
            <Link 
              to="/blog" 
              className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground mb-8 transition-colors"
            >
              <ArrowRight className="w-4 h-4" />
              بازگشت به بلاگ
            </Link>
            
            {/* Header */}
            <header className="mb-12">
              {/* Category */}
              <span className="inline-block px-4 py-1.5 bg-primary/20 text-primary text-sm font-medium rounded-full mb-4">
                {post.category}
              </span>
              
              {/* Title */}
              <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-6 leading-tight">
                {post.title}
              </h1>
              
              {/* Meta */}
              <div className="flex flex-wrap items-center gap-6 text-muted-foreground">
                <div className="flex items-center gap-2">
                  <User className="w-4 h-4" />
                  <span>{post.author}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4" />
                  <span>{post.date}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4" />
                  <span>{post.readTime} مطالعه</span>
                </div>
              </div>
            </header>
            
            {/* Featured Image */}
            <div className="aspect-video bg-gradient-to-br from-primary/20 to-purple-500/20 rounded-2xl flex items-center justify-center mb-12">
              <img
                src={post.image}
                alt={post.title}
                className="w-32 h-32 object-contain"
              />
            </div>
            
            {/* Content */}
            <div className="prose prose-invert prose-lg max-w-none mb-12">
              <div 
                className="text-foreground/90 leading-relaxed"
                dangerouslySetInnerHTML={{ 
                  __html: post.content
                    .replace(/## (.*)/g, '<h2 class="text-2xl font-bold mt-8 mb-4 text-foreground">$1</h2>')
                    .replace(/### (.*)/g, '<h3 class="text-xl font-semibold mt-6 mb-3 text-foreground">$1</h3>')
                    .replace(/\*\*(.*?)\*\*/g, '<strong class="font-semibold text-foreground">$1</strong>')
                    .replace(/\n\n/g, '</p><p class="mb-4 text-muted-foreground">')
                    .replace(/^\|.*\|$/gm, (match) => {
                      return `<div class="overflow-x-auto my-4"><table class="w-full border-collapse">${match}</table></div>`;
                    })
                }}
              />
            </div>
            
            {/* Tags */}
            <div className="flex flex-wrap items-center gap-3 mb-12">
              <Tag className="w-4 h-4 text-muted-foreground" />
              {post.tags.map((tag) => (
                <span
                  key={tag}
                  className="px-3 py-1 bg-card rounded-full text-sm text-muted-foreground"
                >
                  {tag}
                </span>
              ))}
            </div>
            
            {/* CTA */}
            <div className="glass rounded-2xl p-8 text-center">
              <h3 className="text-xl font-bold mb-4">
                می‌خواهید از این ابزارها استفاده کنید؟
              </h3>
              <p className="text-muted-foreground mb-6">
                اشتراک‌های اصلی هوش مصنوعی را با قیمت مناسب از نوا تهیه کنید
              </p>
              <Button asChild size="lg" className="rounded-full">
                <Link to="/">
                  مشاهده سرویس‌ها
                </Link>
              </Button>
            </div>
          </div>
        </article>

        <ShopFooter />
      </div>
    </>
  );
};

export default BlogPost;
