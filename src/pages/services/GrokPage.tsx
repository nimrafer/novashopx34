import { MessageCircle, Clock, RefreshCw, Zap } from "lucide-react";
import ServicePageLayout from "@/components/shop/ServicePageLayout";
import { Helmet } from "react-helmet";

const GrokPage = () => {
  const features = [
    "پاسخ به سوالات حساس بدون فیلتر و سانسور",
    "دسترسی به مدل‌های Grok-3 و Grok-4 (Heavy)",
    "تولید تصویر با Aurora بدون محدودیت",
    "حالت استدلال پیشرفته (Reasoning Mode)",
    "تحلیل داده و آپلود فایل",
    "سرعت پردازش بالا در ساعات شلوغ",
    "اولویت‌بندی در صف پاسخ‌گویی",
    "مکالمه آزاد در هر موضوعی",
    "الهام از جارویس و راهنمای کهکشان",
    "دسترسی به اطلاعات لحظه‌ای X (توییتر)",
    "یک ماه اشتراک رایگان با ChatGPT",
    "تضمین جایگزینی در صورت مشکل",
  ];

  const plans = [
    {
      name: "Super Grok",
      duration: "۱ ماهه - ۳۰ دلار",
      price: 1850000,
      popular: true,
      features: [
        "تمام قابلیت‌های Super Grok",
        "فعال‌سازی روی اکانت شخصی",
        "بدون محدودیت پیام",
        "دسترسی به Grok-3 و Grok-4",
        "تولید تصویر نامحدود با Aurora",
      ],
    },
  ];

  const comparison = [
    { feature: "دسترسی به Grok-3/4", free: false, premium: true },
    { feature: "پاسخ بدون سانسور", free: "محدود", premium: "کامل" },
    { feature: "تولید تصویر با Aurora", free: "محدود", premium: "نامحدود" },
    { feature: "حالت استدلال", free: false, premium: true },
    { feature: "سرعت پاسخ", free: "عادی", premium: "سریع" },
    { feature: "آپلود فایل", free: false, premium: true },
    { feature: "اولویت پردازش", free: false, premium: true },
    { feature: "اطلاعات لحظه‌ای X", free: "محدود", premium: "کامل" },
  ];

  const faqs = [
    {
      question: "Grok چه تفاوتی با ChatGPT دارد؟",
      answer:
        "Grok ساخته xAI و ایلان ماسک است و به خاطر پاسخ‌های بی‌پرده و بدون سانسور معروف است. برخلاف ChatGPT که فیلترهای اخلاقی دارد، Grok به سوالات حساس پاسخ می‌دهد. همچنین به اطلاعات لحظه‌ای X (توییتر سابق) دسترسی دارد.",
    },
    {
      question: "آیا Grok واقعاً بدون سانسور است؟",
      answer:
        "بله، Grok برای پاسخ‌گویی آزادانه طراحی شده و به سوالاتی که سایر AIها رد می‌کنند پاسخ می‌دهد. البته محتوای کاملاً غیرقانونی همچنان ممنوع است اما فیلترهای اخلاقی بسیار کمتری دارد.",
    },
    {
      question: "Aurora چیست؟",
      answer:
        "Aurora سیستم تولید تصویر Grok است که می‌توانید با آن تصاویر متنوع بسازید، حتی تصاویری که سایر AIها مثل DALL-E تولید نمی‌کنند. محدودیت‌های کمتری نسبت به رقبا دارد.",
    },
    {
      question: "چرا یک ماه Grok رایگان با ChatGPT ارائه می‌شود؟",
      answer:
        "این یک پیشنهاد ویژه است! با خرید هر پلن ChatGPT، یک ماه اشتراک رایگان Grok هم دریافت می‌کنید تا بتوانید هر دو را مقایسه کنید.",
    },
  ];

  // Extra content
  const extraContent = (
    <section className="py-12">
      <div className="container mx-auto px-4">
        <h2 className="text-2xl font-bold mb-8">🏆 چرا Grok؟</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="glass rounded-2xl p-6 text-center">
            <div className="w-14 h-14 rounded-full bg-white/20 flex items-center justify-center mx-auto mb-4">
              <MessageCircle className="w-7 h-7 text-white" />
            </div>
            <h3 className="font-bold mb-2">بدون سانسور</h3>
            <p className="text-muted-foreground text-sm">
              پاسخ به سوالاتی که سایر AIها رد می‌کنند
            </p>
          </div>
          <div className="glass rounded-2xl p-6 text-center">
            <div className="w-14 h-14 rounded-full bg-white/20 flex items-center justify-center mx-auto mb-4">
              <RefreshCw className="w-7 h-7 text-white" />
            </div>
            <h3 className="font-bold mb-2">Aurora نامحدود</h3>
            <p className="text-muted-foreground text-sm">
              تولید تصویر بدون محدودیت‌های معمول
            </p>
          </div>
          <div className="glass rounded-2xl p-6 text-center">
            <div className="w-14 h-14 rounded-full bg-white/20 flex items-center justify-center mx-auto mb-4">
              <Zap className="w-7 h-7 text-white" />
            </div>
            <h3 className="font-bold mb-2">اطلاعات لحظه‌ای</h3>
            <p className="text-muted-foreground text-sm">
              دسترسی به آخرین اخبار و توییت‌ها از X
            </p>
          </div>
        </div>
      </div>
    </section>
  );

  return (
    <>
      <Helmet>
        <title>خرید اشتراک Super Grok | AI بدون سانسور ایلان ماسک</title>
        <meta
          name="description"
          content="خرید اشتراک Super Grok - هوش مصنوعی بدون سانسور xAI و ایلان ماسک. پاسخ به سوالات حساس، تولید تصویر با Aurora، دسترسی به اطلاعات لحظه‌ای X."
        />
        <meta name="keywords" content="خرید Grok, Super Grok, xAI, ایلان ماسک, هوش مصنوعی بدون سانسور, Aurora" />
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
