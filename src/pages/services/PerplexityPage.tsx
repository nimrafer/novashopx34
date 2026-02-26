import { Search, Headphones, RefreshCw, Zap } from "lucide-react";
import { Link } from "react-router-dom";
import ServicePageLayout from "@/components/shop/ServicePageLayout";
import { Helmet } from "react-helmet";
import { usePricesContext } from "@/contexts/PricesContext";
import { createFAQSchema, createBreadcrumbSchema, createProductSchema } from "@/components/seo/schemas";

const PerplexityPage = () => {
  const { getPrice } = usePricesContext();

  const features = [
    "جست وجوی زنده وب و پاسخ همراه با لینک به منابع اصلی",
    "امکان Deep Research برای سوال های پیچیده و بررسی چند دیدگاه",
    "پشتیبانی از آپلود فایل و تحلیل اسناد بر اساس پلن انتخابی",
    "ساخت سریع خلاصه، ایده محتوا و ساختار مقاله یا ویدئو",
    "رابط ساده و سریع برای استفاده در دسکتاپ و موبایل",
    "تحویل سریع و فعال سازی در کمترین زمان",
    "پشتیبانی فارسی برای راه اندازی و استفاده بهتر",
    "ارسال راهنمای شروع استفاده پس از خرید",
  ];

  const plans = [
    {
      id: "perplexity_monthly",
      name: "پلن یک ماهه",
      duration: "یک ماهه",
      price: getPrice("perplexity_monthly"),
      priceKey: "perplexity_monthly",
      popular: true,
      features: [
        "جست وجوی زنده وب با ذکر منبع",
        "Deep Research برای تحقیق سریع",
        "مناسب تولید محتوا و سئو",
      ],
    },
    {
      id: "perplexity_yearly",
      name: "پلن یکساله",
      duration: "یکساله",
      price: getPrice("perplexity_yearly"),
      priceKey: "perplexity_yearly",
      features: [
        "پوشش طولانی مدت برای پروژه های تحقیقی",
        "مناسب تیم های محتوا و تحلیل",
        "دسترسی پایدارتر برای استفاده مداوم",
      ],
    },
  ];

  const comparison = [
    { feature: "جست وجوی زنده وب", free: "محدود", premium: "کامل تر" },
    { feature: "پاسخ همراه با منبع", free: true, premium: true },
    { feature: "Deep Research", free: "محدود", premium: "پیشرفته" },
    { feature: "تحلیل فایل و سند", free: "محدود", premium: "گسترده تر" },
    { feature: "سقف جست وجوی حرفه ای", free: "پایه", premium: "بر اساس پلن" },
  ];

  const faqs = [
    {
      question: "Perplexity چه تفاوتی با چت بات های معمولی دارد؟",
      answer:
        "پرپلکسیتی علاوه بر پاسخ هوشمند، وب را جست وجو می کند و نتیجه را با لینک منبع می دهد. همین ویژگی برای تحقیق و سئو بسیار ارزشمند است.",
    },
    {
      question: "این سرویس برای چه کارهایی مناسب است؟",
      answer:
        "برای تحقیق، تولید محتوا، سئو، بررسی منابع و جمع بندی سریع موضوعات تخصصی گزینه بسیار خوبی است.",
    },
    {
      question: "آیا محدودیت جست وجو دارد؟",
      answer:
        "سقف جست وجو و قابلیت ها بر اساس پلن انتخابی شما تعیین می شود.",
    },
    {
      question: "بعد از خرید راهنمای استفاده دارید؟",
      answer:
        "بله، بعد از خرید راهنمای شروع سریع برای استفاده بهتر از ابزار در اختیار شما قرار می گیرد.",
    },
  ];

  const extraContent = (
    <>
      <section className="py-12">
        <div className="container mx-auto px-4">
          <h2 className="text-2xl font-bold mb-6">این سرویس برای چه کسانی مناسب است؟</h2>
          <div className="glass rounded-3xl p-8 max-w-4xl">
            <ul className="space-y-3 text-muted-foreground leading-8">
              <li>• تولیدکنندگان محتوا، سئوکارها و کپی رایترها</li>
              <li>• دانشجوها و پژوهشگرها برای تحقیق سریع همراه با منبع</li>
              <li>• مدیران و تصمیم گیران برای جمع بندی سریع موضوعات پیچیده</li>
              <li>• تیم هایی که دقت، سرعت و استناد در تحقیق برایشان مهم است</li>
            </ul>
          </div>
        </div>
      </section>

      <section className="py-12">
        <div className="container mx-auto px-4">
          <h2 className="text-2xl font-bold mb-8">مزیت خرید از نوا شاپ</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="glass rounded-2xl p-6 text-center">
              <div className="w-16 h-16 rounded-full bg-cyan-500/20 flex items-center justify-center mx-auto mb-4">
                <Zap className="w-8 h-8 text-cyan-500" />
              </div>
              <h3 className="font-bold text-lg mb-2">تحویل سریع</h3>
              <p className="text-muted-foreground text-sm">فعال سازی با سرعت بالا انجام می شود تا بدون معطلی شروع کنید.</p>
            </div>
            <div className="glass rounded-2xl p-6 text-center">
              <div className="w-16 h-16 rounded-full bg-cyan-500/20 flex items-center justify-center mx-auto mb-4">
                <Headphones className="w-8 h-8 text-cyan-500" />
              </div>
              <h3 className="font-bold text-lg mb-2">پشتیبانی فارسی</h3>
              <p className="text-muted-foreground text-sm">برای ثبت سفارش، پیگیری و استفاده بهتر در کنار شما هستیم.</p>
            </div>
            <div className="glass rounded-2xl p-6 text-center">
              <div className="w-16 h-16 rounded-full bg-cyan-500/20 flex items-center justify-center mx-auto mb-4">
                <RefreshCw className="w-8 h-8 text-cyan-500" />
              </div>
              <h3 className="font-bold text-lg mb-2">راهنمای شروع</h3>
              <p className="text-muted-foreground text-sm">
                بعد از خرید راهنمای سریع دریافت می کنید. <Link to="/support" className="text-primary hover:underline">مشاهده راهنما</Link>
              </p>
            </div>
          </div>
        </div>
      </section>
    </>
  );

  const lowestPrice = Math.min(...plans.map((p) => p.price));

  const faqSchema = createFAQSchema(faqs);
  const breadcrumbSchema = createBreadcrumbSchema([
    { name: "خانه", url: "/" },
    { name: "خرید اشتراک پرپلکسیتی پرو (Perplexity Pro)", url: "/services/perplexity" },
  ]);
  const productSchema = createProductSchema({
    name: "خرید اشتراک پرپلکسیتی پرو (Perplexity Pro)",
    description:
      "خرید اشتراک Perplexity Pro برای تحقیق و جست وجوی زنده وب همراه با منبع. تحویل سریع، پشتیبانی فارسی و راهنمای شروع.",
    price: lowestPrice,
    url: "/services/perplexity",
    image: "https://nova-shop.co/logos/perplexity.png",
    category: "ابزار تحقیقاتی",
    sku: "PERP-PRO",
    ratingValue: 4.7,
    reviewCount: 420,
  });

  return (
    <>
      <Helmet>
        <title>خرید اشتراک پرپلکسیتی پرو (Perplexity Pro) | موتور جست وجوی هوش مصنوعی با ذکر منبع</title>
        <meta
          name="description"
          content="خرید اشتراک پرپلکسیتی پرو (Perplexity Pro) برای جست وجوی زنده وب و دریافت پاسخ های مستند با لینک منبع. مناسب تحقیق، سئو و تولید محتوا."
        />
        <meta
          name="keywords"
          content="خرید اشتراک پرپلکسیتی پرو, خرید Perplexity Pro, موتور جست وجوی هوش مصنوعی, تحقیق با منبع"
        />
        <link rel="canonical" href="https://nova-shop.co/services/perplexity" />

        <script type="application/ld+json">{JSON.stringify([productSchema, faqSchema, breadcrumbSchema])}</script>
      </Helmet>

      <ServicePageLayout
        serviceId="perplexity"
        icon={Search}
        logoSrc="/logos/perplexity.png"
        title="خرید اشتراک پرپلکسیتی پرو (Perplexity Pro) | موتور جست وجوی هوش مصنوعی با ذکر منبع"
        subtitle="Perplexity Pro"
        description="Perplexity ترکیبی از موتور جست وجوی وب و هوش مصنوعی است. با خرید اشتراک Pro می توانید سوال های پیچیده بپرسید و پاسخ هایی دقیق، خلاصه شده و همراه با لینک منبع بگیرید. این سرویس برای تحقیق، تولید محتوا و بررسی سریع چندین منبع بسیار کاربردی است."
        color="#06B6D4"
        features={features}
        plans={plans}
        comparison={comparison}
        faqs={faqs}
        extraContent={extraContent}
      />
    </>
  );
};

export default PerplexityPage;
