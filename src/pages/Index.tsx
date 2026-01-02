import { Helmet } from "react-helmet";
import ShopHeader from "@/components/shop/ShopHeader";
import HeroSection from "@/components/shop/HeroSection";
import ServicesSection from "@/components/shop/ServicesSection";
import ShopFooter from "@/components/shop/ShopFooter";

const Index = () => {
  return (
    <>
      <Helmet>
        <title>خرید اکانت‌های پریمیوم هوش مصنوعی | تحویل فوری</title>
        <meta
          name="description"
          content="ارائه اشتراک‌های قانونی و اختصاصی ChatGPT، Grok، Gemini و Cursor؛ بدون قطعی و با پشتیبانی دائمی در ایران. خرید ارزان اکانت‌های AI با فعال‌سازی سریع."
        />
        <meta
          name="keywords"
          content="خرید ChatGPT, اشتراک Gemini, خرید Grok, Cursor Pro, اکانت هوش مصنوعی, خرید اکانت AI"
        />
      </Helmet>

      <div className="min-h-screen bg-background">
        <ShopHeader />
        
        <main>
          <HeroSection />
          <ServicesSection />
        </main>
        
        <ShopFooter />
      </div>
    </>
  );
};

export default Index;
