import SEOHead from "@/components/seo/SEOHead";
import { organizationSchema, websiteSchema, localBusinessSchema } from "@/components/seo/schemas";
import ShopHeader from "@/components/shop/ShopHeader";
import HeroSection from "@/components/shop/HeroSection";
import ServicesSection from "@/components/shop/ServicesSection";
import ShopFooter from "@/components/shop/ShopFooter";

const Index = () => {
  const jsonLdSchemas = [
    organizationSchema,
    websiteSchema,
    localBusinessSchema,
  ];

  return (
    <>
      <SEOHead
        title="خرید اکانت‌های پریمیوم هوش مصنوعی | تحویل فوری - Nova AI Shop"
        description="ارائه اشتراک‌های قانونی و اختصاصی ChatGPT، Grok، Gemini و Cursor؛ بدون قطعی و با پشتیبانی دائمی در ایران. خرید ارزان اکانت‌های AI با فعال‌سازی سریع."
        keywords="خرید ChatGPT, اشتراک Gemini, خرید Grok, Cursor Pro, اکانت هوش مصنوعی, خرید اکانت AI, خرید اکانت ChatGPT Plus, اشتراک هوش مصنوعی"
        canonicalUrl="/"
        ogType="website"
        jsonLd={jsonLdSchemas}
      />

      <div className="min-h-screen bg-background">
        <ShopHeader />
        
        <main>
          <HeroSection />
          <ServicesSection />
          
          {/* SEO Section */}
          <section className="py-16 bg-muted/30">
            <div className="container mx-auto px-4">
              <div className="max-w-4xl mx-auto">
                <h2 className="text-2xl font-bold mb-6 text-center">
                  راهنمای انتخاب و خرید اکانت‌های هوش مصنوعی
                </h2>
                <div className="space-y-6 text-muted-foreground leading-8 text-justify">
                  <p>
                    در عصری که <strong className="text-foreground">هوش مصنوعی</strong> مرزهای توانمندی انسان را جابه‌جا کرده است، دسترسی بدون محدودیت به برترین ابزارها دیگر یک انتخاب نیست؛ بلکه <strong className="text-foreground">یک ضرورت</strong> است. <strong className="text-foreground">نوا شاپ</strong> با هدف حذف تحریم‌ها و موانع پرداخت ارزی، بستری امن برای <strong className="text-foreground">خرید اکانت هوش مصنوعی</strong> فراهم کرده تا کاربران ایرانی بتوانند سریع و مطمئن به سرویس‌های روز دنیا دسترسی داشته باشند.
                  </p>

                  <p>
                    برخلاف مجموعه‌های تک‌محصولی، ما یک فروشگاه <strong className="text-foreground">چندمحصولی</strong> هستیم و <strong className="text-foreground">موجودی دائمی و کامل</strong> از سرویس‌های محبوب را یکجا ارائه می‌دهیم: از <strong className="text-foreground">خرید اکانت ChatGPT Plus</strong> برای دسترسی به مدل‌های پیشرفته OpenAI، تا <strong className="text-foreground">خرید اشتراک Grok AI</strong> برای تجربه هوش مصنوعی X. علاوه بر این، <strong className="text-foreground">Claude Pro</strong> و <strong className="text-foreground">Perplexity Pro</strong> برای کارهای تحقیقاتی، و همچنین <strong className="text-foreground">تلگرام پریمیوم</strong> و <strong className="text-foreground">Spotify Premium</strong> برای استفاده روزمره همیشه در دسترس هستند.
                  </p>

                  <p>
                    برای برنامه‌نویسان و تیم‌های فنی نیز امکان <strong className="text-foreground">خرید اکانت Cursor Pro</strong> فراهم است تا سرعت کدنویسی و کیفیت خروجی چند برابر شود. اگر اکوسیستم گوگل را ترجیح می‌دهید، با <strong className="text-foreground">خرید Gemini Advanced</strong> می‌توانید از قابلیت‌های قدرتمند گوگل و <strong className="text-foreground">فضای ابری ۲ ترابایتی</strong> بهره‌مند شوید.
                  </p>

                  <p>
                    تمامی اشتراک‌ها <strong className="text-foreground">قانونی</strong>، <strong className="text-foreground">اختصاصی</strong> و با <strong className="text-foreground">تحویل آنی</strong> ارائه می‌شوند. اولویت ما <strong className="text-foreground">پایداری ۱۰۰٪</strong>، <strong className="text-foreground">پشتیبانی دائمی</strong> و ارائه <strong className="text-foreground">پایین‌ترین قیمت</strong> است؛ تا هیچ مانعی میان شما و آینده وجود نداشته باشد.
                  </p>
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
