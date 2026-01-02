import { Bot, Clock, RefreshCw, Zap, Shield, Wifi, Headphones } from "lucide-react";
import ServicePageLayout from "@/components/shop/ServicePageLayout";
import { Helmet } from "react-helmet";
import { usePricesContext } from "@/contexts/PricesContext";
import { createFAQSchema, createBreadcrumbSchema, createProductSchema } from "@/components/seo/schemas";

const ChatGPTPage = () => {
  const { getPrice, loading } = usePricesContext();

  const features = [
    "مبتنی بر مدل GPT-4o (Omni) با قابلیت‌های چندوجهی: متن، تصویر، صدا",
    "دسترسی به DALL-E 3 برای ساخت و ویرایش تصویر",
    "وب‌گردی و دسترسی به اطلاعات به‌روز اینترنت",
    "تحلیل فایل‌ها (PDF, Word, Excel, تصویر و...)",
    "سرعت بسیار بالا بدون پیام ChatGPT is at capacity",
    "ساخت GPT سفارشی برای نیازهای خاص شما",
    "مکالمه صوتی پیشرفته با هوش مصنوعی",
    "تحلیل داده‌های پیچیده و فایل‌های بزرگ",
    "اولویت دسترسی در ساعات پرترافیک",
    "اتصال بدون VPN با افزونه اختصاصی",
    "گارانتی تعویض در صورت مسدودی",
    "پشتیبانی ۲۴ ساعته واقعی (نه ربات)",
  ];

  const plans = [
    {
      name: "اکانت اشتراکی Plus",
      duration: "۱ ماهه - اقتصادی",
      price: getPrice("cgpt_pro_shared"),
      priceKey: "cgpt_pro_shared",
      features: [
        "دسترسی به GPT-4o",
        "اشتراکی با ۱-۲ نفر دیگر",
        "مناسب تکالیف و کدنویسی ساده",
      ],
      notIncluded: [
        "تاریخچه چت خصوصی نیست",
        "نامناسب برای چت‌های شخصی",
      ],
    },
    {
      name: "اکانت Plus اختصاصی ۳۰ روزه",
      duration: "۱ ماهه - ۲۰ دلار",
      price: getPrice("cgpt_pro_30day"),
      priceKey: "cgpt_pro_30day",
      popular: true,
      features: [
        "اشتراک کاملاً شخصی و اختصاصی",
        "دسترسی به GPT-4o (Omni)",
        "تمام قابلیت‌ها: DALL-E 3، وب‌گردی، تحلیل فایل",
        "تاریخچه چت کاملاً خصوصی",
        "مناسب دانشجویان، فریلنسرها، نویسندگان",
      ],
    },
    {
      name: "اکانت Plus اختصاصی ۳۷ روزه",
      duration: "۳۷ روزه - ویژه",
      price: getPrice("cgpt_pro_37day"),
      priceKey: "cgpt_pro_37day",
      features: [
        "اشتراک کاملاً شخصی و اختصاصی",
        "۷ روز اضافه‌تر!",
        "تمام قابلیت‌های Plus",
        "مناسب استفاده طولانی‌تر",
      ],
    },
    {
      name: "اکانت Plus تیمی",
      duration: "۱ ماهه - تیمی",
      price: getPrice("cgpt_plus_team"),
      priceKey: "cgpt_plus_team",
      features: [
        "مناسب تیم‌ها و شرکت‌ها",
        "مدیریت مرکزی کاربران",
        "امنیت سازمانی",
      ],
    },
    {
      name: "ChatGPT GO یکساله",
      duration: "۱ ساله - صرفه‌جویی",
      price: getPrice("cgpt_go_yearly"),
      priceKey: "cgpt_go_yearly",
      features: [
        "یک سال کامل",
        "صرفه‌جویی قابل توجه",
        "بهترین ارزش برای پول",
      ],
    },
  ];

  const comparison = [
    { feature: "دسترسی به GPT-4o", free: false, premium: true },
    { feature: "دسترسی به GPT-5 و O3 Pro", free: false, premium: "فقط Pro" },
    { feature: "محدودیت پیام روزانه", free: "۱۰-۲۰ پیام", premium: "نامحدود" },
    { feature: "سرعت پاسخ‌گویی", free: "بسیار پایین در اوج مصرف", premium: "همیشه سریع" },
    { feature: "پیام ChatGPT is at capacity", free: "مکرر", premium: "هرگز" },
    { feature: "کار با فایل‌ها", free: false, premium: true },
    { feature: "ساخت تصویر با DALL-E 3", free: false, premium: true },
    { feature: "وب‌گردی و اطلاعات روز", free: false, premium: true },
    { feature: "ساخت GPT سفارشی", free: false, premium: true },
    { feature: "مکالمه صوتی پیشرفته", free: "محدود", premium: "کامل" },
    { feature: "تحلیل داده پیشرفته", free: false, premium: true },
  ];

  const faqs = [
    {
      question: "تفاوت اکانت اشتراکی و اختصاصی چیست؟",
      answer:
        "در اکانت اشتراکی، شما با ۱-۲ نفر دیگر از یک اکانت استفاده می‌کنید و تاریخچه چت‌ها قابل مشاهده توسط سایرین است. این پلن برای کارهای آموزشی و تکالیف مناسب است. اکانت اختصاصی کاملاً متعلق به شماست و تاریخچه خصوصی دارید.",
    },
    {
      question: "چرا نسخه رایگان کافی نیست؟",
      answer:
        "نسخه رایگان سرعت بسیار پایین در ساعات اوج مصرف دارد، پیام‌های مکرر ChatGPT is at capacity می‌دهد، دسترسی به مدل‌های جدید مثل GPT-4o ندارد و امکاناتی مثل آپلود فایل، وب‌گردی و ساخت GPT سفارشی وجود ندارد. برای هر کار حرفه‌ای—از تولید محتوا تا کدنویسی—نسخه پرمیوم ضروری است.",
    },
    {
      question: "تفاوت ChatGPT Plus با Pro چیست؟",
      answer:
        "ChatGPT Plus با قیمت ۲۰ دلار ماهانه، دسترسی به GPT-4o و امکانات پایه (DALL-E 3، وب‌گردی، تحلیل فایل) را فراهم می‌کند. ChatGPT Pro با قیمت ۲۰۰ دلار، دسترسی به O3 Pro و GPT-5 با قدرت استدلال بسیار بالا، بدون محدودیت مصرف و مناسب محققان و شرکت‌های بزرگ است.",
    },
    {
      question: "زمان تحویل چقدر است؟",
      answer: "پس از پرداخت، اطلاعات اکانت همان لحظه از طریق تلگرام ارسال می‌شود. در کمتر از ۱ دقیقه وارد دنیای ChatGPT Pro می‌شوید.",
    },
    {
      question: "آیا تضمین تعویض دارید؟",
      answer:
        "بله! اگر اکانت شما به هر دلیلی مسدود شود، فوراً یک اکانت جدید دریافت می‌کنید. ما ضمانت کامل تعویض داریم.",
    },
    {
      question: "آیا به VPN نیاز دارم؟",
      answer:
        "خیر! با افزونه اختصاصی ما، بدون VPN و بدون دغدغه مسدود شدن، همیشه به ChatGPT متصل می‌شوید. اولین و تنها سرویس ایرانی با این قابلیت.",
    },
  ];

  // Extra content sections
  const extraContent = (
    <>
      {/* Stats Section */}
      <section className="py-12">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="glass rounded-2xl p-8 text-center">
              <div className="text-4xl font-bold text-chatgpt mb-2">+۱۰,۰۰۰</div>
              <div className="text-lg font-semibold mb-1">کاربر راضی</div>
              <p className="text-muted-foreground text-sm">از ابزارهای هوش مصنوعی ما استفاده می‌کنند</p>
            </div>
            <div className="glass rounded-2xl p-8 text-center">
              <div className="text-4xl font-bold text-chatgpt mb-2">۳+</div>
              <div className="text-lg font-semibold mb-1">سال تجربه</div>
              <p className="text-muted-foreground text-sm">در ارائه راهکارهای دیجیتال و هوش مصنوعی</p>
            </div>
            <div className="glass rounded-2xl p-8 text-center">
              <div className="text-4xl font-bold text-chatgpt mb-2">۱۰۰٪</div>
              <div className="text-lg font-semibold mb-1">امنیت پرداخت</div>
              <p className="text-muted-foreground text-sm">تراکنش‌های امن با پشتیبانی از همه کارت‌ها</p>
            </div>
          </div>
        </div>
      </section>

      {/* Why Premium Section */}
      <section className="py-12">
        <div className="container mx-auto px-4">
          <h2 className="text-2xl font-bold mb-4">❌ چرا نسخه رایگان کافی نیست؟</h2>
          <p className="text-muted-foreground mb-8 max-w-3xl">
            نسخه رایگان ChatGPT برای آشنایی اولیه خوب است، اما برای استفاده حرفه‌ای محدودیت‌های جدی دارد:
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-4xl">
            <div className="glass rounded-xl p-4 flex items-center gap-3">
              <span className="text-red-500 text-xl">✗</span>
              <span>سرعت بسیار پایین در ساعات اوج مصرف</span>
            </div>
            <div className="glass rounded-xl p-4 flex items-center gap-3">
              <span className="text-red-500 text-xl">✗</span>
              <span>پیام‌های مکرر ChatGPT is at capacity</span>
            </div>
            <div className="glass rounded-xl p-4 flex items-center gap-3">
              <span className="text-red-500 text-xl">✗</span>
              <span>عدم دسترسی به مدل‌های جدید مثل GPT-4o</span>
            </div>
            <div className="glass rounded-xl p-4 flex items-center gap-3">
              <span className="text-red-500 text-xl">✗</span>
              <span>نبود امکاناتی مثل آپلود فایل، وب‌گردی، ساخت GPT سفارشی</span>
            </div>
          </div>
        </div>
      </section>

      {/* Plan Types Section */}
      <section className="py-12">
        <div className="container mx-auto px-4">
          <h2 className="text-2xl font-bold mb-8">📊 معرفی پلن‌های ChatGPT</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="glass rounded-2xl p-6 border-t-4 border-blue-500">
              <h3 className="text-xl font-bold mb-3 text-blue-500">🔵 ChatGPT Plus (4o)</h3>
              <p className="text-sm text-muted-foreground mb-4">بهترین انتخاب اقتصادی و پرفروش‌ترین پلن</p>
              <ul className="space-y-2 text-sm">
                <li>• مبتنی بر مدل GPT-4o (Omni)</li>
                <li>• سرعت بسیار بالا</li>
                <li>• قابلیت‌های چندوجهی: متن، تصویر، صدا</li>
                <li>• دسترسی به DALL-E 3، وب‌گردی، تحلیل فایل</li>
                <li>• مناسب دانشجویان، فریلنسرها، نویسندگان</li>
              </ul>
            </div>
            <div className="glass rounded-2xl p-6 border-t-4 border-blue-400">
              <h3 className="text-xl font-bold mb-3 text-blue-400">🔵 ChatGPT 4.5</h3>
              <p className="text-sm text-muted-foreground mb-4">انتخاب میانی برای حرفه‌ای‌ها</p>
              <ul className="space-y-2 text-sm">
                <li>• نسخه تقویت‌شده و سریع‌تر از GPT-4o</li>
                <li>• مناسب برنامه‌نویسان و تحلیل‌گران</li>
                <li>• تحلیل داده‌های پیچیده و فایل‌های بزرگ</li>
                <li>• محدودیت‌های استفاده بسیار بالاتر</li>
                <li>• ایده‌آل برای افرادی که بهره‌وری مهم است</li>
              </ul>
            </div>
            <div className="glass rounded-2xl p-6 border-t-4 border-purple-500">
              <h3 className="text-xl font-bold mb-3 text-purple-500">🟣 ChatGPT 5 / Pro</h3>
              <p className="text-sm text-muted-foreground mb-4">پرچمدار و قدرتمندترین پلن</p>
              <ul className="space-y-2 text-sm">
                <li>• بالاترین سطح مدل GPT-5 و O3 Pro</li>
                <li>• مناسب شرکت‌ها، محققان، دانشمندان داده</li>
                <li>• قدرت استدلال و خلاقیت بسیار بالا</li>
                <li>• بهترین گزینه برای پروژه‌های سنگین</li>
                <li>• بالاترین سطح امکانات + بدون محدودیت</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Why Us Section */}
      <section className="py-12">
        <div className="container mx-auto px-4">
          <h2 className="text-2xl font-bold mb-8">🏆 چرا ما بهترین انتخاب هستیم؟</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="glass rounded-2xl p-6 text-center">
              <div className="w-16 h-16 rounded-full bg-chatgpt/20 flex items-center justify-center mx-auto mb-4">
                <Headphones className="w-8 h-8 text-chatgpt" />
              </div>
              <h3 className="font-bold text-lg mb-2">پشتیبانی ۲۴ ساعته واقعی</h3>
              <p className="text-muted-foreground text-sm">
                تیم پشتیبانی ما واقعی، متخصص و همیشه در دسترس است—نه یک ربات.
              </p>
            </div>
            <div className="glass rounded-2xl p-6 text-center">
              <div className="w-16 h-16 rounded-full bg-chatgpt/20 flex items-center justify-center mx-auto mb-4">
                <RefreshCw className="w-8 h-8 text-chatgpt" />
              </div>
              <h3 className="font-bold text-lg mb-2">تضمین جایگزینی اکانت</h3>
              <p className="text-muted-foreground text-sm">
                اگر اکانت شما مسدود شود، فوری یک اکانت جدید دریافت می‌کنید.
              </p>
            </div>
            <div className="glass rounded-2xl p-6 text-center">
              <div className="w-16 h-16 rounded-full bg-chatgpt/20 flex items-center justify-center mx-auto mb-4">
                <Wifi className="w-8 h-8 text-chatgpt" />
              </div>
              <h3 className="font-bold text-lg mb-2">اتصال بدون VPN</h3>
              <p className="text-muted-foreground text-sm">
                اولین و تنها سرویس ایرانی با افزونه اختصاصی برای اتصال مستقیم بدون نیاز به VPN.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* How to Buy Section */}
      <section className="py-12">
        <div className="container mx-auto px-4">
          <h2 className="text-2xl font-bold mb-8">📋 نحوه خرید در ۳ مرحله</h2>
          <div className="glass rounded-3xl p-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="text-center">
                <div className="w-14 h-14 rounded-full bg-chatgpt text-background font-bold text-2xl flex items-center justify-center mx-auto mb-4">۱</div>
                <h3 className="font-bold text-lg mb-2">انتخاب پلن</h3>
                <p className="text-muted-foreground text-sm">پلن مناسب خود را از لیست محصولات انتخاب کنید.</p>
              </div>
              <div className="text-center">
                <div className="w-14 h-14 rounded-full bg-chatgpt text-background font-bold text-2xl flex items-center justify-center mx-auto mb-4">۲</div>
                <h3 className="font-bold text-lg mb-2">پیام به پشتیبانی</h3>
                <p className="text-muted-foreground text-sm">با کلیک روی دکمه ثبت سفارش، به تلگرام پشتیبانی متصل شوید.</p>
              </div>
              <div className="text-center">
                <div className="w-14 h-14 rounded-full bg-chatgpt text-background font-bold text-2xl flex items-center justify-center mx-auto mb-4">۳</div>
                <h3 className="font-bold text-lg mb-2">دسترسی فوری</h3>
                <p className="text-muted-foreground text-sm">پس از پرداخت، اطلاعات اکانت همان لحظه ارسال می‌شود.</p>
              </div>
            </div>
            <p className="text-center text-muted-foreground mt-8">
              و تمام — در کمتر از ۱ دقیقه وارد دنیای ChatGPT Pro می‌شوید! 🚀
            </p>
          </div>
        </div>
      </section>

      {/* Investment Note */}
      <section className="py-12">
        <div className="container mx-auto px-4">
          <div className="glass rounded-3xl p-8 text-center max-w-3xl mx-auto" style={{ background: "linear-gradient(135deg, rgba(16, 185, 129, 0.1) 0%, transparent 50%)" }}>
            <h3 className="text-xl font-bold mb-4">💰 سرمایه‌گذاری هوشمند</h3>
            <p className="text-muted-foreground">
              سرمایه‌گذاری روی ChatGPT صرفاً یک هزینه نیست—بلکه چندین برابر با صرفه‌جویی زمان و افزایش کیفیت خروجی برمی‌گردد.
              از دانشجویان و برنامه‌نویسان گرفته تا تولیدکنندگان محتوا و مدیران کسب‌وکار، همگی می‌توانند از قدرت این ابزار بهره‌مند شوند.
            </p>
          </div>
        </div>
      </section>
    </>
  );

  // Get the lowest price for schema
  const lowestPrice = Math.min(...plans.map(p => p.price));
  
  // Generate SEO schemas
  const faqSchema = createFAQSchema(faqs);
  const breadcrumbSchema = createBreadcrumbSchema([
    { name: "خانه", url: "/" },
    { name: "خرید ChatGPT", url: "/services/chatgpt" }
  ]);
  const productSchema = createProductSchema({
    name: "اکانت ChatGPT Plus و Pro",
    description: "خرید اکانت ChatGPT Plus و Pro با تحویل فوری، اتصال بدون VPN و ضمانت تعویض. دسترسی به GPT-4o، GPT-5 و O3 Pro.",
    price: lowestPrice,
    url: "/services/chatgpt",
    image: "https://nova-ai-shop.lovable.app/logos/chatgpt.png",
    category: "اشتراک هوش مصنوعی",
    sku: "CGPT-PLUS",
    ratingValue: 4.9,
    reviewCount: 1250
  });

  return (
    <>
      <Helmet>
        <title>خرید اکانت ChatGPT Plus و Pro | تحویل فوری - نوا شاپ</title>
        <meta
          name="description"
          content="خرید اکانت ChatGPT Plus و Pro با قیمت مناسب. اکانت اورجینال با تحویل فوری، پشتیبانی ۲۴ ساعته، ضمانت تعویض و اتصال بدون VPN. GPT-4o و GPT-5"
        />
        <meta name="keywords" content="خرید ChatGPT, اکانت ChatGPT Plus, اشتراک ChatGPT Pro, خرید GPT-4, خرید GPT-5, هوش مصنوعی, O3 Pro, خرید اکانت ChatGPT ایران" />
        <link rel="canonical" href="https://nova-ai-shop.lovable.app/services/chatgpt" />
        
        {/* Structured Data */}
        <script type="application/ld+json">
          {JSON.stringify([productSchema, faqSchema, breadcrumbSchema])}
        </script>
      </Helmet>
      <ServicePageLayout
        icon={Bot}
        title="ChatGPT Plus / Pro"
        subtitle="هوش مصنوعی OpenAI"
        description="ChatGPT پیشرفته‌ترین هوش مصنوعی OpenAI است که با مدل‌های GPT-4o، GPT-5 و O3 Pro می‌تواند متن بنویسد، کد تولید کند، تصویر بسازد و به سوالات پیچیده پاسخ دهد. با نسخه Plus و Pro، سرعت بالا، بدون محدودیت و با تمام قابلیت‌ها."
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
