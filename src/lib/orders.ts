export type OrderStatus = "pending" | "processing" | "completed" | "cancelled" | "refunded";
export type PaymentStatus = "awaiting_payment" | "submitted" | "verified" | "rejected" | "refunded";
export type FulfillmentStatus = "new" | "queued" | "provisioning" | "delivered" | "failed" | "returned";
export type PriceModifierType = "fixed" | "percent";

export interface TimelineEvent {
  id: string;
  type: string;
  message: string;
  actor: string;
  at: string;
}

export interface CreateOrderPayload {
  serviceId: string;
  serviceName: string;
  planId?: string;
  planName: string;
  planDuration?: string;
  price: number;
  notes?: string;
  activationEmail?: string;
  customerTelegram?: string;
  couponCode?: string;
}

export interface OrderRecord {
  id: string;
  userId: string;
  userEmail: string;
  userFullName: string | null;

  serviceId: string;
  serviceName: string;
  planId: string | null;
  planName: string;
  planDuration: string | null;

  price: number;
  basePrice: number;
  currency: "IRR";

  discountCode: string | null;
  discountAmount: number;
  offerId: string | null;
  offerAmount: number;

  status: OrderStatus;
  paymentStatus: PaymentStatus;
  fulfillmentStatus: FulfillmentStatus;

  activationEmail: string | null;
  customerTelegram: string | null;
  notes: string | null;
  adminNotes: string | null;

  paymentMethod: string | null;
  paymentReference: string | null;
  paymentReceipt: string | null;
  paymentSubmittedAt: string | null;
  paymentVerifiedAt: string | null;

  deliveryAccount: string | null;
  deliveredAt: string | null;
  refundedAt: string | null;

  timeline: TimelineEvent[];

  createdAt: string;
  updatedAt: string;
  source: "website" | string;
}

export interface OrderQuote {
  basePrice: number;
  offerId: string | null;
  offerTitle: string | null;
  offerAmount: number;
  couponId: string | null;
  couponCode: string | null;
  couponAmount: number;
  finalPrice: number;
  currency: "IRR";
}

