/**
 * Client for the Nova store API (/api/v1) — the SAME backend the Telegram
 * mini app uses, so plans, prices, festivals, balance and orders stay in
 * perfect sync and everything is managed from the one Nova admin panel.
 *
 * The session token is kept in localStorage under the same key as the mini
 * app; a customer who used either surface keeps one identity across both.
 */

const SESSION_KEY = "nova_session_token";

export interface NovaUser {
  telegram_id: number;
  first_name: string;
  last_name: string;
  username: string;
  balance: number;
  verified_phone: string;
}

interface SessionState {
  user: NovaUser | null;
  csrf: string;
}

const state: SessionState = { user: null, csrf: "" };
let authPromise: Promise<NovaUser | null> | null = null;

const savedToken = (): string => {
  try {
    return localStorage.getItem(SESSION_KEY) || "";
  } catch {
    return "";
  }
};

const rememberToken = (token?: string) => {
  if (!token) return;
  try {
    localStorage.setItem(SESSION_KEY, token);
  } catch {
    /* private mode */
  }
};

export class NovaApiError extends Error {
  status: number;
  constructor(message: string, status: number) {
    super(message);
    this.status = status;
  }
}

export async function novaApi<T = Record<string, unknown>>(
  path: string,
  options: RequestInit = {}
): Promise<T> {
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    ...((options.headers as Record<string, string>) || {}),
  };
  const token = savedToken();
  if (token) headers["X-Nova-Session"] = token;
  if (options.method && options.method !== "GET" && state.csrf) {
    headers["X-Nova-CSRF"] = state.csrf;
  }
  const response = await fetch(path, {
    credentials: "same-origin",
    ...options,
    headers,
  });
  let data: Record<string, unknown> | null = null;
  try {
    data = await response.json();
  } catch {
    /* empty body */
  }
  if (!response.ok) {
    const detail = data?.detail;
    const message = Array.isArray(detail)
      ? detail
          .map((item) => (item as { msg?: string }).msg || "")
          .filter(Boolean)
          .join("؛ ")
      : String(detail || "خطای ارتباط با سرور");
    throw new NovaApiError(message, response.status);
  }
  return data as T;
}

/** Restore the existing session or open a web-guest one. Runs once per load. */
export function ensureNovaSession(): Promise<NovaUser | null> {
  if (!authPromise) {
    authPromise = (async () => {
      try {
        const me = await novaApi<{ user: NovaUser; csrf_token: string }>(
          "/api/v1/auth/me"
        );
        state.user = me.user;
        state.csrf = me.csrf_token;
        return state.user;
      } catch {
        /* no live session yet */
      }
      try {
        const data = await novaApi<{
          user: NovaUser;
          csrf_token: string;
          session_token?: string;
        }>("/api/v1/auth/telegram", {
          method: "POST",
          body: JSON.stringify({ init_data: "" }),
        });
        state.user = data.user;
        state.csrf = data.csrf_token;
        rememberToken(data.session_token);
        return state.user;
      } catch {
        state.user = null;
        state.csrf = "";
        return null;
      }
    })();
  }
  return authPromise;
}

export const novaUser = (): NovaUser | null => state.user;

export const isNovaGuest = (): boolean =>
  !state.user || state.user.telegram_id < 0;

/** Fresh balance without re-auth (top-ups can land any moment). */
export async function refreshNovaBalance(): Promise<number> {
  try {
    const me = await novaApi<{ user: NovaUser }>("/api/v1/auth/me");
    if (state.user) state.user.balance = Number(me.user.balance) || 0;
    return Number(me.user.balance) || 0;
  } catch {
    return state.user ? Number(state.user.balance) || 0 : 0;
  }
}
