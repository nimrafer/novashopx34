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
  outOfStock?: boolean;
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
  const [detailPlan, setDetailPlan] = useState<Plan | null>(null);
  const highlightedPlanId = (searchParams.get("plan") || "").trim();
  const resolvedServiceId = serviceId || location.pathname.replace("/services/", "");
  const usesCentralStoreCheckout = resolvedServiceId.startsWith("store:");
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
    if (usesCentralStoreCheckout) {
      const planId = Number(plan.id);
      if (!Number.isInteger(planId) || planId <= 0) {
        toast({
          title: "این پلن فعلاً قابل سفارش نیست",
          description: "شناسه پلن با فروشگاه مرکزی همگام نشده است.",
          variant: "destructive",
        });
        return;
      }

      // The Mini App checkout is also a first-class browser checkout. It
      // creates a guest web session when Telegram initData is absent and uses
      // the exact same order, discount, central payment and delivery APIs.
      window.location.assign(`/checkout/${encodeURIComponent(String(planId))}`);
      return;
    }

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
    <div className="nv-scope min-h-screen">
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

        {/* Product header — mini app style */}
        <section className="pt-6 pb-2">
          <div className="container mx-auto px-4 max-w-4xl">
            <div className="flex items-center gap-2 text-sm mb-5" style={{ color: "var(--nv-muted)" }}>
              <Link to="/" className="hover:underline">صفحه اصلی</Link>
              <ArrowRight className="w-4 h-4 rotate-180" />
              <span style={{ color: "var(--nv-ink)" }}>{displayTitle}</span>
            </div>
            <div className="nv-phead">
              <div className="nv-phead__logo" style={{ ["--nv-tile" as string]: `${color}18` }}>
                {displayLogo ? (
                  <img src={displayLogo} alt={displayTitle} />
                ) : (
                  <Icon className="w-8 h-8" style={{ color }} />
                )}
              </div>
              <div>
                <h1 className="nv-phead__name">{displayTitle}</h1>
                <p className="nv-phead__eyebrow">{subtitle}</p>
              </div>
            </div>
            {displayDescription && (
              <div className="nv-note mt-4 whitespace-pre-line text-justify">{displayDescription}</div>
            )}
          </div>
        </section>

        {/* Features — mini app perk chips */}
        <section className="py-4">
          <div className="container mx-auto px-4 max-w-4xl">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {features.slice(0, 6).map((feature, idx) => (
                <div key={idx} className="nv-note flex items-start gap-2 !py-3">
                  <Check className="w-4 h-4 mt-1 shrink-0" style={{ color: "#0e9f6e" }} />
                  <span className="text-[13px] leading-7">{feature}</span>
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
        <section className="py-8">
          <div className="container mx-auto px-4 max-w-4xl">
            <h2 className="nv-section-title mb-2">🛍 پلن‌های خرید <small>روی هر پلن بزنید</small></h2>
            <p className="text-sm mb-6" style={{ color: "var(--nv-muted)" }}>
              {usesCentralStoreCheckout ? (
                <>
                  پرداخت از طریق سامانه مرکزی نوا انجام می‌شود؛ مبلغ دقیق و وضعیت
                  تأیید پرداخت به‌صورت خودکار نمایش داده خواهد شد.
                </>
              ) : (
                <>
                  بعد از ثبت سفارش، وضعیت آن از{" "}
                  <Link to="/dashboard" className="underline">پنل کاربری</Link>{" "}
                  قابل پیگیری است.
                </>
              )}
            </p>
            {(() => {
              const renderPlanCard = (item: { key: string; plan: Plan }) => {
                const { plan } = item;
                const isHighlighted =
                  highlightedPlanId.length > 0 &&
                  (plan.id === highlightedPlanId || `${plan.id}`.toLowerCase() === highlightedPlanId.toLowerCase());
                return (
                  <button
                    key={item.key}
                    type="button"
                    className={`nv-plan ${(plan.popular || isHighlighted) && !plan.outOfStock ? "nv-plan--popular" : ""} ${plan.outOfStock ? "nv-plan--oos opacity-60" : ""}`}
                    onClick={() => setDetailPlan(plan)}
                  >
                    {plan.outOfStock ? (
                      <span className="nv-plan__pop" style={{ background: "#64748b" }}>ناموجود</span>
                    ) : (
                      plan.popular && <span className="nv-plan__pop">پرفروش</span>
                    )}
                    <span className="nv-plan__main">
                      <span className="nv-plan__name block">{plan.name}</span>
                      {(plan.duration || plan.subtitle) && (
                        <span className="nv-plan__short block">{plan.duration || plan.subtitle}</span>
                      )}
                      {plan.badges && plan.badges.length > 0 && (
                        <span className="nv-plan__badges">
                          {plan.badges.map((chip, chipIdx) => (
                            <span
                              key={chipIdx}
                              className="nv-badge"
                              style={{
                                color: chip.text_color || undefined,
                                backgroundColor: chip.background_color || undefined,
                              }}
                            >
                              {chip.label}
                            </span>
                          ))}
                        </span>
                      )}
                    </span>
                    <span className="nv-plan__side">
                      <span className="nv-plan__price">
                        {plan.price > 0 ? (
                          <>
                            {plan.price.toLocaleString("fa-IR")} <small>تومان</small>
                          </>
                        ) : (
                          <small>استعلام قیمت</small>
                        )}
                      </span>
                      <span className="nv-plan__cta">جزئیات و خرید ←</span>
                    </span>
                  </button>
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
                  <div className="space-y-10">
                    {grouped.map(({ group, items }) => (
                      <div key={group.id}>
                        <h3 className="nv-group-title mb-1">{group.title}</h3>
                        {group.description && <p className="nv-group-desc mb-4">{group.description}</p>}
                        <div className="grid gap-3 mt-3 grid-cols-1 lg:grid-cols-2">
                          {items.map(renderPlanCard)}
                        </div>
                      </div>
                    ))}
                    {leftovers.length > 0 && (
                      <div>
                        <h3 className="nv-group-title mb-4">سایر پلن‌ها</h3>
                        <div className="grid gap-3 grid-cols-1 lg:grid-cols-2">
                          {leftovers.map(renderPlanCard)}
                        </div>
                      </div>
                    )}
                  </div>
                );
              }

              return (
                <div className="grid gap-3 grid-cols-1 lg:grid-cols-2">
                  {paddedPlans.map(renderPlanCard)}
                </div>
              );
            })()}
          </div>
        </section>

        {/* Plan detail sheet — mini app style */}
        {detailPlan && (
          <>
            <div className="nv-sheet-backdrop" onClick={() => setDetailPlan(null)} />
            <div className="nv-sheet" role="dialog" aria-modal="true" dir="rtl">
              <div className="nv-sheet__handle" />
              <div className="nv-sheet__head">
                <div className="nv-sheet__logo" style={{ ["--nv-tile" as string]: `${color}18` }}>
                  {displayLogo ? <img src={displayLogo} alt={displayTitle} /> : <Icon className="w-7 h-7" style={{ color }} />}
                </div>
                <div>
                  <div className="nv-sheet__name">{detailPlan.name}</div>
                  {(detailPlan.duration || detailPlan.subtitle) && (
                    <div className="text-xs mt-1" style={{ color: "var(--nv-muted)" }}>
                      {detailPlan.duration || detailPlan.subtitle}
                    </div>
                  )}
                  {detailPlan.badges && detailPlan.badges.length > 0 && (
                    <div className="flex flex-wrap gap-1.5 mt-2">
                      {detailPlan.badges.map((chip, chipIdx) => (
                        <span
                          key={chipIdx}
                          className="nv-badge"
                          style={{
                            color: chip.text_color || undefined,
                            backgroundColor: chip.background_color || undefined,
                          }}
                        >
                          {chip.label}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              </div>
              {detailPlan.description && <p className="nv-sheet__desc">{detailPlan.description}</p>}
              {detailPlan.features && detailPlan.features.length > 0 && (
                <ul className="nv-sheet__features">
                  {detailPlan.features.map((feature, idx) => (
                    <li key={idx}>
                      <Check />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
              )}
              <div className="nv-sheet__foot">
                <div className="nv-sheet__price flex-1">
                  <small>قیمت نهایی</small>
                  <b>
                    {detailPlan.price > 0 ? (
                      <>
                        {detailPlan.price.toLocaleString("fa-IR")} <em>تومان</em>
                      </>
                    ) : (
                      <em>استعلام از پشتیبانی</em>
                    )}
                  </b>
                </div>
                {detailPlan.outOfStock && (
                  <p className="text-sm rounded-xl bg-amber-50 text-amber-800 border border-amber-200 px-4 py-3 mb-3 leading-7">
                    <b>این پلن فعلاً ناموجود است.</b> به‌زودی دوباره شارژ می‌شود؛ کمی بعد سر بزنید.
                  </p>
                )}
                <button
                  type="button"
                  className="nv-btn disabled:opacity-50 disabled:cursor-not-allowed"
                  disabled={detailPlan.outOfStock}
                  onClick={() => {
                    const plan = detailPlan;
                    setDetailPlan(null);
                    handleOrder(plan);
                  }}
                >
                  {detailPlan.outOfStock
                    ? "ناموجود"
                    : usesCentralStoreCheckout
                      ? "خرید و پرداخت خودکار ←"
                      : "ثبت سفارش و ادامه ←"}
                </button>
              </div>
            </div>
          </>
        )}

        {/* FAQ Section */}
        {faqs && faqs.length > 0 && (
          <section className="py-8">
            <div className="container mx-auto px-4 max-w-4xl">
              <h2 className="nv-section-title mb-5">❓ سوالات متداول</h2>
              <div className="nv-faq">
                {faqs.map((faq, idx) => (
                  <details key={idx}>
                    <summary>{faq.question}</summary>
                    <p>{faq.answer}</p>
                  </details>
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
