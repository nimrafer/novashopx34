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
  auto_badges: boolean;
  custom_badges: StoreBadge[];
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
  cards: ["mastercard", "visa", "مسترکارت", "ویزا", "کارت ارزی"],
  "virtual-number": ["virtual number", "شماره مجازی"],
};

const productHaystack = (product: StoreProduct): string =>
  normalizeText(
    [product.slug, product.name, product.eyebrow, ...(product.search_aliases || [])].join(" ")
  );

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
  return products.find((p) => {
    const hay = productHaystack(p);
    return keywords.some((keyword) => hay.includes(normalizeText(keyword)));
  });
};

/** Site route for a store product (keeps legacy /services/* URLs for SEO). */
export const storeProductRoute = (product: StoreProduct): string => {
  const hay = productHaystack(product);
  for (const [route, keywords] of Object.entries(LEGACY_ROUTE_KEYWORDS)) {
    if (keywords.some((keyword) => hay.includes(normalizeText(keyword)))) {
      return `/services/${route}`;
    }
  }
  return `/services/${product.slug.replace(/^adm_/, "")}`;
};

export const storeMinPrice = (product: StoreProduct): number => {
  const prices = (product.plans || [])
    .map((plan) => plan.price)
    .filter((price) => price > 0);
  return prices.length ? Math.min(...prices) : 0;
};

export const formatToman = (price: number): string =>
  price > 0 ? `${price.toLocaleString("fa-IR")} تومان` : "استعلام قیمت";

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
      const response = await fetch("/api/v1/catalog", { cache: "no-cache" });
      if (!response.ok) throw new Error("store catalog unavailable");
      const data = await response.json();
      const products: StoreProduct[] = (data.products || []).filter(
        (p: StoreProduct) => !p.draft && (p.plans || []).length > 0
      );
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

  return { catalog, loading, error, refetch: fetchCatalog };
};
