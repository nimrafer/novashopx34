import { Bot } from "lucide-react";
import ServicePageLayout from "@/components/shop/ServicePageLayout";
import { Helmet } from "react-helmet";

const ChatGPTPage = () => {
  const features = [
    "دسترسی به مدل GPT-4/5 برای متن و کدنویسی",
    "امکان کار با فایل‌ها (PDF, Word, Excel, تصویر و...)",
    "ساخت و ویرایش تصویر با هوش مصنوعی DALL-E",
    "سرعت و کیفیت بالاتر نسبت به نسخه رایگان",
    "اولویت دسترسی در ساعات پرترافیک",
    "مکالمه صوتی و کار با ویدیو",
    "تحلیل داده‌ها و انجام محاسبات پیچیده",
    "بدون محدودیت روزانه پیام",
    "دسترسی به مدل‌های ویدیویی جدید",
  ];

  const plans = [
    {
      name: "Pro اشتراکی",
      duration: "۱ ماهه - فوق اقتصادی",
      price: 199000,
      features: [
        "تمام امکانات Pro",
        "اشتراکی با ۲ نفر دیگر",
        "مناسب تکالیف و کدنویسی",
      ],
      notIncluded: [
        "تاریخچه چت خصوصی نیست",
        "نامناسب برای چت‌های شخصی",
      ],
    },
    {
      name: "Pro ۳۰ روزه",
      duration: "۱ ماهه - شخصی",
      price: 449000,
      popular: true,
      features: [
        "اشتراک کاملاً شخصی",
        "فعال‌سازی روی ایمیل شما",
        "تاریخچه چت خصوصی",
        "مناسب استفاده حرفه‌ای",
      ],
    },
    {
      name: "Pro ۳۷ روزه",
      duration: "شخصی - ارزش بیشتر",
      price: 549000,
      features: [
        "۷ روز بیشتر از پلن ۳۰ روزه",
        "اشتراک کاملاً شخصی",
        "مناسب پروژه‌های طولانی‌تر",
      ],
    },
    {
      name: "Plus تیمی",
      duration: "۱ ماهه - تا ۷ نفر",
      price: 1200000,
      features: [
        "مناسب تیم‌ها و شرکت‌ها",
        "تا ۷ کاربر همزمان",
        "فعال‌سازی روی ایمیل شخصی",
        "مدیریت تیمی",
      ],
    },
    {
      name: "GO یکساله",
      duration: "۱ ساله - اقتصادی",
      price: 1730000,
      features: [
        "یک سال اشتراک",
        "صرفه‌جویی قابل توجه",
        "قوی‌تر از نسخه رایگان",
        "مناسب استفاده روزمره",
      ],
    },
  ];

  const comparison = [
    { feature: "دسترسی به GPT-4/5", free: false, premium: true },
    { feature: "محدودیت پیام روزانه", free: "۱۰-۲۰ پیام", premium: "نامحدود" },
    { feature: "کار با فایل‌ها", free: false, premium: true },
    { feature: "ساخت تصویر (DALL-E)", free: false, premium: true },
    { feature: "سرعت پاسخ‌گویی", free: "عادی", premium: "سریع" },
    { feature: "اولویت در ساعات شلوغ", free: false, premium: true },
    { feature: "مکالمه صوتی", free: "محدود", premium: "کامل" },
    { feature: "تحلیل داده پیشرفته", free: false, premium: true },
  ];

  const faqs = [
    {
      question: "تفاوت پلن اشتراکی و شخصی چیست؟",
      answer:
        "در پلن اشتراکی، شما با ۲ نفر دیگر از یک اکانت استفاده می‌کنید و تاریخچه چت‌ها قابل مشاهده توسط سایرین است. این پلن برای کارهای آموزشی و تکالیف مناسب است. پلن شخصی کاملاً اختصاصی شماست.",
    },
    {
      question: "آیا اشتراک روی ایمیل من فعال می‌شود؟",
      answer:
        "بله، تمام پلن‌های شخصی روی ایمیل شما فعال می‌شوند و کاملاً اختصاصی هستند.",
    },
    {
      question: "تفاوت ChatGPT Pro با Plus چیست؟",
      answer:
        "ChatGPT Pro نسخه کامل‌تر است و شامل دسترسی به مدل‌های ویدیویی، استدلال پیشرفته و بدون محدودیت پیام است. Plus امکانات کمتری دارد اما برای تیم‌ها مناسب است.",
    },
    {
      question: "زمان تحویل چقدر است؟",
      answer: "معمولاً کمتر از ۱ ساعت پس از تأیید پرداخت، اشتراک فعال می‌شود.",
    },
  ];

  return (
    <>
      <Helmet>
        <title>خرید اشتراک ChatGPT Pro | Nova AI Shop</title>
        <meta
          name="description"
          content="خرید اشتراک ChatGPT Pro با قیمت مناسب. پلن‌های شخصی و تیمی با پشتیبانی ۲۴ ساعته. فعال‌سازی سریع روی ایمیل شخصی."
        />
      </Helmet>
      <ServicePageLayout
        icon={Bot}
        title="ChatGPT Pro"
        subtitle="هوش مصنوعی OpenAI"
        description="قدرتمندترین هوش مصنوعی برای تولید محتوا، کدنویسی، تحلیل داده و مکالمه. با ChatGPT Pro به تمام امکانات پیشرفته دسترسی داشته باشید."
        color="#10B981"
        features={features}
        plans={plans}
        comparison={comparison}
        faqs={faqs}
      />
    </>
  );
};

export default ChatGPTPage;
