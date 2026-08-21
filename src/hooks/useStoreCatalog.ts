import { useCallback, useEffect, useState } from "react";

/**
 * Live catalog from the Nova store panel (mini app backend).
 * Single source of truth for products, plans, prices, plan groups,
 * badges and content blocks — everything the admin edits in /store-admin/.
 */

export interface StoreBadge {
  id?: string;
  label: string;
  icon?: string;
  text_color?: string;
  background_color?: string;
}

export interface StorePlan {
  id: number;
  slug: string;
  name: string;
  short_description: string;
  description: string;
  price: number;
  currency: string;
  image_url: string;
  features: string[];
  status: string;
  popular: boolean;
  draft: boolean;
  sort_order: number;
  plan_group_id: string | null;
  out_of_stock: boolean;
  auto_badges: boolean;
  custom_badges: StoreBadge[];
  tos?: {
    required?: boolean;
    text?: string;
    link_label?: string;
    link_url?: string;
  } | null;
  sale?: {
    sale_price: number;
    percent: number;
    title: string;
    starts_at: string | null;
    ends_at: string | null;
  } | null;
}

export interface StorePlanGroup {
  id: string;
  title: string;
  description: string;
  sort_order: number;
}

export interface StoreBlock {
  id?: string;
  type: string;
  title?: string;
  body?: string;
  items?: string[];
  tone?: string;
  enabled?: boolean;
  [key: string]: unknown;
}

export interface StoreProduct {
  id: number;
  slug: string;
  name: string;
  eyebrow: string;
  short_description: string;
  description: string;
  image_url: string;
  accent_color: string;
  featured: boolean;
  draft: boolean;
  sort_order: number;
  category_ids: string[];
  search_aliases: string[];
  plan_groups: StorePlanGroup[];
  content_blocks: StoreBlock[];
  requires_phone_verification?: boolean;
  badges?: StoreBadge[];
  plans: StorePlan[];
}

export interface StoreCategory {
  id: string;
  slug: string;
  name: string;
  icon?: string;
  search_aliases?: string[];
  status?: string;
  sort_order: number;
}

export interface StoreCatalog {
  products: StoreProduct[];
  categories: StoreCategory[];
  design?: Record<string, unknown>;
}

const CACHE_DURATION = 60 * 1000;
let catalogCache: StoreCatalog | null = null;
let cacheTimestamp = 0;
/* Difference between the store server's clock and this browser's, so festival
   countdowns stay honest even when the device clock is wrong. */
let serverOffsetMs = 0;

/** fa/en text normalizer so lookups work in both languages */
export const normalizeText = (value: string): string =>
  String(value || "")
    .toLowerCase()
    .replace(/[يى]/g, "ی")
    .replace(/ك/g, "ک")
    .replace(/[‌‏‎]/g, " ")
    .replace(/[-_]/g, " ")
    .replace(/\s+/g, " ")
    .trim();

/** Legacy site routes we must keep for SEO — matched against store products. */
const LEGACY_ROUTE_KEYWORDS: Record<string, string[]> = {
  chatgpt: ["chatgpt", "چت جی پی تی"],
  gemini: ["gemini", "جمینای"],
  grok: ["grok", "گروک", "گراک"],
  claude: ["claude", "کلود"],
  perplexity: ["perplexity", "پرپلکسیتی"],
  spotify: ["spotify", "اسپاتیفای"],
  cursor: ["cursor", "کرسور"],
  "telegram-premium": ["telegram premium", "تلگرام پریمیوم", "تلگرام پرمیوم"],
  "youtube-premium-music": ["youtube premium music", "youtube", "یوتیوب"],
  "canva-pro": ["canva pro", "canva", "کانوا"],
  capcut: ["capcut", "کپ کات", "کپ‌کات"],
  vpn: ["nova vpn", "vpn", "وی پی ان"],
  cards: ["mastercard", "visa", "مسترکارت", "ویزا", "کارت ارزی"],
  "virtual-number": ["virtual number", "شماره مجازی"],
};

