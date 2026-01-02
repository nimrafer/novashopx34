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
                <p className="text-muted-foreground leading-8 text-justify">
                  امروزه استفاده از ابزارهای <strong className="text-foreground">هوش مصنوعی</strong> به یک ضرورت تبدیل شده است. ما در این مجموعه، بستر <strong className="text-foreground">خرید اکانت هوش مصنوعی</strong> را به صورت کاملاً قانونی فراهم کرده‌ایم. اگر به دنبال <strong className="text-foreground">خرید اکانت ChatGPT Plus</strong> برای دسترسی به آخرین مدل‌های OpenAI هستید یا قصد <strong className="text-foreground">خرید اشتراک Grok</strong> (هوش مصنوعی X) را دارید، تمامی این سرویس‌ها با <strong className="text-foreground">تحویل فوری</strong> و ضمانت پایداری ارائه می‌شوند. همچنین برای برنامه‌نویسان حرفه‌ای، امکان <strong className="text-foreground">خرید اکانت Cursor Pro</strong> فراهم شده است. اولویت ما ارائه <strong className="text-foreground">پایین‌ترین قیمت</strong> در کنار <strong className="text-foreground">پشتیبانی دائمی</strong> است تا کاربران ایرانی بدون محدودیت از پتانسیل هوش مصنوعی بهره‌مند شوند.
                </p>
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
