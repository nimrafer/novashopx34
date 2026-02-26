import { Bot, Headphones, RefreshCw, Zap } from "lucide-react";
import { Link } from "react-router-dom";
import ServicePageLayout from "@/components/shop/ServicePageLayout";
import { Helmet } from "react-helmet";
import { usePricesContext } from "@/contexts/PricesContext";
import { createFAQSchema, createBreadcrumbSchema, createProductSchema } from "@/components/seo/schemas";

const ChatGPTPage = () => {
  const { getPrice } = usePricesContext();

  const features = [
    "دسترسی به مدل های جدید OpenAI در چت جی پی تی (ChatGPT) برای متن، کدنویسی و تحلیل",
    "سرعت بالاتر و پایداری بیشتر نسبت به نسخه رایگان",
    "امکان نگهداری تاریخچه گفتگوها و مدیریت بهتر چت ها",
    "مناسب تولید محتوا: مقاله، کپشن، سناریوی ویدئو و ایده تبلیغاتی",
    "کمک در برنامه نویسی، دیباگ کد و یادگیری زبان های برنامه نویسی",
    "تحویل سریع سفارش و شروع فعال سازی در کوتاه ترین زمان",
    "پشتیبانی فارسی و پاسخ گویی سریع برای پیگیری سفارش",
    "ارسال راهنمای شروع استفاده بعد از خرید",
  ];

  const plans = [
    {
      id: "cgpt_pro_shared",
      name: "Pro-Business اشتراکی",
      duration: "یک ماهه",
      price: getPrice("cgpt_pro_shared"),
      priceKey: "cgpt_pro_shared",
      features: [
        "گزینه اقتصادی برای کارهای آموزشی و پروژه ای",
        "دسترسی به قابلیت های اصلی ChatGPT",
        "مناسب استفاده غیرشخصی",
      ],
      notIncluded: ["نامناسب برای گفتگوهای کاملا خصوصی"],
    },
    {
      id: "cgpt_pro_30day",
      name: "Pro-Business اختصاصی ۳۰ روزه",
      duration: "یک ماهه",
      price: getPrice("cgpt_pro_30day"),
      priceKey: "cgpt_pro_30day",
      popular: true,
      features: [
        "اکانت اختصاصی روی ایمیل شما",
        "دسترسی کامل به مدل ها و ابزارهای پیشرفته",
        "مناسب کار حرفه ای روزانه",
      ],
    },
    {
      id: "cgpt_pro_37day",
      name: "Pro-Business اختصاصی ۳۷ روزه",
      duration: "۳۷ روزه",
      price: getPrice("cgpt_pro_37day"),
      priceKey: "cgpt_pro_37day",
      features: [
        "اکانت اختصاصی",
        "مدت بیشتر برای استفاده پیوسته",
        "مناسب کاربرانی با مصرف بالا",
      ],
    },
    {
      id: "cgpt_plus_team",
      name: "Plus تیمی ۵ نفره",
      duration: "تیمی",
      price: getPrice("cgpt_plus_team"),
      priceKey: "cgpt_plus_team",
      features: [
        "مناسب تیم های کوچک",
        "مدیریت بهتر استفاده گروهی",
        "برای تولید محتوا و کار تیمی روزمره",
      ],
    },
    {
      id: "cgpt_team",
      name: "Team تیمی (۳۷ روزه)",
      duration: "تیمی",
      price: getPrice("cgpt_team"),
      priceKey: "cgpt_team",
      features: [
        "ورک اسپیس حرفه ای برای تیم",
        "پایداری بیشتر برای استفاده مداوم",
        "مناسب تیم های کسب و کاری",
      ],
    },
    {
      id: "cgpt_go_yearly",
      name: "ChatGPT GO یکساله",
      duration: "یکساله",
      price: getPrice("cgpt_go_yearly"),
      priceKey: "cgpt_go_yearly",
      features: [
        "گزینه بلندمدت و اقتصادی",
        "سقف دسترسی بالاتر از نسخه رایگان",
        "مناسب استفاده روزانه و پروژه های طولانی",
      ],
    },
  ];

  const comparison = [
    { feature: "دسترسی به مدل های پیشرفته", free: "محدود", premium: "کامل" },
    { feature: "سرعت پاسخ در ساعات شلوغ", free: "پایین تر", premium: "اولویت دار" },
    { feature: "ابزارهای تحلیل فایل", free: "محدود", premium: "پیشرفته" },
    { feature: "تولید و ویرایش محتوا", free: "پایه", premium: "حرفه ای" },
    { feature: "سقف استفاده روزانه", free: "محدود", premium: "بالاتر و پایدارتر" },
    { feature: "پایداری استفاده روزانه", free: "کمتر", premium: "بیشتر" },
    { feature: "پشتیبانی خرید", free: false, premium: true },
  ];

  const faqs = [
    {
      question: "تفاوت پلن های اختصاصی با پلن اشتراکی چیست؟",
      answer:
        "در پلن اختصاصی Pro-Business، اکانت متعلق به خود شماست و برای کار حرفه ای و شخصی مناسب تر است. پلن اشتراکی اقتصادی تر است و برای کارهای عمومی پیشنهاد می شود.",
    },
    {
      question: "این سرویس برای چه کارهایی مناسب است؟",
      answer:
        "برای تولید محتوا، برنامه نویسی، ترجمه، تحقیق، ایده سازی و بهبود متن های تبلیغاتی بسیار کاربردی است.",
    },
    {
      question: "زمان تحویل سفارش چقدر است؟",
      answer:
        "سفارش شما بلافاصله وارد صف فعال سازی می شود و در کوتاه ترین زمان تحویل می گردد.",
    },
    {
      question: "بعد از خرید راهنمای استفاده هم می دهید؟",
      answer:
        "بله. بعد از خرید، راهنمای شروع سریع و مسیر پشتیبانی فارسی در اختیار شما قرار می گیرد.",
    },
    {
      question: "اگر در فعال سازی سوال داشته باشم چه کار کنم؟",
      answer:
        "از طریق پشتیبانی فارسی سایت یا تلگرام می توانید سریع با تیم ما در ارتباط باشید.",
    },
  ];

  const extraContent = (
    <>
      <section className="py-12">
        <div className="container mx-auto px-4">
          <h2 className="text-2xl font-bold mb-6">این سرویس برای چه کسانی مناسب است؟</h2>
          <div className="glass rounded-3xl p-8 max-w-4xl">
            <ul className="space-y-3 text-muted-foreground leading-8">
              <li>• تولیدکنندگان محتوا، بلاگرها و ادمین های شبکه های اجتماعی</li>
              <li>• دانشجوها و پژوهشگرها برای خلاصه سازی و تحقیق</li>
              <li>• برنامه نویس ها برای کدنویسی سریع تر و رفع خطا</li>
              <li>• صاحبان کسب و کار برای ایده پردازی و بهبود متن های سایت و تبلیغات</li>
            </ul>
          </div>
        </div>
      </section>

      <section className="py-12">
        <div className="container mx-auto px-4">
          <h2 className="text-2xl font-bold mb-8">چرا خرید از نوا شاپ؟</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="glass rounded-2xl p-6 text-center">
              <div className="w-16 h-16 rounded-full bg-chatgpt/20 flex items-center justify-center mx-auto mb-4">
                <Zap className="w-8 h-8 text-chatgpt" />
              </div>
              <h3 className="font-bold text-lg mb-2">تحویل سریع</h3>
              <p className="text-muted-foreground text-sm">سفارش شما خودکار یا حداکثر طی چند ساعت رسیدگی می شود.</p>
            </div>
            <div className="glass rounded-2xl p-6 text-center">
              <div className="w-16 h-16 rounded-full bg-chatgpt/20 flex items-center justify-center mx-auto mb-4">
                <Headphones className="w-8 h-8 text-chatgpt" />
              </div>
              <h3 className="font-bold text-lg mb-2">پشتیبانی فارسی</h3>
              <p className="text-muted-foreground text-sm">در تمام مراحل ثبت سفارش تا فعال سازی کنار شما هستیم.</p>
            </div>
            <div className="glass rounded-2xl p-6 text-center">
              <div className="w-16 h-16 rounded-full bg-chatgpt/20 flex items-center justify-center mx-auto mb-4">
                <RefreshCw className="w-8 h-8 text-chatgpt" />
              </div>
              <h3 className="font-bold text-lg mb-2">راهنمای شروع</h3>
              <p className="text-muted-foreground text-sm">
                بعد از خرید، راهنمای استفاده سریع را دریافت می کنید. <Link to="/support" className="text-primary hover:underline">مشاهده راهنما</Link>
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
    { name: "خرید اشتراک چت جی پی تی (ChatGPT)", url: "/services/chatgpt" },
  ]);
  const productSchema = createProductSchema({
    name: "خرید اشتراک چت جی پی تی (ChatGPT)",
    description:
      "خرید اشتراک چت جی پی تی (ChatGPT) با دسترسی به پلن های Plus، Pro-Business و Team. تحویل سریع، پشتیبانی فارسی و راهنمای شروع.",
    price: lowestPrice,
    url: "/services/chatgpt",
    image: "https://nova-shop.co/logos/chatgpt.png",
    category: "اشتراک هوش مصنوعی",
    sku: "CGPT-SUBS",
    ratingValue: 4.9,
    reviewCount: 1250,
  });

  return (
    <>
      <Helmet>
        <title>خرید اشتراک چت جی پی تی (ChatGPT) | دسترسی کامل به هوش مصنوعی</title>
        <meta
          name="description"
          content="خرید اشتراک چت جی پی تی (ChatGPT) با دسترسی کامل به نسخه های حرفه ای OpenAI. مناسب تولید محتوا، برنامه نویسی و تحقیق با تحویل سریع و پشتیبانی فارسی."
        />
        <meta
          name="keywords"
          content="خرید اشتراک چت جی پی تی, خرید ChatGPT, ChatGPT Plus, ChatGPT Pro-Business, ChatGPT Team, خرید اکانت چت جی پی تی"
        />
        <link rel="canonical" href="https://nova-shop.co/services/chatgpt" />

        <script type="application/ld+json">{JSON.stringify([productSchema, faqSchema, breadcrumbSchema])}</script>
      </Helmet>

      <ServicePageLayout
        serviceId="chatgpt"
        icon={Bot}
        logoSrc="/logos/chatgpt.png"
        title="خرید اشتراک چت جی پی تی (ChatGPT) | دسترسی کامل به هوش مصنوعی"
        subtitle="ChatGPT Plus / Pro-Business / Team"
        description="با خرید اشتراک چت جی پی تی (ChatGPT)، به قدرتمندترین نسخه های هوش مصنوعی OpenAI دسترسی پیدا می کنید. این سرویس برای تولید محتوا، برنامه نویسی، ترجمه، تحقیق و ایده سازی عالی است. اکانت شما با راهنمای فارسی و پشتیبانی کامل تحویل می شود."
        color="#10A37F"
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
