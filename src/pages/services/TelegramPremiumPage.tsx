import { Star } from "lucide-react";
import ServicePageLayout from "@/components/shop/ServicePageLayout";
import { Helmet } from "react-helmet";

const TelegramPremiumPage = () => {
  const features = [
    "بدون تبلیغات در کانال‌ها",
    "آپلود فایل تا ۴ گیگابایت",
    "دانلود با سرعت بیشتر",
    "تبدیل صوت به متن (Voice-to-Text)",
    "استیکرهای پرمیوم انحصاری",
    "ایموجی‌های متحرک در متن",
    "پروفایل متحرک (ویدیویی)",
    "نشان پرمیوم ⭐ کنار اسم",
    "ترجمه آنی پیام‌ها",
    "دنبال کردن تا ۱۰۰۰ کانال",
  ];

  const plans = [
    {
      name: "پلن ۳ ماهه",
      duration: "۳ ماهه",
      price: 1730000,
      features: [
        "تمام امکانات Premium",
        "فعال‌سازی گیفت (بدون لاگین)",
        "فقط آیدی تلگرام لازم است",
      ],
    },
    {
      name: "پلن ۶ ماهه",
      duration: "۶ ماهه",
      price: 2230000,
      popular: true,
      features: [
        "صرفه‌جویی قابل توجه",
        "تمام امکانات Premium",
        "بهترین انتخاب",
      ],
    },
    {
      name: "پلن یکساله",
      duration: "۱ ساله - بهترین قیمت",
      price: 3900000,
      features: [
        "اقتصادی‌ترین انتخاب",
        "معادل ماهانه ~۳۲۵ هزار تومان",
        "یک سال بدون دغدغه",
      ],
    },
  ];

  const comparison = [
    { feature: "تبلیغات در کانال‌ها", free: "دارد", premium: "ندارد" },
    { feature: "حداکثر آپلود", free: "۲ گیگ", premium: "۴ گیگ" },
    { feature: "سرعت دانلود", free: "عادی", premium: "سریع‌تر" },
    { feature: "Voice-to-Text", free: false, premium: true },
    { feature: "استیکر پرمیوم", free: false, premium: true },
    { feature: "نشان پرمیوم", free: false, premium: true },
    { feature: "ترجمه پیام", free: false, premium: true },
    { feature: "پروفایل ویدیویی", free: false, premium: true },
  ];

  const faqs = [
    {
      question: "فعال‌سازی چگونه انجام می‌شود؟",
      answer:
        "فعال‌سازی به صورت گیفت (هدیه) انجام می‌شود. نیازی به لاگین به اکانت شما نیست! فقط آیدی تلگرام خود را بفرستید و در کمتر از ۵ دقیقه فعال می‌شود.",
    },
    {
      question: "آیا اکانت من امن است؟",
      answer:
        "بله، چون به صورت گیفت فعال می‌شود و ما هیچ دسترسی به اکانت شما نداریم.",
    },
    {
      question: "تخفیف برای خرید استارز دارید؟",
      answer:
        "برای خرید استارز تلگرام با پشتیبانی تماس بگیرید تا قیمت و موجودی را اعلام کنیم.",
    },
  ];

  return (
    <>
      <Helmet>
        <title>خرید تلگرام پرمیوم | Nova AI Shop</title>
        <meta
          name="description"
          content="خرید تلگرام پرمیوم با فعال‌سازی گیفت. بدون نیاز به لاگین، بدون تبلیغات، آپلود ۴ گیگ، استیکر پرمیوم."
        />
      </Helmet>
      <ServicePageLayout
        icon={Star}
        title="تلگرام پرمیوم"
        subtitle="ارتقای حساب کاربری"
        description="تلگرام پرمیوم مجموعه‌ای از امکانات ویژه و انحصاری است که تجربه استفاده از تلگرام را برای شما متحول می‌کند!"
        color="#0088CC"
        features={features}
        plans={plans}
        comparison={comparison}
        faqs={faqs}
      />
    </>
  );
};

export default TelegramPremiumPage;
