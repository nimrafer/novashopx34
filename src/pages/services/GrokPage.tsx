import { MessageCircle, RefreshCw, Zap, Headphones, Twitter } from "lucide-react";
import { Link } from "react-router-dom";
import ServicePageLayout from "@/components/shop/ServicePageLayout";
import { Helmet } from "react-helmet";
import { usePricesContext } from "@/contexts/PricesContext";
import { createFAQSchema, createBreadcrumbSchema, createProductSchema } from "@/components/seo/schemas";

const GrokPage = () => {
  const { getPrice } = usePricesContext();

  const features = [
    "دسترسی به داده های زنده پلتفرم X برای تحلیل ترندها و خبرها",
    "تولید متن خلاقانه با لحن خودمانی و سبک پاسخ متفاوت",
    "مناسب تحلیل فضای رسانه ای و ایده پردازی محتوای شبکه اجتماعی",
    "ادغام طبیعی با محیط X برای استفاده سریع تر",
    "دسترسی به نسخه های به روز Grok از مسیر اشتراک های Premium و Premium+",
    "تحویل سریع و فعال سازی در کوتاه ترین زمان",
    "پشتیبانی فارسی و پیگیری فعال سازی تا نتیجه نهایی",
    "ارسال راهنمای شروع پس از خرید",
  ];

  const plans = [
    {
      id: "grok_monthly",
      name: "دسترسی Grok (ماهانه)",
      duration: "یک ماهه",
      price: getPrice("grok_monthly"),
      priceKey: "grok_monthly",
      popular: true,
      features: [
        "دسترسی به Grok روی پلتفرم X",
        "مناسب رصد خبر، ترند و تولید ایده",
        "پشتیبانی فارسی در کل مسیر خرید",
      ],
    },
  ];

  const comparison = [
    { feature: "داده زنده شبکه اجتماعی X", free: "محدود", premium: "بالاتر" },
    { feature: "تحلیل ترند و موج خبری", free: "پایه", premium: "پیشرفته" },
    { feature: "ایده پردازی برای محتوا", free: "محدود", premium: "کامل تر" },
    { feature: "پشتیبانی خرید", free: false, premium: true },
  ];

  const faqs = [
    {
      question: "Grok دقیقا چیست؟",
      answer:
        "Grok هوش مصنوعی شرکت xAI است که روی پلتفرم X فعال است و برای تحلیل فضای رسانه ای و ترندها کاربرد زیادی دارد.",
    },
    {
      question: "دسترسی Grok از چه طریقی ارائه می شود؟",
      answer:
        "این دسترسی از مسیر اشتراک های Premium یا Premium+ در پلتفرم X فراهم می شود و با پلن انتخابی شما فعال می گردد.",
    },
    {
      question: "این سرویس برای چه افرادی مناسب است؟",
      answer:
        "برای ادمین های شبکه اجتماعی، فعالان حوزه کریپتو و تکنولوژی، و افرادی که رصد لحظه ای اخبار برایشان مهم است مناسب است.",
    },
    {
      question: "زمان تحویل سفارش چقدر است؟",
      answer:
        "پس از ثبت سفارش، فرایند فعال سازی بلافاصله شروع می شود و در کوتاه ترین زمان انجام می گردد.",
    },
  ];

  const extraContent = (
    <>
      <section className="py-12">
        <div className="container mx-auto px-4">
          <h2 className="text-2xl font-bold mb-6">این سرویس برای چه کسانی مناسب است؟</h2>
          <div className="glass rounded-3xl p-8 max-w-4xl">
            <ul className="space-y-3 text-muted-foreground leading-8">
              <li>• ادمین های صفحات و برندها در X</li>
              <li>• فعالان کریپتو، تکنولوژی و اخبار با نیاز به رصد لحظه ای</li>
              <li>• کسانی که دنبال سبک پاسخ متفاوت و خودمانی هستند</li>
            </ul>
          </div>
        </div>
      </section>

      <section className="py-12">
        <div className="container mx-auto px-4">
          <h2 className="text-2xl font-bold mb-8">مزیت خرید از نوا شاپ</h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="glass rounded-2xl p-6 text-center">
              <div className="w-16 h-16 rounded-full bg-white/20 flex items-center justify-center mx-auto mb-4">
                <Zap className="w-8 h-8 text-white" />
              </div>
              <h3 className="font-bold text-lg mb-2">تحویل سریع</h3>
              <p className="text-muted-foreground text-sm">سفارش شما سریع وارد فرایند فعال سازی می شود.</p>
            </div>
            <div className="glass rounded-2xl p-6 text-center">
              <div className="w-16 h-16 rounded-full bg-white/20 flex items-center justify-center mx-auto mb-4">
                <Headphones className="w-8 h-8 text-white" />
              </div>
              <h3 className="font-bold text-lg mb-2">پشتیبانی فارسی</h3>
              <p className="text-muted-foreground text-sm">راهنمایی مرحله به مرحله تا فعال سازی کامل.</p>
            </div>
            <div className="glass rounded-2xl p-6 text-center">
              <div className="w-16 h-16 rounded-full bg-white/20 flex items-center justify-center mx-auto mb-4">
                <Twitter className="w-8 h-8 text-white" />
              </div>
              <h3 className="font-bold text-lg mb-2">تمرکز روی X</h3>
              <p className="text-muted-foreground text-sm">مناسب کاربرانی که تحلیل جریان های X برایشان مهم است.</p>
            </div>
            <div className="glass rounded-2xl p-6 text-center">
              <div className="w-16 h-16 rounded-full bg-white/20 flex items-center justify-center mx-auto mb-4">
                <RefreshCw className="w-8 h-8 text-white" />
              </div>
              <h3 className="font-bold text-lg mb-2">راهنمای شروع</h3>
              <p className="text-muted-foreground text-sm">
                بعد از خرید راهنمای کوتاه می گیرید. <Link to="/support" className="text-primary hover:underline">مشاهده راهنما</Link>
              </p>
            </div>
          </div>
        </div>
      </section>
    </>
  );

  const lowestPrice = plans[0].price;

  const faqSchema = createFAQSchema(faqs);
  const breadcrumbSchema = createBreadcrumbSchema([
    { name: "خانه", url: "/" },
    { name: "خرید دسترسی گراک (Grok)", url: "/services/grok" },
  ]);
  const productSchema = createProductSchema({
    name: "خرید دسترسی گراک (Grok)",
    description:
      "خرید دسترسی Grok روی پلتفرم X با تحویل سریع، پشتیبانی فارسی و مناسب تحلیل ترندها و اخبار زنده.",
    price: lowestPrice,
    url: "/services/grok",
    image: "https://nova-shop.co/logos/grok.png",
    category: "اشتراک هوش مصنوعی",
    sku: "GROK-X",
    ratingValue: 4.7,
    reviewCount: 650,
  });

  return (
    <>
      <Helmet>
        <title>خرید دسترسی گراک (Grok) | هوش مصنوعی xAI روی پلتفرم X</title>
        <meta
          name="description"
          content="خرید دسترسی گراک (Grok) روی پلتفرم X برای تحلیل ترندها و تولید محتوای خلاقانه. تحویل سریع، پشتیبانی فارسی و فعال سازی مطمئن."
        />
        <meta
          name="keywords"
          content="خرید Grok, خرید گراک, خرید دسترسی Grok, xAI, Grok روی X, خرید اشتراک Premium X"
        />
        <link rel="canonical" href="https://nova-shop.co/services/grok" />

        <script type="application/ld+json">{JSON.stringify([productSchema, faqSchema, breadcrumbSchema])}</script>
      </Helmet>

      <ServicePageLayout
        serviceId="grok"
        icon={MessageCircle}
        logoSrc="/logos/grok.png"
        title="خرید دسترسی گراک (Grok) | هوش مصنوعی xAI روی پلتفرم X"
        subtitle="Grok by xAI on X"
        description="Grok هوش مصنوعی ساخته شرکت xAI است که روی پلتفرم X فعال است و به داده های زنده این شبکه اجتماعی دسترسی دارد. با تهیه اشتراک، به نسخه های به روز Grok برای تحلیل ترندها، تولید محتوا و پاسخ گویی خلاقانه دسترسی پیدا می کنید. سفارش شما با پشتیبانی فارسی تحویل می شود."
        color="#FFFFFF"
        features={features}
        plans={plans}
        comparison={comparison}
        faqs={faqs}
        extraContent={extraContent}
      />
    </>
  );
};

export default GrokPage;
