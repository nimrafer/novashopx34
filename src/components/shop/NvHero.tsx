import { ShieldCheck, Zap, MessageCircle } from "lucide-react";
import { useStoreCatalog } from "@/hooks/useStoreCatalog";

/** Mini-app hero card, fed live from the store panel design settings. */
const PERK_ICONS = [Zap, ShieldCheck, MessageCircle];

const DEFAULTS = {
  hero_badge: "✦ مرجع تخصصی اشتراک‌های هوش مصنوعی",
  hero_title: "دسترسی حرفه‌ای به بهترین ابزارهای هوش مصنوعی جهان",
  hero_subtitle: "ChatGPT، Gemini، Claude و ده‌ها سرویس دیگر با قیمت شفاف و فعال‌سازی سریع.",
  hero_perks: ["فعال‌سازی سریع", "ضمانت و گارانتی", "پشتیبانی فارسی"],
};

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
    <section className="pt-8 pb-4">
      <div className="container mx-auto px-4">
        <div className="nv-hero">
          <span className="nv-hero__tag">{badge}</span>
          <h1 className="nv-hero__title">{title}</h1>
          <p className="nv-hero__sub">{subtitle}</p>
          <div className="nv-hero__perks">
            {perks.map((perk, index) => {
              const Icon = PERK_ICONS[index % PERK_ICONS.length];
              return (
                <span key={index} className="nv-hero__perk">
                  <Icon className="w-3.5 h-3.5" />
                  {perk}
                </span>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
};

export default NvHero;
