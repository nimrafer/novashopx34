import { MessageSquare, Clock, RefreshCw, Zap, Headphones, BookOpen, Code } from "lucide-react";
import ServicePageLayout from "@/components/shop/ServicePageLayout";
import { Helmet } from "react-helmet";
import { usePricesContext } from "@/contexts/PricesContext";
import { createFAQSchema, createBreadcrumbSchema, createProductSchema } from "@/components/seo/schemas";

const ClaudePage = () => {
  const { getPrice } = usePricesContext();

  const features = [
    "دسترسی به Claude 3.5 Sonnet و Claude 3 Opus",
    "پنجره کانتکست ۲۰۰ هزار توکنی (معادل یک کتاب کامل)",
    "بهترین انتخاب برای تحلیل متون طولانی و کتاب‌ها",
    "کدنویسی حرفه‌ای با دقت بسیار بالا",
    "پاسخ‌های دقیق‌تر و کمتر توهم‌زا نسبت به رقبا",
    "مناسب تحلیل اسناد حقوقی و علمی",
    "Artifacts برای خروجی‌های بصری و کد قابل اجرا",
    "آپلود فایل PDF، Word و تصویر",
    "سرعت پاسخ‌گویی بالا",
    "رابط کاربری ساده و کاربرپسند",
    "تضمین جایگزینی در صورت مشکل",
    "پشتیبانی ۲۴ ساعته واقعی",
  ];

  const plans = [
    {
      name: "اکانت Pro اختصاصی",
      duration: "۱ ماهه - ۲۰ دلار",
      price: getPrice("claude_pro"),
      priceKey: "claude_pro",
      popular: true,
      features: [
        "دسترسی به Claude 3.5 Sonnet",
        "دسترسی به Claude 3 Opus",
        "فعال‌سازی روی ایمیل شخصی",
        "اولویت در صف پاسخ‌گویی",
        "کاملاً اختصاصی",
      ],
    },
    {
      name: "اکانت Pro اشتراکی",
      duration: "۱ ماهه - اقتصادی",
      price: getPrice("claude_pro_shared"),
      priceKey: "claude_pro_shared",
      features: [
        "تمام امکانات Pro",
        "اشتراکی با ۱-۲ نفر دیگر",
        "مناسب استفاده آموزشی",
      ],
      notIncluded: ["تاریخچه چت خصوصی نیست"],
    },
  ];

  const comparison = [
    { feature: "دسترسی به Claude 3.5 Sonnet", free: false, premium: true },
    { feature: "دسترسی به Claude 3 Opus", free: false, premium: true },
    { feature: "پنجره کانتکست", free: "محدود", premium: "۲۰۰ هزار توکن" },
    { feature: "محدودیت پیام", free: "بسیار محدود", premium: "نامحدود" },
    { feature: "آپلود فایل", free: "محدود", premium: "نامحدود" },
    { feature: "Artifacts", free: "محدود", premium: "کامل" },
    { feature: "سرعت پاسخ", free: "عادی", premium: "سریع" },
    { feature: "اولویت پردازش", free: false, premium: true },
  ];

  const faqs = [
    {
      question: "Claude چیست و چه تفاوتی با ChatGPT دارد؟",
      answer:
        "Claude ساخته شرکت Anthropic است و به خاطر پنجره کانتکست بسیار بزرگ (۲۰۰ هزار توکن) و پاسخ‌های دقیق‌تر معروف است. Claude در تحلیل متون طولانی، کدنویسی و کارهای تحقیقاتی عملکرد بهتری دارد. همچنین کمتر دچار توهم (hallucination) می‌شود.",
    },
    {
      question: "پنجره کانتکست ۲۰۰ هزار توکنی یعنی چه؟",
      answer:
        "یعنی می‌توانید حدود ۱۵۰ هزار کلمه (معادل یک کتاب کامل ۵۰۰ صفحه‌ای) را به Claude بدهید و درباره‌اش سوال بپرسید. این قابلیت برای تحلیل اسناد حقوقی، کتاب‌ها، مقالات علمی و پروژه‌های بزرگ بسیار کاربردی است.",
    },
    {
      question: "Artifacts چیست؟",
      answer:
        "Artifacts یک قابلیت منحصر به فرد Claude است که اجازه می‌دهد خروجی‌های بصری مثل نمودار، کد قابل اجرا، جدول و حتی برنامه‌های ساده را مستقیماً در چت ببینید، تست کنید و دانلود کنید.",
    },
    {
      question: "Claude برای چه کارهایی بهترین انتخاب است؟",
      answer:
        "Claude برای تحلیل متون طولانی، خلاصه‌سازی کتاب‌ها، کدنویسی حرفه‌ای، تحلیل اسناد حقوقی و علمی، ترجمه متون بلند، و کارهایی که نیاز به دقت بالا و کمترین خطا دارند بهترین انتخاب است.",
    },
    {
      question: "تفاوت Claude Sonnet و Opus چیست؟",
      answer:
        "Claude 3.5 Sonnet سریع‌تر و برای کارهای روزمره عالی است. Claude 3 Opus قدرتمندتر و برای کارهای پیچیده‌تر مثل تحقیقات عمیق و استدلال پیچیده مناسب است. با اشتراک Pro به هر دو دسترسی دارید.",
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
              <div className="text-4xl font-bold text-orange-500 mb-2">۲۰۰K</div>
              <div className="text-lg font-semibold mb-1">توکن کانتکست</div>
              <p className="text-muted-foreground text-sm">معادل یک کتاب کامل ۵۰۰ صفحه‌ای</p>
            </div>
            <div className="glass rounded-2xl p-8 text-center">
              <div className="text-4xl font-bold text-orange-500 mb-2">#۱</div>
              <div className="text-lg font-semibold mb-1">در کدنویسی</div>
              <p className="text-muted-foreground text-sm">بهترین عملکرد در بنچمارک‌های کد</p>
            </div>
            <div className="glass rounded-2xl p-8 text-center">
              <div className="text-4xl font-bold text-orange-500 mb-2">کمترین</div>
              <div className="text-lg font-semibold mb-1">توهم (Hallucination)</div>
              <p className="text-muted-foreground text-sm">دقیق‌ترین پاسخ‌ها بین AIها</p>
            </div>
          </div>
        </div>
      </section>

      {/* What is Claude Section */}
      <section className="py-12">
        <div className="container mx-auto px-4">
          <h2 className="text-2xl font-bold mb-6">🤖 Claude چیست؟</h2>
          <div className="glass rounded-3xl p-8 max-w-4xl">
            <p className="text-muted-foreground leading-relaxed mb-4">
              کلود ساخته شرکت Anthropic است که توسط بنیان‌گذاران سابق OpenAI تأسیس شده. Claude یکی از قوی‌ترین مدل‌های زبانی دنیا محسوب می‌شود و به خاطر دقت بالا و پاسخ‌های کم‌خطا معروف است.
            </p>
            <p className="text-muted-foreground leading-relaxed mb-4">
              ویژگی منحصر به فرد Claude پنجره کانتکست ۲۰۰ هزار توکنی است که اجازه می‌دهد کتاب‌های کامل، اسناد طولانی و پروژه‌های بزرگ را تحلیل کنید.
            </p>
            <p className="text-muted-foreground leading-relaxed">
              Claude در بنچمارک‌های کدنویسی رتبه اول را دارد و برای برنامه‌نویسان حرفه‌ای بهترین انتخاب محسوب می‌شود.
            </p>
          </div>
        </div>
      </section>

      {/* Use Cases Section */}
      <section className="py-12">
        <div className="container mx-auto px-4">
          <h2 className="text-2xl font-bold mb-8">🎯 موارد استفاده Claude</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="glass rounded-2xl p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 rounded-xl bg-orange-500/20 flex items-center justify-center">
                  <BookOpen className="w-6 h-6 text-orange-500" />
                </div>
                <h3 className="font-bold text-lg">تحلیل کتاب و اسناد</h3>
              </div>
              <p className="text-muted-foreground text-sm">
                آپلود کتاب کامل و پرسش درباره محتوا. خلاصه‌سازی اسناد حقوقی، مقالات علمی و گزارش‌های طولانی.
              </p>
            </div>
            <div className="glass rounded-2xl p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 rounded-xl bg-orange-500/20 flex items-center justify-center">
                  <Code className="w-6 h-6 text-orange-500" />
                </div>
                <h3 className="font-bold text-lg">کدنویسی حرفه‌ای</h3>
              </div>
              <p className="text-muted-foreground text-sm">
                نوشتن، دیباگ و بهینه‌سازی کد. Claude در بنچمارک‌های کدنویسی رتبه اول دنیا را دارد.
              </p>
            </div>
            <div className="glass rounded-2xl p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 rounded-xl bg-orange-500/20 flex items-center justify-center">
                  <Zap className="w-6 h-6 text-orange-500" />
                </div>
                <h3 className="font-bold text-lg">Artifacts تعاملی</h3>
              </div>
              <p className="text-muted-foreground text-sm">
                ساخت نمودار، جدول و حتی برنامه‌های ساده که مستقیماً در چت قابل اجرا هستند.
              </p>
            </div>
            <div className="glass rounded-2xl p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 rounded-xl bg-orange-500/20 flex items-center justify-center">
                  <MessageSquare className="w-6 h-6 text-orange-500" />
                </div>
                <h3 className="font-bold text-lg">ترجمه و ویرایش</h3>
              </div>
              <p className="text-muted-foreground text-sm">
                ترجمه متون بلند با حفظ سبک. ویرایش و بازنویسی محتوا با کیفیت بالا.
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
              <div className="w-16 h-16 rounded-full bg-orange-500/20 flex items-center justify-center mx-auto mb-4">
                <Headphones className="w-8 h-8 text-orange-500" />
              </div>
              <h3 className="font-bold text-lg mb-2">پشتیبانی ۲۴ ساعته</h3>
              <p className="text-muted-foreground text-sm">
                تیم پشتیبانی متخصص و همیشه در دسترس
              </p>
            </div>
            <div className="glass rounded-2xl p-6 text-center">
              <div className="w-16 h-16 rounded-full bg-orange-500/20 flex items-center justify-center mx-auto mb-4">
                <RefreshCw className="w-8 h-8 text-orange-500" />
              </div>
              <h3 className="font-bold text-lg mb-2">تضمین جایگزینی</h3>
              <p className="text-muted-foreground text-sm">
                در صورت هر مشکلی، اکانت جدید دریافت می‌کنید
              </p>
            </div>
            <div className="glass rounded-2xl p-6 text-center">
              <div className="w-16 h-16 rounded-full bg-orange-500/20 flex items-center justify-center mx-auto mb-4">
                <Zap className="w-8 h-8 text-orange-500" />
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
                <div className="w-14 h-14 rounded-full bg-orange-500 text-background font-bold text-2xl flex items-center justify-center mx-auto mb-4">۱</div>
                <h3 className="font-bold text-lg mb-2">انتخاب پلن</h3>
                <p className="text-muted-foreground text-sm">پلن اختصاصی یا اشتراکی را انتخاب کنید</p>
              </div>
              <div className="text-center">
                <div className="w-14 h-14 rounded-full bg-orange-500 text-background font-bold text-2xl flex items-center justify-center mx-auto mb-4">۲</div>
                <h3 className="font-bold text-lg mb-2">پیام به پشتیبانی</h3>
                <p className="text-muted-foreground text-sm">با کلیک روی ثبت سفارش به تلگرام متصل شوید</p>
              </div>
              <div className="text-center">
                <div className="w-14 h-14 rounded-full bg-orange-500 text-background font-bold text-2xl flex items-center justify-center mx-auto mb-4">۳</div>
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

  // Generate SEO schemas
  const faqSchema = createFAQSchema(faqs);
  const breadcrumbSchema = createBreadcrumbSchema([
    { name: "خانه", url: "/" },
    { name: "خرید Claude Pro", url: "/services/claude" }
  ]);
  const productSchema = createProductSchema({
    name: "اشتراک Claude Pro",
    description: "خرید اشتراک Claude Pro از Anthropic. پنجره کانتکست ۲۰۰ هزار توکنی، بهترین انتخاب برای تحلیل کتاب‌ها و کدنویسی حرفه‌ای.",
    price: lowestPrice,
    url: "/services/claude",
    image: "https://nova-shop.co/logos/claude.webp",
    category: "اشتراک هوش مصنوعی",
    sku: "CLAUDE-PRO",
    ratingValue: 4.8,
    reviewCount: 720
  });

  return (
    <>
      <Helmet>
        <title>خرید اشتراک Claude Pro | بهترین AI برای کدنویسی - نوا شاپ</title>
        <meta
          name="description"
          content="خرید اشتراک Claude Pro از Anthropic. پنجره کانتکست ۲۰۰ هزار توکنی، بهترین انتخاب برای تحلیل کتاب‌ها، کدنویسی حرفه‌ای و تحقیقات."
        />
        <meta name="keywords" content="خرید Claude, اشتراک Claude Pro, Anthropic, هوش مصنوعی, Claude 3.5 Sonnet, Claude Opus, خرید کلود ایران" />
        <link rel="canonical" href="https://nova-shop.co/services/claude" />

        {/* Structured Data */}
        <script type="application/ld+json">
          {JSON.stringify([productSchema, faqSchema, breadcrumbSchema])}
        </script>
      </Helmet>
      <ServicePageLayout
        icon={MessageSquare}
        title="Claude Pro"
        subtitle="هوش مصنوعی Anthropic"
        description="کلود ساخته شرکت Anthropic است و یکی از قوی‌ترین مدل‌های زبانی دنیا محسوب می‌شود. با پنجره کانتکست ۲۰۰ هزار توکنی، Claude بهترین انتخاب برای کار با متون طولانی، تحلیل کتاب‌ها، اسناد حقوقی و کدنویسی حرفه‌ای است."
        color="#D97706"
        features={features}
        plans={plans}
        comparison={comparison}
        faqs={faqs}
        extraContent={extraContent}
      />
    </>
  );
};

export default ClaudePage;
