export type User = {
  id: number;
  username: string;
  email: string;
  fullName: string;
  bio: string;
  profilePictureUrl: string;
  isVerified: boolean;
  createdAt: string;
  updatedAt: string;
};

export type AuthTokens = {
  accessToken: string;
  refreshToken: string;
};

export type RegisterResponse = {
  success: boolean;
  message: string;
  data: { user: User } & AuthTokens;
};

export type LoginResponse = {
  success: boolean;
  message: string;
  data: { user: User } & AuthTokens;
};

export type RefreshResponse = {
  success: boolean;
  message: string;
  data: AuthTokens;
};

export type LogoutResponse = {
  success: boolean;
  message: string;
  data: {};
};

export type VerifyResponse = {
  success: boolean;
  message: string;
  data: { user: User };
};

const API_BASE = (typeof process !== 'undefined' && process.env && (process.env.NEXT_PUBLIC_API_BASE_URL as string)) || 'http://localhost:3000';

const headersJson = { 'Content-Type': 'application/json' } as const;

const storage = {
  getAccessToken: () => (typeof window !== 'undefined' ? window.localStorage.getItem('fg_accessToken') : null),
  getRefreshToken: () => (typeof window !== 'undefined' ? window.localStorage.getItem('fg_refreshToken') : null),
  setTokens: (tokens: AuthTokens) => {
    if (typeof window === 'undefined') return;
    window.localStorage.setItem('fg_accessToken', tokens.accessToken);
    window.localStorage.setItem('fg_refreshToken', tokens.refreshToken);
    try {
      const maxAge = 60 * 60 * 24 * 7;
      document.cookie = `fg_logged_in=1; path=/; max-age=${maxAge}`;
    } catch {}
  },
  clear: () => {
    if (typeof window === 'undefined') return;
    window.localStorage.removeItem('fg_accessToken');
    window.localStorage.removeItem('fg_refreshToken');
    try {
      document.cookie = 'fg_logged_in=; path=/; max-age=0';
    } catch {}
  },
};

async function handleJson<T>(res: Response): Promise<T> {
  const json = await res.json();
  if (!res.ok) {
    const msg = (json && (json.message || json.error)) || 'Request failed';
    throw new Error(String(msg));
  }
  return json as T;
}

export async function register(payload: { username: string; email: string; password: string; fullName: string }): Promise<RegisterResponse> {
  const res = await fetch(`${API_BASE}/api/auth/register`, {
    method: 'POST',
    headers: headersJson,
    body: JSON.stringify(payload),
  });
  const data = await handleJson<RegisterResponse>(res);
  storage.setTokens({ accessToken: data.data.accessToken, refreshToken: data.data.refreshToken });
  return data;
}

export async function login(payload: { email: string; password: string }): Promise<LoginResponse> {
  const res = await fetch(`${API_BASE}/api/auth/login`, {
    method: 'POST',
    headers: headersJson,
    body: JSON.stringify(payload),
  });
  const data = await handleJson<LoginResponse>(res);
  storage.setTokens({ accessToken: data.data.accessToken, refreshToken: data.data.refreshToken });
  return data;
}

export async function refreshTokens(): Promise<RefreshResponse> {
  const token = storage.getRefreshToken();
  if (!token) {
    throw new Error('Missing refresh token');
  }
  const res = await fetch(`${API_BASE}/api/auth/refresh`, {
    method: 'POST',
    headers: headersJson,
    body: JSON.stringify({ refreshToken: token }),
  });
  const data = await handleJson<RefreshResponse>(res);
  storage.setTokens({ accessToken: data.data.accessToken, refreshToken: data.data.refreshToken });
  return data;
}

export async function logout(): Promise<LogoutResponse> {
  const refresh = storage.getRefreshToken();
  const access = storage.getAccessToken();
  try {
    if (!refresh && !access) {
      return { success: true, message: 'Logged out', data: {} } as LogoutResponse;
    }
    const res = await fetch(`${API_BASE}/api/auth/logout`, {
      method: 'POST',
      headers: access ? { 'Content-Type': 'application/json', Authorization: `Bearer ${access}` } : headersJson,
      body: refresh ? JSON.stringify({ refreshToken: refresh }) : undefined,
    });
    const data = await handleJson<LogoutResponse>(res);
    return data;
  } catch {
    return { success: true, message: 'Logged out', data: {} } as LogoutResponse;
  } finally {
    storage.clear();
  }
}

export async function logoutAll(): Promise<LogoutResponse> {
  const access = storage.getAccessToken();
  try {
    const res = await fetch(`${API_BASE}/api/auth/logout-all`, {
      method: 'POST',
      headers: access ? { 'Content-Type': 'application/json', Authorization: `Bearer ${access}` } : headersJson,
    });
    const data = await handleJson<LogoutResponse>(res);
    return data;
  } catch {
    return { success: true, message: 'Logged out', data: {} } as LogoutResponse;
  } finally {
    storage.clear();
  }
}

export async function verify(): Promise<VerifyResponse> {
  const access = storage.getAccessToken();
  const res = await fetch(`${API_BASE}/api/auth/verify`, {
    method: 'GET',
    headers: access ? { Authorization: `Bearer ${access}` } : undefined,
  });
  return handleJson<VerifyResponse>(res);
}

export const authStorage = storage;