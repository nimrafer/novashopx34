import { Sparkles, Clock, RefreshCw, Zap } from "lucide-react";
import ServicePageLayout from "@/components/shop/ServicePageLayout";
import { Helmet } from "react-helmet";

const GeminiPage = () => {
  const features = [
    "دسترسی به Gemini 2.5 Pro + Deep Research",
    "یکپارچه با اکوسیستم گوگل (Gmail, Docs, Drive, Photos)",
    "۲ ترابایت فضای Google One",
    "ساخت ویدیو با Veo 3/3.1",
    "NotebookLM با سقف بالاتر",
    "Gemini Code Assist برای برنامه‌نویسان",
    "دسترسی به Google AI Studio",
    "تحلیل تصویر و ویدیو پیشرفته",
    "قابل فعال‌سازی روی Gmail شخصی",
    "مناسب تحقیقات دانشگاهی و محتوا",
    "پشتیبانی از زبان فارسی",
    "تضمین جایگزینی در صورت مشکل",
  ];

  const plans = [
    {
      name: "پلن یک‌ماهه",
      duration: "۱ ماهه",
      price: 649000,
      features: [
        "تمام امکانات Gemini Pro",
        "فعال‌سازی روی Gmail شما",
        "۲ ترابایت فضای ابری",
      ],
    },
    {
      name: "پلن سه‌ماهه",
      duration: "۳ ماهه",
      price: 1250000,
      popular: true,
      features: [
        "صرفه‌جویی ۶۰۰ هزار تومانی",
        "تمام امکانات Pro",
        "مناسب استفاده طولانی‌مدت",
      ],
    },
    {
      name: "پلن شش‌ماهه",
      duration: "۶ ماهه",
      price: 1630000,
      features: [
        "بهترین ارزش برای پول",
        "تمام امکانات Pro",
        "صرفه‌جویی بیشتر",
      ],
    },
    {
      name: "یکساله Gmail آماده",
      duration: "۱ ساله - Gmail آماده",
      price: 2590000,
      features: [
        "یک سال کامل",
        "Gmail آماده مجموعه",
        "فعال‌سازی سریع",
      ],
    },
    {
      name: "یکساله Gmail شخصی",
      duration: "۱ ساله - Gmail شما",
      price: 2790000,
      features: [
        "یک سال کامل",
        "فعال‌سازی روی Gmail شخصی",
        "کاملاً اختصاصی",
      ],
    },
    {
      name: "Ultra ۲۵۰ دلاری",
      duration: "مدت محدود - ویژه",
      price: 15500000,
      features: [
        "بالاترین سطح Gemini",
        "قدرت پردازش نامحدود",
        "مناسب شرکت‌ها",
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
      question: "تفاوت Gemini با ChatGPT چیست؟",
      answer:
        "Gemini جدیدترین مدل زبان بزرگ و چندوجهی گوگل است که توسط تیم دیپ‌مایند توسعه یافته و می‌تواند متن، کد، تصویر، صدا و ویدیو را به طور یکپارچه درک کند. با سرویس‌های گوگل یکپارچه است و برای کسانی که زیاد از Gmail, Drive و Docs استفاده می‌کنند بهتر است.",
    },
    {
      question: "آیا تخفیف دانشجویی دارید؟",
      answer:
        "بله! برای پلن یک‌ماهه ۱۵۰ هزار، پلن‌های ۳ و ۶ ماهه ۳۰۰ هزار و پلن‌های یکساله ۴۵۰ هزار تومان تخفیف داریم. برای استفاده با پشتیبانی تماس بگیرید.",
    },
    {
      question: "تفاوت Gmail آماده و شخصی چیست؟",
      answer:
        "در پلن Gmail آماده، یک اکانت Gmail از قبل ساخته شده به شما تحویل داده می‌شود. در پلن Gmail شخصی، اشتراک روی Gmail خودتان فعال می‌شود و کاملاً اختصاصی است.",
    },
    {
      question: "۲ ترابایت فضا برای چیست؟",
      answer:
        "این فضا در Google Drive, Photos و Gmail قابل استفاده است و می‌توانید فایل‌ها، عکس‌ها و ویدیوهایتان را ذخیره کنید. همچنین بک‌آپ گوشی هم در این فضا ذخیره می‌شود.",
    },
    {
      question: "Deep Research چیست؟",
      answer:
        "Deep Research یک قابلیت پیشرفته است که به Gemini اجازه می‌دهد تحقیقات عمیق انجام دهد، منابع متعدد را بررسی کند و گزارش جامع ارائه دهد. مناسب تحقیقات دانشگاهی و تولید محتوای تخصصی.",
    },
  ];

  // Extra content for "Why Us" section
  const extraContent = (
    <section className="py-12">
      <div className="container mx-auto px-4">
        <h2 className="text-2xl font-bold mb-8">🏆 چرا ما؟</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <div className="glass rounded-2xl p-6 text-center">
            <div className="w-14 h-14 rounded-full bg-blue-500/20 flex items-center justify-center mx-auto mb-4">
              <Clock className="w-7 h-7 text-blue-500" />
            </div>
            <h3 className="font-bold mb-2">پشتیبانی ۲۴ ساعته</h3>
            <p className="text-muted-foreground text-sm">
              تیم متخصص ما همیشه آماده پاسخگویی است.
            </p>
          </div>
          <div className="glass rounded-2xl p-6 text-center">
            <div className="w-14 h-14 rounded-full bg-blue-500/20 flex items-center justify-center mx-auto mb-4">
              <RefreshCw className="w-7 h-7 text-blue-500" />
            </div>
            <h3 className="font-bold mb-2">تضمین جایگزینی</h3>
            <p className="text-muted-foreground text-sm">
              در صورت هر مشکلی، اکانت جدید دریافت می‌کنید.
            </p>
          </div>
          <div className="glass rounded-2xl p-6 text-center">
            <div className="w-14 h-14 rounded-full bg-blue-500/20 flex items-center justify-center mx-auto mb-4">
              <Zap className="w-7 h-7 text-blue-500" />
            </div>
            <h3 className="font-bold mb-2">تحویل فوری</h3>
            <p className="text-muted-foreground text-sm">
              بلافاصله پس از پرداخت، اکانت فعال می‌شود.
            </p>
          </div>
        </div>
      </div>
    </section>
  );

  return (
    <>
      <Helmet>
        <title>خرید اشتراک Gemini Pro گوگل | ۲ ترابایت فضا + Deep Research</title>
        <meta
          name="description"
          content="خرید اشتراک Gemini Pro گوگل با ۲ ترابایت فضای ابری. یکپارچه با Gmail, Drive و Docs. ساخت ویدیو با Veo، Deep Research و تخفیف ویژه دانشجویی."
        />
        <meta name="keywords" content="خرید Gemini, اشتراک Gemini Pro, هوش مصنوعی گوگل, Google One, Deep Research" />
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
