import { useState, useEffect, useCallback } from "react";

interface PriceItem {
  name: string;
  price: number;
}

interface PricesData {
  [key: string]: PriceItem;
}

const FALLBACK_PRICES: PricesData = {
  // ChatGPT (bot-aligned)
  cgpt_pro_30day: { name: "چت جی پی تی (ChatGPT) Pro-Business 30 روزه", price: 499000 },
  cgpt_pro_37day: { name: "چت جی پی تی (ChatGPT) Pro-Business 37 روزه", price: 599000 },
  cgpt_plus_team: { name: "ChatGPT Plus ۵ نفره", price: 1249000 },
  cgpt_team: { name: "ChatGPT Team (بیزنسی)", price: 2750000 },
  cgpt_go_yearly: { name: "ChatGPT GO یکساله", price: 0 },
  cgpt_pro_shared: { name: "چت جی پی تی (ChatGPT) Pro-Business اشتراکی", price: 427000 },

  // Gemini (bot-aligned)
  gem_month: { name: "Gemini ماهانه", price: 649000 },
  gem_3month: { name: "Gemini سه‌ماهه", price: 1549000 },
  gem_6month: { name: "Gemini شش‌ماهه", price: 1949000 },
  gem_year_personal: { name: "Gemini یکساله (جیمیل شخصی)", price: 2497000 },
  gem_year_ready: { name: "Gemini یکساله (جیمیل آماده)", price: 2497000 },
  gem_student_month: { name: "تخفیف دانشجویی Gemini ماهانه", price: 130000 },
  gem_student_3month: { name: "تخفیف دانشجویی Gemini 3 ماهه", price: 300000 },
  gem_student_6month: { name: "تخفیف دانشجویی Gemini 6 ماهه", price: 300000 },
  gem_student_year: { name: "تخفیف دانشجویی Gemini یکساله", price: 350000 },

  // Spotify
  spotify_monthly: { name: "Spotify ماهانه", price: 350000 },
  spotify_4month: { name: "Spotify 4 ماهه", price: 1150000 },

  // Cursor
  cursor_monthly: { name: "Cursor ماهانه", price: 3490000 },
  cursor_weekly: { name: "Cursor هفتگی", price: 397000 },

  // Perplexity
  perplexity_monthly: { name: "Perplexity ماهانه", price: 429000 },
  perplexity_yearly: { name: "Perplexity یکساله", price: 0 },

  // Grok
  grok_monthly: { name: "Super Grok ماهانه", price: 1679000 },

  // Telegram Premium
  tgpremium_3month: { name: "Telegram Premium 3 ماهه", price: 2450000 },
  tgpremium_6month: { name: "Telegram Premium 6 ماهه", price: 3275000 },
  tgpremium_12month: { name: "Telegram Premium یکساله", price: 5775000 },

  // Cards
  visa_card: { name: "ویزا کارت", price: 750000 },
  master_card: { name: "مستر کارت", price: 750000 },

  // Virtual Numbers
  vnum_uk: { name: "شماره انگلیس", price: 950000 },
  vnum_us: { name: "شماره آمریکا", price: 750000 },
  vnum_au: { name: "شماره استرالیا", price: 1450000 },
  vnum_ca: { name: "شماره کانادا", price: 650000 },
  vnum_tg_uk: { name: "تلگرام انگلیس", price: 350000 },
  vnum_tg_au: { name: "تلگرام استرالیا", price: 1250000 },
  vnum_tg_us: { name: "تلگرام آمریکا", price: 300000 },
  vnum_tg_ca: { name: "تلگرام کانادا", price: 300000 },
  vnum_wa_uk: { name: "واتساپ انگلیس", price: 350000 },
  vnum_wa_ca: { name: "واتساپ کانادا", price: 350000 },

  // Legacy keys (kept for old pages)
  cgpt_pro_200: { name: "چت جی پی تی (ChatGPT) Pro-Business ۲۰۰ دلاری", price: 12500000 },
  cgpt_pro_monthly: { name: "چت جی پی تی (ChatGPT) Pro-Business ماهانه", price: 500000 },
  claude_pro: { name: "Claude Pro ماهانه", price: 2797000 },
  claude_pro_shared: { name: "Claude Pro اشتراکی", price: 450000 },
  gemini_ultra: { name: "Gemini Ultra ماهانه", price: 29500000 },
  gem_exclusive_1month: { name: "اکانت اختصاصی Gemini Pro یک‌ماهه", price: 749000 },
  gem_exclusive_3month: { name: "اکانت اختصاصی Gemini Pro سه‌ماهه", price: 1949000 },
  gem_exclusive_6month: { name: "اکانت اختصاصی Gemini Pro شش‌ماهه", price: 3499000 },
  gem_exclusive_9month: { name: "اکانت اختصاصی Gemini Pro نه‌ماهه", price: 4999000 },
};

let pricesCache: PricesData | null = null;
let cacheTimestamp = 0;
const CACHE_DURATION = 5 * 60 * 1000;

export const formatPricePersian = (price: number): string => {
  return `${price.toLocaleString("fa-IR")} تومان`;
};

export const formatPriceNumber = (price: number): string => {
  return price.toLocaleString("fa-IR");
};

export const getPrice = (prices: PricesData, key: string): number => {
  return prices[key]?.price ?? FALLBACK_PRICES[key]?.price ?? 0;
};

export const getPriceName = (prices: PricesData, key: string): string => {
  return prices[key]?.name ?? FALLBACK_PRICES[key]?.name ?? "";
};

export const usePrices = () => {
  const [prices, setPrices] = useState<PricesData>(pricesCache || FALLBACK_PRICES);
  const [loading, setLoading] = useState(!pricesCache);
  const [error, setError] = useState<string | null>(null);

  const fetchPrices = useCallback(async () => {
    if (pricesCache && Date.now() - cacheTimestamp < CACHE_DURATION) {
      setPrices(pricesCache);
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      const response = await fetch("/prices.json", {
        cache: "no-cache",
        headers: {
          "Cache-Control": "no-cache",
        },
      });

      if (!response.ok) {
        throw new Error("Failed to fetch prices");
      }

      const data: PricesData = await response.json();
      pricesCache = data;
      cacheTimestamp = Date.now();
      setPrices(data);
      setError(null);
    } catch (err) {
      console.error("Error fetching prices:", err);
      setError("Failed to load prices");
      setPrices(FALLBACK_PRICES);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchPrices();
  }, [fetchPrices]);

  return {
    prices,
    loading,
    error,
    refetch: fetchPrices,
    getPrice: (key: string) => getPrice(prices, key),
    getPriceName: (key: string) => getPriceName(prices, key),
    formatPrice: formatPricePersian,
    formatPriceNumber,
  };
};

export type { PricesData, PriceItem };
export { FALLBACK_PRICES };
