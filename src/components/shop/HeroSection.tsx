import { Sparkles, Bot, ShieldCheck, Clock3, WalletCards, BrainCircuit } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

const HeroSection = () => {
  return (
    <section className="relative overflow-hidden pt-28 pb-20">
      <div className="absolute inset-0 bg-gradient-glow opacity-70" />
      <div className="absolute -top-20 -right-16 h-72 w-72 rounded-full bg-primary/30 blur-3xl" />
      <div className="absolute -bottom-16 -left-10 h-64 w-64 rounded-full bg-accent/20 blur-3xl" />

      <div className="container mx-auto px-4 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center">
          <div className="text-right">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-secondary text-secondary-foreground border border-border mb-6">
              <Sparkles className="w-4 h-4" />
              <span className="text-sm font-medium">پلتفرم جامع اشتراک‌های هوش مصنوعی</span>
            </div>

            <h1 className="text-4xl md:text-5xl lg:text-6xl font-black leading-tight mb-5">
              خرید اشتراک AI
              <br />
              <span className="text-gradient">با طراحی ساده، سفارش سریع</span>
            </h1>

            <p className="text-lg text-muted-foreground leading-8 max-w-2xl mb-8">
              پلن‌های ChatGPT، Gemini، Grok، Perplexity، Cursor و سرویس‌های مکمل را داخل سایت ثبت سفارش کنید و وضعیت هر سفارش را از پنل کاربری پیگیری کنید.
            </p>

            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 mb-10">
              <Button
                size="lg"
                className="bg-gradient-primary text-primary-foreground hover:opacity-95 h-12 px-7"
                onClick={() => document.getElementById("services")?.scrollIntoView({ behavior: "smooth" })}
              >
                مشاهده اشتراک‌ها و قیمت
              </Button>
              <Button size="lg" variant="outline" className="h-12 px-7 border-border" asChild>
                <Link to="/support">مشاوره قبل از خرید</Link>
              </Button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="glass rounded-2xl p-4">
                <p className="text-2xl font-black text-accent">۵۰+ پلن</p>
                <p className="text-xs text-muted-foreground mt-1">تنوع کامل اشتراک‌ها</p>
              </div>
              <div className="glass rounded-2xl p-4">
                <p className="text-2xl font-black text-accent">تحویل سریع</p>
                <p className="text-xs text-muted-foreground mt-1">ورود مستقیم به صف فعال‌سازی</p>
              </div>
              <div className="glass rounded-2xl p-4">
                <p className="text-2xl font-black text-accent">پشتیبانی فوری</p>
                <p className="text-xs text-muted-foreground mt-1">پاسخگویی ساعتی و مستمر</p>
              </div>
            </div>
          </div>

          <div className="glass rounded-3xl p-6 md:p-8">
            <div className="flex items-center gap-2 mb-6">
              <BrainCircuit className="w-5 h-5 text-accent" />
              <p className="font-bold text-lg">چرا تجربه خرید در نوا شاپ بهتره؟</p>
            </div>

            <div className="space-y-3">
              <div className="rounded-2xl bg-secondary/80 border border-border p-4 flex items-start gap-3">
                <Bot className="w-5 h-5 mt-0.5 text-chatgpt" />
                <div>
                  <p className="font-semibold">دسته‌بندی واضح سرویس‌ها</p>
                  <p className="text-sm text-muted-foreground">هر سرویس صفحه اختصاصی و پلن‌های مرتب و قابل مقایسه دارد.</p>
                </div>
              </div>

              <div className="rounded-2xl bg-secondary/80 border border-border p-4 flex items-start gap-3">
                <WalletCards className="w-5 h-5 mt-0.5 text-card-gold" />
                <div>
                  <p className="font-semibold">ثبت سفارش داخل خود سایت</p>
                  <p className="text-sm text-muted-foreground">بدون مسیرهای پراکنده، سفارش مستقیم ثبت و در داشبورد ذخیره می‌شود.</p>
                </div>
              </div>

              <div className="rounded-2xl bg-secondary/80 border border-border p-4 flex items-start gap-3">
                <Clock3 className="w-5 h-5 mt-0.5 text-perplexity" />
                <div>
                  <p className="font-semibold">پیگیری مرحله‌ای سفارش</p>
                  <p className="text-sm text-muted-foreground">وضعیت سفارش (در انتظار، در حال پردازش، تکمیل) شفاف قابل مشاهده است.</p>
                </div>
              </div>

              <div className="rounded-2xl bg-secondary/80 border border-border p-4 flex items-start gap-3">
                <ShieldCheck className="w-5 h-5 mt-0.5 text-gemini" />
                <div>
                  <p className="font-semibold">پشتیبانی ۲۴/۷ ساعته در تلگرام</p>
                  <p className="text-sm text-muted-foreground">پیگیری فوری و در ارتباط بودن با کارشناسان همیشه آنلاین ما در تلگرام برای هر گونه سوال یا ابهام.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
