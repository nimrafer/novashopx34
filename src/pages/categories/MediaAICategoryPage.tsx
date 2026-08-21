import { Link } from "react-router-dom";
import SEOHead from "@/components/seo/SEOHead";
import ShopHeader from "@/components/shop/ShopHeader";
import ShopFooter from "@/components/shop/ShopFooter";
import { createBreadcrumbSchema, createItemListSchema } from "@/components/seo/schemas";

const MediaAICategoryPage = () => {
  const itemList = createItemListSchema([
    { name: "جمینای (Gemini) برای تصویر و ویدیو", url: "/services/gemini", position: 1 },
    { name: "گراک (Grok)", url: "/services/grok", position: 2 },
    { name: "اسپاتیفای (Spotify)", url: "/services/spotify", position: 3 },
    { name: "تلگرام پریمیوم", url: "/services/telegram-premium", position: 4 },
  ]);

  const breadcrumb = createBreadcrumbSchema([
    { name: "خانه", url: "/" },
    { name: "تولید تصویر، صدا و ویدیو", url: "/categories/media-ai" },
  ]);

  const services = [
    {
      title: "جمینای (Gemini) + Nano Banana Pro + Veo 3.1",
      desc: "تولید تصویر حرفه‌ای، تولید ویدیو با Veo 3.1 و ساخت صحنه سینمایی با Flow.",
      href: "/services/gemini",
    },
    {
      title: "گراک (Grok) روی X",
      desc: "تحلیل ترندهای لحظه‌ای و تولید متن خلاقانه برای شبکه‌های اجتماعی.",
      href: "/services/grok",
    },
    {
      title: "اسپاتیفای (Spotify) پریمیوم",
      desc: "دسترسی بدون تبلیغ برای پخش و مدیریت بهتر محتوای صوتی.",
      href: "/services/spotify",
    },
    {
      title: "تلگرام پریمیوم",
      desc: "ابزارهای پیشرفته پیام‌رسانی برای تولیدکنندگان محتوا و تیم‌ها.",
      href: "/services/telegram-premium",
    },
  ];

  return (
    <>
      <SEOHead
        title="تولید تصویر/صدا/ویدیو | Gemini Veo 3.1 و ابزارهای رسانه‌ای"
        description="راهنمای سرویس‌های مناسب تولید محتوای چندرسانه‌ای: جمینای با Nano Banana Pro و Veo 3.1، گراک، اسپاتیفای و تلگرام پریمیوم."
        canonicalUrl="/categories/media-ai"
        keywords="تولید تصویر با هوش مصنوعی, Veo 3.1, Nano Banana Pro, خرید Gemini, خرید Grok"
        jsonLd={[itemList, breadcrumb]}
      />

      <div className="min-h-screen bg-background">
        <ShopHeader />
        <main className="pt-24 pb-16">
          <section className="container mx-auto px-4">
            <h1 className="text-3xl md:text-5xl font-black mb-4">تولید تصویر، صدا و ویدیو</h1>
            <p className="text-muted-foreground max-w-3xl leading-8 mb-8">
              در این دسته، سرویس‌هایی قرار دارند که برای تولید محتوای بصری و رسانه‌ای طراحی شده‌اند و برای تیم‌های تولید محتوا مناسب هستند.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {services.map((service) => (
                <Link key={service.href} to={service.href} className="glass rounded-2xl p-5 hover:border-primary/40">
                  <h2 className="text-lg font-bold mb-2">{service.title}</h2>
                  <p className="text-sm text-muted-foreground leading-7">{service.desc}</p>
                </Link>
              ))}
            </div>
          </section>
        </main>
        <ShopFooter />
      </div>
    </>
  );
};

export default MediaAICategoryPage;
