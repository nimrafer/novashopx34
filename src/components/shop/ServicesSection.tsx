import { Link } from "react-router-dom";
import { usePricesContext } from "@/contexts/PricesContext";
import { ArrowLeft } from "lucide-react";

// Logo paths
const logos = {
  chatgpt: "/logos/chatgpt.png",
  gemini: "/logos/gemini.png",
  grok: "/logos/grok.png",
  claude: "/logos/claude.png",
  perplexity: "/logos/perplexity.png",
  spotify: "/logos/spotify.png",
  cursor: "/logos/cursor.png",
  telegram: "/logos/telegram.png",
};

interface ServiceItem {
  id: string;
  priceKey: string;
  logo: string;
  title: string;
  description: string;
  color: string;
  href: string;
  badge?: string;
}

const formatPrice = (price: number) => {
  if (price === 0) return "تماس بگیرید";
  return new Intl.NumberFormat("fa-IR").format(price);
};

const ServicesSection = () => {
  const { getPrice } = usePricesContext();

  // All services as individual items - one per row, no duplicate plans
  const services: ServiceItem[] = [
    // ChatGPT
    {
      id: "chatgpt-plus-shared",
      priceKey: "cgpt_pro_shared",
      logo: logos.chatgpt,
      title: "ChatGPT Plus اشتراکی",
      description: "اشتراک با ۲ نفر • GPT-4o • اقتصادی",
      color: "#10B981",
      href: "/services/chatgpt",
    },
    {
      id: "chatgpt-plus-30",
      priceKey: "cgpt_pro_30day",
      logo: logos.chatgpt,
      title: "ChatGPT Plus اختصاصی ۳۰ روزه",
      description: "GPT-4o • GPT-5 • DALL-E 3 • اختصاصی",
      color: "#10B981",
      href: "/services/chatgpt",
      badge: "پرفروش",
    },
    {
      id: "chatgpt-plus-37",
      priceKey: "cgpt_pro_37day",
      logo: logos.chatgpt,
      title: "ChatGPT Plus اختصاصی ۳۷ روزه",
      description: "GPT-4o • GPT-5 • DALL-E 3 • تمدید آسان",
      color: "#10B981",
      href: "/services/chatgpt",
    },
    {
      id: "chatgpt-pro",
      priceKey: "cgpt_pro_200",
      logo: logos.chatgpt,
      title: "ChatGPT Pro ۲۰۰ دلاری",
      description: "O3-Pro • بدون محدودیت • حرفه‌ای",
      color: "#8B5CF6",
      href: "/services/chatgpt",
      badge: "ویژه",
    },
    {
      id: "chatgpt-team",
      priceKey: "cgpt_plus_team",
      logo: logos.chatgpt,
      title: "ChatGPT Plus تیمی",
      description: "تا ۷ نفر • مناسب شرکت‌ها",
      color: "#3B82F6",
      href: "/services/chatgpt",
    },

    // Gemini
    {
      id: "gemini-1m",
      priceKey: "gem_exclusive_1month",
      logo: logos.gemini,
      title: "Gemini Pro اختصاصی یک‌ماهه",
      description: "۲ ترابایت Google One • Veo 3",
      color: "#60A5FA",
      href: "/services/gemini",
    },
    {
      id: "gemini-3m",
      priceKey: "gem_exclusive_3month",
      logo: logos.gemini,
      title: "Gemini Pro اختصاصی سه‌ماهه",
      description: "۲ ترابایت Google One • صرفه‌جویی ۲۰٪",
      color: "#A855F7",
      href: "/services/gemini",
      badge: "پرفروش",
    },
    {
      id: "gemini-6m",
      priceKey: "gem_exclusive_6month",
      logo: logos.gemini,
      title: "Gemini Pro اختصاصی شش‌ماهه",
      description: "۲ ترابایت Google One • بهترین ارزش",
      color: "#F472B6",
      href: "/services/gemini",
    },
    {
      id: "gemini-9m",
      priceKey: "gem_exclusive_9month",
      logo: logos.gemini,
      title: "Gemini Pro اختصاصی نه‌ماهه",
      description: "۲ ترابایت Google One • بیشترین صرفه",
      color: "#FBBF24",
      href: "/services/gemini",
    },
    {
      id: "gemini-ultra",
      priceKey: "gemini_ultra",
      logo: logos.gemini,
      title: "Gemini Ultra",
      description: "قدرتمندترین مدل گوگل • پروژه‌های حرفه‌ای",
      color: "#10B981",
      href: "/services/gemini",
      badge: "پیشرفته",
    },

    // Grok
    {
      id: "grok",
      priceKey: "grok_monthly",
      logo: logos.grok,
      title: "Super Grok ماهانه",
      description: "Grok-4 • Aurora • بدون سانسور",
      color: "#374151",
      href: "/services/grok",
      badge: "بدون فیلتر",
    },

    // Claude
    {
      id: "claude-pro",
      priceKey: "claude_pro",
      logo: logos.claude,
      title: "Claude Pro ماهانه",
      description: "Claude Opus 4.5 • ۲۰۰K توکن • Artifacts",
      color: "#F97316",
      href: "/services/claude",
    },
    {
      id: "claude-shared",
      priceKey: "claude_pro_shared",
      logo: logos.claude,
      title: "Claude Pro اشتراکی",
      description: "Claude Opus • اقتصادی",
      color: "#EA580C",
      href: "/services/claude",
    },

    // Cursor
    {
      id: "cursor-weekly",
      priceKey: "cursor_weekly",
      logo: logos.cursor,
      title: "Cursor هفتگی",
      description: "۷ روزه • مناسب تست پروژه",
      color: "#3B82F6",
      href: "/services/cursor",
    },
    {
      id: "cursor-monthly",
      priceKey: "cursor_monthly",
      logo: logos.cursor,
      title: "Cursor ماهانه",
      description: "AI کدنویسی حرفه‌ای • تکمیل خودکار",
      color: "#3B82F6",
      href: "/services/cursor",
      badge: "برنامه‌نویسان",
    },

    // Perplexity
    {
      id: "perplexity-m",
      priceKey: "perplexity_monthly",
      logo: logos.perplexity,
      title: "Perplexity Pro ماهانه",
      description: "جستجوی هوشمند • منابع معتبر",
      color: "#14B8A6",
      href: "/services/perplexity",
    },
    {
      id: "perplexity-y",
      priceKey: "perplexity_yearly",
      logo: logos.perplexity,
      title: "Perplexity Pro یکساله",
      description: "جستجوی هوشمند • صرفه‌جویی ۷۰٪",
      color: "#0D9488",
      href: "/services/perplexity",
      badge: "پیشنهادی",
    },

    // Spotify
    {
      id: "spotify-m",
      priceKey: "spotify_monthly",
      logo: logos.spotify,
      title: "Spotify Premium ماهانه",
      description: "موسیقی نامحدود • بدون تبلیغات",
      color: "#1DB954",
      href: "/services/spotify",
    },
    {
      id: "spotify-4m",
      priceKey: "spotify_4month",
      logo: logos.spotify,
      title: "Spotify Premium چهارماهه",
      description: "موسیقی نامحدود • صرفه‌جویی",
      color: "#1DB954",
      href: "/services/spotify",
    },

    // Telegram
    {
      id: "tg-3m",
      priceKey: "tgpremium_3month",
      logo: logos.telegram,
      title: "Telegram Premium سه‌ماهه",
      description: "استیکرها • ترجمه • دانلود سریع",
      color: "#0088CC",
      href: "/services/telegram-premium",
    },
    {
      id: "tg-6m",
      priceKey: "tgpremium_6month",
      logo: logos.telegram,
      title: "Telegram Premium شش‌ماهه",
      description: "استیکرها • ترجمه • صرفه‌جویی",
      color: "#0088CC",
      href: "/services/telegram-premium",
    },
    {
      id: "tg-12m",
      priceKey: "tgpremium_12month",
      logo: logos.telegram,
      title: "Telegram Premium یکساله",
      description: "استیکرها • ترجمه • بهترین قیمت",
      color: "#0088CC",
      href: "/services/telegram-premium",
      badge: "بهترین ارزش",
    },
  ];

  return (
    <section id="services" className="py-20 relative">
      {/* Background Effect */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-6xl h-px bg-gradient-to-r from-transparent via-primary/50 to-transparent" />

      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="text-center mb-12">
          <h2 className="text-2xl md:text-3xl font-bold mb-4">
            تمامی اشتراک‌های موجود
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            روی هر اشتراک کلیک کنید تا وارد صفحه توضیحات و خرید شوید
          </p>
        </div>

        {/* Services Grid - Clean 4 column layout */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {services.map((service) => {
            const price = getPrice(service.priceKey);
            return (
              <Link
                key={service.id}
                to={service.href}
                className="group relative bg-card/50 backdrop-blur-sm border border-border/50 rounded-2xl p-4 hover:border-primary/50 hover:bg-card/80 transition-all duration-300 hover:shadow-lg hover:shadow-primary/5"
              >
                {/* Badge */}
                {service.badge && (
                  <div className="absolute -top-2 -right-2 z-10">
                    <span
                      className="text-[10px] font-bold px-2 py-1 rounded-full text-white shadow-md"
                      style={{ backgroundColor: service.color }}
                    >
                      {service.badge}
                    </span>
                  </div>
                )}

                <div className="flex items-center gap-3">
                  {/* Logo */}
                  <div
                    className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 transition-transform duration-300 group-hover:scale-110"
                    style={{ backgroundColor: `${service.color}20` }}
                  >
                    <img
                      src={service.logo}
                      alt={service.title}
                      className="w-8 h-8 object-contain"
                      loading="lazy"
                    />
                  </div>

                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <h3 className="font-bold text-sm text-foreground truncate group-hover:text-primary transition-colors">
                      {service.title}
                    </h3>
                    <p className="text-xs text-muted-foreground truncate mt-0.5">
                      {service.description}
                    </p>
                  </div>
                </div>

                {/* Price Row */}
                <div className="flex items-center justify-between mt-3 pt-3 border-t border-border/30">
                  <div className="flex items-baseline gap-1">
                    <span className="text-lg font-bold" style={{ color: service.color }}>
                      {formatPrice(price)}
                    </span>
                    <span className="text-xs text-muted-foreground">تومان</span>
                  </div>
                  <div className="flex items-center gap-1 text-xs text-muted-foreground group-hover:text-primary transition-colors">
                    <span>مشاهده</span>
                    <ArrowLeft className="w-3 h-3 group-hover:-translate-x-1 transition-transform" />
                  </div>
                </div>
              </Link>
            );
          })}
        </div>

        {/* Additional Services Link */}
        <div className="mt-8 text-center">
          <div className="inline-flex gap-4 flex-wrap justify-center">
            <Link
              to="/services/cards"
              className="inline-flex items-center gap-2 px-6 py-3 bg-card/50 border border-border/50 rounded-full hover:border-primary/50 transition-all text-sm"
            >
              <span className="text-xl">💳</span>
              <span>کارت‌های ارزی</span>
              <ArrowLeft className="w-4 h-4" />
            </Link>
            <Link
              to="/services/virtual-number"
              className="inline-flex items-center gap-2 px-6 py-3 bg-card/50 border border-border/50 rounded-full hover:border-primary/50 transition-all text-sm"
            >
              <span className="text-xl">📞</span>
              <span>شماره‌های مجازی</span>
              <ArrowLeft className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ServicesSection;
