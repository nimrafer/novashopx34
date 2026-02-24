import { MessageCircle, Clock, RefreshCw, Zap, Headphones, Image, Brain, Twitter } from "lucide-react";
import ServicePageLayout from "@/components/shop/ServicePageLayout";
import { Helmet } from "react-helmet";
import { usePricesContext } from "@/contexts/PricesContext";
import { createFAQSchema, createBreadcrumbSchema, createProductSchema } from "@/components/seo/schemas";

const GrokPage = () => {
  const { getPrice } = usePricesContext();

  const features = [
    "پاسخ به سوالات حساس بدون فیلتر و سانسور",
    "دسترسی به مدل‌های Grok-3 و Grok-4 (Heavy)",
    "تولید تصویر نامحدود با Aurora",
    "حالت استدلال پیشرفته (Reasoning Mode)",
    "دسترسی لحظه‌ای به اطلاعات X (توییتر)",
    "تحلیل داده و آپلود فایل",
    "سرعت پردازش بالا در ساعات شلوغ",
    "اولویت‌بندی در صف پاسخ‌گویی",
    "مکالمه آزاد در هر موضوعی",
    "الهام از جارویس و راهنمای کهکشان",
    "یک ماه اشتراک رایگان با ChatGPT",
    "تضمین جایگزینی و پشتیبانی ۲۴ ساعته",
  ];

  const plans = [
    {
      name: "Super Grok ماهانه",
      duration: "۱ ماهه - ۳۰ دلار",
      price: getPrice("grok_monthly"),
      priceKey: "grok_monthly",
      popular: true,
      features: [
        "تمام قابلیت‌های Super Grok",
        "دسترسی به Grok-3 و Grok-4",
        "تولید تصویر نامحدود با Aurora",
        "دسترسی به اطلاعات لحظه‌ای X",
      ],
    },
  ];

  const comparison = [
    { feature: "دسترسی به Grok-3/4", free: false, premium: true },
    { feature: "پاسخ بدون سانسور", free: "محدود", premium: "کامل" },
    { feature: "تولید تصویر با Aurora", free: "بسیار محدود", premium: "نامحدود" },
    { feature: "حالت استدلال پیشرفته", free: false, premium: true },
    { feature: "سرعت پاسخ", free: "عادی", premium: "سریع" },
    { feature: "آپلود فایل", free: false, premium: true },
    { feature: "اولویت پردازش", free: false, premium: true },
    { feature: "اطلاعات لحظه‌ای X", free: "محدود", premium: "کامل" },
  ];

  const faqs = [
    {
      question: "Grok چیست و چه تفاوتی با ChatGPT دارد؟",
      answer:
        "Grok ساخته xAI و ایلان ماسک است و به خاطر پاسخ‌های بی‌پرده و بدون سانسور معروف است. برخلاف ChatGPT که فیلترهای اخلاقی دارد، Grok به سوالات حساس پاسخ می‌دهد. همچنین به اطلاعات لحظه‌ای X (توییتر سابق) دسترسی دارد که هیچ AI دیگری ندارد.",
    },
    {
      question: "آیا Grok واقعاً بدون سانسور است؟",
      answer:
        "بله، Grok برای پاسخ‌گویی آزادانه طراحی شده و به سوالاتی که سایر AIها رد می‌کنند پاسخ می‌دهد. البته محتوای کاملاً غیرقانونی همچنان ممنوع است اما فیلترهای اخلاقی بسیار کمتری دارد.",
    },
    {
      question: "Aurora چیست؟",
      answer:
        "Aurora سیستم تولید تصویر Grok است که می‌توانید با آن تصاویر متنوع بسازید، حتی تصاویری که سایر AIها مثل DALL-E یا Midjourney تولید نمی‌کنند. محدودیت‌های بسیار کمتری نسبت به رقبا دارد.",
    },
    {
      question: "چرا یک ماه Grok رایگان با ChatGPT ارائه می‌شود؟",
      answer:
        "این یک پیشنهاد ویژه است! با خرید هر پلن ChatGPT، یک ماه اشتراک رایگان Grok هم دریافت می‌کنید تا بتوانید هر دو را مقایسه کنید و ببینید کدام برای نیازهایتان بهتر است.",
    },
    {
      question: "دسترسی به X یعنی چه؟",
      answer:
        "Grok به اطلاعات لحظه‌ای توییتر (X) دسترسی دارد. یعنی می‌توانید درباره آخرین اخبار، ترندها و توییت‌های مهم سوال بپرسید و پاسخ به‌روز دریافت کنید.",
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
              <div className="text-4xl font-bold text-white mb-2">۰٪</div>
              <div className="text-lg font-semibold mb-1">سانسور</div>
              <p className="text-muted-foreground text-sm">پاسخ آزاد به هر سوالی</p>
            </div>
            <div className="glass rounded-2xl p-8 text-center">
              <div className="text-4xl font-bold text-white mb-2">∞</div>
              <div className="text-lg font-semibold mb-1">تصویر با Aurora</div>
              <p className="text-muted-foreground text-sm">تولید تصویر نامحدود</p>
            </div>
            <div className="glass rounded-2xl p-8 text-center">
              <div className="text-4xl font-bold text-white mb-2">لحظه‌ای</div>
              <div className="text-lg font-semibold mb-1">اطلاعات X</div>
              <p className="text-muted-foreground text-sm">دسترسی به توییتر زنده</p>
            </div>
          </div>
        </div>
      </section>

      {/* What is Grok Section */}
      <section className="py-12">
        <div className="container mx-auto px-4">
          <h2 className="text-2xl font-bold mb-6">🤖 Grok چیست؟</h2>
          <div className="glass rounded-3xl p-8 max-w-4xl">
            <p className="text-muted-foreground leading-relaxed mb-4">
              گروک ساخته xAI و ایلان ماسک، یکی از بی‌پرده‌ترین هوش‌های مصنوعی دنیاست! برخلاف AIهای دیگه که پشت فیلترهای اخلاقی قایم می‌شن، گروک مستقیم میره سر اصل مطلب.
            </p>
            <p className="text-muted-foreground leading-relaxed mb-4">
              الهام‌گرفته از جارویس (دستیار آیرون‌من) و راهنمای کهکشان، گروک نه تنها باهوشه، بلکه شوخ‌طبع و صادق هم هست.
            </p>
            <p className="text-muted-foreground leading-relaxed">
              گروک به اطلاعات لحظه‌ای X (توییتر) دسترسی دارد که هیچ AI دیگری این قابلیت را ندارد. می‌توانید درباره آخرین اخبار و ترندها سوال بپرسید.
            </p>
          </div>
        </div>
      </section>

      {/* Key Features Section */}
      <section className="py-12">
        <div className="container mx-auto px-4">
          <h2 className="text-2xl font-bold mb-8">🌟 قابلیت‌های کلیدی Grok</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="glass rounded-2xl p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 rounded-xl bg-white/20 flex items-center justify-center">
                  <MessageCircle className="w-6 h-6 text-white" />
                </div>
                <h3 className="font-bold text-lg">بدون سانسور</h3>
              </div>
              <p className="text-muted-foreground text-sm">
                پاسخ به سوالاتی که سایر AIها رد می‌کنند. مکالمه آزاد در هر موضوعی بدون فیلترهای اخلاقی محدودکننده.
              </p>
            </div>
            <div className="glass rounded-2xl p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 rounded-xl bg-white/20 flex items-center justify-center">
                  <Image className="w-6 h-6 text-white" />
                </div>
                <h3 className="font-bold text-lg">Aurora نامحدود</h3>
              </div>
              <p className="text-muted-foreground text-sm">
                تولید تصویر بدون محدودیت‌های معمول. ساخت تصاویری که DALL-E و Midjourney اجازه نمی‌دهند.
              </p>
            </div>
            <div className="glass rounded-2xl p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 rounded-xl bg-white/20 flex items-center justify-center">
                  <Twitter className="w-6 h-6 text-white" />
                </div>
                <h3 className="font-bold text-lg">اطلاعات لحظه‌ای X</h3>
              </div>
              <p className="text-muted-foreground text-sm">
                دسترسی به آخرین توییت‌ها، ترندها و اخبار. هیچ AI دیگری این قابلیت را ندارد.
              </p>
            </div>
            <div className="glass rounded-2xl p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 rounded-xl bg-white/20 flex items-center justify-center">
                  <Brain className="w-6 h-6 text-white" />
                </div>
                <h3 className="font-bold text-lg">استدلال پیشرفته</h3>
              </div>
              <p className="text-muted-foreground text-sm">
                حالت Reasoning Mode برای تحلیل‌های پیچیده. Grok-4 با قدرت استدلال بسیار بالا.
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
              <div className="w-16 h-16 rounded-full bg-white/20 flex items-center justify-center mx-auto mb-4">
                <Headphones className="w-8 h-8 text-white" />
              </div>
              <h3 className="font-bold text-lg mb-2">پشتیبانی ۲۴ ساعته</h3>
              <p className="text-muted-foreground text-sm">
                تیم پشتیبانی متخصص و همیشه در دسترس
              </p>
            </div>
            <div className="glass rounded-2xl p-6 text-center">
              <div className="w-16 h-16 rounded-full bg-white/20 flex items-center justify-center mx-auto mb-4">
                <RefreshCw className="w-8 h-8 text-white" />
              </div>
              <h3 className="font-bold text-lg mb-2">تضمین جایگزینی</h3>
              <p className="text-muted-foreground text-sm">
                در صورت هر مشکلی، اکانت جدید دریافت می‌کنید
              </p>
            </div>
            <div className="glass rounded-2xl p-6 text-center">
              <div className="w-16 h-16 rounded-full bg-white/20 flex items-center justify-center mx-auto mb-4">
                <Zap className="w-8 h-8 text-white" />
              </div>
              <h3 className="font-bold text-lg mb-2">تحویل فوری</h3>
              <p className="text-muted-foreground text-sm">
                بلافاصله پس از پرداخت، اکانت فعال می‌شود
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Bonus Section */}
      <section className="py-12">
        <div className="container mx-auto px-4">
          <div className="glass rounded-3xl p-8 text-center max-w-3xl mx-auto" style={{ background: "linear-gradient(135deg, rgba(255, 255, 255, 0.1) 0%, transparent 50%)" }}>
            <h3 className="text-xl font-bold mb-4">🎁 پیشنهاد ویژه</h3>
            <p className="text-muted-foreground">
              همه پلن‌های ChatGPT همراه با یک ماه اشتراک رایگان Grok ارائه می‌شوند!
              با خرید ChatGPT، Grok را هم رایگان تست کنید و ببینید کدام برای نیازهایتان بهتر است.
            </p>
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
                <div className="w-14 h-14 rounded-full bg-white text-background font-bold text-2xl flex items-center justify-center mx-auto mb-4">۱</div>
                <h3 className="font-bold text-lg mb-2">انتخاب پلن</h3>
                <p className="text-muted-foreground text-sm">پلن اشتراکی یا اختصاصی را انتخاب کنید</p>
              </div>
              <div className="text-center">
                <div className="w-14 h-14 rounded-full bg-white text-background font-bold text-2xl flex items-center justify-center mx-auto mb-4">۲</div>
                <h3 className="font-bold text-lg mb-2">پیام به پشتیبانی</h3>
                <p className="text-muted-foreground text-sm">با کلیک روی ثبت سفارش به تلگرام متصل شوید</p>
              </div>
              <div className="text-center">
                <div className="w-14 h-14 rounded-full bg-white text-background font-bold text-2xl flex items-center justify-center mx-auto mb-4">۳</div>
                <h3 className="font-bold text-lg mb-2">دسترسی فوری</h3>
                <p className="text-muted-foreground text-sm">پس از پرداخت، اکانت همان لحظه فعال می‌شود</p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );

  const lowestPrice = plans[0].price;
  
  // Generate SEO schemas
  const faqSchema = createFAQSchema(faqs);
  const breadcrumbSchema = createBreadcrumbSchema([
    { name: "خانه", url: "/" },
    { name: "خرید Grok", url: "/services/grok" }
  ]);
  const productSchema = createProductSchema({
    name: "اشتراک Super Grok",
    description: "خرید اشتراک Super Grok - هوش مصنوعی بدون سانسور xAI ایلان ماسک. تولید تصویر نامحدود با Aurora و دسترسی لحظه‌ای به X.",
    price: lowestPrice,
    url: "/services/grok",
    image: "https://novateam.shop/logos/grok.png",
    category: "اشتراک هوش مصنوعی",
    sku: "GROK-SUPER",
    ratingValue: 4.7,
    reviewCount: 650
  });

  return (
    <>
      <Helmet>
        <title>خرید اشتراک Super Grok | AI بدون سانسور ایلان ماسک - نوا شاپ</title>
        <meta
          name="description"
          content="خرید اشتراک Super Grok - هوش مصنوعی بدون سانسور xAI و ایلان ماسک. پاسخ به سوالات حساس، تولید تصویر نامحدود با Aurora، دسترسی لحظه‌ای به X."
        />
        <meta name="keywords" content="خرید Grok, Super Grok, xAI, ایلان ماسک, هوش مصنوعی بدون سانسور, Aurora, توییتر, خرید گروک ایران" />
        <link rel="canonical" href="https://novateam.shop/services/grok" />
        
        {/* Structured Data */}
        <script type="application/ld+json">
          {JSON.stringify([productSchema, faqSchema, breadcrumbSchema])}
        </script>
      </Helmet>
      <ServicePageLayout
        icon={MessageCircle}
        title="Super Grok"
        subtitle="هوش مصنوعی بدون سانسور"
        description="گروک ساخته xAI و ایلان ماسک، یکی از بی‌پرده‌ترین هوش‌های مصنوعی دنیاست! برخلاف AIهای دیگه که پشت فیلترهای اخلاقی قایم می‌شن، گروک مستقیم میره سر اصل مطلب. الهام‌گرفته از جارویس و راهنمای کهکشان، گروک نه تنها باهوشه، بلکه شوخ‌طبع و صادق هم هست."
        color="#FFFFFF"
        features={features}
        plans={plans}
        comparison={comparison}
        faqs={faqs}
        extraContent={extraContent}
      />
    </>
  );
};

export default GrokPage;
