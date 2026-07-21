import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, Search, Star } from "lucide-react";
import {
  StoreProduct,
  formatToman,
  normalizeText,
  storeMinPrice,
  storeProductRoute,
  useStoreCatalog,
} from "@/hooks/useStoreCatalog";

/** Local brand logos as fallback when the store product has no https image. */
const LOCAL_LOGOS: [RegExp, string][] = [
  [/chatgpt|چت جی پی تی/, "/logos/chatgpt.svg"],
  [/gemini|جمینای/, "/logos/gemini.svg"],
  [/claude|کلود/, "/logos/claude.webp"],
  [/grok|گروک|گراک/, "/logos/grok.svg"],
  [/perplexity|پرپلکسیتی/, "/logos/perplexity.svg"],
  [/spotify|اسپاتیفای/, "/logos/spotify.svg"],
  [/cursor|کرسور/, "/logos/cursor.svg"],
  [/telegram|تلگرام/, "/logos/telegram.svg"],
  [/visa|master|کارت/, "/logos/mastercard.svg"],
];

const productLogo = (product: StoreProduct): string | null => {
  if (product.image_url && /^https?:\/\//.test(product.image_url)) return product.image_url;
  const hay = normalizeText(
    `${product.slug} ${product.name} ${(product.search_aliases || []).join(" ")}`
  );
  const match = LOCAL_LOGOS.find(([pattern]) => pattern.test(hay));
  return match ? match[1] : null;
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
          <h2 className="text-3xl md:text-4xl font-bold mb-3">سرویس‌های نوا شاپ</h2>
          <p className="text-muted-foreground">
            قیمت‌ها و پلن‌ها لحظه‌ای از فروشگاه نوا به‌روز می‌شوند — همان کاتالوگ ربات و مینی‌اپ تلگرام.
          </p>
        </div>

        <div className="max-w-2xl mx-auto mb-6">
          <div className="glass rounded-2xl flex items-center gap-3 px-4 py-3">
            <Search className="w-5 h-5 text-muted-foreground shrink-0" />
            <input
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="جست‌وجوی سرویس؛ فارسی یا انگلیسی (مثلاً ChatGPT یا جمینای)"
              className="bg-transparent outline-none w-full text-sm"
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
                className={`rounded-full px-4 py-2 text-sm font-semibold transition-colors border ${
                  (category.slug === "all" && activeCategory === "all") ||
                  activeCategory === category.id
                    ? "bg-primary text-primary-foreground border-primary"
                    : "glass border-border/50 text-muted-foreground hover:border-primary/40"
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
              <div key={index} className="glass rounded-3xl p-6 animate-pulse h-48" />
            ))}
          </div>
        ) : error && !catalog ? (
          <div className="text-center text-muted-foreground py-12">
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
                return (
                  <Link
                    key={product.id}
                    to={storeProductRoute(product)}
                    className="glass rounded-3xl p-5 glass-hover border border-border/50 hover:border-primary/40 transition-all flex flex-col group"
                  >
                    <div className="flex items-start justify-between mb-4">
                      <div
                        className="w-14 h-14 rounded-2xl flex items-center justify-center overflow-hidden"
                        style={{ backgroundColor: `${product.accent_color}18` }}
                      >
                        {logo ? (
                          <img
                            src={logo}
                            alt={product.name}
                            className="w-9 h-9 object-contain"
                            loading="lazy"
                          />
                        ) : (
                          <span
                            className="text-xl font-black"
                            style={{ color: product.accent_color }}
                          >
                            {product.name.slice(0, 1)}
                          </span>
                        )}
                      </div>
                      {product.featured && (
                        <Star className="w-4 h-4 text-amber-400 fill-amber-400" />
                      )}
                    </div>

                    <h3 className="font-bold mb-1 group-hover:text-primary transition-colors">
                      {product.name}
                    </h3>
                    <p className="text-xs text-muted-foreground leading-6 mb-4 line-clamp-2">
                      {product.eyebrow || product.short_description}
                    </p>

                    <div className="mt-auto flex items-center justify-between text-xs">
                      <span className="text-muted-foreground">
                        {product.plans.length.toLocaleString("fa-IR")} پلن فعال
                      </span>
                      <span className="font-bold" style={{ color: product.accent_color }}>
                        {minPrice > 0 ? `از ${formatToman(minPrice)}` : "استعلام"}
                      </span>
                    </div>

                    <span className="mt-4 inline-flex items-center gap-1 text-xs font-semibold text-primary">
                      مشاهده پلن‌ها
                      <ArrowLeft className="w-3.5 h-3.5" />
                    </span>
                  </Link>
                );
              })}
            </div>
            {products.length === 0 && (
              <div className="text-center text-muted-foreground py-12">
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