export interface CatalogPlanRecord {
  id: string;
  serviceId: string;
  name: string;
  subtitle: string;
  duration: string;
  priceKey: string;
  price: number;
  badge: string;
  description: string;
  sortOrder: number;
  requiresActivationEmail: boolean;
  activationEmailLabel: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CatalogServiceRecord {
  id: string;
  slug: string;
  name: string;
  description: string;
  logo: string;
  routePath: string | null;
  color: string;
  sortOrder: number;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  plans?: CatalogPlanRecord[];
}

export interface PriceRecord {
  key: string;
  name: string;
  price: number;
  updatedAt?: string;
}

export interface DiscountRecord {
  id: string;
  code: string;
  title: string;
  description: string;
  type: PriceModifierType;
  value: number;
  serviceId: string | null;
  planId: string | null;
  maxUses: number;
  usedCount: number;
  active: boolean;
  expiresAt: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface OfferRecord {
  id: string;
  title: string;
  description: string;
  type: PriceModifierType;
  value: number;
  serviceId: string | null;
  planId: string | null;
  active: boolean;
  expiresAt: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface AdminDashboardStats {
  totalOrders: number;
  pendingOrders: number;
  processingOrders: number;
  completedOrders: number;
  refundedOrders: number;
  totalRevenue: number;
  todayOrders: number;
  todayRevenue: number;
  awaitingPayment: number;
  paymentSubmitted: number;
  delivered: number;
}

interface ApiSuccess<T> {
  ok: true;
  data: T;
}

interface ApiFailure {
  ok: false;
  error: string;
}

export type ApiResult<T> = ApiSuccess<T> | ApiFailure;

async function apiRequest<T>(
  path: string,
  options?: {
    method?: "GET" | "POST" | "PATCH" | "DELETE";
    body?: Record<string, unknown>;
  },
): Promise<ApiResult<T>> {
  try {
    const response = await fetch(path, {
      method: options?.method || (options?.body ? "POST" : "GET"),
      headers: options?.body
        ? {
            "Content-Type": "application/json",
          }
        : undefined,
      credentials: "include",
      body: options?.body ? JSON.stringify(options.body) : undefined,
    });

    const payload = await response.json().catch(() => ({}));

    if (!response.ok) {
      return {
        ok: false,
        error: payload?.error || "خطا در ارتباط با سرور",
      };
    }

    return {
      ok: true,
      data: payload as T,
    };
  } catch (_error) {
    return {
      ok: false,
      error: "خطای شبکه رخ داد",
    };
  }
}

export async function quoteOrder(payload: {
  serviceId: string;
  planId?: string;
  price: number;
  couponCode?: string;
}): Promise<ApiResult<OrderQuote>> {
  return apiRequest<OrderQuote>("/api/auth/orders/quote", {
    method: "POST",
    body: {
      serviceId: payload.serviceId,
      planId: payload.planId,
      price: payload.price,
      couponCode: payload.couponCode,
    },
  });
}

export async function createOrder(payload: CreateOrderPayload): Promise<ApiResult<{ order: OrderRecord }>> {
  return apiRequest<{ order: OrderRecord }>("/api/auth/orders", {
    method: "POST",
    body: {
      serviceId: payload.serviceId,
      serviceName: payload.serviceName,
      planId: payload.planId,
      planName: payload.planName,
      planDuration: payload.planDuration,
      price: payload.price,
      notes: payload.notes,
      activationEmail: payload.activationEmail,
      customerTelegram: payload.customerTelegram,
      couponCode: payload.couponCode,
    },
  });
}

export async function fetchMyOrders(): Promise<ApiResult<{ orders: OrderRecord[] }>> {
  return apiRequest<{ orders: OrderRecord[] }>("/api/auth/orders");
}

export async function fetchMyOrder(orderId: string): Promise<ApiResult<{ order: OrderRecord }>> {
  return apiRequest<{ order: OrderRecord }>(`/api/auth/orders/${encodeURIComponent(orderId)}`);
}

export async function sendOrderMessage(orderId: string, message: string): Promise<ApiResult<{ order: OrderRecord }>> {
  return apiRequest<{ order: OrderRecord }>(`/api/auth/orders/${encodeURIComponent(orderId)}/messages`, {
    method: "POST",
    body: { message },
  });
}

export async function submitOrderPayment(
  orderId: string,
  payload: {
    paymentMethod?: string;
    paymentReference?: string;
    paymentReceipt?: string;
  },
): Promise<ApiResult<{ order: OrderRecord }>> {
  return apiRequest<{ order: OrderRecord }>(`/api/auth/orders/${encodeURIComponent(orderId)}/payment`, {
    method: "POST",
    body: payload,
  });
}

export async function fetchAdminOrders(): Promise<ApiResult<{ orders: OrderRecord[] }>> {
  return apiRequest<{ orders: OrderRecord[] }>("/api/auth/orders/admin");
}

export async function updateAdminOrder(
  orderId: string,
  payload: Partial<{
    status: OrderStatus;
    paymentStatus: PaymentStatus;
    fulfillmentStatus: FulfillmentStatus;
    notes: string;
    adminNotes: string;
    paymentMethod: string;
    paymentReference: string;
    paymentReceipt: string;
    deliveryAccount: string;
    activationEmail: string;
    customerTelegram: string;
    appendTimelineMessage: string;
  }>,
): Promise<ApiResult<{ order: OrderRecord }>> {
  return apiRequest<{ order: OrderRecord }>(`/api/auth/orders/admin/${encodeURIComponent(orderId)}`, {
    method: "PATCH",
    body: payload as Record<string, unknown>,
  });
}

export async function fetchAdminDashboard(): Promise<ApiResult<{ stats: AdminDashboardStats }>> {
  return apiRequest<{ stats: AdminDashboardStats }>("/api/auth/admin/dashboard");
}

export async function fetchAdminCatalog(): Promise<ApiResult<{ services: CatalogServiceRecord[]; plans: CatalogPlanRecord[] }>> {
  return apiRequest<{ services: CatalogServiceRecord[]; plans: CatalogPlanRecord[] }>("/api/auth/admin/catalog");
}

export async function createAdminService(payload: {
  id?: string;
  slug?: string;
  name: string;
  description?: string;
  logo?: string;
  routePath?: string;
  color?: string;
  sortOrder?: number;
  isActive?: boolean;
}): Promise<ApiResult<{ service: CatalogServiceRecord }>> {
  return apiRequest<{ service: CatalogServiceRecord }>("/api/auth/admin/catalog/services", {
    method: "POST",
    body: payload as Record<string, unknown>,
  });
}

export async function updateAdminService(
  serviceId: string,
  payload: Partial<{
    slug: string;
    name: string;
    description: string;
    logo: string;
    routePath: string;
    color: string;
    sortOrder: number;
    isActive: boolean;
  }>,
): Promise<ApiResult<{ service: CatalogServiceRecord }>> {
  return apiRequest<{ service: CatalogServiceRecord }>(`/api/auth/admin/catalog/services/${encodeURIComponent(serviceId)}`, {
    method: "PATCH",
    body: payload as Record<string, unknown>,
  });
}

export async function deleteAdminService(serviceId: string): Promise<ApiResult<{ message: string }>> {
  return apiRequest<{ message: string }>(`/api/auth/admin/catalog/services/${encodeURIComponent(serviceId)}`, {
    method: "DELETE",
  });
}

export async function createAdminPlan(payload: {
  id?: string;
  serviceId: string;
  name: string;
  subtitle?: string;
  duration?: string;
  priceKey?: string;
  price?: number;
  badge?: string;
  description?: string;
  sortOrder?: number;
  requiresActivationEmail?: boolean;
  activationEmailLabel?: string;
  isActive?: boolean;
}): Promise<ApiResult<{ plan: CatalogPlanRecord }>> {
  return apiRequest<{ plan: CatalogPlanRecord }>("/api/auth/admin/catalog/plans", {
    method: "POST",
    body: payload as Record<string, unknown>,
  });
}

export async function updateAdminPlan(
  planId: string,
  payload: Partial<{
    serviceId: string;
    name: string;
    subtitle: string;
    duration: string;
    priceKey: string;
    price: number;
    badge: string;
    description: string;
    sortOrder: number;
    requiresActivationEmail: boolean;
    activationEmailLabel: string;
    isActive: boolean;
  }>,
): Promise<ApiResult<{ plan: CatalogPlanRecord }>> {
  return apiRequest<{ plan: CatalogPlanRecord }>(`/api/auth/admin/catalog/plans/${encodeURIComponent(planId)}`, {
    method: "PATCH",
    body: payload as Record<string, unknown>,
  });
}

export async function deleteAdminPlan(planId: string): Promise<ApiResult<{ message: string }>> {
  return apiRequest<{ message: string }>(`/api/auth/admin/catalog/plans/${encodeURIComponent(planId)}`, {
    method: "DELETE",
  });
}

export async function fetchAdminPrices(): Promise<ApiResult<{ prices: PriceRecord[] }>> {
  return apiRequest<{ prices: PriceRecord[] }>("/api/auth/admin/prices");
}

export async function createAdminPrice(payload: {
  key: string;
  name: string;
  price: number;
}): Promise<ApiResult<{ price: PriceRecord }>> {
  return apiRequest<{ price: PriceRecord }>("/api/auth/admin/prices", {
    method: "POST",
    body: payload,
  });
}

export async function updateAdminPrice(
  key: string,
  payload: {
    name?: string;
    price?: number;
  },
): Promise<ApiResult<{ price: PriceRecord }>> {
  return apiRequest<{ price: PriceRecord }>(`/api/auth/admin/prices/${encodeURIComponent(key)}`, {
    method: "PATCH",
    body: payload as Record<string, unknown>,
  });
}

export async function deleteAdminPrice(key: string): Promise<ApiResult<{ message: string }>> {
  return apiRequest<{ message: string }>(`/api/auth/admin/prices/${encodeURIComponent(key)}`, {
    method: "DELETE",
  });
}

export async function fetchAdminDiscounts(): Promise<ApiResult<{ discounts: DiscountRecord[] }>> {
  return apiRequest<{ discounts: DiscountRecord[] }>("/api/auth/admin/discounts");
}

export async function createAdminDiscount(payload: {
  id?: string;
  code: string;
  title: string;
  description?: string;
  type: PriceModifierType;
  value: number;
  serviceId?: string;
  planId?: string;
  maxUses?: number;
  active?: boolean;
  expiresAt?: string;
}): Promise<ApiResult<{ discount: DiscountRecord }>> {
  return apiRequest<{ discount: DiscountRecord }>("/api/auth/admin/discounts", {
    method: "POST",
    body: payload as Record<string, unknown>,
  });
}

export async function updateAdminDiscount(
  id: string,
  payload: Partial<{
    code: string;
    title: string;
    description: string;
    type: PriceModifierType;
    value: number;
    serviceId: string;
    planId: string;
    maxUses: number;
    usedCount: number;
    active: boolean;
    expiresAt: string;
  }>,
): Promise<ApiResult<{ discount: DiscountRecord }>> {
  return apiRequest<{ discount: DiscountRecord }>(`/api/auth/admin/discounts/${encodeURIComponent(id)}`, {
    method: "PATCH",
    body: payload as Record<string, unknown>,
  });
}

export async function deleteAdminDiscount(id: string): Promise<ApiResult<{ message: string }>> {
  return apiRequest<{ message: string }>(`/api/auth/admin/discounts/${encodeURIComponent(id)}`, {
    method: "DELETE",
  });
}

export async function fetchAdminOffers(): Promise<ApiResult<{ offers: OfferRecord[] }>> {
  return apiRequest<{ offers: OfferRecord[] }>("/api/auth/admin/offers");
}

export async function createAdminOffer(payload: {
  id?: string;
  title: string;
  description?: string;
  type: PriceModifierType;
  value: number;
  serviceId?: string;
  planId?: string;
  active?: boolean;
  expiresAt?: string;
}): Promise<ApiResult<{ offer: OfferRecord }>> {
  return apiRequest<{ offer: OfferRecord }>("/api/auth/admin/offers", {
    method: "POST",
    body: payload as Record<string, unknown>,
  });
}

export async function updateAdminOffer(
  id: string,
  payload: Partial<{
    title: string;
    description: string;
    type: PriceModifierType;
    value: number;
    serviceId: string;
    planId: string;
    active: boolean;
    expiresAt: string;
  }>,
): Promise<ApiResult<{ offer: OfferRecord }>> {
  return apiRequest<{ offer: OfferRecord }>(`/api/auth/admin/offers/${encodeURIComponent(id)}`, {
    method: "PATCH",
    body: payload as Record<string, unknown>,
  });
}

export async function deleteAdminOffer(id: string): Promise<ApiResult<{ message: string }>> {
  return apiRequest<{ message: string }>(`/api/auth/admin/offers/${encodeURIComponent(id)}`, {
    method: "DELETE",
  });
}
