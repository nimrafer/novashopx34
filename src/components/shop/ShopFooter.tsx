import { MessageCircle, Send, ShieldCheck, Clock3 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import novaLogo from "@/assets/nova-logo.jpeg";
import { CHANNEL_TELEGRAM_URL } from "@/constants/support";

const ShopFooter = () => {
  return (
    <footer className="pt-16 pb-10 border-t border-border bg-secondary/35">
      <div className="container mx-auto px-4">
        <div className="glass rounded-3xl p-6 md:p-10 mb-10">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-center">
            <div className="lg:col-span-2">
              <h3 className="text-2xl md:text-3xl font-black mb-3">برای خرید سریع آماده‌ای؟</h3>
              <p className="text-muted-foreground leading-8 max-w-2xl">
                سفارش را مستقیم داخل سایت ثبت کن، از پنل کاربری وضعیت را ببین و اگر سوال داشتی همان لحظه با پشتیبانی در ارتباط باش.
              </p>
              <div className="mt-5 flex flex-col sm:flex-row gap-3">
                <Button size="lg" className="bg-gradient-primary text-primary-foreground hover:opacity-95" asChild>
                  <Link to="/support">
                    <MessageCircle className="w-5 h-5 ml-2" />
                    ارتباط با پشتیبانی
                  </Link>
                </Button>
                <Button
                  size="lg"
                  variant="outline"
                  className="border-border"
                  onClick={() => window.open(CHANNEL_TELEGRAM_URL, "_blank")}
                >
                  <Send className="w-5 h-5 ml-2" />
                  عضویت در کانال
                </Button>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="rounded-2xl bg-card border border-border p-4 text-center">
                <ShieldCheck className="w-5 h-5 mx-auto text-accent mb-2" />
                <p className="font-semibold text-sm">گارانتی تعویض</p>
                <p className="text-xs text-muted-foreground mt-1">در صورت بروز مشکل</p>
              </div>
              <div className="rounded-2xl bg-card border border-border p-4 text-center">
                <Clock3 className="w-5 h-5 mx-auto text-accent mb-2" />
                <p className="font-semibold text-sm">پیگیری سفارش</p>
                <p className="text-xs text-muted-foreground mt-1">از داخل پنل کاربری</p>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
          <div>
            <Link to="/" className="flex items-center gap-3 mb-4">
              <img src={novaLogo} alt="Nova AI Shop" className="w-12 h-12 rounded-2xl object-cover border border-border" />
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
            </div>
          </div>

          <div>
            <h4 className="font-bold mb-4">مجوز کسب</h4>
            <div className="bg-white p-3 rounded-2xl border border-border inline-block">
              <a
                referrerPolicy="origin"
                target="_blank"
                href="https://trustseal.enamad.ir/?id=5763406&Code=itrXt1sRq9n4HY1TZd2u8dCOItPmV6dr"
                rel="noreferrer"
              >
                <img
                  referrerPolicy="origin"
                  src="https://trustseal.enamad.ir/logo.aspx?id=5763406&Code=itrXt1sRq9n4HY1TZd2u8dCOItPmV6dr"
                  alt="اینماد"
                  className="w-24 h-auto object-contain"
                  id="itrXt1sRq9n4HY1TZd2u8dCOItPmV6dr"
                />
              </a>
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
