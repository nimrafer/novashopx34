import { MessageCircle } from "lucide-react";
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
  ];

  const plans = [
    {
      name: "پلن ماهانه",
      duration: "۱ ماهه - ۳۰ دلار",
      price: 1850000,
      popular: true,
      features: [
        "تمام قابلیت‌های Super Grok",
        "فعال‌سازی روی اکانت شخصی",
        "بدون محدودیت پیام",
        "دسترسی به مدل‌های پیشرفته",
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
  ];

  const faqs = [
    {
      question: "Grok چه تفاوتی با ChatGPT دارد؟",
      answer:
        "Grok ساخته xAI و ایلان ماسک است و به خاطر پاسخ‌های بی‌پرده و بدون سانسور معروف است. برخلاف ChatGPT که فیلترهای اخلاقی دارد، Grok به سوالات حساس پاسخ می‌دهد.",
    },
    {
      question: "آیا Grok واقعاً بدون سانسور است؟",
      answer:
        "بله، Grok برای پاسخ‌گویی آزادانه طراحی شده و به سوالاتی که سایر AIها رد می‌کنند پاسخ می‌دهد. البته محتوای غیرقانونی همچنان ممنوع است.",
    },
    {
      question: "Aurora چیست؟",
      answer:
        "Aurora سیستم تولید تصویر Grok است که می‌توانید با آن تصاویر متنوع بسازید، حتی تصاویری که سایر AIها تولید نمی‌کنند.",
    },
  ];

  return (
    <>
      <Helmet>
        <title>خرید اشتراک Super Grok | Nova AI Shop</title>
        <meta
          name="description"
          content="خرید اشتراک Super Grok - هوش مصنوعی بدون سانسور ایلان ماسک. پاسخ به سوالات حساس، تولید تصویر با Aurora."
        />
      </Helmet>
      <ServicePageLayout
        icon={MessageCircle}
        title="Super Grok"
        subtitle="هوش مصنوعی بدون سانسور"
        description="گروک ساخته xAI و ایلان ماسک، یکی از بی‌پرده‌ترین هوش‌های مصنوعی دنیاست! برخلاف AIهای دیگه که پشت فیلترهای اخلاقی قایم می‌شن، گروک مستقیم میره سر اصل مطلب."
        color="#FFFFFF"
        features={features}
        plans={plans}
        comparison={comparison}
        faqs={faqs}
      />
    </>
  );
};

export default GrokPage;
