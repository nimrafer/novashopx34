import { Sparkles } from "lucide-react";
import ServicePageLayout from "@/components/shop/ServicePageLayout";
import { Helmet } from "react-helmet";

const GeminiPage = () => {
  const features = [
    "یکپارچه با اکوسیستم گوگل (Gmail, Docs, Drive, Photos)",
    "۲ ترابایت فضای Google One",
    "ساخت ویدیو با Veo 3/3.1",
    "دسترسی به Gemini 2.5 Pro + Deep Research",
    "NotebookLM با سقف بالاتر",
    "Gemini Code Assist برای برنامه‌نویسان",
    "دسترسی به Google AI Studio",
    "تحلیل تصویر و ویدیو پیشرفته",
    "قابل فعال‌سازی روی Gmail شخصی",
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
        "صرفه‌جویی در هزینه",
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
      name: "یکساله جیمیل آماده",
      duration: "۱ ساله - Gmail آماده",
      price: 2590000,
      features: [
        "یک سال کامل",
        "Gmail آماده مجموعه",
        "فعال‌سازی سریع",
      ],
    },
    {
      name: "یکساله جیمیل شخصی",
      duration: "۱ ساله - Gmail شما",
      price: 2790000,
      features: [
        "یک سال کامل",
        "فعال‌سازی روی Gmail شخصی",
        "کاملاً اختصاصی",
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
    { feature: "پشتیبانی ویژه", free: false, premium: true },
  ];

  const faqs = [
    {
      question: "تفاوت Gemini با ChatGPT چیست؟",
      answer:
        "Gemini با سرویس‌های گوگل یکپارچه است و برای کسانی که زیاد از Gmail, Drive و Docs استفاده می‌کنند بهتر است. ChatGPT برای تولید محتوا و کدنویسی مستقل قوی‌تر است.",
    },
    {
      question: "آیا تخفیف دانشجویی دارید؟",
      answer:
        "بله! برای پلن یک‌ماهه ۱۵۰ هزار، پلن‌های ۳ و ۶ ماهه ۳۰۰ هزار و پلن‌های یکساله ۴۵۰ هزار تومان تخفیف داریم. برای استفاده با پشتیبانی تماس بگیرید.",
    },
    {
      question: "تفاوت Gmail آماده و شخصی چیست؟",
      answer:
        "در پلن Gmail آماده، یک اکانت Gmail از قبل ساخته شده به شما تحویل داده می‌شود. در پلن Gmail شخصی، اشتراک روی Gmail خودتان فعال می‌شود.",
    },
    {
      question: "۲ ترابایت فضا برای چیست؟",
      answer:
        "این فضا در Google Drive, Photos و Gmail قابل استفاده است و می‌توانید فایل‌ها و عکس‌هایتان را ذخیره کنید.",
    },
  ];

  return (
    <>
      <Helmet>
        <title>خرید اشتراک Gemini Pro | Nova AI Shop</title>
        <meta
          name="description"
          content="خرید اشتراک Gemini Pro گوگل با ۲ ترابایت فضای ابری. یکپارچه با Gmail, Drive و Docs. تخفیف ویژه دانشجویی."
        />
      </Helmet>
      <ServicePageLayout
        icon={Sparkles}
        title="Gemini Pro"
        subtitle="هوش مصنوعی گوگل"
        description="هوش مصنوعی گوگل با یکپارچگی کامل با سرویس‌های Google. مناسب برای کسانی که با اکوسیستم گوگل کار می‌کنند."
        color="#3B82F6"
        features={features}
        plans={plans}
        comparison={comparison}
        faqs={faqs}
      />
    </>
  );
};

export default GeminiPage;
