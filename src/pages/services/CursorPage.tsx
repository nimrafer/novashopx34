import { Code, Clock, RefreshCw, Zap, Headphones, Terminal, Cpu, GitBranch } from "lucide-react";
import ServicePageLayout from "@/components/shop/ServicePageLayout";
import { Helmet } from "react-helmet";
import { usePricesContext } from "@/contexts/PricesContext";
import { createFAQSchema, createBreadcrumbSchema, createProductSchema } from "@/components/seo/schemas";

const CursorPage = () => {
  const { getPrice } = usePricesContext();

  const features = [
    "تکمیل خودکار کد با مدل‌های قدرتمند AI",
    "دسترسی به Claude 3.5 Sonnet، GPT-4 و Gemini",
    "درک کامل کانتکست کل پروژه",
    "Tab Completion پیشرفته برای کدنویسی سریع‌تر",
    "پیشنهاد رفع باگ و بهینه‌سازی کد",
    "Refactoring هوشمند با یک کلیک",
    "چت با AI درباره کد و پروژه",
    "پشتیبانی از تمام زبان‌های برنامه‌نویسی",
    "سازگار با VS Code Extensions",
    "Composer برای تغییرات چند فایلی",
    "فعال‌سازی روی اکانت شخصی",
    "تضمین جایگزینی و پشتیبانی ۲۴ ساعته",
  ];

  const plans = [
    {
      name: "پلن Pro هفتگی",
      duration: "۱ هفته",
      price: getPrice("cursor_weekly"),
      priceKey: "cursor_weekly",
      features: [
        "دسترسی کامل به همه امکانات",
        "مناسب تست و پروژه‌های کوتاه",
        "دسترسی به Claude، GPT-4، Gemini",
      ],
    },
    {
      name: "پلن Pro ماهانه",
      duration: "۱ ماهه - ۲۰ دلار",
      price: getPrice("cursor_monthly"),
      priceKey: "cursor_monthly",
      popular: true,
      features: [
        "دسترسی کامل به همه امکانات",
        "۵۰۰ درخواست سریع در ماه",
        "درخواست‌های کند نامحدود",
        "فعال‌سازی روی اکانت شخصی",
        "دسترسی به Claude، GPT-4، Gemini",
      ],
    },
  ];

  const comparison = [
    { feature: "تکمیل خودکار کد", free: "محدود", premium: "نامحدود" },
    { feature: "مدل‌های پیشرفته (Claude, GPT-4)", free: false, premium: true },
    { feature: "درک کانتکست کل پروژه", free: "محدود", premium: "کامل" },
    { feature: "چت با AI", free: "محدود", premium: "نامحدود" },
    { feature: "Refactoring هوشمند", free: false, premium: true },
    { feature: "Tab Completion پیشرفته", free: "پایه", premium: "پیشرفته" },
    { feature: "Composer چند فایلی", free: false, premium: true },
    { feature: "سرعت پاسخ", free: "عادی", premium: "سریع" },
  ];

  const faqs = [
    {
      question: "Cursor چیست و چه تفاوتی با GitHub Copilot دارد؟",
      answer:
        "Cursor یک ادیتور کامل است که از ابتدا برای AI طراحی شده، در حالی که Copilot یک افزونه است. Cursor درک بهتری از کل پروژه دارد، می‌تواند با چند فایل همزمان کار کند و به مدل‌های متنوع‌تری (Claude, GPT-4, Gemini) دسترسی دارد.",
    },
    {
      question: "تفاوت درخواست سریع و کند چیست؟",
      answer:
        "درخواست‌های سریع از مدل‌های قوی‌تر مثل Claude 3.5 Sonnet و GPT-4 استفاده می‌کنند و اولویت پاسخ‌گویی دارند. درخواست‌های کند از مدل‌های سبک‌تر استفاده می‌کنند اما همچنان قدرتمند هستند و نامحدود هستند.",
    },
    {
      question: "آیا Extensions های VS Code کار می‌کنند؟",
      answer:
        "بله، Cursor بر پایه VS Code ساخته شده و اکثر افزونه‌های محبوب کار می‌کنند. می‌توانید تم‌ها، زبان‌ها، فرمترها و ابزارهای مورد علاقه‌تان را نصب کنید.",
    },
    {
      question: "Composer چیست؟",
      answer:
        "Composer یک قابلیت قدرتمند Cursor است که اجازه می‌دهد تغییرات را در چند فایل همزمان اعمال کنید. مثلاً می‌توانید بگویید «یک API endpoint برای کاربران بساز» و Cursor تمام فایل‌های لازم را ایجاد یا ویرایش می‌کند.",
    },
    {
      question: "چرا Cursor بهتر از کدنویسی سنتی است؟",
      answer:
        "با Cursor سرعت کدنویسی ۲ برابر یا بیشتر می‌شود. AI کد را تکمیل می‌کند، باگ‌ها را پیدا می‌کند، refactor می‌کند و حتی تست می‌نویسد. شما فقط ایده را توضیح می‌دهید و Cursor پیاده‌سازی می‌کند.",
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
              <div className="text-4xl font-bold text-purple-500 mb-2">۲x</div>
              <div className="text-lg font-semibold mb-1">سرعت کدنویسی</div>
              <p className="text-muted-foreground text-sm">با Tab Completion هوشمند</p>
            </div>
            <div className="glass rounded-2xl p-8 text-center">
              <div className="text-4xl font-bold text-purple-500 mb-2">۵۰۰</div>
              <div className="text-lg font-semibold mb-1">درخواست سریع</div>
              <p className="text-muted-foreground text-sm">Claude و GPT-4 در ماه</p>
            </div>
            <div className="glass rounded-2xl p-8 text-center">
              <div className="text-4xl font-bold text-purple-500 mb-2">∞</div>
              <div className="text-lg font-semibold mb-1">درخواست کند</div>
              <p className="text-muted-foreground text-sm">نامحدود و همیشه در دسترس</p>
            </div>
          </div>
        </div>
      </section>

      {/* What is Cursor Section */}
      <section className="py-12">
        <div className="container mx-auto px-4">
          <h2 className="text-2xl font-bold mb-6">🤖 Cursor چیست؟</h2>
          <div className="glass rounded-3xl p-8 max-w-4xl">
            <p className="text-muted-foreground leading-relaxed mb-4">
              Cursor یک ادیتور کدنویسی نسل جدید است که از ابتدا برای کار با هوش مصنوعی طراحی شده. بر پایه VS Code ساخته شده اما با قابلیت‌های AI بسیار قوی‌تر.
            </p>
            <p className="text-muted-foreground leading-relaxed mb-4">
              برخلاف GitHub Copilot که فقط یک افزونه است، Cursor کل پروژه شما را درک می‌کند و می‌تواند تغییرات هماهنگ در چند فایل همزمان انجام دهد.
            </p>
            <p className="text-muted-foreground leading-relaxed">
              با دسترسی به Claude 3.5 Sonnet، GPT-4 و Gemini، بهترین مدل‌های AI دنیا را برای کدنویسی در اختیار دارید.
            </p>
          </div>
        </div>
      </section>

      {/* Key Features Section */}
      <section className="py-12">
        <div className="container mx-auto px-4">
          <h2 className="text-2xl font-bold mb-8">🌟 قابلیت‌های کلیدی Cursor</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="glass rounded-2xl p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 rounded-xl bg-purple-500/20 flex items-center justify-center">
                  <Terminal className="w-6 h-6 text-purple-500" />
                </div>
                <h3 className="font-bold text-lg">Tab Completion</h3>
              </div>
              <p className="text-muted-foreground text-sm">
                با فشار Tab، AI کد را تکمیل می‌کند. نه فقط یک خط، بلکه بلوک‌های کامل کد با درک کانتکست.
              </p>
            </div>
            <div className="glass rounded-2xl p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 rounded-xl bg-purple-500/20 flex items-center justify-center">
                  <Cpu className="w-6 h-6 text-purple-500" />
                </div>
                <h3 className="font-bold text-lg">مدل‌های متنوع</h3>
              </div>
              <p className="text-muted-foreground text-sm">
                دسترسی به Claude 3.5 Sonnet (بهترین در کدنویسی)، GPT-4 و Gemini. هر مدل را برای کار مناسب استفاده کنید.
              </p>
            </div>
            <div className="glass rounded-2xl p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 rounded-xl bg-purple-500/20 flex items-center justify-center">
                  <GitBranch className="w-6 h-6 text-purple-500" />
                </div>
                <h3 className="font-bold text-lg">Composer</h3>
              </div>
              <p className="text-muted-foreground text-sm">
                تغییرات چند فایلی با یک دستور. بگویید چه می‌خواهید و Cursor تمام فایل‌ها را ایجاد یا ویرایش می‌کند.
              </p>
            </div>
            <div className="glass rounded-2xl p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 rounded-xl bg-purple-500/20 flex items-center justify-center">
                  <Code className="w-6 h-6 text-purple-500" />
                </div>
                <h3 className="font-bold text-lg">درک کل پروژه</h3>
              </div>
              <p className="text-muted-foreground text-sm">
                AI کل کدبیس را می‌فهمد. از توابع، کلاس‌ها و وابستگی‌ها آگاه است و پیشنهادات مرتبط می‌دهد.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Comparison with Copilot */}
      <section className="py-12">
        <div className="container mx-auto px-4">
          <h2 className="text-2xl font-bold mb-8">🔄 Cursor در مقابل GitHub Copilot</h2>
          <div className="glass rounded-3xl p-8 max-w-4xl">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className="font-bold text-lg mb-4 text-purple-500">Cursor Pro ✓</h3>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li>✅ ادیتور کامل با AI یکپارچه</li>
                  <li>✅ درک کل پروژه</li>
                  <li>✅ تغییرات چند فایلی (Composer)</li>
                  <li>✅ دسترسی به Claude, GPT-4, Gemini</li>
                  <li>✅ چت با AI درباره کد</li>
                  <li>✅ Refactoring هوشمند</li>
                </ul>
              </div>
              <div>
                <h3 className="font-bold text-lg mb-4 text-muted-foreground">GitHub Copilot</h3>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li>⚪ فقط افزونه برای ادیتور</li>
                  <li>⚪ درک محدود (فایل فعلی)</li>
                  <li>❌ تغییرات تک فایلی</li>
                  <li>⚪ فقط مدل‌های OpenAI</li>
                  <li>⚪ چت محدود</li>
                  <li>❌ Refactoring محدود</li>
                </ul>
              </div>
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
              <div className="w-16 h-16 rounded-full bg-purple-500/20 flex items-center justify-center mx-auto mb-4">
                <Headphones className="w-8 h-8 text-purple-500" />
              </div>
              <h3 className="font-bold text-lg mb-2">پشتیبانی ۲۴ ساعته</h3>
              <p className="text-muted-foreground text-sm">
                تیم پشتیبانی متخصص و همیشه در دسترس
              </p>
            </div>
            <div className="glass rounded-2xl p-6 text-center">
              <div className="w-16 h-16 rounded-full bg-purple-500/20 flex items-center justify-center mx-auto mb-4">
                <RefreshCw className="w-8 h-8 text-purple-500" />
              </div>
              <h3 className="font-bold text-lg mb-2">تضمین جایگزینی</h3>
              <p className="text-muted-foreground text-sm">
                در صورت هر مشکلی، اکانت جدید دریافت می‌کنید
              </p>
            </div>
            <div className="glass rounded-2xl p-6 text-center">
              <div className="w-16 h-16 rounded-full bg-purple-500/20 flex items-center justify-center mx-auto mb-4">
                <Zap className="w-8 h-8 text-purple-500" />
              </div>
              <h3 className="font-bold text-lg mb-2">تحویل فوری</h3>
              <p className="text-muted-foreground text-sm">
                بلافاصله پس از پرداخت، اکانت فعال می‌شود
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
                <div className="w-14 h-14 rounded-full bg-purple-500 text-background font-bold text-2xl flex items-center justify-center mx-auto mb-4">۱</div>
                <h3 className="font-bold text-lg mb-2">انتخاب پلن</h3>
                <p className="text-muted-foreground text-sm">پلن Pro یا Business را انتخاب کنید</p>
              </div>
              <div className="text-center">
                <div className="w-14 h-14 rounded-full bg-purple-500 text-background font-bold text-2xl flex items-center justify-center mx-auto mb-4">۲</div>
                <h3 className="font-bold text-lg mb-2">پیام به پشتیبانی</h3>
                <p className="text-muted-foreground text-sm">با کلیک روی ثبت سفارش به تلگرام متصل شوید</p>
              </div>
              <div className="text-center">
                <div className="w-14 h-14 rounded-full bg-purple-500 text-background font-bold text-2xl flex items-center justify-center mx-auto mb-4">۳</div>
                <h3 className="font-bold text-lg mb-2">دسترسی فوری</h3>
                <p className="text-muted-foreground text-sm">پس از پرداخت، اکانت همان لحظه فعال می‌شود</p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );

  const lowestPrice = Math.min(...plans.map(p => p.price));
  
  // Generate SEO schemas
  const faqSchema = createFAQSchema(faqs);
  const breadcrumbSchema = createBreadcrumbSchema([
    { name: "خانه", url: "/" },
    { name: "خرید Cursor Pro", url: "/services/cursor" }
  ]);
  const productSchema = createProductSchema({
    name: "اشتراک Cursor Pro",
    description: "خرید اشتراک Cursor Pro - ادیتور کدنویسی هوشمند با AI. دسترسی به Claude 3.5 Sonnet و GPT-4. سرعت کدنویسی ۲ برابر.",
    price: lowestPrice,
    url: "/services/cursor",
    image: "https://nova-ai-shop.lovable.app/logos/cursor.png",
    category: "ابزار برنامه‌نویسی",
    sku: "CURSOR-PRO",
    ratingValue: 4.9,
    reviewCount: 580
  });

  return (
    <>
      <Helmet>
        <title>خرید اشتراک Cursor Pro | ادیتور کدنویسی AI - نوا شاپ</title>
        <meta
          name="description"
          content="خرید اشتراک Cursor Pro - ادیتور کدنویسی هوشمند با AI. دسترسی به Claude 3.5 Sonnet و GPT-4. سرعت کدنویسی ۲ برابر. بهتر از GitHub Copilot."
        />
        <meta name="keywords" content="خرید Cursor, Cursor Pro, ادیتور کد AI, کدنویسی هوشمند, GitHub Copilot, Claude, GPT-4, خرید کرسور ایران" />
        <link rel="canonical" href="https://nova-ai-shop.lovable.app/services/cursor" />
        
        {/* Structured Data */}
        <script type="application/ld+json">
          {JSON.stringify([productSchema, faqSchema, breadcrumbSchema])}
        </script>
      </Helmet>
      <ServicePageLayout
        icon={Code}
        title="Cursor Pro"
        subtitle="ادیتور کدنویسی هوشمند"
        description="Cursor یک ادیتور کدنویسی نسل جدید است که از ابتدا برای کار با هوش مصنوعی طراحی شده. با دسترسی به Claude 3.5 Sonnet، GPT-4 و Gemini، سرعت کدنویسی‌تان ۲ برابر می‌شود. درک کامل کل پروژه، تغییرات چند فایلی با Composer و Tab Completion پیشرفته."
        color="#8B5CF6"
        features={features}
        plans={plans}
        comparison={comparison}
        faqs={faqs}
        extraContent={extraContent}
      />
    </>
  );
};

export default CursorPage;
