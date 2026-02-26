import { useMemo, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { ArrowLeft, Check, Loader2, MessageCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { usePricesContext } from "@/contexts/PricesContext";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import { createOrder } from "@/lib/orders";

const SUPPORT_URL = "https://t.me/Nova_AI_Support";

const logos = {
  chatgpt: "/logos/chatgpt.svg",
  gemini: "/logos/gemini.svg",
  grok: "/logos/grok.svg",
  perplexity: "/logos/perplexity.svg",
  spotify: "/logos/spotify.svg",
  cursor: "/logos/cursor.svg",
  telegram: "/logos/telegram.svg",
  cards: "/logos/mastercard.svg",
};

interface PlanItem {
  id: string;
  title: string;
  subtitle: string;
  priceKey?: string;
  staticPrice?: string;
  badge?: string;
}

interface CategoryItem {
  id: string;
  title: string;
  subtitle: string;
  color: string;
  logo?: string;
  emoji?: string;
  href?: string;
  externalHref?: string;
  plans: PlanItem[];
}

const formatPrice = (price: number): string => {
  if (price <= 0) return "تماس بگیرید";
  return `${new Intl.NumberFormat("fa-IR").format(price)} تومان`;
};

const ServicesSection = () => {
  const { getPrice } = usePricesContext();
  const { user } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  const location = useLocation();
  const [submittingPlanId, setSubmittingPlanId] = useState<string | null>(null);

  const categories: CategoryItem[] = useMemo(
    () => [
      {
        id: "chatgpt",
        title: "ChatGPT",
        subtitle: "۶ پلن فعال",
        color: "#10B981",
        logo: logos.chatgpt,
        href: "/services/chatgpt",
        plans: [
          {
            id: "cgpt_pro_30day",
            title: "Pro ۳۰ روزه شخصی",
            subtitle: "اختصاصی",
            priceKey: "cgpt_pro_30day",
            badge: "پرفروش",
          },
          {
            id: "cgpt_pro_37day",
            title: "Pro ۳۷ روزه شخصی",
            subtitle: "اختصاصی",
            priceKey: "cgpt_pro_37day",
          },
          {
            id: "cgpt_pro_shared",
            title: "Pro اشتراکی",
            subtitle: "اقتصادی",
            priceKey: "cgpt_pro_shared",
          },
          {
            id: "cgpt_plus_team",
            title: "Plus تیمی ۵ نفره",
            subtitle: "تیمی",
            priceKey: "cgpt_plus_team",
          },
          {
            id: "cgpt_team",
            title: "Team تیمی (۳۷ روزه)",
            subtitle: "بیزنسی",
            priceKey: "cgpt_team",
          },
          {
            id: "cgpt_go_yearly",
            title: "GO یکساله",
            subtitle: "سالانه",
            priceKey: "cgpt_go_yearly",
          },
        ],
      },
      {
        id: "gemini",
        title: "Gemini",
        subtitle: "۵ پلن فعال",
        color: "#3B82F6",
        logo: logos.gemini,
        href: "/services/gemini",
        plans: [
          {
            id: "gem_month",
            title: "پلن یک‌ماهه",
            subtitle: "Gemini Pro",
            priceKey: "gem_month",
          },
          {
            id: "gem_3month",
            title: "پلن سه‌ماهه",
            subtitle: "Gemini Pro",
            priceKey: "gem_3month",
            badge: "محبوب",
          },
          {
            id: "gem_6month",
            title: "پلن شش‌ماهه",
            subtitle: "Gemini Pro",
            priceKey: "gem_6month",
          },
          {
            id: "gem_year_personal",
            title: "یکساله جیمیل شخصی",
            subtitle: "Gemini Pro",
            priceKey: "gem_year_personal",
          },
          {
            id: "gem_year_ready",
            title: "یکساله جیمیل آماده",
            subtitle: "Gemini Pro",
            priceKey: "gem_year_ready",
          },
        ],
      },
      {
        id: "grok",
        title: "Super Grok",
        subtitle: "۱ پلن فعال",
        color: "#0F172A",
        logo: logos.grok,
        href: "/services/grok",
        plans: [
          {
            id: "grok_monthly",
            title: "پلن ماهانه",
            subtitle: "Super Grok",
            priceKey: "grok_monthly",
          },
        ],
      },
      {
        id: "perplexity",
        title: "Perplexity",
        subtitle: "۲ پلن فعال",
        color: "#14B8A6",
        logo: logos.perplexity,
        href: "/services/perplexity",
        plans: [
          {
            id: "perplexity_monthly",
            title: "پلن یک‌ماهه",
            subtitle: "Perplexity Pro",
            priceKey: "perplexity_monthly",
          },
          {
            id: "perplexity_yearly",
            title: "پلن یکساله",
            subtitle: "Perplexity Pro",
            priceKey: "perplexity_yearly",
          },
        ],
      },
      {
        id: "spotify",
        title: "Spotify",
        subtitle: "۲ پلن فعال",
        color: "#1DB954",
        logo: logos.spotify,
        href: "/services/spotify",
        plans: [
          {
            id: "spotify_monthly",
            title: "پلن ۱ ماهه",
            subtitle: "Spotify Premium",
            priceKey: "spotify_monthly",
          },
          {
            id: "spotify_4month",
            title: "پلن ۴ ماهه",
            subtitle: "Spotify Premium",
            priceKey: "spotify_4month",
          },
        ],
      },
      {
        id: "cursor",
        title: "Cursor",
        subtitle: "۲ پلن فعال",
        color: "#6366F1",
        logo: logos.cursor,
        href: "/services/cursor",
        plans: [
          {
            id: "cursor_monthly",
            title: "پلن یک‌ماهه",
            subtitle: "Cursor Pro",
            priceKey: "cursor_monthly",
          },
          {
            id: "cursor_weekly",
            title: "پلن ۷ روزه (آفر)",
            subtitle: "Cursor Pro",
            priceKey: "cursor_weekly",
            badge: "آفر",
          },
        ],
      },
      {
        id: "telegram_premium",
        title: "Telegram Premium",
        subtitle: "۳ پلن فعال",
        color: "#0284C7",
        logo: logos.telegram,
        href: "/services/telegram-premium",
        plans: [
          {
            id: "tgpremium_3month",
            title: "پلن ۳ ماهه",
            subtitle: "Telegram Premium",
            priceKey: "tgpremium_3month",
          },
          {
            id: "tgpremium_6month",
            title: "پلن ۶ ماهه",
            subtitle: "Telegram Premium",
            priceKey: "tgpremium_6month",
          },
          {
            id: "tgpremium_12month",
            title: "پلن یکساله",
            subtitle: "Telegram Premium",
            priceKey: "tgpremium_12month",
            badge: "بهترین قیمت",
          },
        ],
      },
      {
        id: "cards",
        title: "ویزا و مستر کارت",
        subtitle: "۲ پلن فعال",
        color: "#EAB308",
        logo: logos.cards,
        href: "/services/cards",
        plans: [
          {
            id: "visa_card",
            title: "ویزا کارت",
            subtitle: "مجازی بین‌المللی",
            priceKey: "visa_card",
          },
          {
            id: "master_card",
            title: "مستر کارت",
            subtitle: "مجازی بین‌المللی",
            priceKey: "master_card",
          },
        ],
      },
      {
        id: "virtual_numbers",
        title: "شماره مجازی",
        subtitle: "۱۰ پلن فعال",
        color: "#A855F7",
        emoji: "📞",
        href: "/services/virtual-number",
        plans: [
          {
            id: "vnum_uk",
            title: "شماره انگلیس (+44)",
            subtitle: "شماره دائمی",
            priceKey: "vnum_uk",
          },
          {
            id: "vnum_us",
            title: "شماره آمریکا (+1)",
            subtitle: "شماره دائمی",
            priceKey: "vnum_us",
          },
          {
            id: "vnum_au",
            title: "شماره استرالیا (+61)",
            subtitle: "شماره دائمی",
            priceKey: "vnum_au",
          },
          {
            id: "vnum_ca",
            title: "شماره کانادا (+1)",
            subtitle: "شماره دائمی",
            priceKey: "vnum_ca",
          },
          {
            id: "vnum_tg_uk",
            title: "تلگرام انگلیس",
            subtitle: "حساب آماده",
            priceKey: "vnum_tg_uk",
          },
          {
            id: "vnum_tg_au",
            title: "تلگرام استرالیا",
            subtitle: "حساب آماده",
            priceKey: "vnum_tg_au",
          },
          {
            id: "vnum_tg_us",
            title: "تلگرام آمریکا",
            subtitle: "حساب آماده",
            priceKey: "vnum_tg_us",
          },
          {
            id: "vnum_tg_ca",
            title: "تلگرام کانادا",
            subtitle: "حساب آماده",
            priceKey: "vnum_tg_ca",
          },
          {
            id: "vnum_wa_uk",
            title: "واتساپ انگلیس",
            subtitle: "حساب آماده",
            priceKey: "vnum_wa_uk",
          },
          {
            id: "vnum_wa_ca",
            title: "واتساپ کانادا",
            subtitle: "حساب آماده",
            priceKey: "vnum_wa_ca",
          },
        ],
      },
      {
        id: "nano_banana",
        title: "Nano Banana Pro",
        subtitle: "ساخت تصویر AI",
        color: "#F59E0B",
        emoji: "🍌",
        externalHref: SUPPORT_URL,
        plans: [
          {
            id: "imggen_text",
            title: "متن به عکس",
            subtitle: "Gemini Image",
            staticPrice: "هر تصویر ۳ ستاره",
          },
          {
            id: "imggen_edit",
            title: "ادیت تصویر",
            subtitle: "با پرامپت دلخواه",
            staticPrice: "هر تصویر ۳ ستاره",
          },
          {
            id: "imggen_initial_credits",
            title: "اعتبار شروع",
            subtitle: "برای کاربر جدید",
            staticPrice: "۲۰ ستاره",
          },
        ],
      },
    ],
    []
  );

  const [activeCategoryId, setActiveCategoryId] = useState<string>(categories[0].id);

  const activeCategory =
    categories.find((category) => category.id === activeCategoryId) ?? categories[0];

  const paddedCategories = useMemo(() => {
    const entries = categories.map((category) => ({
      kind: "category" as const,
      key: category.id,
      category,
    }));

    const remainder = entries.length % 4;
    if (remainder === 0) {
      return entries;
    }

    const placeholders = Array.from({ length: 4 - remainder }, (_, idx) => ({
      kind: "placeholder" as const,
      key: `category-placeholder-${idx}`,
    }));

    return [...entries, ...placeholders];
  }, [categories]);

  const paddedPlans = useMemo(() => {
    const entries = activeCategory.plans.map((plan) => ({
      kind: "plan" as const,
      key: plan.id,
      plan,
    }));

    const remainder = entries.length % 4;
    if (remainder === 0) {
      return entries;
    }

    const placeholders = Array.from({ length: 4 - remainder }, (_, idx) => ({
      kind: "placeholder" as const,
      key: `plan-placeholder-${idx}`,
    }));

    return [...entries, ...placeholders];
  }, [activeCategory]);

  const handleOrder = async (plan: PlanItem) => {
    if (!plan.priceKey) {
      window.open(SUPPORT_URL, "_blank");
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

    const price = getPrice(plan.priceKey);
    setSubmittingPlanId(plan.id);

    const result = await createOrder({
      serviceId: activeCategory.id,
      serviceName: activeCategory.title,
      planId: plan.id,
      planName: plan.title,
      planDuration: plan.subtitle,
      price,
    });

    setSubmittingPlanId(null);

    if ("error" in result) {
      toast({
        title: "ثبت سفارش ناموفق بود",
        description: result.error,
        variant: "destructive",
      });
      return;
    }

    toast({
      title: "سفارش ثبت شد",
      description: `شناسه سفارش: ${result.data.order.id}`,
    });
    navigate("/dashboard");
  };

  return (
    <section id="services" className="py-20 relative">
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-6xl h-px bg-gradient-to-r from-transparent via-primary/50 to-transparent" />

      <div className="container mx-auto px-4">
        <div className="text-center mb-10">
          <h2 className="text-2xl md:text-3xl font-bold mb-4">اشتراک‌های موجود</h2>
          <p className="text-muted-foreground max-w-3xl mx-auto">
            دسته موردنظر را انتخاب کنید تا همه پلن‌های همان بخش را با قیمت دقیق ببینید.
          </p>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-8">
          {paddedCategories.map((item) => {
            if (item.kind === "placeholder") {
              return <div key={item.key} className="hidden lg:block" aria-hidden />;
            }

            const { category } = item;
            const isActive = category.id === activeCategory.id;

            return (
              <button
                key={category.id}
                type="button"
                onClick={() => setActiveCategoryId(category.id)}
                className={`group rounded-2xl border p-3 text-right transition-all duration-300 ${
                  isActive
                    ? "border-primary bg-primary/10 shadow-md shadow-primary/10"
                    : "border-border/50 bg-card/40 hover:border-primary/40"
                }`}
              >
                <div className="flex items-center gap-2 mb-2">
                  <div
                    className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0"
                    style={{ backgroundColor: `${category.color}1f` }}
                  >
                    {category.logo ? (
                      <img
                        src={category.logo}
                        alt={category.title}
                        className="w-6 h-6 object-contain"
                        loading="lazy"
                      />
                    ) : (
                      <span className="text-base">{category.emoji}</span>
                    )}
                  </div>
                  <div className="min-w-0">
                    <p className="font-semibold text-sm truncate">{category.title}</p>
                    <p className="text-[11px] text-muted-foreground truncate">{category.subtitle}</p>
                  </div>
                </div>

                <div className="flex items-center justify-end gap-1 text-[11px] text-muted-foreground">
                  {isActive && <Check className="w-3 h-3 text-primary" />}
                  <span>{isActive ? "انتخاب‌شده" : "مشاهده پلن‌ها"}</span>
                </div>
              </button>
            );
          })}
        </div>

        <div className="rounded-3xl border border-border/60 bg-card/40 p-5 md:p-7 backdrop-blur-sm">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
            <div className="flex items-center gap-3">
              <div
                className="w-12 h-12 rounded-2xl flex items-center justify-center"
                style={{ backgroundColor: `${activeCategory.color}24` }}
              >
                {activeCategory.logo ? (
                  <img
                    src={activeCategory.logo}
                    alt={activeCategory.title}
                    className="w-8 h-8 object-contain"
                    loading="lazy"
                  />
                ) : (
                  <span className="text-2xl">{activeCategory.emoji}</span>
                )}
              </div>

              <div>
                <h3 className="text-xl font-bold">{activeCategory.title}</h3>
                <p className="text-sm text-muted-foreground">
                  {activeCategory.plans.length} پلن موجود در این دسته
                </p>
              </div>
            </div>

            {activeCategory.externalHref ? (
              <a
                href={activeCategory.externalHref}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center justify-center gap-2 px-4 py-2 rounded-full border border-border/60 bg-background/40 hover:border-primary/40 transition-colors text-sm"
              >
                <span>ارتباط با پشتیبانی</span>
                <ArrowLeft className="w-4 h-4" />
              </a>
            ) : (
              activeCategory.href && (
                <Link
                  to={activeCategory.href}
                  className="inline-flex items-center justify-center gap-2 px-4 py-2 rounded-full border border-border/60 bg-background/40 hover:border-primary/40 transition-colors text-sm"
                >
                  <span>صفحه کامل {activeCategory.title}</span>
                  <ArrowLeft className="w-4 h-4" />
                </Link>
              )
            )}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {paddedPlans.map((item) => {
              if (item.kind === "placeholder") {
                return <div key={item.key} className="hidden lg:block" aria-hidden />;
              }

              const { plan } = item;
              const planPrice = plan.priceKey ? getPrice(plan.priceKey) : null;
              const priceText = plan.staticPrice ?? formatPrice(planPrice ?? 0);
              const isSubmitting = submittingPlanId === plan.id;

              return (
                <div
                  key={plan.id}
                  className="relative rounded-2xl border border-border/50 bg-background/50 p-4 hover:border-primary/40 transition-colors flex flex-col"
                >
                  {plan.badge && (
                    <span className="absolute top-3 left-3 text-[10px] font-bold px-2 py-1 rounded-full bg-primary text-primary-foreground">
                      {plan.badge}
                    </span>
                  )}

                  <p className="font-bold text-sm mb-1 pr-1">{plan.title}</p>
                  <p className="text-xs text-muted-foreground mb-4">{plan.subtitle}</p>

                  <div className="pt-3 border-t border-border/40 flex items-center justify-between mb-4">
                    <span className="text-base font-extrabold" style={{ color: activeCategory.color }}>
                      {priceText}
                    </span>
                    <span className="text-xs text-muted-foreground">قیمت نهایی</span>
                  </div>

                  <Button
                    type="button"
                    className="w-full mt-auto"
                    style={{ backgroundColor: activeCategory.color }}
                    disabled={isSubmitting}
                    onClick={() => handleOrder(plan)}
                  >
                    {isSubmitting ? (
                      <Loader2 className="w-4 h-4 ml-2 animate-spin" />
                    ) : (
                      <MessageCircle className="w-4 h-4 ml-2" />
                    )}
                    {isSubmitting
                      ? "در حال ثبت..."
                      : plan.priceKey
                        ? "ثبت سفارش"
                        : "ارتباط با پشتیبانی"}
                  </Button>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
};

export default ServicesSection;
