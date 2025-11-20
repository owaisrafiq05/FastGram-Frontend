import { authStorage, refreshTokens } from '@/services/auth';

type Options = RequestInit & { retryOnAuthFailure?: boolean };

export async function fetchWithAuth(url: string, options: Options = {}) {
  const token = authStorage.getAccessToken();
  const headers = new Headers(options.headers || {});
  if (token) headers.set('Authorization', `Bearer ${token}`);

  const reqInit: RequestInit = { ...options, headers };
  let res = await fetch(url, reqInit);

  if ((res.status === 401 || res.status === 403) && options.retryOnAuthFailure !== false) {
    try {
      await refreshTokens();
      const newToken = authStorage.getAccessToken();
      const retryHeaders = new Headers(options.headers || {});
      if (newToken) retryHeaders.set('Authorization', `Bearer ${newToken}`);
      res = await fetch(url, { ...options, headers: retryHeaders });
    } catch {
      authStorage.clear();
      if (typeof window !== 'undefined') window.location.href = '/login';
      throw new Error('Authentication required');
    }
  }

  return res;
}

export async function handleJson<T>(res: Response): Promise<T> {
  const json = await res.json().catch(() => ({}));
  if (!res.ok) {
    const firstValidation = Array.isArray((json as any)?.errors) && (json as any).errors[0]?.message;
    const msg = firstValidation || (json && ((json as any).message || (json as any).error)) || `HTTP ${res.status}`;
    throw new Error(String(msg));
  }
  return json as T;
}