'use strict';

const http = require('node:http');
const fs = require('node:fs');
const path = require('node:path');
const crypto = require('node:crypto');
const { spawnSync } = require('node:child_process');

const PORT = Number(process.env.PORT || 4010);
const SESSION_SECRET = process.env.SESSION_SECRET || crypto.randomBytes(32).toString('hex');
const BASE_DIR = path.resolve(__dirname, '..');
const DATA_FILE = process.env.AUTH_DATA_FILE || path.join(__dirname, 'data.json');
const PUBLIC_PRICES_FILE = process.env.PUBLIC_PRICES_FILE || path.join(BASE_DIR, 'public', 'prices.json');
const DIST_PRICES_FILE = process.env.DIST_PRICES_FILE || path.join(BASE_DIR, 'dist', 'prices.json');

const OTP_TTL_SECONDS = Number(process.env.OTP_TTL_SECONDS || 600);
const OTP_RESEND_COOLDOWN_SECONDS = Number(process.env.OTP_RESEND_COOLDOWN_SECONDS || 60);
const OTP_MAX_ATTEMPTS = Number(process.env.OTP_MAX_ATTEMPTS || 5);
const SESSION_TTL_SECONDS = Number(process.env.SESSION_TTL_SECONDS || 60 * 60 * 24 * 30);
const FROM_EMAIL = process.env.AUTH_FROM_EMAIL || 'admin@nova-shop.co';
const FROM_NAME = process.env.AUTH_FROM_NAME || 'Nova Shop';
const SENDMAIL_PATH = process.env.SENDMAIL_PATH || '/usr/sbin/sendmail';
const ADMIN_EMAILS = new Set(
  String(process.env.AUTH_ADMIN_EMAILS || 'admin@nova-shop.co')
    .split(',')
    .map((email) => normalizeEmail(email))
    .filter(Boolean),
);

const ORDER_STATUSES = new Set(['pending', 'processing', 'completed', 'cancelled', 'refunded']);
const PAYMENT_STATUSES = new Set(['awaiting_payment', 'submitted', 'verified', 'rejected', 'refunded']);
const FULFILLMENT_STATUSES = new Set(['new', 'queued', 'provisioning', 'delivered', 'failed', 'returned']);
const PRICE_MODIFIER_TYPES = new Set(['fixed', 'percent']);

const state = loadState();
hydrateState();
persistState();
syncPricesFiles();

function loadState() {
  try {
    const raw = fs.readFileSync(DATA_FILE, 'utf8');
    const parsed = JSON.parse(raw);
    return {
      users: Array.isArray(parsed.users) ? parsed.users : [],
      otps: Array.isArray(parsed.otps) ? parsed.otps : [],
      sessions: Array.isArray(parsed.sessions) ? parsed.sessions : [],
      orders: Array.isArray(parsed.orders) ? parsed.orders : [],
      prices: parsed && typeof parsed.prices === 'object' && !Array.isArray(parsed.prices) ? parsed.prices : {},
      priceExtras: parsed && typeof parsed.priceExtras === 'object' && !Array.isArray(parsed.priceExtras) ? parsed.priceExtras : {},
      catalogServices: Array.isArray(parsed.catalogServices) ? parsed.catalogServices : [],
      catalogPlans: Array.isArray(parsed.catalogPlans) ? parsed.catalogPlans : [],
      discounts: Array.isArray(parsed.discounts) ? parsed.discounts : [],
      offers: Array.isArray(parsed.offers) ? parsed.offers : [],
    };
  } catch (_error) {
    return {
      users: [],
      otps: [],
      sessions: [],
      orders: [],
      prices: {},
      priceExtras: {},
      catalogServices: [],
      catalogPlans: [],
      discounts: [],
      offers: [],
    };
  }
}

function persistState() {
  const dir = path.dirname(DATA_FILE);
  fs.mkdirSync(dir, { recursive: true });
  const tmp = `${DATA_FILE}.tmp`;
  fs.writeFileSync(tmp, JSON.stringify(state, null, 2));
  fs.renameSync(tmp, DATA_FILE);
}

function cleanupExpired() {
  const now = Date.now();
  state.otps = state.otps.filter((item) => Number(item.expiresAt) > now);
  state.sessions = state.sessions.filter((item) => Number(item.expiresAt) > now);
}

function hydrateState() {
  cleanupExpired();

  const loadedPrices = loadPriceSource();
  if (Object.keys(state.prices || {}).length === 0) {
    state.prices = loadedPrices.priceMap;
  }
  if (Object.keys(state.priceExtras || {}).length === 0) {
    state.priceExtras = loadedPrices.extras;
  }

  state.prices = normalizePriceMap(state.prices);
  state.priceExtras = normalizeObject(state.priceExtras);

  if (!Array.isArray(state.catalogServices) || state.catalogServices.length === 0) {
    state.catalogServices = getDefaultCatalogServices();
  } else {
    state.catalogServices = state.catalogServices.map(normalizeCatalogService).filter(Boolean);
  }

  if (!Array.isArray(state.catalogPlans) || state.catalogPlans.length === 0) {
    state.catalogPlans = getDefaultCatalogPlans();
  } else {
    state.catalogPlans = state.catalogPlans.map(normalizeCatalogPlan).filter(Boolean);
  }

  if (!Array.isArray(state.discounts)) state.discounts = [];
  state.discounts = state.discounts.map(normalizeDiscount).filter(Boolean);

  if (!Array.isArray(state.offers)) state.offers = [];
  state.offers = state.offers.map(normalizeOffer).filter(Boolean);

  if (!Array.isArray(state.orders)) state.orders = [];
  state.orders = state.orders.map(normalizeOrder).filter(Boolean);
}

function normalizeObject(value) {
  if (!value || typeof value !== 'object' || Array.isArray(value)) return {};
  return value;
}

function loadPriceSource() {
  const candidateFiles = [PUBLIC_PRICES_FILE, DIST_PRICES_FILE];
  for (const filePath of candidateFiles) {
    try {
      const raw = fs.readFileSync(filePath, 'utf8');
      const parsed = JSON.parse(raw);
      const priceMap = {};
      const extras = {};

      for (const [key, value] of Object.entries(parsed || {})) {
        if (isPriceEntry(value)) {
          priceMap[String(key)] = {
            name: normalizeText(value.name, 160),
            price: normalizePrice(value.price) || 0,
            updatedAt: new Date().toISOString(),
          };
        } else {
          extras[String(key)] = value;
        }
      }

      return { priceMap, extras };
    } catch (_error) {
      // ignore and continue
    }
  }

  return { priceMap: {}, extras: {} };
}

function isPriceEntry(value) {
  return !!(
    value &&
    typeof value === 'object' &&
    !Array.isArray(value) &&
    Object.prototype.hasOwnProperty.call(value, 'name') &&
    Object.prototype.hasOwnProperty.call(value, 'price')
  );
}

function normalizePriceMap(map) {
  const out = {};
  for (const [key, value] of Object.entries(normalizeObject(map))) {
    if (!isPriceEntry(value)) continue;
    const k = normalizeSlug(key, 120);
    if (!k) continue;

    out[k] = {
      name: normalizeText(value.name, 160) || k,
      price: normalizePrice(value.price) || 0,
      updatedAt: normalizeISODate(value.updatedAt) || new Date().toISOString(),
    };
  }
  return out;
}

function syncPricesFiles() {
  const payload = buildPricesPayload();
  for (const filePath of [PUBLIC_PRICES_FILE, DIST_PRICES_FILE]) {
    try {
      fs.mkdirSync(path.dirname(filePath), { recursive: true });
      const tmp = `${filePath}.tmp`;
      fs.writeFileSync(tmp, JSON.stringify(payload, null, 2));
      fs.renameSync(tmp, filePath);
    } catch (_error) {
      // keep API alive even if one target is not writable
    }
  }
}

function buildPricesPayload() {
  const payload = {};
  for (const [key, value] of Object.entries(state.prices || {})) {
    payload[key] = {
      name: value.name,
      price: normalizePrice(value.price) || 0,
    };
  }
  for (const [key, value] of Object.entries(state.priceExtras || {})) {
    payload[key] = value;
  }
  return payload;
}

