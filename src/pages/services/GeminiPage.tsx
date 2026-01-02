import { Sparkles, Clock, RefreshCw, Zap, Headphones, Wifi, Database } from "lucide-react";
import ServicePageLayout from "@/components/shop/ServicePageLayout";
import { Helmet } from "react-helmet";
import { usePricesContext } from "@/contexts/PricesContext";

const GeminiPage = () => {
  const { getPrice } = usePricesContext();

  const features = [
    "دسترسی به Gemini 2.5 Pro و Deep Research",
    "یکپارچه با اکوسیستم گوگل (Gmail, Docs, Drive, Photos)",
    "۲ ترابایت فضای ابری Google One",
    "ساخت ویدیو با Veo 3 و 3.1",
    "NotebookLM با سقف بالاتر برای تحقیقات",
    "Gemini Code Assist برای برنامه‌نویسان",
    "دسترسی به Google AI Studio",
    "تحلیل تصویر، صدا و ویدیو پیشرفته",
    "پشتیبانی از زبان فارسی",
    "قابل فعال‌سازی روی Gmail شخصی شما",
    "تضمین جایگزینی در صورت مشکل",
    "پشتیبانی ۲۴ ساعته واقعی",
  ];

  const plans = [
    {
      name: "اکانت اختصاصی یک‌ماهه",
      duration: "۱ ماهه",
      price: getPrice("gem_exclusive_1month"),
      priceKey: "gem_exclusive_1month",
      features: [
        "اکانت کاملاً اختصاصی",
        "تمام امکانات Gemini Pro",
        "فعال‌سازی روی Gmail شما",
      ],
    },
    {
      name: "اکانت اختصاصی سه‌ماهه",
      duration: "۳ ماهه",
      price: getPrice("gem_exclusive_3month"),
      priceKey: "gem_exclusive_3month",
      popular: true,
      features: [
        "اکانت کاملاً اختصاصی",
        "صرفه‌جویی قابل توجه",
        "مناسب استفاده طولانی‌مدت",
      ],
    },
    {
      name: "اکانت اختصاصی شش‌ماهه",
      duration: "۶ ماهه",
      price: getPrice("gem_exclusive_6month"),
      priceKey: "gem_exclusive_6month",
      features: [
        "اکانت کاملاً اختصاصی",
        "بهترین ارزش برای پول",
        "صرفه‌جویی بیشتر",
      ],
    },
    {
      name: "اکانت اختصاصی نه‌ماهه",
      duration: "۹ ماهه",
      price: getPrice("gem_exclusive_9month"),
      priceKey: "gem_exclusive_9month",
      features: [
        "اکانت کاملاً اختصاصی",
        "طولانی‌ترین دوره",
        "بیشترین صرفه‌جویی",
      ],
    },
  ];

  const comparison = [
    { feature: "دسترسی به Gemini 2.5 Pro", free: false, premium: true },
    { feature: "Deep Research", free: false, premium: true },
    { feature: "فضای Google One", free: "۱۵ گیگ", premium: "۲ ترابایت" },
    { feature: "ساخت ویدیو با Veo", free: false, premium: true },
    { feature: "NotebookLM", free: "محدود", premium: "نامحدود" },
    { feature: "Google AI Studio", free: "محدود", premium: "کامل" },
    { feature: "Code Assist", free: false, premium: true },
    { feature: "یکپارچگی با Workspace", free: false, premium: true },
    { feature: "پشتیبانی ویژه", free: false, premium: true },
  ];

  const faqs = [
    {
      question: "Gemini چیست و چه تفاوتی با ChatGPT دارد؟",
      answer:
        "هوش مصنوعی جمینی، جدیدترین مدل زبان بزرگ و چندوجهی گوگل است که توسط تیم دیپ‌مایند توسعه یافته و می‌تواند متن، کد، تصویر، صدا و ویدیو را به طور یکپارچه درک کند. با سرویس‌های گوگل یکپارچه است و برای کسانی که زیاد از Gmail, Drive و Docs استفاده می‌کنند بهترین انتخاب است.",
    },
    {
      question: "Deep Research چیست؟",
      answer:
        "Deep Research یک قابلیت پیشرفته است که به Gemini اجازه می‌دهد تحقیقات عمیق انجام دهد، منابع متعدد را بررسی کند و گزارش جامع ارائه دهد. مناسب تحقیقات دانشگاهی، تولید محتوای تخصصی و تحلیل‌های پیچیده.",
    },
    {
      question: "۲ ترابایت فضا برای چیست؟",
      answer:
        "این فضا در Google Drive, Photos و Gmail قابل استفاده است. می‌توانید فایل‌ها، عکس‌ها و ویدیوهایتان را ذخیره کنید. همچنین بک‌آپ گوشی هم در این فضا ذخیره می‌شود. این فضا به تنهایی ارزش ماهانه ۱۰ دلار دارد!",
    },
    {
      question: "آیا روی Gmail شخصی من فعال می‌شود؟",
      answer:
        "بله، در پلن‌های یکساله می‌توانید اشتراک را روی Gmail شخصی خودتان فعال کنید و کاملاً اختصاصی است.",
    },
    {
      question: "تخفیف دانشجویی دارید؟",
      answer:
        "بله! برای دانشجویان تخفیف ویژه داریم. پلن‌های ماهانه، ۳ ماهه، ۶ ماهه و یکساله با قیمت‌های فوق‌العاده. با پشتیبانی تماس بگیرید.",
    },
  ];

  // Extra content sections
  const extraContent = (
    <>
      {/* Stats Section */}
      <section className="py-12">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="glass rounded-2xl p-8 text-center">
              <div className="text-4xl font-bold text-blue-500 mb-2">+۱۰,۰۰۰</div>
              <div className="text-lg font-semibold mb-1">کاربر راضی</div>
              <p className="text-muted-foreground text-sm">از سرویس‌های ما استفاده می‌کنند</p>
            </div>
            <div className="glass rounded-2xl p-8 text-center">
              <div className="text-4xl font-bold text-blue-500 mb-2">۲ TB</div>
              <div className="text-lg font-semibold mb-1">فضای ابری</div>
              <p className="text-muted-foreground text-sm">با هر اشتراک Gemini Pro</p>
            </div>
            <div className="glass rounded-2xl p-8 text-center">
              <div className="text-4xl font-bold text-blue-500 mb-2">۱۰۰٪</div>
              <div className="text-lg font-semibold mb-1">تضمین رضایت</div>
              <p className="text-muted-foreground text-sm">گارانتی تعویض و پشتیبانی کامل</p>
            </div>
          </div>
        </div>
      </section>

      {/* Student Discount Section */}
      <section className="py-12">
        <div className="container mx-auto px-4">
          <h2 className="text-2xl font-bold mb-6">🎓 تخفیف دانشجویی</h2>
          <div className="glass rounded-3xl p-8 max-w-4xl" style={{ background: "linear-gradient(135deg, rgba(59, 130, 246, 0.1) 0%, transparent 50%)" }}>
            <p className="text-muted-foreground mb-6">
              با ارائه کارت دانشجویی معتبر، از تخفیف‌های ویژه بهره‌مند شوید:
            </p>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="text-center p-4 bg-background/50 rounded-xl">
                <div className="text-2xl font-bold text-blue-500">{new Intl.NumberFormat("fa-IR").format(getPrice("gem_student_month") / 1000)}</div>
                <div className="text-sm text-muted-foreground">هزار تومان / ماهانه</div>
              </div>
              <div className="text-center p-4 bg-background/50 rounded-xl">
                <div className="text-2xl font-bold text-blue-500">{new Intl.NumberFormat("fa-IR").format(getPrice("gem_student_3month") / 1000)}</div>
                <div className="text-sm text-muted-foreground">هزار تومان / ۳ ماهه</div>
              </div>
              <div className="text-center p-4 bg-background/50 rounded-xl">
                <div className="text-2xl font-bold text-blue-500">{new Intl.NumberFormat("fa-IR").format(getPrice("gem_student_6month") / 1000)}</div>
                <div className="text-sm text-muted-foreground">هزار تومان / ۶ ماهه</div>
              </div>
              <div className="text-center p-4 bg-background/50 rounded-xl">
                <div className="text-2xl font-bold text-blue-500">{new Intl.NumberFormat("fa-IR").format(getPrice("gem_student_year") / 1000)}</div>
                <div className="text-sm text-muted-foreground">هزار تومان / یکساله</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* What is Gemini Section */}
      <section className="py-12">
        <div className="container mx-auto px-4">
          <h2 className="text-2xl font-bold mb-6">🤖 Gemini چیست؟</h2>
          <div className="glass rounded-3xl p-8 max-w-4xl">
            <p className="text-muted-foreground leading-relaxed mb-4">
              هوش مصنوعی جمینی، جدیدترین مدل زبان بزرگ و چندوجهی گوگل است که توسط تیم دیپ‌مایند توسعه یافته و می‌تواند متن، کد، تصویر، صدا و ویدیو را به طور یکپارچه درک کند.
            </p>
            <p className="text-muted-foreground leading-relaxed mb-4">
              این مدل در سه نسخه اولترا (برای کارهای بسیار پیچیده)، پرو (برای کاربردهای عمومی) و نانو (برای اجرا روی موبایل) عرضه شده است.
            </p>
            <p className="text-muted-foreground leading-relaxed">
              جمینی با قابلیت‌های استدلال پیشرفته و کدنویسی، در حال ادغام در تمام محصولات گوگل از جمله جستجو، اندروید و ورکرسپیس است تا تجربه‌ای هوشمندتر و یکپارچه‌تر فراهم کند.
            </p>
          </div>
        </div>
      </section>

      {/* Features Deep Dive */}
      <section className="py-12">
        <div className="container mx-auto px-4">
          <h2 className="text-2xl font-bold mb-8">🌟 قابلیت‌های کلیدی Gemini Pro</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="glass rounded-2xl p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 rounded-xl bg-blue-500/20 flex items-center justify-center">
                  <Database className="w-6 h-6 text-blue-500" />
                </div>
                <h3 className="font-bold text-lg">۲ ترابایت فضای ابری</h3>
              </div>
              <p className="text-muted-foreground text-sm">
                ذخیره‌سازی نامحدود عکس، ویدیو و فایل در Google Drive و Photos. بک‌آپ کامل گوشی و دسترسی از هر دستگاه.
              </p>
            </div>
            <div className="glass rounded-2xl p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 rounded-xl bg-blue-500/20 flex items-center justify-center">
                  <Sparkles className="w-6 h-6 text-blue-500" />
                </div>
                <h3 className="font-bold text-lg">Deep Research</h3>
              </div>
              <p className="text-muted-foreground text-sm">
                تحقیقات عمیق با بررسی منابع متعدد. تولید گزارش‌های جامع برای تحقیقات دانشگاهی و محتوای تخصصی.
              </p>
            </div>
            <div className="glass rounded-2xl p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 rounded-xl bg-blue-500/20 flex items-center justify-center">
                  <Zap className="w-6 h-6 text-blue-500" />
                </div>
                <h3 className="font-bold text-lg">ساخت ویدیو با Veo</h3>
              </div>
              <p className="text-muted-foreground text-sm">
                تولید ویدیو با هوش مصنوعی Veo 3 و 3.1. ساخت ویدیوهای حرفه‌ای از متن یا تصویر.
              </p>
            </div>
            <div className="glass rounded-2xl p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 rounded-xl bg-blue-500/20 flex items-center justify-center">
                  <RefreshCw className="w-6 h-6 text-blue-500" />
                </div>
                <h3 className="font-bold text-lg">یکپارچگی با گوگل</h3>
              </div>
              <p className="text-muted-foreground text-sm">
                کار مستقیم با Gmail, Docs, Sheets و Drive. خلاصه‌سازی ایمیل‌ها، نوشتن متن و تحلیل داده‌ها.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Why Us Section */}
      <section className="py-12">
        <div className="container mx-auto px-4">
          <h2 className="text-2xl font-bold mb-8">🏆 چرا ما بهترین انتخاب هستیم؟</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="glass rounded-2xl p-6 text-center">
              <div className="w-16 h-16 rounded-full bg-blue-500/20 flex items-center justify-center mx-auto mb-4">
                <Headphones className="w-8 h-8 text-blue-500" />
              </div>
              <h3 className="font-bold text-lg mb-2">پشتیبانی ۲۴ ساعته</h3>
              <p className="text-muted-foreground text-sm">
                تیم پشتیبانی متخصص و همیشه در دسترس
              </p>
            </div>
            <div className="glass rounded-2xl p-6 text-center">
              <div className="w-16 h-16 rounded-full bg-blue-500/20 flex items-center justify-center mx-auto mb-4">
                <RefreshCw className="w-8 h-8 text-blue-500" />
              </div>
              <h3 className="font-bold text-lg mb-2">تضمین جایگزینی</h3>
              <p className="text-muted-foreground text-sm">
                در صورت هر مشکلی، اکانت جدید دریافت می‌کنید
              </p>
            </div>
            <div className="glass rounded-2xl p-6 text-center">
              <div className="w-16 h-16 rounded-full bg-blue-500/20 flex items-center justify-center mx-auto mb-4">
                <Zap className="w-8 h-8 text-blue-500" />
              </div>
              <h3 className="font-bold text-lg mb-2">تحویل فوری</h3>
              <p className="text-muted-foreground text-sm">
                بلافاصله پس از پرداخت، اکانت فعال می‌شود
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* How to Buy Section */}
      <section className="py-12">
        <div className="container mx-auto px-4">
          <h2 className="text-2xl font-bold mb-8">📋 نحوه خرید در ۳ مرحله</h2>
          <div className="glass rounded-3xl p-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="text-center">
                <div className="w-14 h-14 rounded-full bg-blue-500 text-background font-bold text-2xl flex items-center justify-center mx-auto mb-4">۱</div>
                <h3 className="font-bold text-lg mb-2">انتخاب پلن</h3>
                <p className="text-muted-foreground text-sm">پلن مناسب خود را انتخاب کنید</p>
              </div>
              <div className="text-center">
                <div className="w-14 h-14 rounded-full bg-blue-500 text-background font-bold text-2xl flex items-center justify-center mx-auto mb-4">۲</div>
                <h3 className="font-bold text-lg mb-2">پیام به پشتیبانی</h3>
                <p className="text-muted-foreground text-sm">با کلیک روی ثبت سفارش به تلگرام متصل شوید</p>
              </div>
              <div className="text-center">
                <div className="w-14 h-14 rounded-full bg-blue-500 text-background font-bold text-2xl flex items-center justify-center mx-auto mb-4">۳</div>
                <h3 className="font-bold text-lg mb-2">دسترسی فوری</h3>
                <p className="text-muted-foreground text-sm">پس از پرداخت، اکانت همان لحظه فعال می‌شود</p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );

  const lowestPrice = Math.min(...plans.map(p => p.price));

  return (
    <>
      <Helmet>
        <title>خرید اشتراک Gemini Pro گوگل | ۲ ترابایت فضا + Deep Research</title>
        <meta
          name="description"
          content="خرید اشتراک Gemini Pro گوگل با ۲ ترابایت فضای ابری. یکپارچه با Gmail, Drive و Docs. ساخت ویدیو با Veo، Deep Research و پشتیبانی ۲۴ ساعته."
        />
        <meta name="keywords" content="خرید Gemini, اشتراک Gemini Pro, هوش مصنوعی گوگل, Google One, Deep Research, Veo" />
        
        {/* Product Schema with dynamic price */}
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Product",
            "name": "اشتراک Gemini Pro گوگل",
            "description": "خرید اشتراک Gemini Pro با ۲ ترابایت فضای ابری و Deep Research",
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
        icon={Sparkles}
        title="Gemini Pro"
        subtitle="هوش مصنوعی گوگل"
        description="هوش مصنوعی جمینی، جدیدترین مدل زبان بزرگ و چندوجهی گوگل است که توسط تیم دیپ‌مایند توسعه یافته و می‌تواند متن، کد، تصویر، صدا و ویدیو را به طور یکپارچه درک کند. این مدل در حال ادغام در تمام محصولات گوگل است تا تجربه‌ای هوشمندتر و یکپارچه‌تر فراهم کند."
        color="#3B82F6"
        features={features}
        plans={plans}
        comparison={comparison}
        faqs={faqs}
        extraContent={extraContent}
      />
    </>
  );
};

export default GeminiPage;
