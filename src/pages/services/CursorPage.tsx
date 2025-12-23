import { Code } from "lucide-react";
import ServicePageLayout from "@/components/shop/ServicePageLayout";
import { Helmet } from "react-helmet";

const CursorPage = () => {
  const features = [
    "تکمیل خودکار کد با مدل‌های قدرتمند AI",
    "پیشنهاد رفع باگ و بهینه‌سازی",
    "پشتیبانی از زبان‌های مختلف برنامه‌نویسی",
    "درک کامل کانتکست پروژه",
    "چت با AI درباره کد",
    "Refactoring هوشمند",
    "مناسب فریلنسرها و تیم‌ها",
    "سازگار با VS Code Extensions",
    "سرعت بالا در کدنویسی",
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
      ],
    },
    {
      name: "پلن یک‌ماهه",
      duration: "۱ ماهه",
      price: 3490000,
      popular: true,
      features: [
        "دسترسی کامل به همه امکانات",
        "فعال‌سازی روی اکانت شخصی",
        "مناسب پروژه‌های جدی",
      ],
    },
  ];

  const comparison = [
    { feature: "تکمیل خودکار کد", free: "محدود", premium: "نامحدود" },
    { feature: "مدل‌های پیشرفته", free: false, premium: true },
    { feature: "درک کانتکست پروژه", free: "محدود", premium: "کامل" },
    { feature: "چت با AI", free: "محدود", premium: "نامحدود" },
    { feature: "Refactoring هوشمند", free: false, premium: true },
    { feature: "سرعت پاسخ", free: "عادی", premium: "سریع" },
  ];

  const faqs = [
    {
      question: "Cursor چه تفاوتی با GitHub Copilot دارد؟",
      answer:
        "Cursor یک ادیتور کامل است که از ابتدا برای AI طراحی شده، در حالی که Copilot یک افزونه است. Cursor درک بهتری از کل پروژه دارد.",
    },
    {
      question: "پلن ۷ روزه برای چه کسانی مناسب است؟",
      answer:
        "برای کسانی که می‌خواهند Cursor را تست کنند یا یک پروژه کوتاه‌مدت دارند. قیمت بسیار مناسبی دارد.",
    },
    {
      question: "آیا Extensions های VS Code کار می‌کنند؟",
      answer:
        "بله، Cursor بر پایه VS Code ساخته شده و اکثر افزونه‌های محبوب کار می‌کنند.",
    },
  ];

  return (
    <>
      <Helmet>
        <title>خرید اشتراک Cursor Pro | Nova AI Shop</title>
        <meta
          name="description"
          content="خرید اشتراک Cursor Pro - ادیتور کدنویسی هوشمند با AI. تکمیل خودکار کد، رفع باگ هوشمند، مناسب برنامه‌نویسان حرفه‌ای."
        />
      </Helmet>
      <ServicePageLayout
        icon={Code}
        title="Cursor Pro"
        subtitle="ادیتور کدنویسی هوشمند"
        description="کرسر یک ادیتور کدنویسی هوشمند است که با کمک هوش مصنوعی، سرعت کدنویسی و رفع باگ شما را چند برابر می‌کند."
        color="#8B5CF6"
        features={features}
        plans={plans}
        comparison={comparison}
        faqs={faqs}
      />
    </>
  );
};

export default CursorPage;