function getDefaultCatalogServices() {
  return [
    {
      id: 'chatgpt',
      slug: 'chatgpt',
      name: 'چت جی پی تی (ChatGPT)',
      description: 'خرید اشتراک چت جی پی تی',
      logo: '/logos/chatgpt.png',
      routePath: '/services/chatgpt',
      color: '#10A37F',
      sortOrder: 10,
      isActive: true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
    {
      id: 'gemini',
      slug: 'gemini',
      name: 'جمینای (Gemini)',
      description: 'خرید اشتراک Gemini',
      logo: '/logos/gemini.png',
      routePath: '/services/gemini',
      color: '#3B82F6',
      sortOrder: 20,
      isActive: true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
    {
      id: 'grok',
      slug: 'grok',
      name: 'گراک (Grok)',
      description: 'خرید اشتراک Grok',
      logo: '/logos/grok.png',
      routePath: '/services/grok',
      color: '#111827',
      sortOrder: 30,
      isActive: true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
    {
      id: 'perplexity',
      slug: 'perplexity',
      name: 'پرپلکسیتی (Perplexity)',
      description: 'خرید اشتراک Perplexity Pro',
      logo: '/logos/perplexity.png',
      routePath: '/services/perplexity',
      color: '#06B6D4',
      sortOrder: 40,
      isActive: true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
    {
      id: 'spotify',
      slug: 'spotify',
      name: 'اسپاتیفای (Spotify)',
      description: 'خرید اشتراک Spotify Premium',
      logo: '/logos/spotify.png',
      routePath: '/services/spotify',
      color: '#22C55E',
      sortOrder: 50,
      isActive: true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
    {
      id: 'cursor',
      slug: 'cursor',
      name: 'کرسور (Cursor)',
      description: 'خرید اشتراک Cursor Pro',
      logo: '/logos/cursor.png',
      routePath: '/services/cursor',
      color: '#6366F1',
      sortOrder: 60,
      isActive: true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
    {
      id: 'telegram_premium',
      slug: 'telegram-premium',
      name: 'تلگرام پریمیوم (Telegram Premium)',
      description: 'خرید تلگرام پریمیوم',
      logo: '/logos/telegram.png',
      routePath: '/services/telegram-premium',
      color: '#0EA5E9',
      sortOrder: 70,
      isActive: true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
    {
      id: 'cards',
      slug: 'cards',
      name: 'ویزا و مستر کارت',
      description: 'کارت های مجازی بین المللی',
      logo: '/logos/mastercard.svg',
      routePath: '/services/cards',
      color: '#F59E0B',
      sortOrder: 80,
      isActive: true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
    {
      id: 'virtual_number',
      slug: 'virtual-number',
      name: 'شماره مجازی',
      description: 'خرید شماره مجازی',
      logo: '/logos/number.png',
      routePath: '/services/virtual-number',
      color: '#A855F7',
      sortOrder: 90,
      isActive: true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
  ];
}

function getDefaultCatalogPlans() {
  const now = new Date().toISOString();
  return [
    {
      id: 'cgpt_pro_30day',
      serviceId: 'chatgpt',
      name: 'Pro-Business اختصاصی ۳۰ روزه',
      subtitle: 'اکانت اختصاصی',
      duration: '۳۰ روز',
      priceKey: 'cgpt_pro_30day',
      sortOrder: 10,
      badge: 'پرفروش',
      requiresActivationEmail: true,
      activationEmailLabel: 'ایمیل اکانت رایگان ChatGPT',
      isActive: true,
      createdAt: now,
      updatedAt: now,
    },
    {
      id: 'cgpt_pro_37day',
      serviceId: 'chatgpt',
      name: 'Pro-Business اختصاصی ۳۷ روزه',
      subtitle: 'اکانت اختصاصی',
      duration: '۳۷ روز',
      priceKey: 'cgpt_pro_37day',
      sortOrder: 20,
      requiresActivationEmail: true,
      activationEmailLabel: 'ایمیل اکانت رایگان ChatGPT',
      isActive: true,
      createdAt: now,
      updatedAt: now,
    },
    {
      id: 'cgpt_pro_shared',
      serviceId: 'chatgpt',
      name: 'Pro-Business اشتراکی',
      subtitle: 'اقتصادی',
      duration: 'یک ماه',
      priceKey: 'cgpt_pro_shared',
      sortOrder: 30,
      requiresActivationEmail: false,
      isActive: true,
      createdAt: now,
      updatedAt: now,
    },
    {
      id: 'gem_month',
      serviceId: 'gemini',
      name: 'Gemini یک ماهه',
      subtitle: 'Gemini Pro / Ultra',
      duration: 'یک ماه',
      priceKey: 'gem_month',
      sortOrder: 10,
      requiresActivationEmail: true,
      activationEmailLabel: 'جیمیل برای فعالسازی Gemini',
      isActive: true,
      createdAt: now,
      updatedAt: now,
    },
    {
      id: 'gem_3month',
      serviceId: 'gemini',
      name: 'Gemini سه ماهه',
      subtitle: 'Gemini Pro / Ultra',
      duration: 'سه ماه',
      priceKey: 'gem_3month',
      sortOrder: 20,
      badge: 'محبوب',
      requiresActivationEmail: true,
      activationEmailLabel: 'جیمیل برای فعالسازی Gemini',
      isActive: true,
      createdAt: now,
      updatedAt: now,
    },
    {
      id: 'gem_6month',
      serviceId: 'gemini',
      name: 'Gemini شش ماهه',
      subtitle: 'Gemini Pro / Ultra',
      duration: 'شش ماه',
      priceKey: 'gem_6month',
      sortOrder: 30,
      requiresActivationEmail: true,
      activationEmailLabel: 'جیمیل برای فعالسازی Gemini',
      isActive: true,
      createdAt: now,
      updatedAt: now,
    },
    {
      id: 'grok_monthly',
      serviceId: 'grok',
      name: 'Super Grok ماهانه',
      subtitle: 'Premium+',
      duration: 'یک ماه',
      priceKey: 'grok_monthly',
      sortOrder: 10,
      requiresActivationEmail: false,
      isActive: true,
      createdAt: now,
      updatedAt: now,
    },
    {
      id: 'perplexity_monthly',
      serviceId: 'perplexity',
      name: 'Perplexity Pro یک ماهه',
      subtitle: 'تحقیق و سئو',
      duration: 'یک ماه',
      priceKey: 'perplexity_monthly',
      sortOrder: 10,
      requiresActivationEmail: false,
      isActive: true,
      createdAt: now,
      updatedAt: now,
    },
    {
      id: 'perplexity_yearly',
      serviceId: 'perplexity',
      name: 'Perplexity Pro یکساله',
      subtitle: 'تحقیق و سئو',
      duration: 'یکساله',
      priceKey: 'perplexity_yearly',
      sortOrder: 20,
      requiresActivationEmail: false,
      isActive: true,
      createdAt: now,
      updatedAt: now,
    },
  ];
}

function normalizeCatalogService(service) {
  if (!service || typeof service !== 'object') return null;
  const id = normalizeSlug(service.id || service.slug, 80);
  if (!id) return null;
  return {
    id,
    slug: normalizeSlug(service.slug || id, 120) || id,
    name: normalizeText(service.name, 160) || id,
    description: normalizeText(service.description, 500) || '',
    logo: normalizeText(service.logo, 500) || '',
    routePath: normalizeRoutePath(service.routePath),
    color: normalizeColor(service.color),
    sortOrder: normalizeSortOrder(service.sortOrder),
    isActive: normalizeBoolean(service.isActive, true),
    createdAt: normalizeISODate(service.createdAt) || new Date().toISOString(),
    updatedAt: normalizeISODate(service.updatedAt) || new Date().toISOString(),
  };
}

function normalizeCatalogPlan(plan) {
  if (!plan || typeof plan !== 'object') return null;
  const id = normalizeSlug(plan.id || plan.priceKey || plan.name, 120);
  const serviceId = normalizeSlug(plan.serviceId, 80);
  if (!id || !serviceId) return null;

  return {
    id,
    serviceId,
    name: normalizeText(plan.name, 180) || id,
    subtitle: normalizeText(plan.subtitle, 180) || '',
    duration: normalizeText(plan.duration, 120) || '',
    priceKey: normalizeSlug(plan.priceKey || id, 120) || id,
    price: normalizePrice(plan.price),
    badge: normalizeText(plan.badge, 120) || '',
    description: normalizeText(plan.description, 1000) || '',
    sortOrder: normalizeSortOrder(plan.sortOrder),
    requiresActivationEmail: normalizeBoolean(plan.requiresActivationEmail, false),
    activationEmailLabel: normalizeText(plan.activationEmailLabel, 160) || '',
    isActive: normalizeBoolean(plan.isActive, true),
    createdAt: normalizeISODate(plan.createdAt) || new Date().toISOString(),
    updatedAt: normalizeISODate(plan.updatedAt) || new Date().toISOString(),
  };
}

function normalizeDiscount(discount) {
  if (!discount || typeof discount !== 'object') return null;
  const discountIdCandidate = normalizeSlug(discount.id || discount.code, 120);
  const id =
    discountIdCandidate && !/^[-_]+$/.test(discountIdCandidate)
      ? discountIdCandidate
      : `dsc-${crypto.randomBytes(4).toString('hex')}`;
  const code = normalizeDiscountCode(discount.code || discount.id);
  if (!id || !code) return null;

  const type = normalizePriceModifierType(discount.type || discount.discountType);
  if (!type) return null;

  const value = normalizePositiveNumber(discount.value);
  if (value === null) return null;

  return {
    id,
    code,
    title: normalizeText(discount.title, 160) || code,
    description: normalizeText(discount.description, 500) || '',
    type,
    value,
    serviceId: normalizeNullableSlug(discount.serviceId),
    planId: normalizeNullableSlug(discount.planId),
    maxUses: normalizePositiveInteger(discount.maxUses, 100),
    usedCount: normalizePositiveInteger(discount.usedCount, 0),
    active: normalizeBoolean(discount.active, true),
    expiresAt: normalizeNullableDate(discount.expiresAt),
    createdAt: normalizeISODate(discount.createdAt) || new Date().toISOString(),
    updatedAt: normalizeISODate(discount.updatedAt) || new Date().toISOString(),
  };
}

function normalizeOffer(offer) {
  if (!offer || typeof offer !== 'object') return null;
  const offerIdCandidate = normalizeSlug(offer.id || offer.title, 120);
  const id =
    offerIdCandidate && !/^[-_]+$/.test(offerIdCandidate)
      ? offerIdCandidate
      : `off-${crypto.randomBytes(4).toString('hex')}`;
  if (!id) return null;

  const type = normalizePriceModifierType(offer.type);
  if (!type) return null;

  const value = normalizePositiveNumber(offer.value);
  if (value === null) return null;

  return {
    id,
    title: normalizeText(offer.title, 160) || id,
    description: normalizeText(offer.description, 500) || '',
    type,
    value,
    serviceId: normalizeNullableSlug(offer.serviceId),
    planId: normalizeNullableSlug(offer.planId),
    active: normalizeBoolean(offer.active, true),
    expiresAt: normalizeNullableDate(offer.expiresAt),
    createdAt: normalizeISODate(offer.createdAt) || new Date().toISOString(),
    updatedAt: normalizeISODate(offer.updatedAt) || new Date().toISOString(),
  };
}

function normalizeOrder(order) {
  if (!order || typeof order !== 'object') return null;

  const id = normalizeText(order.id, 100);
  const serviceId = normalizeSlug(order.serviceId, 120);
  const planId = normalizeNullableSlug(order.planId);

  if (!id || !serviceId) return null;

  const createdAt = normalizeISODate(order.createdAt) || new Date().toISOString();
  const updatedAt = normalizeISODate(order.updatedAt) || createdAt;

  const status = normalizeOrderStatus(order.status) || 'pending';
  const paymentStatus = normalizePaymentStatus(order.paymentStatus) || derivePaymentStatusFromOrder(order);
  const fulfillmentStatus = normalizeFulfillmentStatus(order.fulfillmentStatus) || deriveFulfillmentStatusFromOrder(order);

  const timeline = Array.isArray(order.timeline)
    ? order.timeline
        .map((event) => normalizeTimelineEvent(event))
        .filter(Boolean)
    : [];

  if (timeline.length === 0) {
    timeline.push(createTimelineEvent('created', 'سفارش ثبت شد', 'system', createdAt));
  }

  const basePrice = normalizePrice(order.basePrice);
  const finalPrice = normalizePrice(order.price);

  return {
    id,
    userId: normalizeText(order.userId, 100) || '',
    userEmail: normalizeEmail(order.userEmail),
    userFullName: normalizeNullableText(order.userFullName, 160),
    serviceId,
    serviceName: normalizeText(order.serviceName, 160) || serviceId,
    planId,
    planName: normalizeText(order.planName, 200) || planId || serviceId,
    planDuration: normalizeNullableText(order.planDuration, 120),

    price: finalPrice || 0,
    basePrice: basePrice === null ? finalPrice || 0 : basePrice,
    currency: 'IRR',

    discountCode: normalizeNullableText(order.discountCode, 80),
    discountAmount: normalizePrice(order.discountAmount) || 0,
    offerId: normalizeNullableSlug(order.offerId),
    offerAmount: normalizePrice(order.offerAmount) || 0,

    status,
    paymentStatus,
    fulfillmentStatus,

    activationEmail: normalizeNullableEmail(order.activationEmail),
    customerTelegram: normalizeNullableText(order.customerTelegram, 80),
    notes: normalizeNullableText(order.notes, 1000),
    adminNotes: normalizeNullableText(order.adminNotes, 1000),

    paymentMethod: normalizeNullableText(order.paymentMethod, 60),
    paymentReference: normalizeNullableText(order.paymentReference, 160),
    paymentReceipt: normalizeNullableText(order.paymentReceipt, 1200),
    paymentSubmittedAt: normalizeNullableDate(order.paymentSubmittedAt),
    paymentVerifiedAt: normalizeNullableDate(order.paymentVerifiedAt),

    deliveryAccount: normalizeNullableText(order.deliveryAccount, 500),
    deliveredAt: normalizeNullableDate(order.deliveredAt),
    refundedAt: normalizeNullableDate(order.refundedAt),

    timeline,

    createdAt,
    updatedAt,
    source: normalizeText(order.source, 50) || 'website',
  };
}

function normalizeTimelineEvent(event) {
  if (!event || typeof event !== 'object') return null;
  const id = normalizeText(event.id, 80) || `EV-${crypto.randomBytes(4).toString('hex').toUpperCase()}`;
  const type = normalizeText(event.type, 60) || 'note';
  const message = normalizeText(event.message, 1000);
  if (!message) return null;

  return {
    id,
    type,
    message,
    actor: normalizeText(event.actor, 120) || 'system',
    at: normalizeISODate(event.at) || new Date().toISOString(),
  };
}

function createTimelineEvent(type, message, actor = 'system', at = new Date().toISOString()) {
  return {
    id: `EV-${crypto.randomBytes(4).toString('hex').toUpperCase()}`,
    type,
    message,
    actor,
    at,
  };
}

function addTimeline(order, type, message, actor = 'system') {
  order.timeline = Array.isArray(order.timeline) ? order.timeline : [];
  order.timeline.push(createTimelineEvent(type, message, actor));
  if (order.timeline.length > 80) {
    order.timeline = order.timeline.slice(-80);
  }
}

function derivePaymentStatusFromOrder(order) {
  if (order.status === 'refunded') return 'refunded';
  if (order.status === 'completed') return 'verified';
  if (order.paymentReference || order.paymentReceipt) return 'submitted';
  return 'awaiting_payment';
}

function deriveFulfillmentStatusFromOrder(order) {
  if (order.status === 'completed') return 'delivered';
  if (order.status === 'cancelled') return 'failed';
  if (order.status === 'processing') return 'provisioning';
  return 'new';
}

function normalizeSlug(value, maxLength = 120) {
  const normalized = String(value || '')
    .trim()
    .toLowerCase()
    .replace(/\s+/g, '-')
    .replace(/[^a-z0-9_\-]/g, '')
    .replace(/[-_]{2,}/g, '-')
    .replace(/^[-_]+|[-_]+$/g, '')
    .slice(0, maxLength);
  if (!normalized) return '';
  if (!/[a-z0-9]/.test(normalized)) return '';
  return normalized;
}

function normalizeNullableSlug(value, maxLength = 120) {
  const normalized = normalizeSlug(value, maxLength);
  return normalized || null;
}

function normalizeText(value, maxLength = 500) {
  return String(value || '').trim().slice(0, maxLength);
}

function normalizeNullableText(value, maxLength = 500) {
  const normalized = normalizeText(value, maxLength);
  return normalized || null;
}

function normalizeEmail(email) {
  return String(email || '').trim().toLowerCase();
}

function normalizeNullableEmail(email) {
  const normalized = normalizeEmail(email);
  return normalized || null;
}

function normalizePrice(value) {
  const price = Number(value);
  if (!Number.isFinite(price) || price < 0) return null;
  return Math.round(price);
}

function normalizePositiveNumber(value) {
  const number = Number(value);
  if (!Number.isFinite(number) || number < 0) return null;
  return number;
}

function normalizePositiveInteger(value, fallback = 0) {
  const parsed = Number(value);
  if (!Number.isFinite(parsed) || parsed < 0) return fallback;
  return Math.floor(parsed);
}

function normalizeSortOrder(value) {
  const number = Number(value);
  if (!Number.isFinite(number)) return 100;
  return Math.floor(number);
}

function normalizeBoolean(value, fallback = false) {
  if (typeof value === 'boolean') return value;
  if (typeof value === 'string') {
    const low = value.trim().toLowerCase();
    if (['1', 'true', 'yes', 'on', 'active'].includes(low)) return true;
    if (['0', 'false', 'no', 'off', 'inactive'].includes(low)) return false;
  }
  if (typeof value === 'number') {
    return value > 0;
  }
  return fallback;
}

function normalizeRoutePath(value) {
  const raw = normalizeText(value, 300);
  if (!raw) return null;
  if (!raw.startsWith('/')) return `/${raw}`;
  return raw;
}

function normalizeColor(value) {
  const raw = normalizeText(value, 32);
  if (!raw) return '#0f766e';
  return raw;
}

function normalizeDiscountCode(value) {
  const code = String(value || '').trim().toUpperCase().replace(/\s+/g, '');
  if (!code) return '';
  return code.slice(0, 32);
}

function normalizePriceModifierType(value) {
  const type = String(value || '').trim().toLowerCase();
  if (!PRICE_MODIFIER_TYPES.has(type)) return null;
  return type;
}

function normalizeISODate(value) {
  const text = String(value || '').trim();
  if (!text) return null;
  const date = new Date(text);
  if (Number.isNaN(date.getTime())) return null;
  return date.toISOString();
}

function normalizeNullableDate(value) {
  return normalizeISODate(value);
}

function normalizeOrderStatus(value) {
  const status = String(value || '').trim().toLowerCase();
  return ORDER_STATUSES.has(status) ? status : null;
}

function normalizePaymentStatus(value) {
  const status = String(value || '').trim().toLowerCase();
  return PAYMENT_STATUSES.has(status) ? status : null;
}

function normalizeFulfillmentStatus(value) {
  const status = String(value || '').trim().toLowerCase();
  return FULFILLMENT_STATUSES.has(status) ? status : null;
}

function json(res, status, payload, extraHeaders = {}) {
  const body = JSON.stringify(payload);
  res.writeHead(status, {
    'Content-Type': 'application/json; charset=utf-8',
    'Content-Length': Buffer.byteLength(body),
    'Cache-Control': 'no-store',
    ...extraHeaders,
  });
  res.end(body);
}

function ok(res, payload, headers = {}) {
  json(res, 200, payload, headers);
}

function badRequest(res, message, status = 400) {
  json(res, status, { error: message });
}

function notFound(res) {
  json(res, 404, { error: 'Not found' });
}

function parseCookies(cookieHeader) {
  const out = {};
  if (!cookieHeader) return out;
  const parts = cookieHeader.split(';');
  for (const part of parts) {
    const index = part.indexOf('=');
    if (index === -1) continue;
    const key = part.slice(0, index).trim();
    const value = part.slice(index + 1).trim();
    if (key) out[key] = value;
  }
  return out;
}

function sha256(input) {
  return crypto.createHash('sha256').update(input).digest('hex');
}

function generateOtpCode() {
  return String(crypto.randomInt(100000, 999999));
}

function readBody(req) {
  return new Promise((resolve, reject) => {
    let data = '';

    req.on('data', (chunk) => {
      data += chunk;
      if (data.length > 1024 * 256) {
        reject(new Error('Payload too large'));
      }
    });

    req.on('end', () => {
      if (!data) {
        resolve({});
        return;
      }
      try {
        resolve(JSON.parse(data));
      } catch (_error) {
        reject(new Error('Invalid JSON payload'));
      }
    });

    req.on('error', reject);
  });
}

function findUserByEmail(email) {
  return state.users.find((user) => user.email === email) || null;
}

function createUser(email, fullName) {
  const user = {
    id: crypto.randomUUID(),
    email,
    fullName: fullName || null,
    createdAt: new Date().toISOString(),
    lastLoginAt: null,
  };
  state.users.push(user);
  return user;
}

function updateUserAfterLogin(user, fullName) {
  if (!user.fullName && fullName) {
    user.fullName = fullName;
  }
  user.lastLoginAt = new Date().toISOString();
}

function createSession(userId, ip, userAgent) {
  const token = crypto.randomBytes(48).toString('base64url');
  const tokenHash = sha256(`${SESSION_SECRET}:${token}`);
  const session = {
    id: crypto.randomUUID(),
    userId,
    tokenHash,
    createdAt: new Date().toISOString(),
    expiresAt: Date.now() + SESSION_TTL_SECONDS * 1000,
    ip,
    userAgent,
  };
  state.sessions.push(session);
  return token;
}

function buildSetCookie(token) {
  return `nova_auth=${token}; Path=/; HttpOnly; Secure; SameSite=Lax; Max-Age=${SESSION_TTL_SECONDS}`;
}

function buildClearCookie() {
  return 'nova_auth=; Path=/; HttpOnly; Secure; SameSite=Lax; Max-Age=0';
}

function resolveUserFromRequest(req) {
  cleanupExpired();
  const cookies = parseCookies(req.headers.cookie || '');
  const rawToken = cookies.nova_auth;
  if (!rawToken) return null;

  const tokenHash = sha256(`${SESSION_SECRET}:${rawToken}`);
  const session = state.sessions.find((item) => item.tokenHash === tokenHash);
  if (!session) return null;

  const user = state.users.find((item) => item.id === session.userId) || null;
  if (!user) return null;

  return { user, session };
}

function removeSessionByToken(rawToken) {
  if (!rawToken) return;
  const tokenHash = sha256(`${SESSION_SECRET}:${rawToken}`);
  state.sessions = state.sessions.filter((item) => item.tokenHash !== tokenHash);
}

function isAdminUser(user) {
  const email = normalizeEmail(user && user.email ? user.email : '');
  return ADMIN_EMAILS.has(email);
}

function requireAuth(req, res) {
  const identity = resolveUserFromRequest(req);
  if (!identity) {
    badRequest(res, 'ابتدا وارد حساب کاربری شوید', 401);
    return null;
  }
  return identity;
}

function requireAdmin(req, res) {
  const identity = requireAuth(req, res);
  if (!identity) return null;
  if (!isAdminUser(identity.user)) {
    badRequest(res, 'دسترسی غیرمجاز', 403);
    return null;
  }
  return identity;
}

function sendOtpEmail(to, code, mode) {
  const subject = mode === 'signup' ? 'Nova Shop signup verification code' : 'Nova Shop login verification code';
  const lines = [
    `From: ${FROM_NAME} <${FROM_EMAIL}>`,
    `To: <${to}>`,
    `Subject: ${subject}`,
    'MIME-Version: 1.0',
    'Content-Type: text/plain; charset=UTF-8',
    '',
    'Nova Shop verification code',
    '---------------------------',
    `Your one-time code: ${code}`,
    `This code expires in ${Math.floor(OTP_TTL_SECONDS / 60)} minutes.`,
    '',
    'If you do not see this in Inbox, check Spam/Junk folder as well.',
    '',
    'If this request was not from you, ignore this email.',
    '',
    'Nova Shop',
  ];

  const message = `${lines.join('\n')}\n`;
  const result = spawnSync(SENDMAIL_PATH, ['-t', '-f', FROM_EMAIL], {
    input: message,
    encoding: 'utf8',
  });

  if (result.status !== 0) {
    const stderr = (result.stderr || '').trim();
    throw new Error(stderr || 'sendmail failed');
  }
}

function getCatalogSnapshot(includeInactive = false) {
  const services = state.catalogServices
    .filter((service) => (includeInactive ? true : service.isActive))
    .sort((a, b) => a.sortOrder - b.sortOrder)
    .map((service) => ({
      ...service,
      plans: state.catalogPlans
        .filter((plan) => plan.serviceId === service.id && (includeInactive ? true : plan.isActive))
        .sort((a, b) => a.sortOrder - b.sortOrder)
        .map((plan) => {
          const priceRef = plan.priceKey && state.prices[plan.priceKey] ? state.prices[plan.priceKey] : null;
          const computedPrice = priceRef ? priceRef.price : normalizePrice(plan.price) || 0;
          return {
            ...plan,
            price: computedPrice,
          };
        }),
    }));

  return services;
}

function calculateAmountFromModifier(basePrice, type, value) {
  if (basePrice <= 0) return 0;
  if (type === 'percent') {
    const amount = Math.round((basePrice * value) / 100);
    return amount < 0 ? 0 : amount;
  }
  if (type === 'fixed') {
    return Math.round(value < 0 ? 0 : value);
  }
  return 0;
}

function isDateExpired(isoString) {
  if (!isoString) return false;
  const timestamp = new Date(isoString).getTime();
  if (Number.isNaN(timestamp)) return false;
  return Date.now() > timestamp;
}

function getBestOffer(serviceId, planId, basePrice) {
  const activeOffers = state.offers.filter((offer) => {
    if (!offer.active) return false;
    if (isDateExpired(offer.expiresAt)) return false;
    if (offer.serviceId && offer.serviceId !== serviceId) return false;
    if (offer.planId && offer.planId !== planId) return false;
    return true;
  });

  if (activeOffers.length === 0) return { offer: null, amount: 0 };

  let bestOffer = null;
  let bestAmount = 0;

  for (const offer of activeOffers) {
    const amount = calculateAmountFromModifier(basePrice, offer.type, offer.value);
    if (amount > bestAmount) {
      bestAmount = amount;
      bestOffer = offer;
    }
  }

  return { offer: bestOffer, amount: bestAmount };
}

function resolveDiscountByCode(code, serviceId, planId) {
  const discountCode = normalizeDiscountCode(code);
  if (!discountCode) return null;

  const discount = state.discounts.find((item) => item.code === discountCode);
  if (!discount) return null;

  if (!discount.active) return null;
  if (isDateExpired(discount.expiresAt)) return null;
  if (discount.maxUses > 0 && discount.usedCount >= discount.maxUses) return null;
  if (discount.serviceId && discount.serviceId !== serviceId) return null;
  if (discount.planId && discount.planId !== planId) return null;

  return discount;
}

function getPlanById(planId) {
  return state.catalogPlans.find((plan) => plan.id === planId) || null;
}

function getServiceById(serviceId) {
  return state.catalogServices.find((service) => service.id === serviceId) || null;
}

function resolveBasePrice({ serviceId, planId, clientPrice }) {
  const normalizedClientPrice = normalizePrice(clientPrice);
  const plan = planId ? getPlanById(planId) : null;

  if (plan) {
    const priceRef = plan.priceKey && state.prices[plan.priceKey] ? state.prices[plan.priceKey] : null;
    if (priceRef) {
      return priceRef.price;
    }
    if (normalizePrice(plan.price) !== null) {
      return normalizePrice(plan.price);
    }
  }

  if (normalizedClientPrice !== null) {
    return normalizedClientPrice;
  }

  const service = serviceId ? getServiceById(serviceId) : null;
  if (service) {
    const fallbackPlan = state.catalogPlans
      .filter((item) => item.serviceId === service.id)
      .sort((a, b) => a.sortOrder - b.sortOrder)[0];

    if (fallbackPlan) {
      const fallbackPriceRef = fallbackPlan.priceKey && state.prices[fallbackPlan.priceKey] ? state.prices[fallbackPlan.priceKey] : null;
      if (fallbackPriceRef) return fallbackPriceRef.price;
      if (normalizePrice(fallbackPlan.price) !== null) return normalizePrice(fallbackPlan.price);
    }
  }

  return 0;
}

function buildQuote({ serviceId, planId, basePrice, couponCode }) {
  const safeBasePrice = normalizePrice(basePrice) || 0;
  const safeServiceId = normalizeSlug(serviceId, 120);
  const safePlanId = normalizeNullableSlug(planId, 120);

  const { offer, amount: offerAmountRaw } = getBestOffer(safeServiceId, safePlanId, safeBasePrice);
  const offerAmount = Math.min(offerAmountRaw, safeBasePrice);

  let coupon = null;
  let couponAmount = 0;

  if (couponCode) {
    coupon = resolveDiscountByCode(couponCode, safeServiceId, safePlanId);
    if (!coupon) {
      return {
        error: 'کد تخفیف نامعتبر یا منقضی است',
      };
    }
    couponAmount = calculateAmountFromModifier(safeBasePrice, coupon.type, coupon.value);
    couponAmount = Math.min(couponAmount, safeBasePrice);
  }

  const finalPrice = Math.max(0, safeBasePrice - offerAmount - couponAmount);

  return {
    basePrice: safeBasePrice,
    offerId: offer ? offer.id : null,
    offerTitle: offer ? offer.title : null,
    offerAmount,
    couponId: coupon ? coupon.id : null,
    couponCode: coupon ? coupon.code : null,
    couponAmount,
    finalPrice,
    currency: 'IRR',
  };
}

function buildAdminDashboard() {
  const orders = state.orders.slice();
  const now = Date.now();

  const todayStart = new Date();
  todayStart.setHours(0, 0, 0, 0);

  const stats = {
    totalOrders: orders.length,
    pendingOrders: 0,
    processingOrders: 0,
    completedOrders: 0,
    refundedOrders: 0,
    totalRevenue: 0,
    todayOrders: 0,
    todayRevenue: 0,
    awaitingPayment: 0,
    paymentSubmitted: 0,
    delivered: 0,
  };

  for (const order of orders) {
    if (order.status === 'pending') stats.pendingOrders += 1;
    if (order.status === 'processing') stats.processingOrders += 1;
    if (order.status === 'completed') stats.completedOrders += 1;
    if (order.status === 'refunded') stats.refundedOrders += 1;

    if (order.paymentStatus === 'awaiting_payment') stats.awaitingPayment += 1;
    if (order.paymentStatus === 'submitted') stats.paymentSubmitted += 1;
    if (order.fulfillmentStatus === 'delivered') stats.delivered += 1;

    if (order.status === 'completed' || order.paymentStatus === 'verified') {
      stats.totalRevenue += order.price;
    }

    const createdAt = new Date(order.createdAt).getTime();
    if (!Number.isNaN(createdAt) && createdAt >= todayStart.getTime() && createdAt <= now) {
      stats.todayOrders += 1;
      if (order.status === 'completed' || order.paymentStatus === 'verified') {
        stats.todayRevenue += order.price;
      }
    }
  }

  return stats;
}

function getAdminCatalogPayload() {
  const services = state.catalogServices.slice().sort((a, b) => a.sortOrder - b.sortOrder);
  const plans = state.catalogPlans
    .slice()
    .sort((a, b) => {
      if (a.serviceId === b.serviceId) {
        return a.sortOrder - b.sortOrder;
      }
      return a.serviceId.localeCompare(b.serviceId);
    })
    .map((plan) => {
      const priceRef = plan.priceKey && state.prices[plan.priceKey] ? state.prices[plan.priceKey] : null;
      return {
        ...plan,
        price: priceRef ? priceRef.price : normalizePrice(plan.price) || 0,
      };
    });

  return {
    services,
    plans,
  };
}

function parsePathSegments(pathname) {
  return pathname.split('/').filter(Boolean);
}

function setOrderStatus(order, nextStatus, actorName) {
  const current = order.status;
  if (!nextStatus || current === nextStatus) return;
  order.status = nextStatus;
  addTimeline(order, 'status', `وضعیت سفارش از ${current} به ${nextStatus} تغییر کرد`, actorName);

  if (nextStatus === 'completed' && order.fulfillmentStatus !== 'delivered') {
    order.fulfillmentStatus = 'delivered';
    order.deliveredAt = new Date().toISOString();
  }
  if (nextStatus === 'refunded') {
    order.paymentStatus = 'refunded';
    order.refundedAt = new Date().toISOString();
  }
}

function setPaymentStatus(order, nextStatus, actorName) {
  const current = order.paymentStatus;
  if (!nextStatus || current === nextStatus) return;
  order.paymentStatus = nextStatus;
  addTimeline(order, 'payment', `وضعیت پرداخت از ${current} به ${nextStatus} تغییر کرد`, actorName);

  if (nextStatus === 'verified') {
    order.paymentVerifiedAt = new Date().toISOString();
    if (order.status === 'pending') {
      order.status = 'processing';
    }
  }

  if (nextStatus === 'refunded') {
    order.refundedAt = new Date().toISOString();
    order.status = 'refunded';
  }
}

function setFulfillmentStatus(order, nextStatus, actorName) {
  const current = order.fulfillmentStatus;
  if (!nextStatus || current === nextStatus) return;
  order.fulfillmentStatus = nextStatus;
  addTimeline(order, 'fulfillment', `وضعیت تحویل از ${current} به ${nextStatus} تغییر کرد`, actorName);

  if (nextStatus === 'delivered') {
    order.deliveredAt = new Date().toISOString();
    if (order.status !== 'refunded') {
      order.status = 'completed';
    }
    if (order.paymentStatus === 'submitted') {
      order.paymentStatus = 'verified';
      order.paymentVerifiedAt = new Date().toISOString();
    }
  }
}

function upsertPrice(key, name, price) {
  const now = new Date().toISOString();
  state.prices[key] = {
    name,
    price,
    updatedAt: now,
  };
}

async function handleRequest(req, res) {
  cleanupExpired();

  const url = new URL(req.url || '/', `http://${req.headers.host || 'localhost'}`);
  const pathname = url.pathname;
  const method = req.method || 'GET';
  const segments = parsePathSegments(pathname);

  if (method === 'GET' && pathname === '/health') {
    ok(res, { status: 'ok' });
    return;
  }

  if (method === 'GET' && pathname === '/api/auth/session') {
    const identity = resolveUserFromRequest(req);
    if (!identity) {
      ok(res, { user: null });
      return;
    }

    ok(res, {
      user: {
        ...identity.user,
        isAdmin: isAdminUser(identity.user),
      },
    });
    return;
  }

  if (method === 'GET' && pathname === '/api/auth/catalog') {
    ok(res, {
      services: getCatalogSnapshot(false),
      generatedAt: new Date().toISOString(),
    });
    return;
  }

  if (method === 'POST' && pathname === '/api/auth/orders/quote') {
    const body = await readBody(req);
    const serviceId = normalizeSlug(body.serviceId, 120);
    const planId = normalizeNullableSlug(body.planId, 120);
    const couponCode = normalizeDiscountCode(body.couponCode);
    const basePrice = resolveBasePrice({ serviceId, planId, clientPrice: body.price });

    const quote = buildQuote({
      serviceId,
      planId,
      basePrice,
      couponCode,
    });

    if (quote.error) {
      badRequest(res, quote.error, 422);
      return;
    }

    ok(res, quote);
    return;
  }

  if (method === 'GET' && pathname === '/api/auth/orders') {
    const identity = requireAuth(req, res);
    if (!identity) return;

    const orders = state.orders
      .filter((order) => order.userId === identity.user.id)
      .sort((a, b) => Number(new Date(b.createdAt)) - Number(new Date(a.createdAt)));

    ok(res, { orders });
    return;
  }

  if (method === 'GET' && pathname === '/api/auth/orders/admin') {
    const identity = requireAdmin(req, res);
    if (!identity) return;

    const orders = state.orders
      .slice()
      .sort((a, b) => Number(new Date(b.createdAt)) - Number(new Date(a.createdAt)));

    ok(res, { orders });
    return;
  }

  if (
    method === 'GET' &&
    segments.length === 4 &&
    segments[0] === 'api' &&
    segments[1] === 'auth' &&
    segments[2] === 'orders' &&
    segments[3] !== 'admin'
  ) {
    const identity = requireAuth(req, res);
    if (!identity) return;

    const orderId = normalizeText(segments[3], 100);
    const order = state.orders.find((item) => item.id === orderId && item.userId === identity.user.id);
    if (!order) {
      badRequest(res, 'سفارش یافت نشد', 404);
      return;
    }

    ok(res, { order });
    return;
  }

  if (method === 'POST' && pathname === '/api/auth/orders') {
    const identity = requireAuth(req, res);
    if (!identity) return;

    const body = await readBody(req);

    const serviceId = normalizeSlug(body.serviceId, 120);
    const service = getServiceById(serviceId);
    const serviceName = normalizeText(body.serviceName, 160) || (service ? service.name : serviceId);

    const planId = normalizeNullableSlug(body.planId, 120);
    const plan = planId ? getPlanById(planId) : null;

    const planName = normalizeText(body.planName, 200) || (plan ? plan.name : '');
    const planDuration = normalizeNullableText(body.planDuration, 120) || (plan ? plan.duration : null);

    const customerNote = normalizeNullableText(body.notes, 1000);
    const customerTelegram = normalizeNullableText(body.customerTelegram || body.telegramUsername, 80);

    const activationEmail = normalizeNullableEmail(
      body.activationEmail || (body.customer && body.customer.activationEmail) || body.accountEmail,
    );

    const couponCode = normalizeDiscountCode(body.couponCode || '');

    if (!serviceId || !serviceName || !planName) {
      badRequest(res, 'اطلاعات سفارش کامل نیست');
      return;
    }

    const mustRequireActivationEmail =
      serviceId === 'chatgpt' ||
      serviceId === 'gemini' ||
      (plan && plan.requiresActivationEmail);

    if (mustRequireActivationEmail && !activationEmail) {
      badRequest(
        res,
        serviceId === 'chatgpt'
          ? 'ایمیل اکانت رایگان ChatGPT الزامی است'
          : 'جیمیل فعالسازی برای این سفارش الزامی است',
        422,
      );
      return;
    }

    const basePrice = resolveBasePrice({ serviceId, planId, clientPrice: body.price });
    const quote = buildQuote({
      serviceId,
      planId,
      basePrice,
      couponCode,
    });

    if (quote.error) {
      badRequest(res, quote.error, 422);
      return;
    }

    const now = new Date().toISOString();
    const order = normalizeOrder({
      id: `ORD-${crypto.randomBytes(4).toString('hex').toUpperCase()}`,
      userId: identity.user.id,
      userEmail: identity.user.email,
      userFullName: identity.user.fullName || null,
      serviceId,
      serviceName,
      planId: planId || null,
      planName,
      planDuration,
      basePrice: quote.basePrice,
      price: quote.finalPrice,
      discountCode: quote.couponCode,
      discountAmount: quote.couponAmount,
      offerId: quote.offerId,
      offerAmount: quote.offerAmount,

      status: 'pending',
      paymentStatus: 'awaiting_payment',
      fulfillmentStatus: 'new',

      activationEmail,
      customerTelegram,
      notes: customerNote,

      timeline: [
        createTimelineEvent('created', 'سفارش توسط مشتری ثبت شد', identity.user.email, now),
        createTimelineEvent('pricing', `مبلغ نهایی سفارش ${quote.finalPrice.toLocaleString('fa-IR')} تومان شد`, 'system', now),
      ],

      source: 'website',
      createdAt: now,
      updatedAt: now,
    });

    if (quote.couponId) {
      const discount = state.discounts.find((item) => item.id === quote.couponId);
      if (discount) {
        discount.usedCount += 1;
        discount.updatedAt = now;
      }
    }

    state.orders.push(order);
    persistState();

    ok(res, {
      message: 'سفارش شما با موفقیت ثبت شد',
      order,
    });
    return;
  }

  if (method === 'POST' && segments.length === 5 && segments[0] === 'api' && segments[1] === 'auth' && segments[2] === 'orders' && segments[4] === 'messages') {
    const identity = requireAuth(req, res);
    if (!identity) return;

    const orderId = normalizeText(segments[3], 100);
    const order = state.orders.find((item) => item.id === orderId && item.userId === identity.user.id);
    if (!order) {
      badRequest(res, 'سفارش یافت نشد', 404);
      return;
    }

    const body = await readBody(req);
    const message = normalizeText(body.message, 1000);
    if (!message) {
      badRequest(res, 'متن پیام را وارد کنید');
      return;
    }

    addTimeline(order, 'customer_message', message, identity.user.email);
    order.updatedAt = new Date().toISOString();
    persistState();

    ok(res, { message: 'پیام شما ثبت شد', order });
    return;
  }

  if (method === 'POST' && segments.length === 5 && segments[0] === 'api' && segments[1] === 'auth' && segments[2] === 'orders' && segments[4] === 'payment') {
    const identity = requireAuth(req, res);
    if (!identity) return;

    const orderId = normalizeText(segments[3], 100);
    const order = state.orders.find((item) => item.id === orderId && item.userId === identity.user.id);
    if (!order) {
      badRequest(res, 'سفارش یافت نشد', 404);
      return;
    }

    const body = await readBody(req);
    const paymentMethod = normalizeNullableText(body.paymentMethod, 60);
    const paymentReference = normalizeNullableText(body.paymentReference, 160);
    const paymentReceipt = normalizeNullableText(body.paymentReceipt, 1200);

    if (!paymentMethod && !paymentReference && !paymentReceipt) {
      badRequest(res, 'اطلاعات پرداخت را وارد کنید');
      return;
    }

    if (paymentMethod) order.paymentMethod = paymentMethod;
    if (paymentReference) order.paymentReference = paymentReference;
    if (paymentReceipt) order.paymentReceipt = paymentReceipt;

    order.paymentStatus = 'submitted';
    order.paymentSubmittedAt = new Date().toISOString();
    order.updatedAt = new Date().toISOString();

    addTimeline(order, 'payment_submitted', 'کاربر اطلاعات پرداخت را ثبت کرد', identity.user.email);

    persistState();

    ok(res, {
      message: 'اطلاعات پرداخت ثبت شد',
      order,
    });
    return;
  }

  if (method === 'GET' && pathname === '/api/auth/admin/dashboard') {
    const identity = requireAdmin(req, res);
    if (!identity) return;

    ok(res, {
      stats: buildAdminDashboard(),
    });
    return;
  }

  if (method === 'PATCH' && segments.length === 6 && segments[0] === 'api' && segments[1] === 'auth' && segments[2] === 'orders' && segments[3] === 'admin') {
    const identity = requireAdmin(req, res);
    if (!identity) return;

    const orderId = normalizeText(segments[4], 100);
    if (!orderId || segments[5] !== '') {
      // ignore, this route uses /api/auth/orders/admin/:id (without extra segment)
    }
  }

  if (method === 'PATCH' && segments.length === 5 && segments[0] === 'api' && segments[1] === 'auth' && segments[2] === 'orders' && segments[3] === 'admin') {
    const identity = requireAdmin(req, res);
    if (!identity) return;

    const orderId = normalizeText(segments[4], 100);
    if (!orderId) {
      badRequest(res, 'شناسه سفارش نامعتبر است');
      return;
    }

    const order = state.orders.find((item) => item.id === orderId);
    if (!order) {
      badRequest(res, 'سفارش یافت نشد', 404);
      return;
    }

    const body = await readBody(req);

    const nextStatus = Object.prototype.hasOwnProperty.call(body, 'status') ? normalizeOrderStatus(body.status) : null;
    const nextPaymentStatus = Object.prototype.hasOwnProperty.call(body, 'paymentStatus')
      ? normalizePaymentStatus(body.paymentStatus)
      : null;
    const nextFulfillmentStatus = Object.prototype.hasOwnProperty.call(body, 'fulfillmentStatus')
      ? normalizeFulfillmentStatus(body.fulfillmentStatus)
      : null;

    if (Object.prototype.hasOwnProperty.call(body, 'status') && !nextStatus) {
      badRequest(res, 'وضعیت سفارش نامعتبر است');
      return;
    }
    if (Object.prototype.hasOwnProperty.call(body, 'paymentStatus') && !nextPaymentStatus) {
      badRequest(res, 'وضعیت پرداخت نامعتبر است');
      return;
    }
    if (Object.prototype.hasOwnProperty.call(body, 'fulfillmentStatus') && !nextFulfillmentStatus) {
      badRequest(res, 'وضعیت تحویل نامعتبر است');
      return;
    }

    const actor = identity.user.email;

    setOrderStatus(order, nextStatus, actor);
    setPaymentStatus(order, nextPaymentStatus, actor);
    setFulfillmentStatus(order, nextFulfillmentStatus, actor);

    if (Object.prototype.hasOwnProperty.call(body, 'adminNotes')) {
      order.adminNotes = normalizeNullableText(body.adminNotes, 1000);
      addTimeline(order, 'admin_note', 'یادداشت ادمین بروزرسانی شد', actor);
    }

    if (Object.prototype.hasOwnProperty.call(body, 'notes')) {
      order.notes = normalizeNullableText(body.notes, 1000);
      addTimeline(order, 'customer_note_edit', 'متن توضیحات سفارش بروزرسانی شد', actor);
    }

    if (Object.prototype.hasOwnProperty.call(body, 'paymentMethod')) {
      order.paymentMethod = normalizeNullableText(body.paymentMethod, 60);
    }

    if (Object.prototype.hasOwnProperty.call(body, 'paymentReference')) {
      order.paymentReference = normalizeNullableText(body.paymentReference, 160);
    }

    if (Object.prototype.hasOwnProperty.call(body, 'paymentReceipt')) {
      order.paymentReceipt = normalizeNullableText(body.paymentReceipt, 1200);
    }

    if (Object.prototype.hasOwnProperty.call(body, 'deliveryAccount')) {
      order.deliveryAccount = normalizeNullableText(body.deliveryAccount, 500);
      if (order.deliveryAccount) {
        addTimeline(order, 'delivery_account', 'جزئیات تحویل اکانت ثبت شد', actor);
      }
    }

    if (Object.prototype.hasOwnProperty.call(body, 'activationEmail')) {
      const activationEmail = normalizeNullableEmail(body.activationEmail);
      order.activationEmail = activationEmail;
      addTimeline(order, 'activation_email', 'ایمیل فعالسازی بروزرسانی شد', actor);
    }

    if (Object.prototype.hasOwnProperty.call(body, 'customerTelegram')) {
      order.customerTelegram = normalizeNullableText(body.customerTelegram, 80);
    }

    if (Object.prototype.hasOwnProperty.call(body, 'appendTimelineMessage')) {
      const customMessage = normalizeText(body.appendTimelineMessage, 1000);
      if (customMessage) {
        addTimeline(order, 'admin_message', customMessage, actor);
      }
    }

    order.updatedAt = new Date().toISOString();
    persistState();

    ok(res, {
      message: 'سفارش بروزرسانی شد',
      order,
    });
    return;
  }

  if (method === 'GET' && pathname === '/api/auth/admin/prices') {
    const identity = requireAdmin(req, res);
    if (!identity) return;

    const prices = Object.entries(state.prices)
      .map(([key, value]) => ({ key, ...value }))
      .sort((a, b) => a.key.localeCompare(b.key));

    ok(res, { prices });
    return;
  }

  if (method === 'POST' && pathname === '/api/auth/admin/prices') {
    const identity = requireAdmin(req, res);
    if (!identity) return;

    const body = await readBody(req);
    const key = normalizeSlug(body.key, 120);
    const name = normalizeText(body.name, 160);
    const price = normalizePrice(body.price);

    if (!key || !name || price === null) {
      badRequest(res, 'کلید، نام و قیمت معتبر الزامی است');
      return;
    }

    upsertPrice(key, name, price);
    syncPricesFiles();
    persistState();

    ok(res, {
      message: 'قیمت ثبت شد',
      price: { key, ...state.prices[key] },
    });
    return;
  }

  if (segments.length === 5 && segments[0] === 'api' && segments[1] === 'auth' && segments[2] === 'admin' && segments[3] === 'prices') {
    const identity = requireAdmin(req, res);
    if (!identity) return;

    const key = normalizeSlug(segments[4], 120);
    if (!key) {
      badRequest(res, 'کلید قیمت نامعتبر است');
      return;
    }

    if (method === 'PATCH') {
      if (!state.prices[key]) {
        badRequest(res, 'قیمت یافت نشد', 404);
        return;
      }

      const body = await readBody(req);
      const name = Object.prototype.hasOwnProperty.call(body, 'name') ? normalizeText(body.name, 160) : state.prices[key].name;
      const price = Object.prototype.hasOwnProperty.call(body, 'price') ? normalizePrice(body.price) : state.prices[key].price;

      if (!name || price === null) {
        badRequest(res, 'نام یا قیمت نامعتبر است');
        return;
      }

      upsertPrice(key, name, price);
      syncPricesFiles();
      persistState();

      ok(res, {
        message: 'قیمت بروزرسانی شد',
        price: { key, ...state.prices[key] },
      });
      return;
    }

    if (method === 'DELETE') {
      if (!state.prices[key]) {
        badRequest(res, 'قیمت یافت نشد', 404);
        return;
      }

      delete state.prices[key];
      syncPricesFiles();
      persistState();

      ok(res, { message: 'قیمت حذف شد' });
      return;
    }
  }

  if (method === 'GET' && pathname === '/api/auth/admin/catalog') {
    const identity = requireAdmin(req, res);
    if (!identity) return;

    ok(res, getAdminCatalogPayload());
    return;
  }

  if (method === 'POST' && pathname === '/api/auth/admin/catalog/services') {
    const identity = requireAdmin(req, res);
    if (!identity) return;

    const body = await readBody(req);
    const fallbackServiceId = `svc-${crypto.randomBytes(3).toString('hex')}`;

    const service = normalizeCatalogService({
      id: body.id || body.slug || normalizeSlug(body.name, 80) || fallbackServiceId,
      slug: body.slug,
      name: body.name,
      description: body.description,
      logo: body.logo,
      routePath: body.routePath,
      color: body.color,
      sortOrder: body.sortOrder,
      isActive: body.isActive,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    });

    if (!service) {
      badRequest(res, 'اطلاعات سرویس نامعتبر است');
      return;
    }

    const exists = state.catalogServices.some((item) => item.id === service.id);
    if (exists) {
      badRequest(res, 'سرویسی با این شناسه از قبل وجود دارد', 409);
      return;
    }

    state.catalogServices.push(service);
    persistState();

    ok(res, { message: 'سرویس جدید اضافه شد', service });
    return;
  }

  if (
    segments.length === 6 &&
    segments[0] === 'api' &&
    segments[1] === 'auth' &&
    segments[2] === 'admin' &&
    segments[3] === 'catalog' &&
    segments[4] === 'services'
  ) {
    const identity = requireAdmin(req, res);
    if (!identity) return;

    const serviceId = normalizeSlug(segments[5], 80);
    const service = state.catalogServices.find((item) => item.id === serviceId);
    if (!service) {
      badRequest(res, 'سرویس یافت نشد', 404);
      return;
    }

    if (method === 'PATCH') {
      const body = await readBody(req);

      const next = normalizeCatalogService({
        ...service,
        ...body,
        id: service.id,
        updatedAt: new Date().toISOString(),
      });

      if (!next) {
        badRequest(res, 'اطلاعات بروزرسانی سرویس نامعتبر است');
        return;
      }

      Object.assign(service, next);
      persistState();

      ok(res, { message: 'سرویس بروزرسانی شد', service });
      return;
    }

    if (method === 'DELETE') {
      state.catalogServices = state.catalogServices.filter((item) => item.id !== serviceId);
      state.catalogPlans = state.catalogPlans.filter((plan) => plan.serviceId !== serviceId);
      persistState();

      ok(res, { message: 'سرویس و پلن های مرتبط حذف شدند' });
      return;
    }
  }

  if (method === 'POST' && pathname === '/api/auth/admin/catalog/plans') {
    const identity = requireAdmin(req, res);
    if (!identity) return;

    const body = await readBody(req);
    const fallbackPlanId = `plan-${crypto.randomBytes(4).toString('hex')}`;
    const generatedPlanId = normalizeSlug(`${body.serviceId || ''}-${body.name || ''}`, 120) || fallbackPlanId;
    const generatedPriceKey = normalizeSlug(body.priceKey || generatedPlanId, 120) || generatedPlanId;

    const plan = normalizeCatalogPlan({
      id: body.id || body.priceKey || generatedPlanId,
      serviceId: body.serviceId,
      name: body.name,
      subtitle: body.subtitle,
      duration: body.duration,
      priceKey: generatedPriceKey,
      price: body.price,
      badge: body.badge,
      description: body.description,
      sortOrder: body.sortOrder,
      requiresActivationEmail: body.requiresActivationEmail,
      activationEmailLabel: body.activationEmailLabel,
      isActive: body.isActive,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    });

    if (!plan) {
      badRequest(res, 'اطلاعات پلن نامعتبر است');
      return;
    }

    const service = getServiceById(plan.serviceId);
    if (!service) {
      badRequest(res, 'سرویس انتخابی وجود ندارد');
      return;
    }

    const exists = state.catalogPlans.some((item) => item.id === plan.id);
    if (exists) {
      badRequest(res, 'پلنی با این شناسه از قبل وجود دارد', 409);
      return;
    }

    if (normalizePrice(plan.price) !== null) {
      const finalName = normalizeText(plan.name, 160) || plan.id;
      upsertPrice(plan.priceKey || plan.id, finalName, normalizePrice(plan.price));
      syncPricesFiles();
    }

    state.catalogPlans.push(plan);
    persistState();

    ok(res, { message: 'پلن جدید اضافه شد', plan });
    return;
  }

  if (
    segments.length === 6 &&
    segments[0] === 'api' &&
    segments[1] === 'auth' &&
    segments[2] === 'admin' &&
    segments[3] === 'catalog' &&
    segments[4] === 'plans'
  ) {
    const identity = requireAdmin(req, res);
    if (!identity) return;

    const planId = normalizeSlug(segments[5], 120);
    const plan = state.catalogPlans.find((item) => item.id === planId);
    if (!plan) {
      badRequest(res, 'پلن یافت نشد', 404);
      return;
    }

    if (method === 'PATCH') {
      const body = await readBody(req);

      const merged = {
        ...plan,
        ...body,
        id: plan.id,
        updatedAt: new Date().toISOString(),
      };

      const next = normalizeCatalogPlan(merged);
      if (!next) {
        badRequest(res, 'اطلاعات بروزرسانی پلن نامعتبر است');
        return;
      }

      const serviceExists = getServiceById(next.serviceId);
      if (!serviceExists) {
        badRequest(res, 'سرویس انتخابی وجود ندارد');
        return;
      }

      Object.assign(plan, next);

      if (Object.prototype.hasOwnProperty.call(body, 'price')) {
        const priceValue = normalizePrice(body.price);
        if (priceValue !== null) {
          upsertPrice(plan.priceKey || plan.id, plan.name, priceValue);
          syncPricesFiles();
        }
      }

      persistState();

      ok(res, { message: 'پلن بروزرسانی شد', plan });
      return;
    }

    if (method === 'DELETE') {
      state.catalogPlans = state.catalogPlans.filter((item) => item.id !== planId);
      persistState();

      ok(res, { message: 'پلن حذف شد' });
      return;
    }
  }

  if (method === 'GET' && pathname === '/api/auth/admin/discounts') {
    const identity = requireAdmin(req, res);
    if (!identity) return;

    const discounts = state.discounts.slice().sort((a, b) => Number(new Date(b.createdAt)) - Number(new Date(a.createdAt)));
    ok(res, { discounts });
    return;
  }

  if (method === 'POST' && pathname === '/api/auth/admin/discounts') {
    const identity = requireAdmin(req, res);
    if (!identity) return;

    const body = await readBody(req);
    const now = new Date().toISOString();
    const rawDiscountId = normalizeSlug(body.id || body.code, 120);
    const discountId =
      rawDiscountId && !/^[-_]+$/.test(rawDiscountId)
        ? rawDiscountId
        : `dsc-${crypto.randomBytes(4).toString('hex')}`;

    const discount = normalizeDiscount({
      id: discountId,
      code: body.code,
      title: body.title,
      description: body.description,
      type: body.type,
      value: body.value,
      serviceId: body.serviceId,
      planId: body.planId,
      maxUses: body.maxUses,
      usedCount: 0,
      active: body.active,
      expiresAt: body.expiresAt,
      createdAt: now,
      updatedAt: now,
    });

    if (!discount) {
      badRequest(res, 'اطلاعات کد تخفیف نامعتبر است');
      return;
    }

    const duplicate = state.discounts.find((item) => item.code === discount.code);
    if (duplicate) {
      badRequest(res, 'این کد تخفیف قبلا ثبت شده است', 409);
      return;
    }

    state.discounts.push(discount);
    persistState();

    ok(res, { message: 'کد تخفیف اضافه شد', discount });
    return;
  }

  if (segments.length === 5 && segments[0] === 'api' && segments[1] === 'auth' && segments[2] === 'admin' && segments[3] === 'discounts') {
    const identity = requireAdmin(req, res);
    if (!identity) return;

    const discountId = normalizeSlug(segments[4], 120);
    const discount = state.discounts.find((item) => item.id === discountId);
    if (!discount) {
      badRequest(res, 'کد تخفیف یافت نشد', 404);
      return;
    }

    if (method === 'PATCH') {
      const body = await readBody(req);
      const next = normalizeDiscount({
        ...discount,
        ...body,
        id: discount.id,
        updatedAt: new Date().toISOString(),
      });

      if (!next) {
        badRequest(res, 'اطلاعات بروزرسانی کد تخفیف نامعتبر است');
        return;
      }

      const duplicate = state.discounts.find((item) => item.id !== discount.id && item.code === next.code);
      if (duplicate) {
        badRequest(res, 'کد تخفیف تکراری است', 409);
        return;
      }

      Object.assign(discount, next);
      persistState();

      ok(res, { message: 'کد تخفیف بروزرسانی شد', discount });
      return;
    }

    if (method === 'DELETE') {
      state.discounts = state.discounts.filter((item) => item.id !== discountId);
      persistState();
      ok(res, { message: 'کد تخفیف حذف شد' });
      return;
    }
  }

  if (method === 'GET' && pathname === '/api/auth/admin/offers') {
    const identity = requireAdmin(req, res);
    if (!identity) return;

    const offers = state.offers.slice().sort((a, b) => Number(new Date(b.createdAt)) - Number(new Date(a.createdAt)));
    ok(res, { offers });
    return;
  }

  if (method === 'POST' && pathname === '/api/auth/admin/offers') {
    const identity = requireAdmin(req, res);
    if (!identity) return;

    const body = await readBody(req);
    const now = new Date().toISOString();
    const rawOfferId = normalizeSlug(body.id || body.title, 120);
    const offerId =
      rawOfferId && !/^[-_]+$/.test(rawOfferId)
        ? rawOfferId
        : `off-${crypto.randomBytes(4).toString('hex')}`;

    const offer = normalizeOffer({
      id: offerId,
      title: body.title,
      description: body.description,
      type: body.type,
      value: body.value,
      serviceId: body.serviceId,
      planId: body.planId,
      active: body.active,
      expiresAt: body.expiresAt,
      createdAt: now,
      updatedAt: now,
    });

    if (!offer) {
      badRequest(res, 'اطلاعات آفر نامعتبر است');
      return;
    }

    const duplicate = state.offers.find((item) => item.id === offer.id);
    if (duplicate) {
      badRequest(res, 'آفری با این شناسه وجود دارد', 409);
      return;
    }

    state.offers.push(offer);
    persistState();

    ok(res, { message: 'آفر اضافه شد', offer });
    return;
  }

  if (segments.length === 5 && segments[0] === 'api' && segments[1] === 'auth' && segments[2] === 'admin' && segments[3] === 'offers') {
    const identity = requireAdmin(req, res);
    if (!identity) return;

    const offerId = normalizeSlug(segments[4], 120);
    const offer = state.offers.find((item) => item.id === offerId);
    if (!offer) {
      badRequest(res, 'آفر یافت نشد', 404);
      return;
    }

    if (method === 'PATCH') {
      const body = await readBody(req);
      const next = normalizeOffer({
        ...offer,
        ...body,
        id: offer.id,
        updatedAt: new Date().toISOString(),
      });

      if (!next) {
        badRequest(res, 'اطلاعات آفر نامعتبر است');
        return;
      }

      Object.assign(offer, next);
      persistState();

      ok(res, { message: 'آفر بروزرسانی شد', offer });
      return;
    }

    if (method === 'DELETE') {
      state.offers = state.offers.filter((item) => item.id !== offerId);
      persistState();
      ok(res, { message: 'آفر حذف شد' });
      return;
    }
  }

  if (method === 'POST' && pathname === '/api/auth/request-otp') {
    const body = await readBody(req);
    const email = normalizeEmail(body.email);
    const mode = body.mode === 'signup' ? 'signup' : 'login';
    const fullName = normalizeNullableText(body.fullName, 160);

    if (!email || !email.includes('@') || !email.includes('.')) {
      badRequest(res, 'ایمیل معتبر وارد کنید');
      return;
    }

    const user = findUserByEmail(email);

    if (mode === 'login' && !user) {
      badRequest(res, 'برای این ایمیل حسابی یافت نشد. ابتدا ثبت‌نام کنید.', 404);
      return;
    }

    if (mode === 'signup' && user) {
      badRequest(res, 'این ایمیل قبلا ثبت شده است. از بخش ورود استفاده کنید.', 409);
      return;
    }

    const now = Date.now();
    const latestOtp = state.otps
      .filter((item) => item.email === email)
      .sort((a, b) => Number(b.createdAt) - Number(a.createdAt))[0];

    if (latestOtp && now - Number(latestOtp.createdAt) < OTP_RESEND_COOLDOWN_SECONDS * 1000) {
      badRequest(res, 'کد قبلا ارسال شده است. یک دقیقه بعد دوباره تلاش کنید.', 429);
      return;
    }

    const code = generateOtpCode();
    const salt = crypto.randomBytes(16).toString('hex');
    const otp = {
      id: crypto.randomUUID(),
      email,
      mode,
      codeHash: sha256(`${salt}:${code}`),
      salt,
      fullName,
      attempts: 0,
      createdAt: now,
      expiresAt: now + OTP_TTL_SECONDS * 1000,
    };

    state.otps = state.otps.filter((item) => item.email !== email);
    state.otps.push(otp);

    sendOtpEmail(email, code, mode);
    persistState();

    ok(res, {
      message: 'کد تایید ارسال شد. لطفا Inbox و پوشه Spam/Junk را بررسی کنید.',
    });
    return;
  }

  if (method === 'POST' && pathname === '/api/auth/verify-otp') {
    const body = await readBody(req);
    const email = normalizeEmail(body.email);
    const token = String(body.token || '').trim();

    if (!email || !token) {
      badRequest(res, 'ایمیل و کد تایید الزامی است');
      return;
    }

    const otp = state.otps.find((item) => item.email === email);
    if (!otp) {
      badRequest(res, 'کد معتبر پیدا نشد. دوباره درخواست کد بدهید.', 404);
      return;
    }

    if (Date.now() > Number(otp.expiresAt)) {
      state.otps = state.otps.filter((item) => item.id !== otp.id);
      persistState();
      badRequest(res, 'کد منقضی شده است. دوباره درخواست کد بدهید.', 410);
      return;
    }

    otp.attempts += 1;
    const tokenHash = sha256(`${otp.salt}:${token}`);
    if (tokenHash !== otp.codeHash) {
      if (otp.attempts >= OTP_MAX_ATTEMPTS) {
        state.otps = state.otps.filter((item) => item.id !== otp.id);
      }
      persistState();
      badRequest(res, 'کد وارد شده صحیح نیست', 401);
      return;
    }

    state.otps = state.otps.filter((item) => item.id !== otp.id);

    let user = findUserByEmail(email);
    if (!user) {
      user = createUser(email, otp.fullName);
    }
    updateUserAfterLogin(user, otp.fullName);

    const ip = String(req.headers['x-forwarded-for'] || req.socket.remoteAddress || '');
    const userAgent = String(req.headers['user-agent'] || '');
    const sessionToken = createSession(user.id, ip, userAgent);

    persistState();

    ok(
      res,
      {
        user: {
          ...user,
          isAdmin: isAdminUser(user),
        },
        message: 'احراز هویت موفق بود',
      },
      {
        'Set-Cookie': buildSetCookie(sessionToken),
      },
    );
    return;
  }

  if (method === 'POST' && pathname === '/api/auth/logout') {
    const cookies = parseCookies(req.headers.cookie || '');
    removeSessionByToken(cookies.nova_auth);
    persistState();
    ok(
      res,
      {
        message: 'خروج انجام شد',
      },
      {
        'Set-Cookie': buildClearCookie(),
      },
    );
    return;
  }

  notFound(res);
}

const server = http.createServer(async (req, res) => {
  try {
    await handleRequest(req, res);
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unexpected server error';
    json(res, 500, { error: message });
  }
});

server.listen(PORT, '127.0.0.1', () => {
  console.log(`Nova Shop auth API listening on 127.0.0.1:${PORT}`);
});
