import { ReactNode, useMemo, useState } from "react";
import { Link, useLocation, useNavigate, useSearchParams } from "react-router-dom";
import { LucideIcon, MessageCircle, ArrowRight, Check, X, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/useAuth";
import { createOrder, quoteOrder, startOrderZarinpalPayment } from "@/lib/orders";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import ShopHeader from "./ShopHeader";
import ShopFooter from "./ShopFooter";
import { usePricesContext } from "@/contexts/PricesContext";

interface Plan {
  id?: string;
  name: string;
  duration: string;
  price: number;
  priceKey?: string;
  features?: string[];
  popular?: boolean;
  notIncluded?: string[];
  requiresActivationEmail?: boolean;
  activationEmailLabel?: string;
  badge?: string;
  subtitle?: string;
  description?: string;
  image?: string;
  groupId?: string;
  badges?: { label: string; text_color?: string; background_color?: string }[];
}

interface PlanGroup {
  id: string;
  title: string;
  description?: string;
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
  serviceId?: string;
  icon: LucideIcon;
  logoSrc?: string;
  title: string;
  subtitle: string;
  description: string;
  color: string;
  features: string[];
  plans: Plan[];
  planGroups?: PlanGroup[];
  faqs?: FAQ[];
  comparison?: CompareItem[];
  extraContent?: ReactNode;
}

// Format price - full number with تومان
const formatPrice = (price: number) => {
  if (price === 0) return "تماس بگیرید";
  return new Intl.NumberFormat("fa-IR").format(price) + " تومان";
};

const ServicePageLayout = ({
  serviceId,
  icon: Icon,
  logoSrc,
  title,
  subtitle,
  description,
  color,
  features,
  plans,
  planGroups,
  faqs,
  comparison,
  extraContent,
}: ServicePageLayoutProps) => {
  const { user } = useAuth();
  const { catalog } = usePricesContext();
  const { toast } = useToast();
  const navigate = useNavigate();
  const location = useLocation();
  const [searchParams] = useSearchParams();
  const [submittingPlan, setSubmittingPlan] = useState<string | null>(null);
  const [selectedPlan, setSelectedPlan] = useState<Plan | null>(null);
  const [showOrderDialog, setShowOrderDialog] = useState(false);
  const [quoteLoading, setQuoteLoading] = useState(false);
  const [orderForm, setOrderForm] = useState({
    activationEmail: "",
    customerTelegram: "",
    couponCode: "",
    notes: "",
  });
  const [pricePreview, setPricePreview] = useState<{
    basePrice: number;
    finalPrice: number;
    offerAmount: number;
    couponAmount: number;
    offerTitle: string | null;
    couponCode: string | null;
  } | null>(null);
  const highlightedPlanId = (searchParams.get("plan") || "").trim();
  const resolvedServiceId = serviceId || location.pathname.replace("/services/", "");
  const catalogService = useMemo(
    () => catalog.find((service) => service.id === resolvedServiceId || service.slug === resolvedServiceId),
    [catalog, resolvedServiceId],
  );
  const effectivePlans = useMemo(() => {
    if (!catalogService) return plans;
    return catalogService.plans.map((catalogPlan) => {
      const fallback = plans.find((plan) => plan.id === catalogPlan.id || plan.priceKey === catalogPlan.priceKey);
      return {
        ...fallback,
        id: catalogPlan.id,
        name: catalogPlan.name,
        subtitle: catalogPlan.subtitle,
        duration: catalogPlan.duration || fallback?.duration || "",
        price: catalogPlan.price,
        priceKey: catalogPlan.priceKey || catalogPlan.id,
        badge: catalogPlan.badge,
        popular: fallback?.popular || Boolean(catalogPlan.badge),
        description: catalogPlan.description || fallback?.description,
        image: catalogPlan.image || fallback?.image,
        requiresActivationEmail: catalogPlan.requiresActivationEmail,
        activationEmailLabel: catalogPlan.activationEmailLabel,
      };
    });
  }, [catalogService, plans]);
  const displayTitle = catalogService?.name || title;
  const displayDescription = catalogService?.description || description;
  const displayLogo = catalogService?.logo || logoSrc;

  const paddedPlans = useMemo(() => {
    return effectivePlans.map((plan, idx) => ({
      key: plan.id ? `${plan.id}-${idx}` : `${plan.name}-${idx}`,
      plan,
    }));
  }, [effectivePlans]);
  const planGridClass = effectivePlans.length === 1
    ? "grid-cols-1 max-w-xl mx-auto"
    : effectivePlans.length === 2
      ? "grid-cols-1 sm:grid-cols-2 max-w-4xl mx-auto"
      : effectivePlans.length === 3
        ? "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 max-w-6xl mx-auto"
        : "grid-cols-1 sm:grid-cols-2 lg:grid-cols-4";

  const requiresActivationEmail = (plan: Plan) => {
    if (typeof plan.requiresActivationEmail === "boolean") {
      return plan.requiresActivationEmail;
    }
    return resolvedServiceId === "chatgpt" || resolvedServiceId === "gemini";
  };

  const activationEmailLabel = (plan: Plan) => {
    if (plan.activationEmailLabel) return plan.activationEmailLabel;
    if (resolvedServiceId === "chatgpt") return "ایمیل اکانت رایگان ChatGPT";
    if (resolvedServiceId === "gemini") return "جیمیل برای فعالسازی Gemini";
    return "ایمیل فعالسازی";
  };

  const refreshQuote = async (plan: Plan, couponCode: string) => {
    setQuoteLoading(true);
    const result = await quoteOrder({
      serviceId: resolvedServiceId,
      planId: plan.id,
      price: plan.price,
      couponCode: couponCode.trim() || undefined,
    });
    setQuoteLoading(false);

    if ("error" in result) {
      setPricePreview({
        basePrice: plan.price,
        finalPrice: plan.price,
        offerAmount: 0,
        couponAmount: 0,
        offerTitle: null,
        couponCode: null,
      });
      if (couponCode.trim()) {
        toast({
          title: "کد تخفیف معتبر نیست",
          description: result.error,
          variant: "destructive",
        });
      }
      return;
    }

    setPricePreview({
      basePrice: result.data.basePrice,
      finalPrice: result.data.finalPrice,
      offerAmount: result.data.offerAmount,
      couponAmount: result.data.couponAmount,
      offerTitle: result.data.offerTitle,
      couponCode: result.data.couponCode,
    });
  };

  const handleOrder = async (plan: Plan) => {
    if (!user) {
      toast({
        title: "ابتدا وارد حساب شوید",
        description: "برای ثبت سفارش، ابتدا با ایمیل وارد شوید.",
        variant: "destructive",
      });
      navigate(`/auth?next=${encodeURIComponent(location.pathname)}`);
      return;
    }

    setSelectedPlan(plan);
    setOrderForm({
      activationEmail: "",
      customerTelegram: "",
      couponCode: "",
      notes: "",
    });
    setPricePreview({
      basePrice: plan.price,
      finalPrice: plan.price,
      offerAmount: 0,
      couponAmount: 0,
      offerTitle: null,
      couponCode: null,
    });
    setShowOrderDialog(true);
    await refreshQuote(plan, "");
  };

  const submitOrderFromDialog = async () => {
    if (!selectedPlan) return;

    if (!orderForm.customerTelegram.trim()) {
      toast({
        title: "آیدی تلگرام لازم است",
        description: "برای پیگیری سفارش، آیدی تلگرام خود را وارد کنید.",
        variant: "destructive",
      });
      return;
    }

    if (requiresActivationEmail(selectedPlan) && !orderForm.activationEmail.trim()) {
      toast({
        title: "ایمیل فعالسازی لازم است",
        description: `${activationEmailLabel(selectedPlan)} را وارد کنید.`,
        variant: "destructive",
      });
      return;
    }

    setSubmittingPlan(selectedPlan.name);
    const result = await createOrder({
      serviceId: resolvedServiceId || "service",
      serviceName: displayTitle,
      planId: selectedPlan.id,
      planName: selectedPlan.name,
      planDuration: selectedPlan.duration,
      price: pricePreview?.finalPrice ?? selectedPlan.price,
      notes: orderForm.notes.trim() || undefined,
      activationEmail: orderForm.activationEmail.trim() || undefined,
      customerTelegram: orderForm.customerTelegram.trim() || undefined,
      couponCode: orderForm.couponCode.trim() || undefined,
    });
    setSubmittingPlan(null);

    if ("error" in result) {
      toast({
        title: "ثبت سفارش ناموفق بود",
        description: result.error,
        variant: "destructive",
      });
      return;
    }

    setShowOrderDialog(false);
    const order = result.data.order;

    if ((order.price || 0) <= 0) {
      toast({
        title: "سفارش ثبت شد",
        description: `شناسه سفارش: ${order.id}`,
      });
      navigate("/dashboard");
      return;
    }

    const paymentResult = await startOrderZarinpalPayment(order.id);
    if ("error" in paymentResult) {
      toast({
        title: "سفارش ثبت شد اما اتصال به درگاه انجام نشد",
        description: `${paymentResult.error} — می‌توانید از پنل مشتری پرداخت را ادامه دهید.`,
        variant: "destructive",
      });
      navigate("/dashboard");
      return;
    }

    toast({
      title: "در حال انتقال به زرین‌پال",
      description: "لطفا تا باز شدن درگاه صبر کنید.",
    });
    window.location.href = paymentResult.data.payment.paymentUrl;
  };

  return (
    <div className="min-h-screen bg-background">
      <ShopHeader />

      <main className="pt-24 pb-12">
        <Dialog open={showOrderDialog} onOpenChange={setShowOrderDialog}>
          <DialogContent className="max-w-2xl" dir="rtl">
            <DialogHeader>
              <DialogTitle>ثبت سفارش {selectedPlan?.name}</DialogTitle>
              <DialogDescription>
                اطلاعات سفارش را تکمیل کنید تا سفارش شما برای ادمین ارسال شود.
              </DialogDescription>
            </DialogHeader>

            {selectedPlan ? (
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <div className="rounded-xl border border-border/60 bg-muted/20 p-3">
                    <p className="text-xs text-muted-foreground">سرویس</p>
                    <p className="font-bold">{displayTitle}</p>
                  </div>
                  <div className="rounded-xl border border-border/60 bg-muted/20 p-3">
                    <p className="text-xs text-muted-foreground">پلن انتخابی</p>
                    <p className="font-bold">{selectedPlan.name}</p>
                    <p className="text-xs text-muted-foreground mt-1">{selectedPlan.duration}</p>
                  </div>
                </div>

                {requiresActivationEmail(selectedPlan) ? (
                  <div className="space-y-2">
                    <label className="text-sm font-medium">{activationEmailLabel(selectedPlan)}</label>
                    <Input
                      dir="ltr"
                      type="email"
                      value={orderForm.activationEmail}
                      onChange={(e) => setOrderForm((prev) => ({ ...prev, activationEmail: e.target.value }))}
                      placeholder="example@gmail.com"
                    />
                  </div>
                ) : null}

                <div className="space-y-2">
                  <label className="text-sm font-medium">آیدی تلگرام (الزامی)</label>
                  <Input
                    dir="ltr"
                    value={orderForm.customerTelegram}
                    onChange={(e) => setOrderForm((prev) => ({ ...prev, customerTelegram: e.target.value }))}
                    placeholder="@username"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">کد تخفیف</label>
                  <div className="flex gap-2">
                    <Input
                      dir="ltr"
                      value={orderForm.couponCode}
                      onChange={(e) => setOrderForm((prev) => ({ ...prev, couponCode: e.target.value.toUpperCase() }))}
                      placeholder="CODE2026"
                    />
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => refreshQuote(selectedPlan, orderForm.couponCode)}
                      disabled={quoteLoading}
                    >
                      {quoteLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : "اعمال"}
                    </Button>
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">توضیحات سفارش (اختیاری)</label>
                  <Textarea
                    value={orderForm.notes}
                    onChange={(e) => setOrderForm((prev) => ({ ...prev, notes: e.target.value }))}
                    placeholder="اگر توضیح خاصی دارید بنویسید"
                    className="min-h-[88px]"
                  />
                </div>

                <div className="rounded-xl border border-border/60 bg-card/40 p-4 space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">مبلغ پایه</span>
                    <span>{formatPrice(pricePreview?.basePrice ?? selectedPlan.price)}</span>
                  </div>
                  {(pricePreview?.offerAmount ?? 0) > 0 ? (
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">
                        آفر فعال {pricePreview?.offerTitle ? `(${pricePreview.offerTitle})` : ""}
                      </span>
                      <span className="text-emerald-600">- {formatPrice(pricePreview?.offerAmount ?? 0)}</span>
                    </div>
                  ) : null}
                  {(pricePreview?.couponAmount ?? 0) > 0 ? (
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">
                        کد تخفیف {pricePreview?.couponCode ? `(${pricePreview.couponCode})` : ""}
                      </span>
                      <span className="text-emerald-600">- {formatPrice(pricePreview?.couponAmount ?? 0)}</span>
                    </div>
                  ) : null}
                  <div className="h-px bg-border/60" />
                  <div className="flex items-center justify-between">
                    <span className="font-medium">مبلغ نهایی</span>
                    <span className="text-xl font-black" style={{ color }}>
                      {formatPrice(pricePreview?.finalPrice ?? selectedPlan.price)}
                    </span>
                  </div>
                </div>
              </div>
            ) : null}

            <DialogFooter className="gap-2 sm:justify-start">
              <Button
                type="button"
                style={{ backgroundColor: color }}
                onClick={submitOrderFromDialog}
                disabled={!!submittingPlan}
              >
                {submittingPlan ? <Loader2 className="w-4 h-4 animate-spin ml-2" /> : <MessageCircle className="w-4 h-4 ml-2" />}
                {submittingPlan ? "در حال ثبت..." : "ثبت نهایی سفارش"}
              </Button>
              <Button type="button" variant="outline" onClick={() => setShowOrderDialog(false)}>
                انصراف
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

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
              <span className="text-foreground">{displayTitle}</span>
            </div>

            <div className="flex flex-col md:flex-row items-start gap-8">
              <div
                className="w-20 h-20 rounded-3xl flex items-center justify-center shrink-0"
                style={{ backgroundColor: `${color}20` }}
              >
                {displayLogo ? (
                  <img
                    src={displayLogo}
                    alt={displayTitle}
                    width={48}
                    height={48}
                    className="w-12 h-12 object-contain"
                    loading="lazy"
                    decoding="async"
                  />
                ) : (
                  <Icon className="w-10 h-10" style={{ color }} />
                )}
              </div>

              <div className="flex-1">
                <Badge
                  className="mb-4"
                  style={{ backgroundColor: `${color}20`, color }}
                >
                  {subtitle}
                </Badge>
                <h1 className="text-3xl md:text-5xl font-bold mb-4">{displayTitle}</h1>
                <p className="text-lg text-muted-foreground max-w-2xl">
                  {displayDescription}
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
            <div className="glass rounded-2xl p-4 mb-6 flex items-center justify-between gap-3">
              <p className="text-sm text-muted-foreground">
                بعد از ثبت سفارش، وضعیت سفارش از داخل پنل کاربری قابل پیگیری است.
              </p>
              <Button variant="outline" asChild>
                <Link to="/dashboard">مشاهده پنل کاربری</Link>
              </Button>
            </div>
            {(() => {
              const renderPlanCard = (item: { key: string; plan: Plan }) => {
                const { plan } = item;
                const isSubmitting = submittingPlan === plan.name;
                const isHighlighted =
                  highlightedPlanId.length > 0 &&
                  (plan.id === highlightedPlanId || `${plan.id}`.toLowerCase() === highlightedPlanId.toLowerCase());

                return (
                  <div
                    key={item.key}
                    className={`glass rounded-3xl p-6 relative transition-all duration-300 ${
                      plan.popular || isHighlighted ? "border-2 shadow-lg" : "border border-border/50"
                    }`}
                    style={plan.popular || isHighlighted ? { borderColor: color } : {}}
                  >
                    {plan.image && (
                      <img
                        src={plan.image}
                        alt={plan.name}
                        className="w-full aspect-[16/9] object-cover rounded-2xl mb-5 border border-border/50"
                        loading="lazy"
                      />
                    )}
                    {(plan.popular || isHighlighted) && (
                      <div className="absolute -top-3 right-6 flex gap-2">
                        {plan.popular ? <Badge style={{ backgroundColor: color }}>پرفروش</Badge> : null}
                        {isHighlighted ? <Badge variant="secondary">پلن انتخاب‌شده</Badge> : null}
                      </div>
                    )}

                    <h3 className="text-xl font-bold mb-2">{plan.name}</h3>
                    <p className="text-sm text-muted-foreground mb-4">
                      {plan.duration || plan.subtitle}
                    </p>

                    {plan.badges && plan.badges.length > 0 && (
                      <div className="flex flex-wrap gap-2 mb-4">
                        {plan.badges.map((chip, chipIdx) => (
                          <span
                            key={chipIdx}
                            className="text-xs font-bold rounded-lg px-2.5 py-1"
                            style={{
                              color: chip.text_color || undefined,
                              backgroundColor: chip.background_color || `${color}20`,
                            }}
                          >
                            {chip.label}
                          </span>
                        ))}
                      </div>
                    )}

                    {plan.description && (
                      <p className="text-sm text-muted-foreground leading-7 mb-5 whitespace-pre-line line-clamp-6">
                        {plan.description}
                      </p>
                    )}

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
                      disabled={isSubmitting}
                      onClick={() => handleOrder(plan)}
                    >
                      {isSubmitting ? (
                        <Loader2 className="w-4 h-4 ml-2 animate-spin" />
                      ) : (
                        <MessageCircle className="w-4 h-4 ml-2" />
                      )}
                      {isSubmitting ? "در حال ثبت..." : "ثبت سفارش و ادامه"}
                    </Button>
                  </div>
                );
              };

              if (planGroups && planGroups.length > 0) {
                const grouped = planGroups
                  .map((group) => ({
                    group,
                    items: paddedPlans.filter(
                      (item) => (item.plan.groupId || "other") === group.id
                    ),
                  }))
                  .filter((entry) => entry.items.length > 0);
                const groupedKeys = new Set(
                  grouped.flatMap((entry) => entry.items.map((item) => item.key))
                );
                const leftovers = paddedPlans.filter((item) => !groupedKeys.has(item.key));
                return (
                  <div className="space-y-12">
                    {grouped.map(({ group, items }) => (
                      <div key={group.id}>
                        <div className="flex items-center gap-4 mb-3">
                          <h3 className="text-xl font-bold whitespace-nowrap">{group.title}</h3>
                          <div className="h-px flex-1 bg-border/60" />
                        </div>
                        {group.description && (
                          <p className="text-sm text-muted-foreground mb-6">{group.description}</p>
                        )}
                        <div
                          className={`grid gap-6 ${
                            items.length === 1
                              ? "grid-cols-1 max-w-xl"
                              : items.length === 2
                                ? "grid-cols-1 sm:grid-cols-2 max-w-4xl"
                                : "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3"
                          }`}
                        >
                          {items.map(renderPlanCard)}
                        </div>
                      </div>
                    ))}
                    {leftovers.length > 0 && (
                      <div>
                        <div className="flex items-center gap-4 mb-6">
                          <h3 className="text-xl font-bold whitespace-nowrap">سایر پلن‌ها</h3>
                          <div className="h-px flex-1 bg-border/60" />
                        </div>
                        <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
                          {leftovers.map(renderPlanCard)}
                        </div>
                      </div>
                    )}
                  </div>
                );
              }

              return (
                <div className={`grid gap-6 ${planGridClass}`}>
                  {paddedPlans.map(renderPlanCard)}
                </div>
              );
            })()}
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
                برای مشاوره رایگان و انتخاب بهترین پلن، وارد صفحه پشتیبانی شوید و
                مستقیم با ادمین تلگرام در ارتباط باشید.
              </p>
              <Button size="lg" style={{ backgroundColor: color }} asChild>
                <Link to="/support">
                  <MessageCircle className="w-5 h-5 ml-2" />
                  مشاهده صفحه پشتیبانی
                </Link>
              </Button>
            </div>
          </div>
        </section>

        {/* SEO Section */}
        <section className="py-16 bg-muted/30">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto">
              <h2 className="text-2xl font-bold mb-6 text-center">
                🏆 فروشگاه جامع اکانت‌های هوش مصنوعی | نوا شاپ
              </h2>
              <div className="space-y-6 text-muted-foreground leading-8 text-justify">
                <p>
                  در عصری که <strong className="text-foreground">هوش مصنوعی</strong> مرزهای توانمندی انسان را جابه‌جا کرده، دسترسی بدون محدودیت به برترین ابزارها دیگر یک انتخاب نیست، بلکه <strong className="text-foreground">یک ضرورت</strong> است. <strong className="text-foreground">نوا شاپ</strong> به عنوان <strong className="text-foreground">بزرگترین فروشگاه اکانت هوش مصنوعی</strong> در ایران، با هدف حذف تحریم‌ها و موانع پرداخت ارزی، بستری امن و مطمئن برای <strong className="text-foreground">خرید اکانت AI</strong> فراهم کرده است.
                </p>
                <p>
                  برخلاف مجموعه‌های تک‌محصولی، ما در نوا شاپ <strong className="text-foreground">پکیج کاملی از قدرت</strong> را به شما ارائه می‌دهیم: از <Link to="/services/chatgpt" className="text-primary hover:underline font-semibold">خرید چت جی پی تی (ChatGPT) Plus / Pro-Business</Link> با دسترسی به مدل‌های پیشرفته OpenAI، تا <Link to="/services/grok" className="text-primary hover:underline font-semibold">خرید اشتراک گراک (Grok)</Link> برای تجربه xAI. همچنین <Link to="/services/perplexity" className="text-primary hover:underline font-semibold">پرپلکسیتی پرو (Perplexity Pro)</Link> برای جستجوی هوشمند و <Link to="/services/cursor" className="text-primary hover:underline font-semibold">کرسور پرو (Cursor Pro)</Link> برای برنامه‌نویسی حرفه‌ای در دسترس شماست.
                </p>
                <p>
                  متخصصان و برنامه‌نویسان نیز می‌توانند با <Link to="/services/cursor" className="text-primary hover:underline font-semibold">خرید اکانت کرسور پرو (Cursor Pro)</Link>، کدنویسی خود را به سطح جدیدی ببرند یا با <Link to="/services/gemini" className="text-primary hover:underline font-semibold">خرید جمینای پرو (Gemini Pro) و Ultra</Link> از اکوسیستم قدرتمند گوگل و <strong className="text-foreground">فضای ابری ۲ ترابایتی</strong> بهره‌مند شوند. برای سرگرمی و موسیقی هم <Link to="/services/spotify" className="text-primary hover:underline font-semibold">اشتراک اسپاتیفای پریمیوم (Spotify Premium)</Link> و <Link to="/services/telegram-premium" className="text-primary hover:underline font-semibold">تلگرام پریمیوم</Link> داریم.
                </p>
                <p>
                  تمامی اشتراک‌های ما به صورت <strong className="text-foreground">کاملاً قانونی</strong>، <strong className="text-foreground">اختصاصی</strong> و با <strong className="text-foreground">تحویل آنی</strong> ارائه می‌شوند. اولویت ما در نوا شاپ، <strong className="text-foreground">تضمین پایداری ۱۰۰٪</strong>، <strong className="text-foreground">پشتیبانی ۲۴ ساعته</strong> و <strong className="text-foreground">کیفیت تضمین‌شده</strong> است تا هیچ مانعی میان شما و آینده وجود نداشته باشد.
                </p>
              </div>
            </div>
          </div>
        </section>
      </main>

      <ShopFooter />
    </div>
  );
};

export default ServicePageLayout;
