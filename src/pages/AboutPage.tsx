import { Building2, Send, ShieldCheck } from "lucide-react";
import ShopHeader from "@/components/shop/ShopHeader";
import ShopFooter from "@/components/shop/ShopFooter";
import SEOHead from "@/components/seo/SEOHead";
import supportImage from "@/assets/telegram-support.jpg";
import { CHANNEL_TELEGRAM_URL, CHANNEL_USERNAME, SUPPORT_TELEGRAM_URL, SUPPORT_USERNAME } from "@/constants/support";

const AboutPage = () => {
  return (
    <>
      <SEOHead
        title="درباره ما | نوا شاپ"
        description="درباره مجموعه Nova AI Shop و اطلاعات کامل تماس، آدرس، پشتیبانی تلگرام و راه‌های ارتباطی."
        keywords="درباره ما نوا شاپ, تماس نوا شاپ, آدرس نوا شاپ"
        canonicalUrl="/about"
      />

      <div className="min-h-screen bg-background">
        <ShopHeader />

        <main className="pt-24 pb-16">
          <div className="container mx-auto px-4">
            <div className="text-center mb-10">
              <h1 className="text-3xl md:text-5xl font-black mb-3">درباره نوا شاپ</h1>
              <p className="text-muted-foreground max-w-2xl mx-auto">
                نوا شاپ مرجع تخصصی خرید اشتراک سرویس های هوش مصنوعی برای کاربران فارسی زبان است.
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 max-w-6xl mx-auto mb-6">
              <div className="glass rounded-3xl p-6 md:p-8">
                <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
                  <Building2 className="w-6 h-6 text-primary" />
                  اطلاعات مجموعه
                </h2>

                <div className="space-y-4">
                  <div className="rounded-2xl border border-border/70 p-4 bg-card/40">
                    <p className="text-xs text-muted-foreground mb-1">ایمیل</p>
                    <p className="font-bold" dir="ltr">admin@nova-shop.co</p>
                  </div>

                  <div className="rounded-2xl border border-border/70 p-4 bg-card/40">
                    <p className="text-xs text-muted-foreground mb-1">تلفن تماس</p>
                    <p className="font-bold" dir="ltr">+98 999 970 8896</p>
                  </div>

                  <div className="rounded-2xl border border-border/70 p-4 bg-card/40">
                    <p className="text-xs text-muted-foreground mb-1">کانال تلگرام</p>
                    <a
                      href={CHANNEL_TELEGRAM_URL}
                      target="_blank"
                      rel="noreferrer"
                      className="font-bold inline-flex items-center gap-2 hover:text-primary"
                      dir="ltr"
                    >
                      <Send className="w-4 h-4 text-[#0088cc]" />
                      @{CHANNEL_USERNAME}
                    </a>
                  </div>

                  <div className="rounded-2xl border border-border/70 p-4 bg-card/40">
                    <p className="text-xs text-muted-foreground mb-1">پشتیبانی تلگرام</p>
                    <a
                      href={SUPPORT_TELEGRAM_URL}
                      target="_blank"
                      rel="noreferrer"
                      className="font-bold hover:text-primary"
                      dir="ltr"
                    >
                      @{SUPPORT_USERNAME}
                    </a>
                  </div>

                  <div className="rounded-2xl border border-border/70 p-4 bg-card/40">
                    <p className="text-xs text-muted-foreground mb-1">آدرس مجموعه</p>
                    <p className="font-bold">تهران، خیابان انقلاب، خیابان ۱۹ آذر - پلاک ۳۱</p>
                  </div>
                </div>
              </div>

              <div className="glass rounded-3xl p-5 md:p-6">
                <img
                  src={supportImage}
                  alt="تصویر پیوی پشتیبانی تلگرام نوا شاپ"
                  className="w-full h-auto rounded-2xl border border-border object-cover"
                />
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-4">
                  <div className="rounded-2xl border border-border/70 bg-card/40 p-4">
                    <p className="text-xs text-muted-foreground mb-1">پشتیبانی فوری</p>
                    <p className="font-semibold">۲۴/۷ ساعته در تلگرام</p>
                  </div>
                  <div className="rounded-2xl border border-border/70 bg-card/40 p-4">
                    <p className="text-xs text-muted-foreground mb-1">مسیر پیگیری</p>
                    <p className="font-semibold">پاسخگویی ساعتی و مستمر</p>
                  </div>
                  <div className="rounded-2xl border border-border/70 bg-card/40 p-4 md:col-span-2">
                    <p className="text-xs text-muted-foreground mb-1">تعهد مجموعه</p>
                    <p className="font-semibold">تحویل سریع اشتراک ها + پشتیبانی کامل پس از خرید</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="glass rounded-3xl p-6 md:p-8 max-w-6xl mx-auto">
              <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
                <ShieldCheck className="w-6 h-6 text-primary" />
                ماموریت ما
              </h2>
              <p className="text-muted-foreground leading-8">
                ماموریت نوا شاپ این است که کاربران ایرانی بتوانند بدون دردسر پرداخت ارزی، به بهترین ابزارهای هوش مصنوعی دنیا
                دسترسی داشته باشند. ما روی شفافیت سفارش، پایداری سرویس، تحویل سریع و پاسخگویی واقعی تمرکز داریم.
              </p>
            </div>
          </div>
        </main>

        <ShopFooter />
      </div>
    </>
  );
};

export default AboutPage;
