import { Headphones, MessageCircle, Send, ShieldCheck, Clock3 } from "lucide-react";
import { Button } from "@/components/ui/button";
import ShopHeader from "@/components/shop/ShopHeader";
import ShopFooter from "@/components/shop/ShopFooter";
import SEOHead from "@/components/seo/SEOHead";
import supportImage from "@/assets/telegram-support.jpg";
import {
  ADMIN_TELEGRAM_ID,
  CHANNEL_TELEGRAM_URL,
  CHANNEL_USERNAME,
  SUPPORT_TELEGRAM_URL,
  SUPPORT_USERNAME,
} from "@/constants/support";

const SupportPage = () => {
  return (
    <>
      <SEOHead
        title="پشتیبانی تلگرام | نوا شاپ"
        description="پشتیبانی ۲۴/۷ ساعته نوا شاپ در تلگرام. مشاهده مستقیم آیدی ادمین، تصویر پیوی پشتیبانی و ارتباط فوری."
        keywords="پشتیبانی تلگرام نوا شاپ, آیدی ادمین نوا شاپ, Nova AI Support"
        canonicalUrl="/support"
      />

      <div className="min-h-screen bg-background">
        <ShopHeader />

        <main className="pt-24 pb-16">
          <div className="container mx-auto px-4">
            <div className="text-center mb-10">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass mb-4">
                <Headphones className="w-4 h-4 text-primary" />
                <span className="text-sm text-muted-foreground">پشتیبانی فوری</span>
              </div>
              <h1 className="text-3xl md:text-5xl font-black mb-3">پشتیبانی ۲۴/۷ ساعته در تلگرام</h1>
              <p className="text-muted-foreground max-w-2xl mx-auto">
                پیگیری فوری و در ارتباط بودن با کارشناسان همیشه آنلاین ما در تلگرام برای هر گونه سوال یا ابهام.
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 max-w-6xl mx-auto">
              <div className="glass rounded-3xl p-4 md:p-6">
                <img
                  src={supportImage}
                  alt="تصویر پیوی پشتیبانی تلگرام نوا شاپ"
                  className="w-full h-auto rounded-2xl border border-border object-cover"
                />
              </div>

              <div className="glass rounded-3xl p-6 md:p-8">
                <h2 className="text-2xl font-bold mb-6">ارتباط مستقیم با پشتیبانی</h2>

                <div className="space-y-4 mb-8">
                  <div className="rounded-2xl border border-border/70 p-4 bg-card/40">
                    <p className="text-xs text-muted-foreground mb-1">آیدی ادمین</p>
                    <p className="text-lg font-black" dir="ltr">{ADMIN_TELEGRAM_ID}</p>
                  </div>
                  <div className="rounded-2xl border border-border/70 p-4 bg-card/40">
                    <p className="text-xs text-muted-foreground mb-1">پشتیبانی تلگرام</p>
                    <p className="text-lg font-black" dir="ltr">@{SUPPORT_USERNAME}</p>
                  </div>
                  <div className="rounded-2xl border border-border/70 p-4 bg-card/40">
                    <p className="text-xs text-muted-foreground mb-1">کانال تلگرام</p>
                    <p className="text-lg font-black" dir="ltr">@{CHANNEL_USERNAME}</p>
                  </div>
                </div>

                <div className="space-y-3">
                  <Button
                    size="lg"
                    className="w-full bg-[#0088cc] hover:bg-[#0077b5] text-white"
                    onClick={() => window.open(SUPPORT_TELEGRAM_URL, "_blank")}
                  >
                    <MessageCircle className="w-5 h-5 ml-2" />
                    چت فوری با پشتیبانی
                  </Button>
                  <Button
                    size="lg"
                    variant="outline"
                    className="w-full"
                    onClick={() => window.open(CHANNEL_TELEGRAM_URL, "_blank")}
                  >
                    <Send className="w-5 h-5 ml-2" />
                    عضویت در کانال تلگرام
                  </Button>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 max-w-6xl mx-auto mt-6">
              <div className="glass rounded-2xl p-5 text-center">
                <Clock3 className="w-6 h-6 mx-auto mb-2 text-primary" />
                <p className="font-semibold">پاسخگویی ساعتی و مستمر</p>
              </div>
              <div className="glass rounded-2xl p-5 text-center">
                <ShieldCheck className="w-6 h-6 mx-auto mb-2 text-primary" />
                <p className="font-semibold">پیگیری کامل سفارش</p>
              </div>
              <div className="glass rounded-2xl p-5 text-center">
                <Headphones className="w-6 h-6 mx-auto mb-2 text-primary" />
                <p className="font-semibold">مشاوره قبل از خرید</p>
              </div>
            </div>
          </div>
        </main>

        <ShopFooter />
      </div>
    </>
  );
};

export default SupportPage;
