import { Phone } from "lucide-react";
import ServicePageLayout from "@/components/shop/ServicePageLayout";
import { Helmet } from "react-helmet";
import { usePricesContext } from "@/contexts/PricesContext";

const VirtualNumberPage = () => {
  const { getPrice } = usePricesContext();

  const features = [
    "ثبت‌نام در سرویس‌های بین‌المللی (Gmail, Facebook, Apple ID)",
    "شماره‌های دائمی و Private",
    "دریافت کد تأیید در بلندمدت",
    "ساخت چند حساب کاربری",
    "حفظ حریم خصوصی",
    "جدا کردن زندگی شخصی از کار",
    "ارتباط با مشتریان خارج از کشور",
    "شماره‌های تضمین ریپورت نبودن",
    "حساب‌های آماده تلگرام و واتساپ",
  ];

  const plans = [
    {
      name: "شماره کانادا",
      duration: "دائمی (+1)",
      price: getPrice("vnum_ca"),
      priceKey: "vnum_ca",
      features: [
        "شماره دائمی",
        "دریافت SMS و تماس",
        "مناسب سرویس‌های آمریکایی",
      ],
    },
    {
      name: "شماره آمریکا",
      duration: "دائمی (+1)",
      price: getPrice("vnum_us"),
      priceKey: "vnum_us",
      features: [
        "شماره دائمی",
        "دریافت SMS و تماس",
        "پرطرفدارترین انتخاب",
      ],
    },
    {
      name: "شماره انگلیس",
      duration: "دائمی (+44)",
      price: getPrice("vnum_uk"),
      priceKey: "vnum_uk",
      popular: true,
      features: [
        "شماره دائمی",
        "مناسب سرویس‌های اروپایی",
        "کیفیت بالا",
      ],
    },
    {
      name: "شماره استرالیا",
      duration: "دائمی (+61)",
      price: getPrice("vnum_au"),
      priceKey: "vnum_au",
      features: [
        "شماره دائمی",
        "مناسب منطقه آسیا-پاسیفیک",
        "کمیاب و با کیفیت",
      ],
    },
  ];

  const faqs = [
    {
      question: "تفاوت شماره مجازی با شماره یک‌بارمصرف چیست؟",
      answer:
        "شماره‌های ما دائمی هستند و می‌توانید تا زمانی که سرویس فعال است از آن‌ها استفاده کنید. شماره‌های یک‌بارمصرف فقط یک‌بار کد دریافت می‌کنند.",
    },
    {
      question: "آیا شماره‌ها ریپورت نیستند؟",
      answer:
        "بله، تمام شماره‌ها تضمین ریپورت نبودن دارند و از اپراتورهای معتبر هستند.",
    },
    {
      question: "حساب آماده تلگرام یعنی چه؟",
      answer:
        "یعنی یک اکانت تلگرام از قبل ساخته شده با شماره خارجی به شما تحویل داده می‌شود. نیازی به ثبت‌نام خودتان نیست.",
    },
    {
      question: "آیا می‌توانم با این شماره تماس بگیرم؟",
      answer:
        "بستگی به نوع شماره دارد. برخی شماره‌ها فقط SMS دریافت می‌کنند و برخی تماس هم دارند. با پشتیبانی هماهنگ کنید.",
    },
  ];

  const extraContent = (
    <section className="py-12">
      <div className="container mx-auto px-4">
        <h2 className="text-2xl font-bold mb-8">👤 حساب‌های آماده</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="glass rounded-2xl p-6">
            <h3 className="text-lg font-semibold mb-4">📨 تلگرام آماده</h3>
            <ul className="space-y-3 text-sm text-muted-foreground">
              <li>🇬🇧 انگلیس (+44): {new Intl.NumberFormat("fa-IR").format(getPrice("vnum_tg_uk") / 1000)} هزار تومان</li>
              <li>🇦🇺 استرالیا (+61): {new Intl.NumberFormat("fa-IR").format(getPrice("vnum_tg_au") / 1000)} هزار تومان</li>
              <li>🇺🇸 آمریکا (+1): {new Intl.NumberFormat("fa-IR").format(getPrice("vnum_tg_us") / 1000)} هزار تومان</li>
              <li>🇨🇦 کانادا (+1): {new Intl.NumberFormat("fa-IR").format(getPrice("vnum_tg_ca") / 1000)} هزار تومان</li>
            </ul>
          </div>
          <div className="glass rounded-2xl p-6">
            <h3 className="text-lg font-semibold mb-4">💬 واتساپ آماده</h3>
            <ul className="space-y-3 text-sm text-muted-foreground">
              <li>🇬🇧 انگلیس (+44): {new Intl.NumberFormat("fa-IR").format(getPrice("vnum_wa_uk") / 1000)} هزار تومان</li>
              <li>🇨🇦 کانادا (+1): {new Intl.NumberFormat("fa-IR").format(getPrice("vnum_wa_ca") / 1000)} هزار تومان</li>
            </ul>
          </div>
        </div>
      </div>
    </section>
  );

  const lowestPrice = Math.min(...plans.map(p => p.price));

  return (
    <>
      <Helmet>
        <title>خرید شماره مجازی خارجی | Nova AI Shop</title>
        <meta
          name="description"
          content="خرید شماره مجازی دائمی خارجی - انگلیس، آمریکا، کانادا، استرالیا. مناسب ثبت‌نام Gmail, Facebook, Apple ID."
        />
        
        {/* Product Schema with dynamic price */}
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Product",
            "name": "شماره مجازی خارجی",
            "description": "خرید شماره مجازی دائمی خارجی برای ثبت‌نام در سرویس‌های بین‌المللی",
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
        icon={Phone}
        title="شماره مجازی"
        subtitle="شماره خارجی دائمی"
        description="شماره مجازی دائمی برای ثبت‌نام در سرویس‌های بین‌المللی، ساخت چند حساب کاربری و حفظ حریم خصوصی."
        color="#A855F7"
        features={features}
        plans={plans}
        faqs={faqs}
        extraContent={extraContent}
      />
    </>
  );
};

export default VirtualNumberPage;
