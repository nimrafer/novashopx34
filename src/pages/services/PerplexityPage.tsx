import { Search } from "lucide-react";
import ServicePageLayout from "@/components/shop/ServicePageLayout";
import { Helmet } from "react-helmet";
import { usePricesContext } from "@/contexts/PricesContext";
import { createFAQSchema, createBreadcrumbSchema, createProductSchema } from "@/components/seo/schemas";

const PerplexityPage = () => {
  const { getPrice } = usePricesContext();

  const features = [
    "پاسخ‌های دقیق با ذکر منبع و لینک",
    "دسترسی به اطلاعات به‌روز از سراسر وب",
    "دسترسی به مدل‌های پیشرفته OpenAI، Anthropic و Google (بسته به دسترس‌پذیری Perplexity)",
    "Quick Search نامحدود + سهمیه Pro Search روزانه",
    "آپلود فایل و تحلیل اسناد",
    "تحلیل تصاویر و PDF",
    "حالت تمرکز (Focus Mode)",
    "Labs برای ساخت صفحات، گزارش و مینی‌اپ",
    "صرفه‌جویی در زمان تحقیق",
  ];

  const plans = [
    {
      id: "perplexity_monthly",
      name: "پلن یک‌ماهه",
      duration: "۱ ماهه",
      price: getPrice("perplexity_monthly"),
      priceKey: "perplexity_monthly",
      popular: true,
      features: [
        "Quick Search نامحدود",
        "سهمیه روزانه Pro Search",
        "دسترسی به مدل‌های پیشرفته",
        "آپلود و تحلیل فایل",
      ],
    },
    {
      id: "perplexity_yearly",
      name: "پلن یکساله",
      duration: "۱ ساله - صرفه‌جویی ۷۰٪",
      price: getPrice("perplexity_yearly"),
      priceKey: "perplexity_yearly",
      features: [
        "یک سال کامل",
        "صرفه‌جویی قابل توجه",
        "تمام امکانات Pro",
      ],
    },
  ];

  const comparison = [
    { feature: "Quick Search", free: "محدود", premium: "نامحدود" },
    { feature: "Pro Search", free: "خیلی محدود", premium: "روزانه" },
    { feature: "ذکر منابع", free: true, premium: true },
    { feature: "مدل‌های پیشرفته", free: false, premium: true },
    { feature: "آپلود فایل", free: "محدود", premium: "پیشرفته" },
    { feature: "تحلیل PDF", free: false, premium: true },
    { feature: "حالت تمرکز", free: false, premium: true },
    { feature: "Perplexity Labs", free: false, premium: true },
  ];

  const faqs = [
    {
      question: "Perplexity چه تفاوتی با ChatGPT دارد؟",
      answer:
        "Perplexity یک موتور جستجوی هوشمند است که پاسخ‌ها را با ذکر منبع ارائه می‌دهد. ChatGPT بیشتر برای تولید محتوا و مکالمه است. Perplexity برای تحقیقات علمی بهتر است.",
    },
    {
      question: "چرا Perplexity برای تحقیق بهتر است؟",
      answer:
        "چون هر پاسخ با لینک منبع همراه است و می‌توانید صحت اطلاعات را بررسی کنید. نیازی به خواندن ۱۰ سایت مختلف نیست.",
    },
    {
      question: "آیا می‌توانم مدل دلخواه انتخاب کنم؟",
      answer:
        "بله، در نسخه Pro می‌توانید بین مدل‌های پیشرفته موجود در Perplexity جابه‌جا شوید. نام مدل‌ها ممکن است بر اساس به‌روزرسانی رسمی Perplexity تغییر کند.",
    },
  ];

  const lowestPrice = Math.min(...plans.map(p => p.price));

  // Generate SEO schemas
  const faqSchema = createFAQSchema(faqs);
  const breadcrumbSchema = createBreadcrumbSchema([
    { name: "خانه", url: "/" },
    { name: "خرید Perplexity Pro", url: "/services/perplexity" }
  ]);
  const productSchema = createProductSchema({
    name: "اشتراک Perplexity Pro",
    description: "خرید اشتراک Perplexity Pro - موتور جستجوی هوشمند با منابع. دسترسی به مدل‌های پیشرفته برای تحقیق و پاسخ مستند.",
    price: lowestPrice,
    url: "/services/perplexity",
    image: "https://nova-shop.co/logos/perplexity.svg",
    category: "ابزار تحقیقاتی",
    sku: "PERP-PRO",
    ratingValue: 4.7,
    reviewCount: 420
  });

  return (
    <>
      <Helmet>
        <title>خرید اشتراک Perplexity Pro | موتور جستجوی AI - نوا شاپ</title>
        <meta
          name="description"
          content="خرید اشتراک Perplexity Pro - موتور جستجوی هوشمند با منابع معتبر. دسترسی به Pro Search، مدل‌های پیشرفته و قابلیت تحلیل فایل."
        />
        <meta name="keywords" content="خرید Perplexity, Perplexity Pro, موتور جستجوی AI, تحقیق هوشمند, GPT-4, Claude, خرید پرپلکسیتی ایران" />
        <link rel="canonical" href="https://nova-shop.co/services/perplexity" />

        {/* Structured Data */}
        <script type="application/ld+json">
          {JSON.stringify([productSchema, faqSchema, breadcrumbSchema])}
        </script>
      </Helmet>
      <ServicePageLayout
        serviceId="perplexity"
        icon={Search}
        logoSrc="/logos/perplexity.svg"
        title="Perplexity Pro"
        subtitle="موتور جستجوی هوشمند"
        description="پرپلکسیتی یک موتور جستجوی مبتنی بر هوش مصنوعی است که اطلاعات را از سراسر اینترنت جمع‌آوری کرده و پاسخ‌های دقیق و مستند با ذکر منبع ارائه می‌دهد."
        color="#06B6D4"
        features={features}
        plans={plans}
        comparison={comparison}
        faqs={faqs}
      />
    </>
  );
};

export default PerplexityPage;
