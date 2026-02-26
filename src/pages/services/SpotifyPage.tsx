import { Music } from "lucide-react";
import ServicePageLayout from "@/components/shop/ServicePageLayout";
import { Helmet } from "react-helmet";
import { usePricesContext } from "@/contexts/PricesContext";

const SpotifyPage = () => {
  const { getPrice } = usePricesContext();

  const features = [
    "بدون تبلیغات آزاردهنده",
    "دانلود آهنگ و پلی‌لیست برای حالت آفلاین",
    "کیفیت صدای عالی (تا ۳۲۰ kbps)",
    "پخش نامحدود هر آهنگی",
    "قابلیت Skip نامحدود",
    "پخش در پس‌زمینه",
    "Spotify Connect برای دستگاه‌های مختلف",
    "Spotify Wrapped سالانه",
    "فعال‌سازی روی اکانت شخصی",
  ];

  const plans = [
    {
      id: "spotify_monthly",
      name: "پلن یک‌ماهه",
      duration: "۱ ماهه",
      price: getPrice("spotify_monthly"),
      priceKey: "spotify_monthly",
      popular: true,
      features: [
        "تمام امکانات Premium",
        "فعال‌سازی روی اکانت شما",
        "تحویل سریع",
      ],
    },
    {
      id: "spotify_4month",
      name: "پلن ۴ ماهه",
      duration: "۴ ماهه - اقتصادی",
      price: getPrice("spotify_4month"),
      priceKey: "spotify_4month",
      features: [
        "صرفه‌جویی در هزینه",
        "۴ ماه بدون دغدغه",
        "بهترین ارزش",
      ],
    },
  ];

  const comparison = [
    { feature: "تبلیغات", free: "دارد", premium: "ندارد" },
    { feature: "Skip نامحدود", free: false, premium: true },
    { feature: "دانلود آفلاین", free: false, premium: true },
    { feature: "کیفیت صدا", free: "معمولی", premium: "عالی (۳۲۰kbps)" },
    { feature: "پخش دلخواه", free: "فقط شافل", premium: "هر آهنگی" },
    { feature: "Spotify Connect", free: "محدود", premium: "کامل" },
  ];

  const faqs = [
    {
      question: "آیا روی اکانت خودم فعال می‌شود؟",
      answer:
        "بله، اشتراک روی اکانت شخصی شما فعال می‌شود. اکانت اشتراکی نداریم و تمام پلی‌لیست‌ها و تاریخچه شما حفظ می‌شود.",
    },
    {
      question: "آیا می‌توانم آهنگ دانلود کنم؟",
      answer:
        "بله، با Premium می‌توانید آهنگ‌ها و پلی‌لیست‌ها را دانلود کنید و بدون اینترنت گوش دهید.",
    },
    {
      question: "تفاوت پلن ۱ و ۴ ماهه چیست؟",
      answer:
        "فقط در مدت زمان متفاوت هستند. پلن ۴ ماهه به نسبت ارزان‌تر است و نیازی به تمدید ماهانه ندارید.",
    },
  ];

  const lowestPrice = Math.min(...plans.map(p => p.price));

  return (
    <>
      <Helmet>
        <title>خرید اشتراک Spotify Premium | Nova AI Shop</title>
        <meta
          name="description"
          content="خرید اشتراک Spotify Premium - موسیقی بدون تبلیغ با کیفیت بالا. دانلود آفلاین، فعال‌سازی روی اکانت شخصی."
        />
        
        {/* Product Schema with dynamic price */}
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Product",
            "name": "اشتراک Spotify Premium",
            "description": "خرید اشتراک Spotify Premium با تحویل فوری",
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
        serviceId="spotify"
        icon={Music}
        logoSrc="/logos/spotify.png"
        title="Spotify Premium"
        subtitle="موسیقی بدون محدودیت"
        description="اسپاتیفای بزرگ‌ترین پلتفرم موسیقی در جهان است؛ بدون تبلیغ، با کیفیت بالا و قابلیت دانلود آفلاین."
        color="#1DB954"
        features={features}
        plans={plans}
        comparison={comparison}
        faqs={faqs}
      />
    </>
  );
};

export default SpotifyPage;
