import { useState, useEffect, createContext, useContext, ReactNode } from 'react';

export interface AuthUser {
  id: string;
  email: string;
  fullName: string | null;
  createdAt: string;
  isAdmin?: boolean;
}

interface RequestOtpOptions {
  fullName?: string;
  shouldCreateUser?: boolean;
}

interface AuthContextType {
  user: AuthUser | null;
  loading: boolean;
  requestEmailOtp: (email: string, options?: RequestOtpOptions) => Promise<{ error: Error | null }>;
  verifyEmailOtp: (email: string, token: string) => Promise<{ error: Error | null }>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface ApiSuccess<T> {
  ok: true;
  data: T;
}

interface ApiFailure {
  ok: false;
  error: string;
}

async function apiRequest<T>(path: string, body?: Record<string, unknown>): Promise<ApiSuccess<T> | ApiFailure> {
  try {
    const response = await fetch(path, {
      method: body ? 'POST' : 'GET',
      headers: body
        ? {
            'Content-Type': 'application/json',
          }
        : undefined,
      credentials: 'include',
      body: body ? JSON.stringify(body) : undefined,
    });

    const payload = await response.json().catch(() => ({}));

    if (!response.ok) {
      return {
        ok: false,
        error: payload?.error || 'درخواست ناموفق بود',
      };
    }

    return {
      ok: true,
      data: payload as T,
    };
  } catch (_error) {
    return {
      ok: false,
      error: 'خطای شبکه رخ داد',
    };
  }
}

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;

    const loadSession = async () => {
      const result = await apiRequest<{ user: AuthUser | null }>('/api/auth/session');

      if (!mounted) return;

      if (result.ok) {
        setUser(result.data.user ?? null);
      } else {
        setUser(null);
      }

      setLoading(false);
    };

    loadSession();

    return () => {
      mounted = false;
    };
  }, []);

  const requestEmailOtp = async (email: string, options?: RequestOtpOptions) => {
    const mode = options?.shouldCreateUser ? 'signup' : 'login';

    const result = await apiRequest<{ message: string }>('/api/auth/request-otp', {
      email,
      mode,
      fullName: options?.fullName,
    });

    if ("error" in result) {
      return { error: new Error(result.error) };
    }

    return { error: null };
  };

  const verifyEmailOtp = async (email: string, token: string) => {
    const result = await apiRequest<{ user: AuthUser }>('/api/auth/verify-otp', {
      email,
      token,
    });

    if ("error" in result) {
      return { error: new Error(result.error) };
    }

    setUser(result.data.user);
    return { error: null };
  };

  const signOut = async () => {
    await apiRequest<{ message: string }>('/api/auth/logout', {});
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, loading, requestEmailOtp, verifyEmailOtp, signOut }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
