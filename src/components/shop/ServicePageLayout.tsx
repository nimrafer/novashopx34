import { ReactNode } from "react";
import { Link } from "react-router-dom";
import { LucideIcon, MessageCircle, ArrowRight, Check, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import ShopHeader from "./ShopHeader";
import ShopFooter from "./ShopFooter";

const SUPPORT_USERNAME = "Nova_AI_Support";

interface Plan {
  name: string;
  duration: string;
  price: number;
  features?: string[];
  popular?: boolean;
  notIncluded?: string[];
}

interface FAQ {
  question: string;
  answer: string;
}

interface CompareItem {
  feature: string;
  free: string | boolean;
  premium: string | boolean;
}

interface ServicePageLayoutProps {
  icon: LucideIcon;
  title: string;
  subtitle: string;
  description: string;
  color: string;
  features: string[];
  plans: Plan[];
  faqs?: FAQ[];
  comparison?: CompareItem[];
  extraContent?: ReactNode;
}

const formatPrice = (price: number) => {
  if (price === 0) return "تماس بگیرید";
  return new Intl.NumberFormat("fa-IR").format(price / 1000) + " هزار تومان";
};

const ServicePageLayout = ({
  icon: Icon,
  title,
  subtitle,
  description,
  color,
  features,
  plans,
  faqs,
  comparison,
  extraContent,
}: ServicePageLayoutProps) => {
  const handleOrder = (planName: string) => {
    const message = encodeURIComponent(`سلام! میخوام ${title} - ${planName} رو سفارش بدم.`);
    window.open(`https://t.me/${SUPPORT_USERNAME}?text=${message}`, "_blank");
  };

  return (
    <div className="min-h-screen bg-background">
      <ShopHeader />

      <main className="pt-24 pb-12">
        {/* Hero Section */}
        <section className="relative py-16 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-glow opacity-30" />
          <div
            className="absolute top-1/2 right-1/4 w-96 h-96 rounded-full blur-3xl opacity-20"
            style={{ backgroundColor: color }}
          />

          <div className="container mx-auto px-4 relative z-10">
            {/* Breadcrumb */}
            <div className="flex items-center gap-2 text-sm text-muted-foreground mb-8">
              <Link to="/" className="hover:text-foreground transition-colors">
                صفحه اصلی
              </Link>
              <ArrowRight className="w-4 h-4 rotate-180" />
              <span className="text-foreground">{title}</span>
            </div>

            <div className="flex flex-col md:flex-row items-start gap-8">
              <div
                className="w-20 h-20 rounded-3xl flex items-center justify-center shrink-0"
                style={{ backgroundColor: `${color}20` }}
              >
                <Icon className="w-10 h-10" style={{ color }} />
              </div>

              <div className="flex-1">
                <Badge
                  className="mb-4"
                  style={{ backgroundColor: `${color}20`, color }}
                >
                  {subtitle}
                </Badge>
                <h1 className="text-3xl md:text-5xl font-bold mb-4">{title}</h1>
                <p className="text-lg text-muted-foreground max-w-2xl">
                  {description}
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="py-12">
          <div className="container mx-auto px-4">
            <h2 className="text-2xl font-bold mb-8">✨ قابلیت‌ها و مزایا</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {features.map((feature, idx) => (
                <div
                  key={idx}
                  className="glass rounded-2xl p-5 glass-hover flex items-start gap-3"
                >
                  <div
                    className="w-6 h-6 rounded-full flex items-center justify-center shrink-0 mt-0.5"
                    style={{ backgroundColor: `${color}20` }}
                  >
                    <Check className="w-4 h-4" style={{ color }} />
                  </div>
                  <span>{feature}</span>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Comparison Table */}
        {comparison && comparison.length > 0 && (
          <section className="py-12">
            <div className="container mx-auto px-4">
              <h2 className="text-2xl font-bold mb-8">
                ⚖️ مقایسه نسخه رایگان و پرمیوم
              </h2>
              <div className="glass rounded-3xl overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-border/50">
                        <th className="text-right p-4 font-semibold">ویژگی</th>
                        <th className="text-center p-4 font-semibold text-muted-foreground">
                          رایگان
                        </th>
                        <th className="text-center p-4 font-semibold" style={{ color }}>
                          پرمیوم
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {comparison.map((item, idx) => (
                        <tr
                          key={idx}
                          className="border-b border-border/30 last:border-0"
                        >
                          <td className="p-4">{item.feature}</td>
                          <td className="text-center p-4">
                            {typeof item.free === "boolean" ? (
                              item.free ? (
                                <Check className="w-5 h-5 mx-auto text-chatgpt" />
                              ) : (
                                <X className="w-5 h-5 mx-auto text-muted-foreground" />
                              )
                            ) : (
                              <span className="text-muted-foreground">
                                {item.free}
                              </span>
                            )}
                          </td>
                          <td className="text-center p-4">
                            {typeof item.premium === "boolean" ? (
                              item.premium ? (
                                <Check className="w-5 h-5 mx-auto" style={{ color }} />
                              ) : (
                                <X className="w-5 h-5 mx-auto text-muted-foreground" />
                              )
                            ) : (
                              <span style={{ color }}>{item.premium}</span>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </section>
        )}

        {/* Extra Content */}
        {extraContent}

        {/* Plans Section */}
        <section className="py-12">
          <div className="container mx-auto px-4">
            <h2 className="text-2xl font-bold mb-8">🛍 پلن‌های خرید</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {plans.map((plan, idx) => (
                <div
                  key={idx}
                  className={`glass rounded-3xl p-6 relative ${
                    plan.popular ? "border-2" : ""
                  }`}
                  style={plan.popular ? { borderColor: color } : {}}
                >
                  {plan.popular && (
                    <div className="absolute -top-3 right-6">
                      <Badge style={{ backgroundColor: color }}>پرفروش</Badge>
                    </div>
                  )}

                  <h3 className="text-xl font-bold mb-2">{plan.name}</h3>
                  <p className="text-sm text-muted-foreground mb-4">
                    {plan.duration}
                  </p>

                  <div className="text-3xl font-bold mb-6" style={{ color }}>
                    {formatPrice(plan.price)}
                  </div>

                  {plan.features && (
                    <ul className="space-y-3 mb-6">
                      {plan.features.map((f, i) => (
                        <li key={i} className="flex items-center gap-2 text-sm">
                          <Check className="w-4 h-4" style={{ color }} />
                          {f}
                        </li>
                      ))}
                    </ul>
                  )}

                  {plan.notIncluded && (
                    <ul className="space-y-2 mb-6 pt-4 border-t border-border/50">
                      {plan.notIncluded.map((f, i) => (
                        <li
                          key={i}
                          className="flex items-center gap-2 text-sm text-muted-foreground"
                        >
                          <X className="w-4 h-4" />
                          {f}
                        </li>
                      ))}
                    </ul>
                  )}

                  <Button
                    className="w-full"
                    style={{ backgroundColor: color }}
                    onClick={() => handleOrder(plan.name)}
                  >
                    <MessageCircle className="w-4 h-4 ml-2" />
                    ثبت سفارش
                  </Button>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* FAQ Section */}
        {faqs && faqs.length > 0 && (
          <section className="py-12">
            <div className="container mx-auto px-4">
              <h2 className="text-2xl font-bold mb-8">❓ سوالات متداول</h2>
              <div className="space-y-4 max-w-3xl">
                {faqs.map((faq, idx) => (
                  <div key={idx} className="glass rounded-2xl p-6">
                    <h3 className="font-semibold mb-3">{faq.question}</h3>
                    <p className="text-muted-foreground">{faq.answer}</p>
                  </div>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* CTA Section */}
        <section className="py-12">
          <div className="container mx-auto px-4">
            <div
              className="glass rounded-3xl p-8 md:p-12 text-center relative overflow-hidden"
              style={{
                background: `linear-gradient(135deg, ${color}10 0%, transparent 50%)`,
              }}
            >
              <h3 className="text-2xl md:text-3xl font-bold mb-4">
                سوالی دارید؟
              </h3>
              <p className="text-muted-foreground mb-8 max-w-xl mx-auto">
                برای مشاوره رایگان و انتخاب بهترین پلن، همین الان با پشتیبانی
                تماس بگیرید.
              </p>
              <Button
                size="lg"
                style={{ backgroundColor: color }}
                onClick={() =>
                  window.open(`https://t.me/${SUPPORT_USERNAME}`, "_blank")
                }
              >
                <MessageCircle className="w-5 h-5 ml-2" />
                پیام به پشتیبانی
              </Button>
            </div>
          </div>
        </section>

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
  );
};

export default ServicePageLayout;
