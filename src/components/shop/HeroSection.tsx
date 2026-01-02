import { Sparkles, Bot, Zap, Shield, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";

const SUPPORT_USERNAME = "Nova_AI_Support";

const HeroSection = () => {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-16">
      {/* Background Effects */}
      <div className="absolute inset-0 bg-gradient-glow opacity-50" />
      <div className="absolute top-1/4 right-1/4 w-96 h-96 bg-primary/20 rounded-full blur-3xl animate-pulse-glow" />
      <div className="absolute bottom-1/4 left-1/4 w-96 h-96 bg-gemini/20 rounded-full blur-3xl animate-pulse-glow animation-delay-300" />
      
      <div className="container mx-auto px-4 relative z-10">
        <div className="text-center max-w-4xl mx-auto">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass mb-8 animate-slide-up">
            <Sparkles className="w-4 h-4 text-primary" />
            <span className="text-sm text-muted-foreground">فروشگاه سرویس‌های هوش مصنوعی</span>
          </div>
          
          {/* Main Heading */}
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 animate-slide-up animation-delay-100 leading-tight">
            <span className="text-gradient">خرید اکانت‌های پریمیوم هوش مصنوعی</span>
            <br />
            <span className="text-foreground">با تحویل فوری</span>
          </h1>
          
          {/* Subtitle */}
          <h2 className="text-lg md:text-xl text-muted-foreground mb-10 max-w-2xl mx-auto animate-slide-up animation-delay-200 font-normal">
            ارائه اشتراک‌های قانونی و اختصاصی ChatGPT، Grok، Gemini و Cursor؛ با پشتیبانی دائمی در ایران.
          </h2>
          
          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16 animate-slide-up animation-delay-300">
            <Button
              size="lg"
              className="bg-gradient-primary hover:opacity-90 transition-opacity text-lg px-8 py-6"
              onClick={() => document.getElementById("services")?.scrollIntoView({ behavior: "smooth" })}
            >
              مشاهده قیمت و خرید اکانت‌ها
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="text-lg px-8 py-6 border-primary/50 hover:bg-primary/10"
              onClick={() => window.open(`https://t.me/${SUPPORT_USERNAME}`, "_blank")}
            >
              مشاوره رایگان
            </Button>
          </div>
          
          {/* Features */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 animate-slide-up animation-delay-400">
            <div className="glass rounded-2xl p-5 glass-hover">
              <div className="w-12 h-12 rounded-xl bg-chatgpt/20 flex items-center justify-center mx-auto mb-3">
                <Bot className="w-6 h-6 text-chatgpt" />
              </div>
              <h3 className="font-semibold mb-1">اشتراک شخصی</h3>
              <p className="text-xs text-muted-foreground">
                فعال‌سازی روی اکانت شخصی شما
              </p>
            </div>
            
            <div className="glass rounded-2xl p-5 glass-hover">
              <div className="w-12 h-12 rounded-xl bg-primary/20 flex items-center justify-center mx-auto mb-3">
                <Zap className="w-6 h-6 text-primary" />
              </div>
              <h3 className="font-semibold mb-1">تحویل سریع</h3>
              <p className="text-xs text-muted-foreground">
                فعال‌سازی در کمتر از ۱ ساعت
              </p>
            </div>
            
            <div className="glass rounded-2xl p-5 glass-hover">
              <div className="w-12 h-12 rounded-xl bg-telegram/20 flex items-center justify-center mx-auto mb-3">
                <Shield className="w-6 h-6 text-telegram" />
              </div>
              <h3 className="font-semibold mb-1">پشتیبانی دائمی</h3>
              <p className="text-xs text-muted-foreground">
                پشتیبانی تلگرامی همیشه در دسترس
              </p>
            </div>
            
            <div className="glass rounded-2xl p-5 glass-hover">
              <div className="w-12 h-12 rounded-xl bg-green-500/20 flex items-center justify-center mx-auto mb-3">
                <RefreshCw className="w-6 h-6 text-green-500" />
              </div>
              <h3 className="font-semibold mb-1">تضمین کیفیت</h3>
              <p className="text-xs text-muted-foreground">
                تعویض فوری اکانت شما در صورت بروز هرگونه مشکل
              </p>
            </div>
          </div>
        </div>
      </div>
      
      {/* Scroll Indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce">
        <div className="w-6 h-10 rounded-full border-2 border-muted-foreground/30 flex items-start justify-center p-2">
          <div className="w-1 h-2 bg-muted-foreground/50 rounded-full" />
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