const productHaystack = (product: StoreProduct): string =>
  normalizeText(
    [product.slug, product.name, product.eyebrow, ...(product.search_aliases || [])].join(" ")
  );

/* Routing must ignore search aliases/eyebrow: the admin adds marketing terms
   there (e.g. «gemini» on the Antigravity product so searches find it), and
   matching them sent products to a competitor's page. Identity = slug + name. */
const identityHaystack = (product: StoreProduct): string =>
  normalizeText([product.slug, product.name].join(" "));

/** Find the store product that a site route slug refers to. */
export const findStoreProduct = (
  products: StoreProduct[],
  routeSlug: string
): StoreProduct | undefined => {
  const slug = normalizeText(routeSlug);
  const exact = products.find(
    (p) =>
      normalizeText(p.slug) === slug ||
      normalizeText(p.slug.replace(/^adm_/, "")) === slug
  );
  if (exact) return exact;
  const keywords = LEGACY_ROUTE_KEYWORDS[routeSlug] || [routeSlug.replace(/-/g, " ")];
  // identity first, aliases second — so an alias never outranks the real owner
  const byIdentity = products.find((p) =>
    keywords.some((keyword) => identityHaystack(p).includes(normalizeText(keyword)))
  );
  if (byIdentity) return byIdentity;
  return products.find((p) => {
    const hay = productHaystack(p);
    return keywords.some((keyword) => hay.includes(normalizeText(keyword)));
  });
};

/** Site route for a store product (keeps legacy /services/* URLs for SEO). */
export const storeProductRoute = (product: StoreProduct): string => {
  const hay = identityHaystack(product);
  for (const [route, keywords] of Object.entries(LEGACY_ROUTE_KEYWORDS)) {
    if (keywords.some((keyword) => hay.includes(normalizeText(keyword)))) {
      return `/services/${route}`;
    }
  }
  return `/services/${product.slug.replace(/^adm_/, "").replace(/_/g, "-")}`;
};

const FA_TO_EN = "۰۱۲۳۴۵۶۷۸۹";
const WORD_NUMBERS: Record<string, number> = {
  "یک": 1, "دو": 2, "سه": 3, "چهار": 4, "پنج": 5, "شش": 6,
  "هفت": 7, "هشت": 8, "نه": 9, "ده": 10, "دوازده": 12, "هجده": 18,
};

/** Best-effort plan duration in months, parsed from the Persian title
 *  («۳ ماهه», «یک‌ماهه», «ده‌روزه» …). Unknown durations sort last. */
export const planDurationMonths = (plan: StorePlan): number => {
  const text = `${plan.name} ${plan.short_description}`
    .replace(/[۰-۹]/g, (d) => String(FA_TO_EN.indexOf(d)))
    .replace(/[‌ـ]/g, " ");
  const num = (raw: string): number =>
    /^\d+$/.test(raw) ? Number(raw) : WORD_NUMBERS[raw.trim()] ?? NaN;
  let match = text.match(/(\d+|[آ-ی]+)\s*(?:ماهه|ماه)/);
  if (match && !Number.isNaN(num(match[1]))) return num(match[1]);
  match = text.match(/(\d+|[آ-ی]+)\s*(?:روزه|روز)/);
  if (match && !Number.isNaN(num(match[1]))) return num(match[1]) / 30;
  match = text.match(/(\d+|[آ-ی]+)\s*(?:ساله|سال)/);
  if (match && !Number.isNaN(num(match[1]))) return num(match[1]) * 12;
  return Number.POSITIVE_INFINITY;
};

export interface StorePlanGroupView {
  id: string;
  title: string;
  description: string;
  plans: StorePlan[];
}

/** The mini app's plan grouping, for the website: admin-defined groups in
 *  their order, plans inside each group sorted by duration then sort_order. */
