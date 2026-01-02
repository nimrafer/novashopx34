import { useState, useEffect, useCallback } from 'react';

// Type definition for price data
interface PriceItem {
  name: string;
  price: number;
}

interface PricesData {
  [key: string]: PriceItem;
}

// Fallback prices - used when API is unavailable
const FALLBACK_PRICES: PricesData = {
  // ChatGPT
  cgpt_pro_30day: { name: "ChatGPT Pro 30 روزه", price: 497000 },
  cgpt_pro_37day: { name: "ChatGPT Pro 37 روزه", price: 547000 },
  cgpt_plus_team: { name: "ChatGPT Plus تیمی", price: 1249000 },
  cgpt_go_yearly: { name: "ChatGPT GO یکساله", price: 1849000 },
  cgpt_pro_shared: { name: "ChatGPT Pro اشتراکی", price: 297000 },
  cgpt_pro_200: { name: "ChatGPT Pro ۲۰۰ دلاری", price: 12500000 },
  cgpt_pro_monthly: { name: "ChatGPT Pro ماهانه", price: 500000 },
  
  // Claude
  claude_pro: { name: "Claude Pro ماهانه", price: 2797000 },
  claude_pro_shared: { name: "Claude Pro اشتراکی", price: 450000 },
  
  // Gemini
  gemini_ultra: { name: "Gemini Ultra ماهانه", price: 29500000 },
  gem_month: { name: "Gemini ماهانه", price: 649000 },
  gem_3month: { name: "Gemini سه‌ماهه", price: 1249000 },
  gem_6month: { name: "Gemini شش‌ماهه", price: 1749000 },
  gem_year_personal: { name: "Gemini یکساله (جیمیل شخصی)", price: 2497000 },
  gem_year_ready: { name: "Gemini یکساله (جیمیل آماده)", price: 2597000 },
  gem_exclusive_1month: { name: "اکانت اختصاصی Gemini Pro یک‌ماهه", price: 0 },
  gem_exclusive_3month: { name: "اکانت اختصاصی Gemini Pro سه‌ماهه", price: 0 },
  gem_exclusive_6month: { name: "اکانت اختصاصی Gemini Pro شش‌ماهه", price: 0 },
  gem_exclusive_9month: { name: "اکانت اختصاصی Gemini Pro نه‌ماهه", price: 0 },
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
  perplexity_monthly: { name: "Perplexity ماهانه", price: 629000 },
  perplexity_yearly: { name: "Perplexity یکساله", price: 1847000 },
  
  // Grok
  grok_monthly: { name: "Super Grok ماهانه", price: 1699000 },
  
  // Telegram Premium
  tgpremium_3month: { name: "Telegram Premium 3 ماهه", price: 1979000 },
  tgpremium_6month: { name: "Telegram Premium 6 ماهه", price: 2899000 },
  tgpremium_12month: { name: "Telegram Premium یکساله", price: 4579000 },
  
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
};

// Cache for prices
let pricesCache: PricesData | null = null;
let cacheTimestamp: number = 0;
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

/**
 * Format price to Persian format like bot.py's thousand_or_toman function
 * If price is a multiple of 1000, show as "X هزار تومان"
 * Otherwise show as "X تومان" with comma separators
 */
export const formatPricePersian = (price: number): string => {
  if (price % 1000 === 0) {
    const thousands = price / 1000;
    return `${thousands.toLocaleString('fa-IR')} هزار تومان`;
  } else {
    return `${price.toLocaleString('fa-IR')} تومان`;
  }
};

/**
 * Format price for display (just the number with Persian numerals)
 */
export const formatPriceNumber = (price: number): string => {
  return price.toLocaleString('fa-IR');
};

/**
 * Get price by key from the prices data
 */
export const getPrice = (prices: PricesData, key: string): number => {
  return prices[key]?.price ?? FALLBACK_PRICES[key]?.price ?? 0;
};

/**
 * Get name by key from the prices data
 */
export const getPriceName = (prices: PricesData, key: string): string => {
  return prices[key]?.name ?? FALLBACK_PRICES[key]?.name ?? '';
};

/**
 * Custom hook to fetch and manage prices
 */
export const usePrices = () => {
  // Initialize with cache if available, otherwise fallback
  const [prices, setPrices] = useState<PricesData>(pricesCache || FALLBACK_PRICES);
  const [loading, setLoading] = useState(!pricesCache);
  const [error, setError] = useState<string | null>(null);

  const fetchPrices = useCallback(async () => {
    // Check cache first
    if (pricesCache && Date.now() - cacheTimestamp < CACHE_DURATION) {
      setPrices(pricesCache);
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      const response = await fetch('/prices.json', {
        cache: 'no-cache',
        headers: {
          'Cache-Control': 'no-cache',
        },
      });
      
      if (!response.ok) {
        throw new Error('Failed to fetch prices');
      }
      
      const data: PricesData = await response.json();
      
      // Update cache
      pricesCache = data;
      cacheTimestamp = Date.now();
      
      setPrices(data);
      setError(null);
    } catch (err) {
      console.error('Error fetching prices:', err);
      setError('Failed to load prices');
      // Use fallback prices
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
