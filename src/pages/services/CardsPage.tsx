import { CreditCard } from "lucide-react";
import ServicePageLayout from "@/components/shop/ServicePageLayout";
import { Helmet } from "react-helmet";
import { usePricesContext } from "@/contexts/PricesContext";

const CardsPage = () => {
  const { getPrice } = usePricesContext();

  const features = [
    "صادر شده از بانک‌های اروپایی و سوییس",
    "قابلیت شارژ مجدد نامحدود",
    "مناسب برای تمام خریدهای بین‌المللی",
    "رفع تحریم به معنای واقعی",
    "امنیت بالا",
    "پشتیبانی از یوتیوب پریمیوم",
    "پشتیبانی از اسپاتیفای",
    "پشتیبانی از تلگرام پریمیوم",
    "پشتیبانی از آمازون، نتفلیکس و...",
  ];

  const plans = [
    {
      name: "مستر کارت",
      duration: "بین‌المللی - بانک سوییس",
      price: getPrice("master_card"),
      priceKey: "master_card",
      features: [
        "قابلیت شارژ مجدد",
        "تمام سایت‌های بین‌المللی",
        "امنیت بالا",
      ],
    },
    {
      name: "ویزا کارت",
      duration: "بین‌المللی - بانک سوییس",
      price: getPrice("visa_card"),
      priceKey: "visa_card",
      popular: true,
      features: [
        "پذیرش گسترده‌تر",
        "قابلیت شارژ مجدد",
        "تمام سایت‌های بین‌المللی",
      ],
    },
  ];

  const faqs = [
    {
      question: "تفاوت ویزا و مستر کارت چیست؟",
      answer:
        "هر دو تقریباً یکسان هستند. ویزا کمی گسترده‌تر پذیرفته می‌شود اما مستر کارت هم در اکثر جاها کار می‌کند. اگر مطمئن نیستید، ویزا را انتخاب کنید.",
    },
    {
      question: "آیا می‌توانم کارت را شارژ کنم؟",
      answer:
        "بله، کارت‌های ما قابلیت شارژ مجدد نامحدود دارند. هر وقت موجودی تمام شد می‌توانید شارژ کنید.",
    },
    {
      question: "برای چه سایت‌هایی می‌توانم استفاده کنم؟",
      answer:
        "یوتیوب پریمیوم، اسپاتیفای، تلگرام پریمیوم، اپل استور، گوگل پلی، آمازون، نتفلیکس و هر سایت بین‌المللی دیگر.",
    },
    {
      question: "آیا این کارت‌ها قانونی هستند؟",
      answer:
        "بله، کارت‌ها از بانک‌های معتبر اروپایی و سوییس صادر شده‌اند و کاملاً قانونی هستند.",
    },
  ];

  const lowestPrice = Math.min(...plans.map(p => p.price));

  return (
    <>
      <Helmet>
        <title>خرید ویزا کارت و مستر کارت مجازی | Nova AI Shop</title>
        <meta
          name="description"
          content="خرید ویزا کارت و مستر کارت مجازی بین‌المللی. صادر شده از بانک سوییس، قابل شارژ، مناسب خریدهای بین‌المللی."
        />
        
        {/* Product Schema with dynamic price */}
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Product",
            "name": "ویزا کارت و مستر کارت مجازی",
            "description": "کارت اعتباری مجازی بین‌المللی صادر شده از بانک سوییس",
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
        icon={CreditCard}
        title="ویزا و مستر کارت"
        subtitle="کارت اعتباری مجازی"
        description="کارت اعتباری مجازی بین‌المللی صادر شده از بانک‌های اروپایی و سوییس. مناسب برای تمام خریدهای بین‌المللی و رفع تحریم."
        color="#EAB308"
        features={features}
        plans={plans}
        faqs={faqs}
      />
    </>
  );
};

export default CardsPage;
