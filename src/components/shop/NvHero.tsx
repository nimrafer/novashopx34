import { Link } from "react-router-dom";
import { ShieldCheck, Zap, MessageCircle, ArrowLeft } from "lucide-react";
import { useStoreCatalog } from "@/hooks/useStoreCatalog";

/** Homepage hero — fed live from the store panel design settings (single
 *  source of truth with the mini app), rendered as the site's premium world. */
const PERK_ICONS = [Zap, ShieldCheck, MessageCircle];

const DEFAULTS = {
  hero_badge: "مرجع تخصصی اشتراک‌های هوش مصنوعی",
  hero_title: "دسترسی حرفه‌ای به بهترین ابزارهای هوش مصنوعی جهان",
  hero_subtitle: "ChatGPT، Gemini، Claude و ده‌ها سرویس دیگر با قیمت شفاف و فعال‌سازی سریع.",
  hero_perks: ["فعال‌سازی سریع", "ضمانت و گارانتی", "پشتیبانی فارسی"],
};

/** Official brand marks — untouched assets, each linking to its service page. */
const MONO_MARKS = new Set(["Perplexity", "Cursor", "Spotify"]);

const BRANDS: Array<[string, string, string]> = [
  ["ChatGPT", "/logos/chatgpt.svg", "/services/chatgpt"],
  ["Gemini", "/logos/gemini-2025.svg", "/services/gemini"],
  ["Claude", "/logos/claude-mark.svg", "/services/claude"],
  ["Grok", "/logos/grok.svg", "/services/grok"],
  ["Perplexity", "/logos/perplexity.svg", "/services/perplexity"],
  ["Cursor", "/logos/cursor.svg", "/services/cursor"],
  ["Spotify", "/logos/spotify.svg", "/services/spotify"],
  ["Telegram", "/logos/telegram.svg", "/services/telegram-premium"],
];

const NvHero = () => {
  const { catalog } = useStoreCatalog();
  const design = (catalog?.design || {}) as {
    hero_badge?: string;
    hero_title?: string;
    hero_subtitle?: string;
    hero_perks?: string[];
  };
  const badge = design.hero_badge || DEFAULTS.hero_badge;
  const title = design.hero_title || DEFAULTS.hero_title;
  const subtitle = design.hero_subtitle || DEFAULTS.hero_subtitle;
  const perks = design.hero_perks?.length ? design.hero_perks : DEFAULTS.hero_perks;

  return (
    <section className="nv2-hero" aria-labelledby="nv2-hero-title">
      <div className="nv2-hero__aurora" aria-hidden="true" />
      <div className="container mx-auto px-4">
        <div className="nv2-hero__inner">
          <span className="nv2-hero__badge">{badge}</span>
          <h1 className="nv2-hero__title" id="nv2-hero-title">{title}</h1>
          <p className="nv2-hero__sub">{subtitle}</p>

          <div className="nv2-hero__cta">
            <a className="nv2-btn nv2-btn--primary" href="#services">
              مشاهده سرویس‌ها و قیمت‌ها
              <ArrowLeft aria-hidden="true" className="w-4 h-4" />
            </a>
            <Link className="nv2-btn nv2-btn--ghost" to="/blog">
              راهنماهای خرید
            </Link>
          </div>

          <div className="nv2-hero__perks">
            {perks.map((perk, index) => {
              const Icon = PERK_ICONS[index % PERK_ICONS.length];
              return (
                <span key={index} className="nv2-hero__perk">
                  <Icon aria-hidden="true" className="w-4 h-4" />
                  {perk}
                </span>
              );
            })}
          </div>

          <nav className="nv2-brands" aria-label="سرویس‌های اصلی">
            {BRANDS.map(([name, logo, href], index) => (
              <Link
                key={name}
                to={href}
                className={`nv2-brand ${MONO_MARKS.has(name) ? "nv2-brand--mono" : ""}`}
                style={{ animationDelay: `${index * 0.35}s` }}
                title={`خرید اکانت ${name}`}
              >
                <img src={logo} alt={`لوگوی ${name}`} width={30} height={30} loading="lazy" />
                <span>{name}</span>
              </Link>
            ))}
          </nav>
        </div>
      </div>
    </section>
  );
};

export default NvHero;
