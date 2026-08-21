import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, Search, Star } from "lucide-react";
import SaleTimer from "@/components/shop/SaleTimer";
import {
  StoreProduct,
  formatToman,
  normalizeText,
  storeMediaUrl,
  storeMinPrice,
  planEffectivePrice,
  storeProductRoute,
  useStoreCatalog,
} from "@/hooks/useStoreCatalog";

/** Local brand logos as fallback when the store product has no https image. */
const LOCAL_LOGOS: [RegExp, string][] = [
  [/chatgpt|چت جی پی تی/, "/logos/chatgpt.svg"],
  [/gemini|جمینای/, "/logos/gemini-2025.svg"],
  [/claude|کلود/, "/logos/claude-mark.svg"],
  [/grok|گروک|گراک/, "/logos/grok.svg"],
  [/perplexity|پرپلکسیتی/, "/logos/perplexity.svg"],
  [/spotify|اسپاتیفای/, "/logos/spotify.svg"],
  [/cursor|کرسور/, "/logos/cursor.svg"],
  [/telegram|تلگرام/, "/logos/telegram.svg"],
  [/capcut|کپ کات/, "/logos/capcut.svg"],
  [/youtube|یوتیوب/, "/app/assets/products/youtube-premium-music.svg"],
  [/vpn|وی پی ان/, "/app/assets/products/vpn.svg"],
  [/visa|master|کارت|ویزا/, "/app/assets/products/cards.webp"],
];

const productLogo = (product: StoreProduct): string | null => {
  /* Brand marks first: the mini-app product images are plan-marketing art and
     read wrong inside the small square tile; official logos always win here. */
  // Identity only (slug+name): search aliases carry cross-sell terms — the
  // Antigravity product lists «gemini» there and was getting the Gemini logo.
  const hay = normalizeText(`${product.slug} ${product.name}`);
  const match = LOCAL_LOGOS.find(([pattern]) => pattern.test(hay));
  if (match) return match[1];
  return storeMediaUrl(product.image_url);
};