export const groupStorePlans = (product: StoreProduct | null | undefined): StorePlanGroupView[] => {
  if (!product) return [];
  const live = [...(product.plans || [])]
    .filter((plan) => !plan.draft && plan.status === "active")
    .sort(
      (a, b) =>
        planDurationMonths(a) - planDurationMonths(b) || a.sort_order - b.sort_order
    );
  const groups = [...(product.plan_groups || [])].sort(
    (a, b) => Number(a.sort_order || 0) - Number(b.sort_order || 0)
  );
  if (!groups.length) {
    return live.length ? [{ id: "all", title: "", description: "", plans: live }] : [];
  }
  const known = new Set(groups.map((group) => group.id));
  const views: StorePlanGroupView[] = groups.map((group) => ({
    id: group.id,
    // «گروه بدون عنوان» is the admin default placeholder, not a real heading.
    title: group.title === "گروه بدون عنوان" ? "" : group.title || "",
    description: (group as { description?: string }).description || "",
    plans: live.filter((plan) => plan.plan_group_id === group.id),
  }));
  const rest = live.filter((plan) => !plan.plan_group_id || !known.has(plan.plan_group_id));
  if (rest.length) views.push({ id: "other", title: "سایر پلن‌ها", description: "", plans: rest });
  return views.filter((view) => view.plans.length > 0);
};

/** Festival (flash-sale) aware price — keeps web and Mini App in sync. */
export const planEffectivePrice = (plan: StorePlan): number =>
  plan.sale && plan.sale.sale_price > 0 ? plan.sale.sale_price : plan.price;

export const storeMinPrice = (product: StoreProduct): number => {
  const prices = (product.plans || [])
    .map((plan) => planEffectivePrice(plan))
    .filter((price) => price > 0);
  return prices.length ? Math.min(...prices) : 0;
};

export const formatToman = (price: number): string =>
  price > 0 ? `${price.toLocaleString("fa-IR")} تومان` : "استعلام قیمت";

/**
 * Resolve media exactly as it is configured in the Mini App catalog.
 *
 * Product images are commonly stored under `/app/assets/...` on the same
 * production hostname.  The storefront used to reject those paths and replace
 * them with its own legacy logo map, which made the two storefronts look out of
 * sync even though they were reading the same product record.
 */
export const storeMediaUrl = (value: string | null | undefined): string | null => {
  const source = String(value || "").trim();
  if (!source) return null;
  if (/^https?:\/\//i.test(source) || source.startsWith("/")) return source;
  return `/${source.replace(/^\.?\//, "")}`;
};

export const useStoreCatalog = () => {
  const [catalog, setCatalog] = useState<StoreCatalog | null>(catalogCache);
  const [loading, setLoading] = useState(!catalogCache);
  const [error, setError] = useState<string | null>(null);

  const fetchCatalog = useCallback(async () => {
    if (catalogCache && Date.now() - cacheTimestamp < CACHE_DURATION) {
      setCatalog(catalogCache);
      setLoading(false);
      return;
    }
    try {
      setLoading(true);
      // surface=site → only products published to nova-shop.co. Products can
      // be limited to the Telegram mini app from the store admin panel.
      const response = await fetch("/api/v1/catalog?surface=site", { cache: "no-cache" });
      if (!response.ok) throw new Error("store catalog unavailable");
      const data = await response.json();
      const products: StoreProduct[] = (data.products || []).filter(
        (p: StoreProduct) => !p.draft && (p.plans || []).length > 0
      );
      if (Number(data.server_time_ms) > 0) {
        serverOffsetMs = Number(data.server_time_ms) - Date.now();
      }
      catalogCache = {
        products,
        categories: (data.categories || []).filter(
          (c: StoreCategory) => (c.status || "active") === "active"
        ),
        design: data.design || {},
      };
      cacheTimestamp = Date.now();
      setCatalog(catalogCache);
      setError(null);
    } catch (err) {
      console.error("Error fetching store catalog:", err);
      setError("کاتالوگ فروشگاه در دسترس نیست");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchCatalog();
  }, [fetchCatalog]);

  return { catalog, loading, error, refetch: fetchCatalog, serverOffset: serverOffsetMs };
};
