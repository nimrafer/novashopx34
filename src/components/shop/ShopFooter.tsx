import { MessageCircle, Send, ShieldCheck, Clock3 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import novaLogo from "@/assets/nova-logo.webp";
import { CHANNEL_TELEGRAM_URL } from "@/constants/support";

const ShopFooter = () => {
  return (
    <footer className="pt-16 pb-10 border-t border-border bg-secondary/35">
      <div className="container mx-auto px-4">
        <div className="relative overflow-hidden rounded-3xl bg-accent text-accent-foreground p-6 md:p-10 mb-10 shadow-[0_32px_64px_-36px_hsl(165_52%_20%/0.7)]">
          <div
            className="absolute inset-0 pointer-events-none"
            aria-hidden="true"
            style={{
              background:
                "radial-gradient(560px 280px at 12% -10%, hsl(92 74% 68% / 0.22), transparent 62%), radial-gradient(480px 260px at 95% 115%, hsl(165 60% 22% / 0.85), transparent 60%)",
            }}
          />
          <div className="relative grid grid-cols-1 lg:grid-cols-3 gap-8 items-center">
            <div className="lg:col-span-2">
              <h3 className="text-2xl md:text-3xl font-black mb-3">برای خرید سریع آماده‌ای؟</h3>
              <p className="leading-8 max-w-2xl text-accent-foreground/80">
                پلن را انتخاب کن و بدون نیاز به ورود، پرداخت را در سامانه مرکزی نوا انجام بده؛ وضعیت تأیید همان‌جا خودکار نمایش داده می‌شود.
              </p>
              <div className="mt-6 flex flex-col sm:flex-row gap-3">
                <Button size="lg" className="bg-primary text-primary-foreground hover:bg-primary/90 font-bold" asChild>
                  <Link to="/support">
                    <MessageCircle className="w-5 h-5 ml-2" />
                    ارتباط با پشتیبانی
                  </Link>
                </Button>
                <Button
                  size="lg"
                  variant="outline"
                  className="border-accent-foreground/25 bg-transparent text-accent-foreground hover:bg-accent-foreground/10 hover:text-accent-foreground"
                  onClick={() => window.open(CHANNEL_TELEGRAM_URL, "_blank")}
                >
                  <Send className="w-5 h-5 ml-2" />
                  عضویت در کانال
                </Button>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="rounded-2xl bg-accent-foreground/10 border border-accent-foreground/15 p-4 text-center backdrop-blur-sm">
                <ShieldCheck className="w-5 h-5 mx-auto text-primary mb-2" />
                <p className="font-bold text-sm">گارانتی تعویض</p>
                <p className="text-xs text-accent-foreground/70 mt-1">در صورت بروز مشکل</p>
              </div>
              <div className="rounded-2xl bg-accent-foreground/10 border border-accent-foreground/15 p-4 text-center backdrop-blur-sm">
                <Clock3 className="w-5 h-5 mx-auto text-primary mb-2" />
                <p className="font-bold text-sm">تأیید پرداخت</p>
                <p className="text-xs text-accent-foreground/70 mt-1">خودکار و لحظه‌ای</p>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
          <div>
            <Link to="/" className="flex items-center gap-3 mb-4">
              <img
                src={novaLogo}
                alt="Nova AI Shop"
                width={48}
                height={48}
                loading="lazy"
                decoding="async"
                className="w-12 h-12 rounded-2xl object-cover border border-border"
              />
              <div>
                <p className="font-black leading-none">Nova AI Shop</p>
                <p className="text-xs text-muted-foreground">Smart Subscription Marketplace</p>
              </div>
            </Link>
            <p className="text-sm text-muted-foreground leading-7">
              فروشگاه تخصصی اشتراک‌های هوش مصنوعی برای کاربران فارسی‌زبان با ساختار سفارش شفاف، تحویل سریع و پشتیبانی فوری.
            </p>
          </div>

          <div>
            <h4 className="font-bold mb-4">دسترسی سریع</h4>
            <div className="space-y-2 text-sm">
              <Link to="/" className="block text-muted-foreground hover:text-foreground">صفحه اصلی</Link>
              <Link to="/dashboard" className="block text-muted-foreground hover:text-foreground">پنل کاربری</Link>
              <Link to="/support" className="block text-muted-foreground hover:text-foreground">پشتیبانی</Link>
              <Link to="/about" className="block text-muted-foreground hover:text-foreground">درباره ما</Link>
              <Link to="/blog" className="block text-muted-foreground hover:text-foreground">وبلاگ</Link>
              <Link to="/contact" className="block text-muted-foreground hover:text-foreground">تماس با ما</Link>
              <Link to="/gemini-offer-terms" className="block text-muted-foreground hover:text-foreground">شرایط آفرهای Gemini</Link>
            </div>
          </div>

          <div>
            <h4 className="font-bold mb-4">مجوز کسب</h4>
            <div className="bg-white p-3 rounded-2xl border border-border inline-block">
              <div className="flex items-center gap-3">
                <a
                  referrerPolicy="origin"
                  target="_blank"
                  href="https://trustseal.enamad.ir/?id=710810&Code=itrXt1sRq9n4HY1TZd2u8dCOItPmV6dr"
                  rel="noreferrer"
                >
                  <img
                    referrerPolicy="origin"
                    src="https://trustseal.enamad.ir/logo.aspx?id=710810&Code=itrXt1sRq9n4HY1TZd2u8dCOItPmV6dr"
                    alt="نماد اعتماد الکترونیکی (اینماد) نوا شاپ"
                    width={96}
                    height={96}
                    loading="lazy"
                    decoding="async"
                    className="w-24 h-auto object-contain"
                    code="itrXt1sRq9n4HY1TZd2u8dCOItPmV6dr"
                  />
                </a>

                <div className="h-16 w-px bg-zinc-200" />

                <div className="w-24 min-h-[96px] flex items-center justify-center">
                  <a
                    href="https://www.zarinpal.com"
                    target="_blank"
                    rel="noreferrer"
                    className="block"
                    title="مجوز و پرداخت امن زرین‌پال"
                  >
                    <img
                      src="/logos/zarinpal-license.svg"
                      alt="زرین‌پال"
                      width={96}
                      height={96}
                      loading="lazy"
                      decoding="async"
                      className="w-24 h-auto object-contain"
                    />
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="pt-5 border-t border-border text-sm text-muted-foreground flex flex-col md:flex-row items-center justify-between gap-3">
          <p>© ۱۴۰۴ Nova AI Shop - تمامی حقوق محفوظ است</p>
          <p>طراحی جدید با تمرکز روی تجربه سفارش سریع و شفاف</p>
        </div>
      </div>
    </footer>
  );
};

export default ShopFooter;
