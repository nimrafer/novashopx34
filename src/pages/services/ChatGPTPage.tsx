import { Bot, Shield, Clock, Zap, MessageCircle, RefreshCw, Users } from "lucide-react";
import ServicePageLayout from "@/components/shop/ServicePageLayout";
import { Helmet } from "react-helmet";
import { Badge } from "@/components/ui/badge";

const ChatGPTPage = () => {
  const features = [
    "دسترسی به مدل GPT-4o (Omni) و GPT-5 برای متن و کدنویسی",
    "امکان کار با فایل‌ها (PDF, Word, Excel, تصویر و...)",
    "ساخت و ویرایش تصویر با هوش مصنوعی DALL-E 3",
    "سرعت بسیار بالا و بدون پیام ChatGPT is at capacity",
    "قابلیت‌های چندوجهی: متن، تصویر، صدا",
    "دسترسی به وب‌گردی و اطلاعات به‌روز",
    "ساخت GPT سفارشی برای نیازهای خاص",
    "مکالمه صوتی پیشرفته با AI",
    "تحلیل داده‌ها و انجام محاسبات پیچیده",
    "اولویت دسترسی در ساعات پرترافیک",
    "بدون نیاز به VPN با افزونه اختصاصی",
    "تضمین جایگزینی در صورت مشکل",
  ];

  const plans = [
    {
      name: "Plus اشتراکی",
      duration: "۱ ماهه - اقتصادی",
      price: 199000,
      features: [
        "تمام امکانات Plus",
        "اشتراکی با ۲ نفر دیگر",
        "مناسب تکالیف و کدنویسی",
      ],
      notIncluded: [
        "تاریخچه چت خصوصی نیست",
        "نامناسب برای چت‌های شخصی",
      ],
    },
    {
      name: "Plus ۳۰ روزه",
      duration: "۱ ماهه - ۲۰ دلار",
      price: 449000,
      popular: true,
      features: [
        "اشتراک کاملاً شخصی",
        "دسترسی به GPT-4o (Omni)",
        "تاریخچه چت خصوصی",
        "مناسب استفاده حرفه‌ای",
        "فعال‌سازی روی ایمیل شما",
      ],
    },
    {
      name: "Plus ۳۷ روزه",
      duration: "شخصی - ارزش بیشتر",
      price: 549000,
      features: [
        "۷ روز بیشتر از پلن ۳۰ روزه",
        "اشتراک کاملاً شخصی",
        "مناسب پروژه‌های طولانی‌تر",
      ],
    },
    {
      name: "Pro ماهانه",
      duration: "۱ ماهه - ۲۰۰ دلار",
      price: 12500000,
      features: [
        "دسترسی به O3 Pro و GPT-5",
        "بالاترین سطح قدرت استدلال",
        "مناسب محققان و شرکت‌ها",
        "بدون محدودیت مصرف",
      ],
    },
    {
      name: "تیمی Plus",
      duration: "۱ ماهه - تا ۷ نفر",
      price: 1200000,
      features: [
        "مناسب تیم‌ها و شرکت‌ها",
        "تا ۷ کاربر همزمان",
        "مدیریت تیمی",
      ],
    },
  ];

  const comparison = [
    { feature: "دسترسی به GPT-4o/5", free: false, premium: true },
    { feature: "محدودیت پیام روزانه", free: "۱۰-۲۰ پیام", premium: "نامحدود" },
    { feature: "سرعت پاسخ‌گویی", free: "پایین در اوج مصرف", premium: "همیشه سریع" },
    { feature: "پیام ChatGPT is at capacity", free: "مکرر", premium: "هرگز" },
    { feature: "کار با فایل‌ها", free: false, premium: true },
    { feature: "ساخت تصویر (DALL-E 3)", free: false, premium: true },
    { feature: "وب‌گردی و اطلاعات روز", free: false, premium: true },
    { feature: "ساخت GPT سفارشی", free: false, premium: true },
    { feature: "مکالمه صوتی", free: "محدود", premium: "کامل" },
    { feature: "تحلیل داده پیشرفته", free: false, premium: true },
  ];

  const faqs = [
    {
      question: "تفاوت پلن اشتراکی و شخصی چیست؟",
      answer:
        "در پلن اشتراکی، شما با ۲ نفر دیگر از یک اکانت استفاده می‌کنید و تاریخچه چت‌ها قابل مشاهده توسط سایرین است. این پلن برای کارهای آموزشی و تکالیف مناسب است. پلن شخصی کاملاً اختصاصی شماست و تاریخچه خصوصی دارید.",
    },
    {
      question: "آیا اشتراک روی ایمیل من فعال می‌شود؟",
      answer:
        "بله، تمام پلن‌های شخصی روی ایمیل شما فعال می‌شوند و کاملاً اختصاصی هستند. شما صاحب کامل اکانت خواهید بود.",
    },
    {
      question: "تفاوت ChatGPT Plus با Pro چیست؟",
      answer:
        "ChatGPT Plus با قیمت ۲۰ دلار، دسترسی به GPT-4o و امکانات پایه را فراهم می‌کند. ChatGPT Pro با قیمت ۲۰۰ دلار، دسترسی به O3 Pro و GPT-5 با قدرت استدلال بسیار بالا، بدون محدودیت مصرف و مناسب محققان و شرکت‌های بزرگ است.",
    },
    {
      question: "زمان تحویل چقدر است؟",
      answer: "معمولاً کمتر از ۱ ساعت پس از تأیید پرداخت، اشتراک فعال می‌شود. در بعضی موارد تحویل آنی است.",
    },
    {
      question: "آیا تضمین تعویض دارید؟",
      answer:
        "بله! اگر اکانت شما به هر دلیلی مسدود شود، فوراً یک اکانت جدید دریافت می‌کنید. ما ضمانت کامل تعویض داریم.",
    },
    {
      question: "چرا نسخه رایگان کافی نیست؟",
      answer:
        "نسخه رایگان سرعت بسیار پایین در ساعات اوج مصرف دارد، پیام‌های مکرر ChatGPT is at capacity می‌دهد، دسترسی به مدل‌های جدید مثل GPT-4o ندارد و امکاناتی مثل آپلود فایل، وب‌گردی و ساخت GPT سفارشی وجود ندارد.",
    },
  ];

  // Extra content for "Why Us" section
  const extraContent = (
    <section className="py-12">
      <div className="container mx-auto px-4">
        <h2 className="text-2xl font-bold mb-8">🏆 چرا ما؟</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <div className="glass rounded-2xl p-6 text-center">
            <div className="w-14 h-14 rounded-full bg-chatgpt/20 flex items-center justify-center mx-auto mb-4">
              <Clock className="w-7 h-7 text-chatgpt" />
            </div>
            <h3 className="font-bold mb-2">پشتیبانی ۲۴ ساعته واقعی</h3>
            <p className="text-muted-foreground text-sm">
              تیم پشتیبانی ما واقعی، متخصص و همیشه در دسترس است—نه یک ربات.
            </p>
          </div>
          <div className="glass rounded-2xl p-6 text-center">
            <div className="w-14 h-14 rounded-full bg-chatgpt/20 flex items-center justify-center mx-auto mb-4">
              <RefreshCw className="w-7 h-7 text-chatgpt" />
            </div>
            <h3 className="font-bold mb-2">تضمین جایگزینی</h3>
            <p className="text-muted-foreground text-sm">
              اگر اکانت شما مسدود شود، فوری یک اکانت جدید دریافت می‌کنید.
            </p>
          </div>
          <div className="glass rounded-2xl p-6 text-center">
            <div className="w-14 h-14 rounded-full bg-chatgpt/20 flex items-center justify-center mx-auto mb-4">
              <Zap className="w-7 h-7 text-chatgpt" />
            </div>
            <h3 className="font-bold mb-2">اتصال بدون VPN</h3>
            <p className="text-muted-foreground text-sm">
              با افزونه اختصاصی، بدون VPN و بدون دغدغه مسدود شدن، همیشه متصل باشید.
            </p>
          </div>
        </div>

        <h2 className="text-2xl font-bold mb-8">📋 مراحل خرید</h2>
        <div className="glass rounded-3xl p-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-12 h-12 rounded-full bg-chatgpt text-background font-bold text-xl flex items-center justify-center mx-auto mb-4">۱</div>
              <h3 className="font-bold mb-2">انتخاب پلن</h3>
              <p className="text-muted-foreground text-sm">پلن مناسب خود را از لیست بالا انتخاب کنید.</p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 rounded-full bg-chatgpt text-background font-bold text-xl flex items-center justify-center mx-auto mb-4">۲</div>
              <h3 className="font-bold mb-2">پیام به پشتیبانی</h3>
              <p className="text-muted-foreground text-sm">با کلیک روی دکمه ثبت سفارش، به تلگرام پشتیبانی متصل شوید.</p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 rounded-full bg-chatgpt text-background font-bold text-xl flex items-center justify-center mx-auto mb-4">۳</div>
              <h3 className="font-bold mb-2">دسترسی فوری</h3>
              <p className="text-muted-foreground text-sm">پس از پرداخت، اطلاعات اکانت همان لحظه ارسال می‌شود.</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );

  return (
    <>
      <Helmet>
        <title>خرید اشتراک ChatGPT Plus و Pro | تحویل فوری با ضمانت تعویض</title>
        <meta
          name="description"
          content="خرید اکانت ChatGPT Plus و Pro با قیمت مناسب. اکانت‌های اورجینال و اختصاصی با تحویل فوری، پشتیبانی ۲۴ ساعته و ضمانت تعویض. اتصال بدون VPN."
        />
        <meta name="keywords" content="خرید ChatGPT, اکانت ChatGPT Plus, اشتراک ChatGPT Pro, خرید GPT-4, هوش مصنوعی" />
      </Helmet>
      <ServicePageLayout
        icon={Bot}
        title="ChatGPT Plus / Pro"
        subtitle="هوش مصنوعی OpenAI"
        description="در قلب انقلاب هوش مصنوعی، ChatGPT قرار دارد؛ مدلی شگفت‌انگیز که توانایی درک، تحلیل و تولید زبان انسان را به سطحی بی‌سابقه رسانده است. از دانشجویان و برنامه‌نویسان گرفته تا تولیدکنندگان محتوا و مدیران کسب‌وکار، همگی می‌توانند از قدرت این ابزار بهره‌مند شوند."
        color="#10B981"
        features={features}
        plans={plans}
        comparison={comparison}
        faqs={faqs}
        extraContent={extraContent}
      />
    </>
  );
};

export default ChatGPTPage;
