import { Star } from "lucide-react";
import ServicePageLayout from "@/components/shop/ServicePageLayout";
import { Helmet } from "react-helmet";
import { usePricesContext } from "@/contexts/PricesContext";

const TelegramPremiumPage = () => {
  const { getPrice } = usePricesContext();

  const features = [
    "بدون تبلیغات در کانال‌ها",
    "آپلود فایل تا ۴ گیگابایت",
    "دانلود با سرعت بیشتر",
    "تبدیل صوت به متن (Voice-to-Text)",
    "استیکرهای پرمیوم انحصاری",
    "ایموجی‌های متحرک در متن",
    "پروفایل متحرک (ویدیویی)",
    "نشان پرمیوم ⭐ کنار اسم",
    "ترجمه آنی پیام‌ها",
    "دنبال کردن تا ۱۰۰۰ کانال",
  ];

  const plans = [
    {
      id: "tgpremium_3month",
      name: "پلن ۳ ماهه",
      duration: "۳ ماهه",
      price: getPrice("tgpremium_3month"),
      priceKey: "tgpremium_3month",
      features: [
        "تمام امکانات Premium",
        "فعال‌سازی گیفت (بدون لاگین)",
        "فقط آیدی تلگرام لازم است",
      ],
    },
    {
      id: "tgpremium_6month",
      name: "پلن ۶ ماهه",
      duration: "۶ ماهه",
      price: getPrice("tgpremium_6month"),
      priceKey: "tgpremium_6month",
      popular: true,
      features: [
        "صرفه‌جویی قابل توجه",
        "تمام امکانات Premium",
        "بهترین انتخاب",
      ],
    },
    {
      id: "tgpremium_12month",
      name: "پلن یکساله",
      duration: "۱ ساله - بهترین قیمت",
      price: getPrice("tgpremium_12month"),
      priceKey: "tgpremium_12month",
      features: [
        "اقتصادی‌ترین انتخاب",
        "یک سال بدون دغدغه",
        "بهترین ارزش برای پول",
      ],
    },
  ];

  const comparison = [
    { feature: "تبلیغات در کانال‌ها", free: "دارد", premium: "ندارد" },
    { feature: "حداکثر آپلود", free: "۲ گیگ", premium: "۴ گیگ" },
    { feature: "سرعت دانلود", free: "عادی", premium: "سریع‌تر" },
    { feature: "Voice-to-Text", free: false, premium: true },
    { feature: "استیکر پرمیوم", free: false, premium: true },
    { feature: "نشان پرمیوم", free: false, premium: true },
    { feature: "ترجمه پیام", free: false, premium: true },
    { feature: "پروفایل ویدیویی", free: false, premium: true },
  ];

  const faqs = [
    {
      question: "فعال‌سازی چگونه انجام می‌شود؟",
      answer:
        "فعال‌سازی به صورت گیفت (هدیه) انجام می‌شود. نیازی به لاگین به اکانت شما نیست! فقط آیدی تلگرام خود را بفرستید و در کمتر از ۵ دقیقه فعال می‌شود.",
    },
    {
      question: "آیا اکانت من امن است؟",
      answer:
        "بله، چون به صورت گیفت فعال می‌شود و ما هیچ دسترسی به اکانت شما نداریم.",
    },
    {
      question: "تخفیف برای خرید استارز دارید؟",
      answer:
        "برای خرید استارز تلگرام با پشتیبانی تماس بگیرید تا قیمت و موجودی را اعلام کنیم.",
    },
  ];

  const lowestPrice = Math.min(...plans.map(p => p.price));

  return (
    <>
      <Helmet>
        <title>خرید تلگرام پرمیوم | Nova AI Shop</title>
        <meta
          name="description"
          content="خرید تلگرام پرمیوم با فعال‌سازی گیفت. بدون نیاز به لاگین، بدون تبلیغات، آپلود ۴ گیگ، استیکر پرمیوم."
        />
        
        {/* Product Schema with dynamic price */}
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Product",
            "name": "تلگرام پرمیوم",
            "description": "خرید تلگرام پرمیوم با فعال‌سازی گیفت",
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
        serviceId="telegram_premium"
        icon={Star}
        logoSrc="/logos/telegram.svg"
        title="تلگرام پرمیوم"
        subtitle="ارتقای حساب کاربری"
        description="تلگرام پرمیوم مجموعه‌ای از امکانات ویژه و انحصاری است که تجربه استفاده از تلگرام را برای شما متحول می‌کند!"
        color="#0088CC"
        features={features}
        plans={plans}
        comparison={comparison}
        faqs={faqs}
      />
    </>
  );
};

export default TelegramPremiumPage;
