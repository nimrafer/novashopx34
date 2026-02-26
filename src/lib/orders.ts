export type OrderStatus = "pending" | "processing" | "completed" | "cancelled" | "refunded";

export interface CreateOrderPayload {
  serviceId: string;
  serviceName: string;
  planId?: string;
  planName: string;
  planDuration?: string;
  price: number;
  notes?: string;
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
  currency: "IRR";
  status: OrderStatus;
  createdAt: string;
  updatedAt: string;
  notes: string | null;
  source: "website";
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

async function apiRequest<T>(path: string, body?: Record<string, unknown>, method?: "GET" | "POST" | "PATCH"): Promise<ApiSuccess<T> | ApiFailure> {
  try {
    const response = await fetch(path, {
      method: method || (body ? "POST" : "GET"),
      headers: body
        ? {
            "Content-Type": "application/json",
          }
        : undefined,
      credentials: "include",
      body: body ? JSON.stringify(body) : undefined,
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

export async function createOrder(payload: CreateOrderPayload): Promise<ApiSuccess<{ order: OrderRecord }> | ApiFailure> {
  return apiRequest<{ order: OrderRecord }>("/api/auth/orders", {
    serviceId: payload.serviceId,
    serviceName: payload.serviceName,
    planId: payload.planId,
    planName: payload.planName,
    planDuration: payload.planDuration,
    price: payload.price,
    notes: payload.notes,
  });
}

export async function fetchMyOrders(): Promise<ApiSuccess<{ orders: OrderRecord[] }> | ApiFailure> {
  return apiRequest<{ orders: OrderRecord[] }>("/api/auth/orders");
}

export async function fetchAdminOrders(): Promise<ApiResult<{ orders: OrderRecord[] }>> {
  return apiRequest<{ orders: OrderRecord[] }>("/api/auth/orders/admin");
}

export async function updateAdminOrder(
  orderId: string,
  payload: { status?: OrderStatus; notes?: string },
): Promise<ApiResult<{ order: OrderRecord }>> {
  return apiRequest<{ order: OrderRecord }>(`/api/auth/orders/admin/${encodeURIComponent(orderId)}`, payload, "PATCH");
}
