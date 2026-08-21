import { Link } from "react-router-dom";
import SEOHead from "@/components/seo/SEOHead";
import ShopHeader from "@/components/shop/ShopHeader";
import ShopFooter from "@/components/shop/ShopFooter";
import { createBreadcrumbSchema, createItemListSchema } from "@/components/seo/schemas";

const TextAICategoryPage = () => {
  const itemList = createItemListSchema([
    { name: "چت جی پی تی (ChatGPT)", url: "/services/chatgpt", position: 1 },
    { name: "جمینای (Gemini)", url: "/services/gemini", position: 2 },
    { name: "پرپلکسیتی (Perplexity)", url: "/services/perplexity", position: 3 },
    { name: "کلود (Claude)", url: "/services/claude", position: 4 },
    { name: "گراک (Grok)", url: "/services/grok", position: 5 },
  ]);

  const breadcrumb = createBreadcrumbSchema([
    { name: "خانه", url: "/" },
    { name: "چت‌بات‌ها و تولید متن", url: "/categories/text-ai" },
  ]);

  const services = [
    {
      title: "خرید اشتراک چت جی پی تی (ChatGPT)",
      desc: "برای تولید محتوا، کدنویسی، ترجمه و ایده‌پردازی حرفه‌ای.",
      href: "/services/chatgpt",
    },
    {
      title: "خرید اشتراک جمینای (Gemini)",
      desc: "متن، تصویر، تحلیل داده و قابلیت‌های چندحالته گوگل.",
      href: "/services/gemini",
    },
    {
      title: "خرید اشتراک پرپلکسیتی (Perplexity)",
      desc: "پاسخ مستند همراه لینک منبع برای تحقیق سریع‌تر.",
      href: "/services/perplexity",
    },
    {
      title: "خرید اشتراک کلود (Claude)",
      desc: "پاسخ دقیق و مناسب برای کار با متن‌های طولانی.",
      href: "/services/claude",
    },
    {
      title: "خرید اشتراک گراک (Grok)",
      desc: "تحلیل جریان‌های شبکه X و تولید محتوای سریع.",
      href: "/services/grok",
    },
  ];

  return (
    <>
      <SEOHead
        title="چت‌بات‌ها و تولید متن | خرید اشتراک ChatGPT، Gemini، Perplexity"
        description="راهنمای انتخاب و خرید اشتراک ابزارهای چت‌بات و تولید متن: چت جی پی تی، جمینای، پرپلکسیتی، کلود و گراک."
        canonicalUrl="/categories/text-ai"
        keywords="خرید اشتراک چت جی پی تی, خرید Gemini, خرید Perplexity Pro, خرید Claude, خرید Grok"
        jsonLd={[itemList, breadcrumb]}
      />

      <div className="min-h-screen bg-background">
        <ShopHeader />
        <main className="pt-24 pb-16">
          <section className="container mx-auto px-4">
            <h1 className="text-3xl md:text-5xl font-black mb-4">چت‌بات‌ها و تولید متن</h1>
            <p className="text-muted-foreground max-w-3xl leading-8 mb-8">
              اگر تمرکز شما روی نوشتن، تحلیل متن، پاسخ‌گویی سریع یا تحقیق مستند است، سرویس‌های این دسته برای شما مناسب‌تر هستند.
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

export default TextAICategoryPage;
