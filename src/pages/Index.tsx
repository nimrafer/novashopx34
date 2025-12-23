import { Helmet } from "react-helmet";
import ShopHeader from "@/components/shop/ShopHeader";
import HeroSection from "@/components/shop/HeroSection";
import ServicesSection from "@/components/shop/ServicesSection";
import ShopFooter from "@/components/shop/ShopFooter";

const Index = () => {
  return (
    <>
      <Helmet>
        <title>Nova AI Shop | خرید اشتراک ChatGPT، Gemini، Spotify و سرویس‌های پرمیوم</title>
        <meta
          name="description"
          content="خرید اشتراک ChatGPT Pro، Gemini Pro، Spotify Premium، Cursor Pro و ده‌ها سرویس دیگر با قیمت مناسب، تضمین کیفیت و پشتیبانی ۲۴ ساعته."
        />
        <meta
          name="keywords"
          content="خرید ChatGPT, اشتراک Gemini, Spotify Premium, Cursor Pro, VPN, شماره مجازی, تلگرام پرمیوم"
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
