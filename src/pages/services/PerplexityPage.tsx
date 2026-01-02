import { Search } from "lucide-react";
import ServicePageLayout from "@/components/shop/ServicePageLayout";
import { Helmet } from "react-helmet";
import { usePricesContext } from "@/contexts/PricesContext";

const PerplexityPage = () => {
  const { getPrice } = usePricesContext();

  const features = [
    "پاسخ‌های دقیق با ذکر منبع و لینک",
    "دسترسی به اطلاعات به‌روز از سراسر وب",
    "دسترسی به GPT-4، Claude 3 و Gemini Pro",
    "۳۰۰+ پرسش Pro در روز",
    "آپلود نامحدود فایل",
    "تحلیل تصاویر و PDF",
    "حالت تمرکز (Focus Mode)",
    "API دسترسی",
    "صرفه‌جویی در زمان تحقیق",
  ];

  const plans = [
    {
      name: "پلن یک‌ماهه",
      duration: "۱ ماهه",
      price: getPrice("perplexity_monthly"),
      priceKey: "perplexity_monthly",
      popular: true,
      features: [
        "۳۰۰+ پرسش Pro در روز",
        "دسترسی به مدل‌های پیشرفته",
        "آپلود نامحدود فایل",
      ],
    },
    {
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
    { feature: "پرسش‌های Pro", free: "۵ در روز", premium: "۳۰۰+ در روز" },
    { feature: "ذکر منابع", free: true, premium: true },
    { feature: "مدل‌های پیشرفته", free: false, premium: true },
    { feature: "آپلود فایل", free: "محدود", premium: "نامحدود" },
    { feature: "تحلیل PDF", free: false, premium: true },
    { feature: "حالت تمرکز", free: false, premium: true },
    { feature: "API دسترسی", free: false, premium: true },
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
        "بله، در نسخه Pro می‌توانید بین GPT-4، Claude 3 و Gemini Pro انتخاب کنید.",
    },
  ];

  const lowestPrice = Math.min(...plans.map(p => p.price));

  return (
    <>
      <Helmet>
        <title>خرید اشتراک Perplexity Pro | Nova AI Shop</title>
        <meta
          name="description"
          content="خرید اشتراک Perplexity Pro - موتور جستجوی هوشمند با منابع. پاسخ‌های دقیق با ذکر لینک، دسترسی به GPT-4 و Claude 3."
        />
        
        {/* Product Schema with dynamic price */}
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Product",
            "name": "اشتراک Perplexity Pro",
            "description": "خرید اشتراک Perplexity Pro - موتور جستجوی هوشمند",
            "brand": {
              "@type": "Brand",
              "name": "Nova AI Shop"
            },
            "offers": {
              "@type": "AggregateOffer",
              "priceCurrency": "IRR",
              "lowPrice": lowestPrice,
              "highPrice": Math.max(...plans.map(p => p.price)),
              "offerCount": plans.length,
              "availability": "https://schema.org/InStock"
            }
          })}
        </script>
      </Helmet>
      <ServicePageLayout
        icon={Search}
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
