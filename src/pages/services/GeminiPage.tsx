import { Sparkles, Headphones, RefreshCw, Zap } from "lucide-react";
import { Link } from "react-router-dom";
import ServicePageLayout from "@/components/shop/ServicePageLayout";
import { Helmet } from "react-helmet";
import { usePricesContext } from "@/contexts/PricesContext";
import { createFAQSchema, createBreadcrumbSchema, createProductSchema } from "@/components/seo/schemas";

const GeminiPage = () => {
  const { getPrice } = usePricesContext();

  const features = [
    "دسترسی به نانو بنانا پرو (Nano Banana Pro) برای تولید و ادیت تصویر حرفه ای",
    "دسترسی به Veo 3.1 برای تولید ویدیو و تولید محتوای چندرسانه ای",
    "دسترسی به Flow برای ساخت صحنه های سینمایی با Veo 3.1",
    "دسترسی به Jules گوگل برای کمک در کدنویسی و تسک های توسعه",
    "دسترسی به NoteBookLLM (NotebookLM) برای خلاصه سازی و تحلیل منابع",
    "پشتیبانی از ورودی چندحالته: متن، تصویر، فایل و سناریوهای ویدیویی",
    "ادغام با سرویس های گوگل مثل Drive و Docs بر اساس پلن انتخابی",
    "تولید محتوای چندزبانه و ترجمه با کیفیت بالا",
    "تحلیل و خلاصه سازی اسناد طولانی برای کارهای آموزشی و حرفه ای",
    "برداشته شدن بخش زیادی از محدودیت های نسخه رایگان و دسترسی پایدارتر",
    "مناسب ایده پردازی، طراحی، تحقیق و تولید محتوای روزانه",
    "تحویل سریع سفارش و فعال سازی در کوتاه ترین زمان",
    "پشتیبانی فارسی برای راه اندازی و استفاده بهتر",
    "ارسال راهنمای شروع بعد از خرید",
  ];

  const plans = [
    {
      id: "gem_month",
      name: "پلن یک ماهه",
      duration: "یک ماهه",
      price: getPrice("gem_month"),
      priceKey: "gem_month",
      features: ["اکانت اختصاصی", "مناسب شروع سریع", "فعال سازی با پشتیبانی فارسی"],
    },
    {
      id: "gem_3month",
      name: "پلن سه ماهه",
      duration: "سه ماهه",
      price: getPrice("gem_3month"),
      priceKey: "gem_3month",
      popular: true,
      features: ["استفاده پایدارتر", "صرفه اقتصادی بیشتر", "مناسب کار مداوم"],
    },
    {
      id: "gem_6month",
      name: "پلن شش ماهه",
      duration: "شش ماهه",
      price: getPrice("gem_6month"),
      priceKey: "gem_6month",
      features: ["مناسب پروژه های بلندمدت", "صرفه جویی بیشتر", "پشتیبانی مستمر"],
    },
    {
      id: "gem_year_personal",
      name: "پلن یکساله (جیمیل شخصی)",
      duration: "یکساله",
      price: getPrice("gem_year_personal"),
      priceKey: "gem_year_personal",
      features: ["فعال سازی روی جیمیل شخصی", "اکانت اختصاصی", "بهترین انتخاب حرفه ای"],
    },
    {
      id: "gem_year_ready",
      name: "پلن یکساله (جیمیل آماده)",
      duration: "یکساله",
      price: getPrice("gem_year_ready"),
      priceKey: "gem_year_ready",
      features: ["تحویل سریع با جیمیل آماده", "مناسب شروع فوری", "پشتیبانی کامل"],
    },
  ];

  const comparison = [
    { feature: "نانو بنانا پرو (Nano Banana Pro)", free: "ندارد", premium: "دارد" },
    { feature: "Veo 3.1 و Flow برای ویدیو", free: "ندارد", premium: "دارد" },
    { feature: "ابزار Jules برای کدنویسی", free: "ندارد", premium: "دارد" },
    { feature: "دسترسی به NoteBookLLM (NotebookLM)", free: "محدود", premium: "کامل تر" },
    { feature: "تحلیل اسناد طولانی", free: "محدود", premium: "پیشرفته" },
    { feature: "ادغام با ابزارهای گوگل", free: "پایه", premium: "کامل تر" },
    { feature: "سطح لیمیت و سقف استفاده", free: "محدود", premium: "بسیار بالاتر" },
    { feature: "تولید تصویر و محتوای ترکیبی", free: "پایه", premium: "سطح حرفه ای" },
    { feature: "پشتیبانی خرید", free: false, premium: true },
  ];

  const faqs = [
    {
      question: "تفاوت Gemini Pro و Gemini Ultra چیست؟",
      answer:
        "Gemini Pro برای بیشتر کاربران حرفه ای کافی است و تعادل خوبی بین سرعت و کیفیت می دهد. Gemini Ultra برای سناریوهای سنگین تر و نیازهای سازمانی مناسب تر است.",
    },
    {
      question: "آیا روی جیمیل شخصی فعال می شود؟",
      answer:
        "بله. بر اساس پلن انتخابی، فعال سازی می تواند روی جیمیل شخصی شما انجام شود.",
    },
    {
      question: "این سرویس برای چه کارهایی کاربردی است؟",
      answer:
        "برای نوشتن متن، ایده پردازی، تحلیل فایل، خلاصه سازی مقاله، تولید تصویر با Nano Banana Pro، ویدیو با Veo 3.1 و Flow و همچنین کمک کدنویسی با Jules بسیار مناسب است.",
    },
    {
      question: "آیا NotebookLM، Veo 3.1 و Jules هم شامل می شود؟",
      answer:
        "بله، در پلن های پرمیوم دسترسی به NoteBookLLM (NotebookLM)، Veo 3.1، Flow و Jules لحاظ می شود. دسترسی نهایی ممکن است بر اساس منطقه و پلن شما متفاوت باشد.",
    },
    {
      question: "زمان تحویل سفارش چقدر است؟",
      answer: "سفارش شما سریع ثبت می شود و فعال سازی در کوتاه ترین زمان انجام می گردد.",
    },
  ];

  const extraContent = (
    <>
      <section className="py-12">
        <div className="container mx-auto px-4">
          <h2 className="text-2xl font-bold mb-6">این سرویس برای چه کسانی مناسب است؟</h2>
          <div className="glass rounded-3xl p-8 max-w-4xl">
            <ul className="space-y-3 text-muted-foreground leading-8">
              <li>• کاربرانی که از Gmail، Google Docs و Google Drive استفاده می کنند</li>
              <li>• طراحان و خالقان محتوا که متن، تصویر و ویدیو را ترکیب می کنند</li>
              <li>• دانشجویان و پژوهشگران برای خلاصه سازی مقالات و مستندات</li>
              <li>• برنامه نویس هایی که از Jules برای تسریع توسعه استفاده می کنند</li>
              <li>• کسب و کارهایی که به هوش مصنوعی چندحالته نیاز دارند</li>
            </ul>
          </div>
        </div>
      </section>

      <section className="py-12">
        <div className="container mx-auto px-4">
          <h2 className="text-2xl font-bold mb-8">مزیت خرید از نوا شاپ</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="glass rounded-2xl p-6 text-center">
              <div className="w-16 h-16 rounded-full bg-blue-500/20 flex items-center justify-center mx-auto mb-4">
                <Zap className="w-8 h-8 text-blue-500" />
              </div>
              <h3 className="font-bold text-lg mb-2">تحویل سریع</h3>
              <p className="text-muted-foreground text-sm">فعال سازی سفارش شما با سرعت بالا انجام می شود.</p>
            </div>
            <div className="glass rounded-2xl p-6 text-center">
              <div className="w-16 h-16 rounded-full bg-blue-500/20 flex items-center justify-center mx-auto mb-4">
                <Headphones className="w-8 h-8 text-blue-500" />
              </div>
              <h3 className="font-bold text-lg mb-2">پشتیبانی فارسی</h3>
              <p className="text-muted-foreground text-sm">از ثبت سفارش تا استفاده روزانه، پاسخگوی شما هستیم.</p>
            </div>
            <div className="glass rounded-2xl p-6 text-center">
              <div className="w-16 h-16 rounded-full bg-blue-500/20 flex items-center justify-center mx-auto mb-4">
                <RefreshCw className="w-8 h-8 text-blue-500" />
              </div>
              <h3 className="font-bold text-lg mb-2">راهنمای شروع</h3>
              <p className="text-muted-foreground text-sm">
                بعد از خرید، آموزش کوتاه استفاده را دریافت می کنید. <Link to="/support" className="text-primary hover:underline">مشاهده راهنما</Link>
              </p>
            </div>
          </div>
        </div>
      </section>
    </>
  );

  const lowestPrice = Math.min(...plans.map((p) => p.price));

  const faqSchema = createFAQSchema(faqs);
  const breadcrumbSchema = createBreadcrumbSchema([
    { name: "خانه", url: "/" },
    { name: "خرید اشتراک Gemini", url: "/services/gemini" },
  ]);
  const productSchema = createProductSchema({
    name: "خرید اشتراک Gemini",
    description:
      "خرید اشتراک Gemini Pro و Gemini Ultra با دسترسی به Nano Banana Pro، NoteBookLLM، Veo 3.1، Flow و Jules همراه با پشتیبانی فارسی و تحویل سریع.",
    price: lowestPrice,
    url: "/services/gemini",
    image: "https://nova-shop.co/logos/gemini.png",
    category: "اشتراک هوش مصنوعی",
    sku: "GEM-PRO-ULTRA",
    ratingValue: 4.8,
    reviewCount: 890,
  });

  return (
    <>
      <Helmet>
        <title>خرید اشتراک Gemini | هوش مصنوعی گوگل برای متن، تصویر و تحلیل داده + دسترسی به نانو بنانا پرو 🍌 + NoteBookLLM و Veo3.1</title>
        <meta
          name="description"
          content="خرید اشتراک Gemini با دسترسی به نانو بنانا پرو، NoteBookLLM، Veo 3.1، Flow و Jules گوگل. مناسب متن، تصویر، ویدیو، تحلیل داده و کدنویسی با پشتیبانی فارسی."
        />
        <meta
          name="keywords"
          content="خرید اشتراک Gemini, خرید اکانت Gemini, Gemini Pro, Gemini Ultra, Nano Banana Pro, NoteBookLLM, Veo 3.1, Jules"
        />
        <link rel="canonical" href="https://nova-shop.co/services/gemini" />

        <script type="application/ld+json">{JSON.stringify([productSchema, faqSchema, breadcrumbSchema])}</script>
      </Helmet>

      <ServicePageLayout
        serviceId="gemini"
        icon={Sparkles}
        logoSrc="/logos/gemini.png"
        title="خرید اشتراک Gemini | هوش مصنوعی گوگل برای متن، تصویر و تحلیل داده + دسترسی به نانو بنانا پرو 🍌 + NoteBookLLM و Veo3.1"
        subtitle="Gemini Pro / Gemini Ultra"
        description="با خرید اشتراک Gemini، از هوش مصنوعی چندحالته گوگل برای نوشتن متن، تولید تصویر، تحلیل داده، تولید ویدیو با Veo 3.1 و ساخت صحنه های سینمایی با Flow استفاده کنید. در این پلن ها دسترسی به Nano Banana Pro، NoteBookLLM (NotebookLM) و ابزار Jules گوگل برای کدنویسی نیز لحاظ شده و محدودیت های نسخه رایگان تا حد زیادی برداشته می شود."
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
