import { MessageSquare, Clock, RefreshCw, Zap } from "lucide-react";
import ServicePageLayout from "@/components/shop/ServicePageLayout";
import { Helmet } from "react-helmet";

const ClaudePage = () => {
  const features = [
    "مدل Claude 3.5 Sonnet و Claude 3 Opus",
    "پنجره کانتکست ۲۰۰ هزار توکنی",
    "بهترین انتخاب برای متون طولانی و کتاب‌ها",
    "کدنویسی حرفه‌ای با دقت بالا",
    "پاسخ‌های دقیق‌تر و کمتر توهم‌زا",
    "مناسب تحلیل اسناد حقوقی و علمی",
    "سرعت پاسخ‌گویی بالا",
    "رابط کاربری ساده و کاربرپسند",
    "آپلود فایل PDF و تصویر",
    "Artifacts برای خروجی‌های بصری",
    "تضمین جایگزینی در صورت مشکل",
    "پشتیبانی ۲۴ ساعته",
  ];

  const plans = [
    {
      name: "Pro ماهانه",
      duration: "۱ ماهه - ۲۰ دلار",
      price: 1250000,
      popular: true,
      features: [
        "دسترسی به Claude 3.5 Sonnet",
        "دسترسی به Claude 3 Opus",
        "فعال‌سازی روی ایمیل شخصی",
        "اولویت در صف پاسخ‌گویی",
      ],
    },
    {
      name: "Pro اشتراکی",
      duration: "۱ ماهه - اقتصادی",
      price: 450000,
      features: [
        "تمام امکانات Pro",
        "اشتراکی با ۲ نفر دیگر",
        "مناسب استفاده آموزشی",
      ],
      notIncluded: [
        "تاریخچه چت خصوصی نیست",
      ],
    },
  ];

  const comparison = [
    { feature: "دسترسی به Claude 3.5 Sonnet", free: false, premium: true },
    { feature: "دسترسی به Claude 3 Opus", free: false, premium: true },
    { feature: "محدودیت پیام", free: "بسیار محدود", premium: "نامحدود" },
    { feature: "آپلود فایل", free: "محدود", premium: "نامحدود" },
    { feature: "Artifacts", free: "محدود", premium: "کامل" },
    { feature: "سرعت پاسخ", free: "عادی", premium: "سریع" },
    { feature: "اولویت پردازش", free: false, premium: true },
  ];

  const faqs = [
    {
      question: "Claude چه تفاوتی با ChatGPT دارد؟",
      answer:
        "Claude ساخته شرکت Anthropic است و به خاطر پنجره کانتکست بسیار بزرگ (۲۰۰ هزار توکن) و پاسخ‌های دقیق‌تر معروف است. Claude در تحلیل متون طولانی، کدنویسی و کارهای تحقیقاتی عملکرد بهتری دارد.",
    },
    {
      question: "پنجره کانتکست ۲۰۰ هزار توکنی یعنی چه؟",
      answer:
        "یعنی می‌توانید حدود ۱۵۰ هزار کلمه (معادل یک کتاب کامل) را به Claude بدهید و درباره‌اش سوال بپرسید. این قابلیت برای تحلیل اسناد حقوقی، کتاب‌ها و مقالات علمی بسیار کاربردی است.",
    },
    {
      question: "Artifacts چیست؟",
      answer:
        "Artifacts یک قابلیت منحصر به فرد Claude است که اجازه می‌دهد خروجی‌های بصری مثل نمودار، کد قابل اجرا و جدول را مستقیماً در چت ببینید و دانلود کنید.",
    },
    {
      question: "Claude برای چه کارهایی مناسب‌تر است؟",
      answer:
        "Claude برای تحلیل متون طولانی، خلاصه‌سازی کتاب‌ها، کدنویسی حرفه‌ای، تحلیل اسناد حقوقی و علمی، و کارهایی که نیاز به دقت بالا دارند بهترین انتخاب است.",
    },
  ];

  // Extra content
  const extraContent = (
    <section className="py-12">
      <div className="container mx-auto px-4">
        <h2 className="text-2xl font-bold mb-8">🏆 چرا Claude؟</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="glass rounded-2xl p-6 text-center">
            <div className="w-14 h-14 rounded-full bg-orange-500/20 flex items-center justify-center mx-auto mb-4">
              <Clock className="w-7 h-7 text-orange-500" />
            </div>
            <h3 className="font-bold mb-2">کانتکست عظیم</h3>
            <p className="text-muted-foreground text-sm">
              پنجره کانتکست ۲۰۰ هزار توکنی برای کار با متون طولانی
            </p>
          </div>
          <div className="glass rounded-2xl p-6 text-center">
            <div className="w-14 h-14 rounded-full bg-orange-500/20 flex items-center justify-center mx-auto mb-4">
              <RefreshCw className="w-7 h-7 text-orange-500" />
            </div>
            <h3 className="font-bold mb-2">دقت بالا</h3>
            <p className="text-muted-foreground text-sm">
              پاسخ‌های دقیق‌تر و کمتر توهم‌زا نسبت به رقبا
            </p>
          </div>
          <div className="glass rounded-2xl p-6 text-center">
            <div className="w-14 h-14 rounded-full bg-orange-500/20 flex items-center justify-center mx-auto mb-4">
              <Zap className="w-7 h-7 text-orange-500" />
            </div>
            <h3 className="font-bold mb-2">کدنویسی قوی</h3>
            <p className="text-muted-foreground text-sm">
              یکی از بهترین‌ها در کدنویسی و دیباگ کردن
            </p>
          </div>
        </div>
      </div>
    </section>
  );

  return (
    <>
      <Helmet>
        <title>خرید اشتراک Claude Pro | بهترین AI برای متون طولانی</title>
        <meta
          name="description"
          content="خرید اشتراک Claude Pro از Anthropic. پنجره کانتکست ۲۰۰ هزار توکنی، بهترین انتخاب برای تحلیل متون طولانی، کدنویسی و تحقیقات."
        />
        <meta name="keywords" content="خرید Claude, اشتراک Claude Pro, Anthropic, هوش مصنوعی, Claude 3" />
      </Helmet>
      <ServicePageLayout
        icon={MessageSquare}
        title="Claude Pro"
        subtitle="هوش مصنوعی Anthropic"
        description="کلود ساخته شرکت Anthropic است و یکی از قوی‌ترین مدل‌های زبانی دنیا محسوب می‌شود. با پنجره کانتکست ۲۰۰ هزار توکنی، Claude بهترین انتخاب برای کار با متون طولانی، تحلیل کتاب‌ها و اسناد حقوقی است."
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
