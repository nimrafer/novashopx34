import { Link } from "react-router-dom";
import SEOHead from "@/components/seo/SEOHead";
import ShopHeader from "@/components/shop/ShopHeader";
import ShopFooter from "@/components/shop/ShopFooter";
import { createBreadcrumbSchema, createItemListSchema } from "@/components/seo/schemas";

const DevAICategoryPage = () => {
  const itemList = createItemListSchema([
    { name: "کرسور (Cursor) Pro", url: "/services/cursor", position: 1 },
    { name: "چت جی پی تی (ChatGPT)", url: "/services/chatgpt", position: 2 },
    { name: "جمینای (Gemini) + Jules", url: "/services/gemini", position: 3 },
    { name: "کلود (Claude)", url: "/services/claude", position: 4 },
  ]);

  const breadcrumb = createBreadcrumbSchema([
    { name: "خانه", url: "/" },
    { name: "برنامه‌نویسی و API", url: "/categories/dev-ai" },
  ]);

  const services = [
    {
      title: "خرید کرسور پرو (Cursor Pro)",
      desc: "دستیار مستقیم داخل ادیتور برای افزایش سرعت کدنویسی، ریفکتور و دیباگ.",
      href: "/services/cursor",
    },
    {
      title: "خرید چت جی پی تی (ChatGPT)",
      desc: "تولید کد، توضیح مفاهیم، رفع خطا و طراحی معماری نرم‌افزار.",
      href: "/services/chatgpt",
    },
    {
      title: "خرید جمینای (Gemini) + Jules",
      desc: "ترکیب هوش مصنوعی گوگل با ابزار Jules برای سناریوهای توسعه نرم‌افزار.",
      href: "/services/gemini",
    },
    {
      title: "خرید کلود (Claude)",
      desc: "مناسب تحلیل کدها و مستندات طولانی با خروجی دقیق و ساختارمند.",
      href: "/services/claude",
    },
  ];

  return (
    <>
      <SEOHead
        title="برنامه‌نویسی و API | خرید اشتراک Cursor، ChatGPT، Gemini و Claude"
        description="راهنمای ابزارهای هوش مصنوعی مناسب برنامه‌نویسی و توسعه: Cursor Pro، ChatGPT، Gemini (Jules) و Claude."
        canonicalUrl="/categories/dev-ai"
        keywords="خرید Cursor Pro, خرید ChatGPT برای برنامه نویسی, خرید Gemini Jules, خرید Claude Pro"
        jsonLd={[itemList, breadcrumb]}
      />

      <div className="min-h-screen bg-background">
        <ShopHeader />
        <main className="pt-24 pb-16">
          <section className="container mx-auto px-4">
            <h1 className="text-3xl md:text-5xl font-black mb-4">برنامه‌نویسی و API</h1>
            <p className="text-muted-foreground max-w-3xl leading-8 mb-8">
              اگر توسعه‌دهنده هستید، این صفحه مسیر سریع انتخاب سرویس مناسب برای کدنویسی، دیباگ، تحقیق فنی و تحویل سریع‌تر پروژه را نشان می‌دهد.
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

export default DevAICategoryPage;
