import { Link } from "react-router-dom";
import { CheckCircle2, MessagesSquare, Clapperboard, Code2, ArrowLeft } from "lucide-react";
import SEOHead from "@/components/seo/SEOHead";
import {
  organizationSchema,
  websiteSchema,
  localBusinessSchema,
  createItemListSchema,
  createHowToSchema,
  createFAQSchema
} from "@/components/seo/schemas";
import ShopHeader from "@/components/shop/ShopHeader";
import NvHero from "@/components/shop/NvHero";
import ServicesSection from "@/components/shop/ServicesSection";
import OrderingSteps from "@/components/shop/OrderingSteps";
import ShopFooter from "@/components/shop/ShopFooter";

const Index = () => {
  // Product listing for SEO
  const productList = createItemListSchema([
    { name: "اکانت چت جی پی تی (ChatGPT) Plus", url: "/services/chatgpt", position: 1 },
    { name: "اکانت جمینای (Gemini) Pro", url: "/services/gemini", position: 2 },
    { name: "اکانت گراک (Grok)", url: "/services/grok", position: 3 },
    { name: "اکانت کرسور (Cursor) Pro", url: "/services/cursor", position: 4 },
    { name: "اکانت پرپلکسیتی (Perplexity) Pro", url: "/services/perplexity", position: 5 },
    { name: "تلگرام پریمیوم", url: "/services/telegram-premium", position: 6 },
  ]);

  // How to buy guide for SEO
  const howToBuy = createHowToSchema({
    name: "نحوه خرید اکانت هوش مصنوعی از نوا شاپ",
    description: "راهنمای گام به گام خرید اشتراک ChatGPT، Gemini و سایر سرویس‌های AI",
    steps: [
      { name: "انتخاب سرویس", text: "از لیست محصولات، سرویس مورد نظر خود را انتخاب کنید" },
      { name: "انتخاب پلن", text: "پلن مناسب با نیاز و بودجه خود را انتخاب کنید" },
      { name: "پرداخت مرکزی", text: "بدون نیاز به ورود، سفارش را ثبت کنید و مبلغ دقیق نمایش‌داده‌شده را بپردازید" },
      { name: "تأیید و فعال‌سازی", text: "سامانه مرکزی پرداخت را خودکار بررسی می‌کند و سفارش وارد مرحله تحویل می‌شود" },
    ],
    totalTime: "PT30M"
  });

  // Homepage FAQ for SEO
  const homeFAQ = createFAQSchema([
    {
      question: "چگونه می‌توانم اکانت ChatGPT بخرم؟",
      answer: "برای خرید اکانت ChatGPT وارد صفحه سرویس شوید و پلن موردنظر را انتخاب کنید. بدون نیاز به ورود، به پرداخت مرکزی نوا منتقل می‌شوید و وضعیت تأیید پرداخت همان‌جا به‌صورت خودکار نمایش داده می‌شود."
    },
    {
      question: "آیا اکانت‌های شما قانونی هستند؟",
      answer: "بله، تمامی اکانت‌های ما ۱۰۰٪ قانونی و اصلی هستند و مستقیماً از سرویس‌دهنده اصلی تهیه می‌شوند."
    },
    {
      question: "زمان تحویل اکانت چقدر است؟",
      answer: "تحویل اکانت‌ها فوری است و معمولاً در کمتر از ۱ ساعت پس از پرداخت انجام می‌شود."
    },
    {
      question: "آیا گارانتی تعویض دارید؟",
      answer: "بله، در صورت بروز هرگونه مشکل، اکانت شما فوراً تعویض می‌شود. پشتیبانی ۲۴ ساعته در خدمت شماست."
    }
  ]);

  const jsonLdSchemas = [
    organizationSchema,
    websiteSchema,
    localBusinessSchema,
    productList,
    howToBuy,
    homeFAQ,
  ];

  return (
    <>
      <SEOHead
        title="نوا شاپ | خرید چت جی پی تی (ChatGPT)، جمینای (Gemini)، گراک (Grok)"
        description="خرید اشتراک چت جی پی تی (ChatGPT) Plus/Pro-Business، جمینای (Gemini)، گراک (Grok)، کرسور (Cursor)، پرپلکسیتی (Perplexity) و سرویس‌های مکمل با تحویل فوری و پشتیبانی فارسی."
        keywords="خرید چت جی پی تی, خرید ChatGPT, اشتراک ChatGPT Pro-Business, خرید جمینای, خرید Gemini, خرید Grok, خرید Cursor, خرید Perplexity, تلگرام پریمیوم"
        canonicalUrl="/"
        ogType="website"
        jsonLd={jsonLdSchemas}
      />

      <div className="nv-scope min-h-screen">
        <ShopHeader />

        <main className="pt-20">
          <NvHero />
          <ServicesSection />
          <OrderingSteps />

          {/* SEO Content Section */}
          <section className="py-16 bg-muted/30">
            <div className="container mx-auto px-4">
              <div className="max-w-4xl mx-auto">
                <h2 className="text-2xl md:text-3xl font-black mb-8 text-center text-foreground">
                  راهنمای انتخاب و خرید اکانت‌های هوش مصنوعی
                </h2>
                <div className="space-y-6 text-muted-foreground leading-8 text-right">
                  <p>
                    در عصری که <strong className="text-foreground">هوش مصنوعی</strong> مرزهای توانمندی انسان را جابه‌جا کرده است، دسترسی بدون محدودیت به برترین ابزارها دیگر یک انتخاب نیست؛ بلکه <strong className="text-foreground">یک ضرورت</strong> است. <strong className="text-foreground">نوا شاپ</strong> با هدف حذف تحریم‌ها و موانع پرداخت ارزی، بستری امن برای <strong className="text-foreground">خرید اکانت هوش مصنوعی</strong> فراهم کرده تا کاربران ایرانی بتوانند سریع و مطمئن به سرویس‌های روز دنیا دسترسی داشته باشند.
                  </p>

                  <p>
                    برخلاف مجموعه‌های تک‌محصولی، ما یک فروشگاه <strong className="text-foreground">چندمحصولی</strong> هستیم و <strong className="text-foreground">موجودی دائمی و کامل</strong> از سرویس‌های محبوب را یکجا ارائه می‌دهیم: از <Link to="/services/chatgpt" className="text-primary hover:underline font-semibold">خرید چت جی پی تی (ChatGPT) Plus / Pro-Business</Link> برای دسترسی به مدل‌های پیشرفته OpenAI، تا <Link to="/services/grok" className="text-primary hover:underline font-semibold">خرید اشتراک گراک (Grok)</Link> برای تجربه هوش مصنوعی X. علاوه بر این، <Link to="/services/perplexity" className="text-primary hover:underline font-semibold">پرپلکسیتی پرو (Perplexity Pro)</Link> برای کارهای تحقیقاتی، <Link to="/services/cursor" className="text-primary hover:underline font-semibold">کرسور پرو (Cursor Pro)</Link> برای برنامه‌نویسی حرفه‌ای، و همچنین <Link to="/services/telegram-premium" className="text-primary hover:underline font-semibold">تلگرام پریمیوم</Link> و <Link to="/services/spotify" className="text-primary hover:underline font-semibold">اسپاتیفای پریمیوم (Spotify Premium)</Link> برای استفاده روزمره همیشه در دسترس هستند.
                  </p>

                  <p>
                    برای برنامه‌نویسان و تیم‌های فنی نیز امکان <Link to="/services/cursor" className="text-primary hover:underline font-semibold">خرید اکانت کرسور پرو (Cursor Pro)</Link> فراهم است تا سرعت کدنویسی و کیفیت خروجی چند برابر شود. اگر اکوسیستم گوگل را ترجیح می‌دهید، با <Link to="/services/gemini" className="text-primary hover:underline font-semibold">خرید جمینای (Gemini) Pro و Ultra</Link> می‌توانید از قابلیت‌های قدرتمند گوگل و <strong className="text-foreground">فضای ابری ۲ ترابایتی</strong> بهره‌مند شوید.
                  </p>

                  <p>
                    تمامی اشتراک‌ها <strong className="text-foreground">قانونی</strong>، <strong className="text-foreground">اختصاصی</strong> و با <strong className="text-foreground">تحویل آنی</strong> ارائه می‌شوند. اولویت ما <strong className="text-foreground">پایداری ۱۰۰٪</strong>، <strong className="text-foreground">پشتیبانی دائمی</strong> و <strong className="text-foreground">کیفیت تضمین‌شده</strong> است؛ تا هیچ مانعی میان شما و آینده وجود نداشته باشد.
                  </p>
                </div>

                {/* Additional SEO Keywords Section */}
                <div className="mt-12">
                  <h3 className="text-xl md:text-2xl font-black mb-6 text-center text-foreground">
                    چرا نوا شاپ؟
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {[
                      ["تحویل فوری", "اکانت شما در کمتر از ۱ ساعت فعال می‌شود"],
                      ["گارانتی تعویض", "در صورت مشکل، فوراً اکانت جدید دریافت کنید"],
                      ["پشتیبانی ۲۴/۷", "تیم پشتیبانی فوری همیشه در دسترس شماست"],
                      ["اکانت ۱۰۰٪ اصلی", "تمام اشتراک‌ها قانونی و مستقیم از سرویس‌دهنده"],
                    ].map(([title, text]) => (
                      <div key={title} className="flex items-start gap-3 rounded-2xl bg-card border border-border/70 p-5">
                        <CheckCircle2 className="w-5 h-5 text-accent shrink-0 mt-1" aria-hidden="true" />
                        <div>
                          <p className="font-bold text-foreground mb-1">{title}</p>
                          <p className="text-sm text-muted-foreground leading-7">{text}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="mt-12">
                  <h3 className="text-xl md:text-2xl font-black mb-6 text-center text-foreground">دسته‌بندی ابزارها بر اساس کاربرد</h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {[
                      {
                        to: "/categories/text-ai",
                        icon: MessagesSquare,
                        title: "چت‌بات‌ها و تولید متن",
                        text: "مناسب تولید محتوا، تحقیق و پاسخ‌گویی هوشمند",
                      },
                      {
                        to: "/categories/media-ai",
                        icon: Clapperboard,
                        title: "تولید تصویر / صدا / ویدیو",
                        text: "برای محتوای چندرسانه‌ای با Gemini Veo 3.1 و Nano Banana Pro",
                      },
                      {
                        to: "/categories/dev-ai",
                        icon: Code2,
                        title: "برنامه‌نویسی و API",
                        text: "ابزارهای توسعه با Cursor، ChatGPT، Gemini (Jules) و Claude",
                      },
                    ].map(({ to, icon: Icon, title, text }) => (
                      <Link
                        key={to}
                        to={to}
                        className="group rounded-2xl bg-card border border-border/70 p-6 transition-all duration-300 hover:border-accent/40 hover:shadow-[0_24px_48px_-32px_hsl(165_52%_33%/0.45)]"
                      >
                        <span className="w-11 h-11 rounded-xl bg-accent/10 text-accent flex items-center justify-center mb-4 transition-colors duration-300 group-hover:bg-accent group-hover:text-accent-foreground">
                          <Icon className="w-5 h-5" aria-hidden="true" />
                        </span>
                        <h4 className="font-bold text-foreground mb-2">{title}</h4>
                        <p className="text-sm text-muted-foreground leading-7 mb-4">{text}</p>
                        <span className="inline-flex items-center gap-1.5 text-sm font-semibold text-accent">
                          مشاهده ابزارها
                          <ArrowLeft className="w-4 h-4 transition-transform duration-300 group-hover:-translate-x-1" aria-hidden="true" />
                        </span>
                      </Link>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </section>
        </main>

        <ShopFooter />
      </div>
    </>
  );
};

export default Index;