const ServicesSection = () => {
  const { catalog, loading, error } = useStoreCatalog();
  const [activeCategory, setActiveCategory] = useState("all");
  const [query, setQuery] = useState("");

  const products = useMemo(() => {
    if (!catalog) return [];
    let list = catalog.products;
    if (activeCategory !== "all") {
      list = list.filter((p) => (p.category_ids || []).includes(activeCategory));
    }
    const q = normalizeText(query);
    if (q) {
      const tokens = q.split(" ").filter(Boolean);
      list = list.filter((p) => {
        const hay = normalizeText(
          `${p.name} ${p.slug} ${p.eyebrow} ${p.short_description} ${(p.search_aliases || []).join(" ")} ${p.plans
            .map((plan) => plan.name)
            .join(" ")}`
        );
        return tokens.every((token) => hay.includes(token));
      });
    }
    return list;
  }, [catalog, activeCategory, query]);

  const categories = useMemo(() => {
    if (!catalog) return [];
    const used = new Set(catalog.products.flatMap((p) => p.category_ids || []));
    return catalog.categories.filter((c) => c.slug === "all" || used.has(c.id));
  }, [catalog]);

  return (
    <section id="services" className="py-16">
      <div className="container mx-auto px-4">
        <div className="text-center mb-10">
          <h2 className="text-3xl md:text-4xl font-black mb-3" style={{ color: "var(--nv-ink)" }}>سرویس‌های نوا شاپ</h2>
          <p style={{ color: "var(--nv-muted)" }}>
            قیمت‌ها و پلن‌ها لحظه‌ای از فروشگاه نوا به‌روز می‌شوند — همان کاتالوگ ربات و مینی‌اپ تلگرام.
          </p>
        </div>

        <div className="max-w-2xl mx-auto mb-6">
          <div className="nv-search">
            <Search className="w-5 h-5" />
            <input
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="جست‌وجوی سرویس؛ فارسی یا انگلیسی (مثلاً ChatGPT یا جمینای)"
              aria-label="جست‌وجوی سرویس"
            />
          </div>
        </div>

        {categories.length > 1 && (
          <div className="flex flex-wrap justify-center gap-2 mb-10">
            {categories.map((category) => (
              <button
                key={category.id}
                onClick={() => setActiveCategory(category.slug === "all" ? "all" : category.id)}
                className={`nv-chip ${
                  (category.slug === "all" && activeCategory === "all") ||
                  activeCategory === category.id
                    ? "nv-chip--on"
                    : ""
                }`}
              >
                {category.name}
              </button>
            ))}
          </div>
        )}

        {loading && !catalog ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {Array.from({ length: 8 }).map((_, index) => (
              <div key={index} className="nv-pcard animate-pulse h-48" />
            ))}
          </div>
        ) : error && !catalog ? (
          <div className="text-center py-12" style={{ color: "var(--nv-muted)" }}>
            کاتالوگ موقتاً در دسترس نیست؛ لطفاً صفحه را دوباره بارگیری کنید یا از{" "}
            <Link to="/support" className="text-primary hover:underline">
              پشتیبانی
            </Link>{" "}
            کمک بگیرید.
          </div>
        ) : (
          <>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {products.map((product) => {
                const logo = productLogo(product);
                const minPrice = storeMinPrice(product);
                const bestSale = (product.plans || []).reduce(
                  (best, plan) =>
                    plan.sale && plan.sale.percent > (best?.percent || 0) ? plan.sale : best,
                  null as null | { percent: number; title: string }
                );
                return (
                  <Link
                    key={product.id}
                    to={storeProductRoute(product)}
                    className="nv-pcard group"
                    style={{ ["--nv-accent" as string]: product.accent_color, ["--nv-tile" as string]: `${product.accent_color}18` }}
                  >
                    <span className="nv-pcard__glow" />
                    <div className="flex items-start justify-between w-full mb-1">
                      <div className="nv-pcard__logo">
                        {logo ? (
                          <img src={logo} alt={product.name} loading="lazy" />
                        ) : (
                          <span className="text-xl font-black" style={{ color: product.accent_color }}>
                            {product.name.slice(0, 1)}
                          </span>
                        )}
                      </div>
                      <span className="flex items-center gap-1.5 flex-wrap justify-end">
                        {(product.badges || []).slice(0, 3).map((badge) => {
                          const preset = String(badge.id || "").startsWith("preset_") ? String(badge.id).slice(7) : "";
                          return (
                            <span
                              key={badge.id || badge.label}
                              className={`nv-pbadge${preset ? ` nv-pbadge--${preset}` : ""}`}
                              style={preset ? undefined : { color: badge.text_color, background: badge.background_color }}
                            >
                              {badge.label}
                            </span>
                          );
                        })}
                        {bestSale && (
                          <span className="text-[10px] font-bold text-white rounded-full px-2 py-0.5" style={{ background: "linear-gradient(110deg,#e11d48,#f97316)" }}>
                            جشنواره ٪{bestSale.percent.toLocaleString("fa-IR")}
                          </span>
                        )}
                        {product.featured && <Star className="w-4 h-4 text-amber-400 fill-amber-400" />}
                      </span>
                    </div>

                    {bestSale?.ends_at && (
                      <SaleTimer endsAt={bestSale.ends_at} className="mb-2" />
                    )}
                    <h3 className="nv-pcard__name">{product.name}</h3>
                    <p className="nv-pcard__eyebrow line-clamp-2">
                      {product.eyebrow || product.short_description}
                    </p>

                    <div className="nv-pcard__meta">
                      <span className="nv-pcard__count">
                        {product.plans.length.toLocaleString("fa-IR")} پلن فعال
                      </span>
                      <span className="nv-pcard__price">
                        {minPrice > 0 ? `از ${formatToman(minPrice)}` : "استعلام قیمت"}
                      </span>
                    </div>

                    <span className="mt-3 inline-flex items-center gap-1 text-xs font-bold" style={{ color: "var(--nv-brand)" }}>
                      مشاهده پلن‌ها
                      <ArrowLeft className="w-3.5 h-3.5" />
                    </span>
                  </Link>
                );
              })}
            </div>
            {products.length === 0 && (
              <div className="text-center py-12" style={{ color: "var(--nv-muted)" }}>
                نتیجه‌ای برای جست‌وجوی شما پیدا نشد.
              </div>
            )}
          </>
        )}
      </div>
    </section>
  );
};

export default ServicesSection;
