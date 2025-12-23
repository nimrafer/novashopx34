import { Code, Clock, RefreshCw, Zap } from "lucide-react";
import ServicePageLayout from "@/components/shop/ServicePageLayout";
import { Helmet } from "react-helmet";

const CursorPage = () => {
  const features = [
    "تکمیل خودکار کد با مدل‌های قدرتمند AI",
    "دسترسی به Claude 3.5 Sonnet، GPT-4 و Gemini",
    "درک کامل کانتکست پروژه",
    "پیشنهاد رفع باگ و بهینه‌سازی کد",
    "Refactoring هوشمند با یک کلیک",
    "چت با AI درباره کد و پروژه",
    "پشتیبانی از تمام زبان‌های برنامه‌نویسی",
    "سازگار با VS Code Extensions",
    "Tab Completion پیشرفته",
    "مناسب فریلنسرها و تیم‌ها",
    "سرعت کدنویسی ۲ برابر بیشتر",
    "فعال‌سازی روی اکانت شخصی",
  ];

  const plans = [
    {
      name: "پلن ۷ روزه",
      duration: "آفر ویژه - ۷ روز",
      price: 350000,
      features: [
        "تمام امکانات Pro",
        "مناسب تست و پروژه کوتاه",
        "فعال‌سازی سریع",
        "۵۰۰ درخواست سریع",
      ],
    },
    {
      name: "پلن یک‌ماهه",
      duration: "۱ ماهه - ۲۰ دلار",
      price: 1250000,
      popular: true,
      features: [
        "دسترسی کامل به همه امکانات",
        "فعال‌سازی روی اکانت شخصی",
        "۵۰۰ درخواست سریع در ماه",
        "درخواست‌های کند نامحدود",
      ],
    },
    {
      name: "پلن Business",
      duration: "۱ ماهه - تیمی",
      price: 2500000,
      features: [
        "مناسب تیم‌ها و شرکت‌ها",
        "مدیریت مرکزی",
        "پشتیبانی اولویت‌دار",
      ],
    },
  ];

  const comparison = [
    { feature: "تکمیل خودکار کد", free: "محدود", premium: "نامحدود" },
    { feature: "مدل‌های پیشرفته (Claude, GPT-4)", free: false, premium: true },
    { feature: "درک کانتکست پروژه", free: "محدود", premium: "کامل" },
    { feature: "چت با AI", free: "محدود", premium: "نامحدود" },
    { feature: "Refactoring هوشمند", free: false, premium: true },
    { feature: "Tab Completion", free: "پایه", premium: "پیشرفته" },
    { feature: "سرعت پاسخ", free: "عادی", premium: "سریع" },
  ];

  const faqs = [
    {
      question: "Cursor چه تفاوتی با GitHub Copilot دارد؟",
      answer:
        "Cursor یک ادیتور کامل است که از ابتدا برای AI طراحی شده، در حالی که Copilot یک افزونه است. Cursor درک بهتری از کل پروژه دارد و می‌تواند با چند فایل همزمان کار کند. همچنین به مدل‌های متنوع‌تری دسترسی دارد.",
    },
    {
      question: "پلن ۷ روزه برای چه کسانی مناسب است؟",
      answer:
        "برای کسانی که می‌خواهند Cursor را تست کنند یا یک پروژه کوتاه‌مدت دارند. قیمت بسیار مناسبی دارد و تمام امکانات Pro را شامل می‌شود.",
    },
    {
      question: "آیا Extensions های VS Code کار می‌کنند؟",
      answer:
        "بله، Cursor بر پایه VS Code ساخته شده و اکثر افزونه‌های محبوب کار می‌کنند. می‌توانید تم‌ها، زبان‌ها و ابزارهای مورد علاقه‌تان را نصب کنید.",
    },
    {
      question: "تفاوت درخواست سریع و کند چیست؟",
      answer:
        "درخواست‌های سریع از مدل‌های قوی‌تر مثل Claude 3.5 Sonnet و GPT-4 استفاده می‌کنند و اولویت پاسخ‌گویی دارند. درخواست‌های کند از مدل‌های سبک‌تر استفاده می‌کنند اما همچنان قدرتمند هستند.",
    },
  ];

  // Extra content
  const extraContent = (
    <section className="py-12">
      <div className="container mx-auto px-4">
        <h2 className="text-2xl font-bold mb-8">🚀 چرا Cursor؟</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="glass rounded-2xl p-6 text-center">
            <div className="w-14 h-14 rounded-full bg-purple-500/20 flex items-center justify-center mx-auto mb-4">
              <Code className="w-7 h-7 text-purple-500" />
            </div>
            <h3 className="font-bold mb-2">کدنویسی ۲ برابر سریع‌تر</h3>
            <p className="text-muted-foreground text-sm">
              با Tab Completion هوشمند، سرعت کدنویسی‌تان دو برابر می‌شود.
            </p>
          </div>
          <div className="glass rounded-2xl p-6 text-center">
            <div className="w-14 h-14 rounded-full bg-purple-500/20 flex items-center justify-center mx-auto mb-4">
              <RefreshCw className="w-7 h-7 text-purple-500" />
            </div>
            <h3 className="font-bold mb-2">درک کل پروژه</h3>
            <p className="text-muted-foreground text-sm">
              AI کل پروژه رو می‌فهمه و پیشنهادات مرتبط میده.
            </p>
          </div>
          <div className="glass rounded-2xl p-6 text-center">
            <div className="w-14 h-14 rounded-full bg-purple-500/20 flex items-center justify-center mx-auto mb-4">
              <Zap className="w-7 h-7 text-purple-500" />
            </div>
            <h3 className="font-bold mb-2">مدل‌های متنوع</h3>
            <p className="text-muted-foreground text-sm">
              دسترسی به Claude، GPT-4 و Gemini در یک جا.
            </p>
          </div>
        </div>
      </div>
    </section>
  );

  return (
    <>
      <Helmet>
        <title>خرید اشتراک Cursor Pro | ادیتور کدنویسی AI</title>
        <meta
          name="description"
          content="خرید اشتراک Cursor Pro - ادیتور کدنویسی هوشمند با AI. تکمیل خودکار کد، رفع باگ هوشمند، دسترسی به Claude و GPT-4. مناسب برنامه‌نویسان حرفه‌ای."
        />
        <meta name="keywords" content="خرید Cursor, Cursor Pro, ادیتور کد AI, کدنویسی هوشمند, GitHub Copilot" />
      </Helmet>
      <ServicePageLayout
        icon={Code}
        title="Cursor Pro"
        subtitle="ادیتور کدنویسی هوشمند"
        description="کرسر یک ادیتور کدنویسی هوشمند است که با کمک هوش مصنوعی، سرعت کدنویسی و رفع باگ شما را چند برابر می‌کند. با دسترسی به Claude 3.5 Sonnet، GPT-4 و Gemini، بهترین مدل‌های AI را برای کدنویسی در اختیار دارید."
        color="#8B5CF6"
        features={features}
        plans={plans}
        comparison={comparison}
        faqs={faqs}
        extraContent={extraContent}
      />
    </>
  );
};

export default CursorPage;
