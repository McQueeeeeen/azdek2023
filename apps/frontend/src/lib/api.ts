const API_BASE = process.env.NEXT_PUBLIC_API_URL ?? "http://127.0.0.1:4000/v1";

function buildNetworkErrorMessage(path: string, reason: string): string {
  if (process.env.NODE_ENV !== "production") {
    return [
      "Сервис каталога сейчас недоступен.",
      `Проверьте NEXT_PUBLIC_API_URL: ${API_BASE}`,
      `Запрос: ${path}`,
      `Причина: ${reason}`,
    ].join(" ");
  }

  return "Сервис временно недоступен. Обновите страницу чуть позже.";
}

export interface CatalogVariant {
  id: string;
  sku: string;
  title: string;
  price: number;
  currency: string;
  stock: number;
}

export interface CatalogProduct {
  id: string;
  slug: string;
  name: string;
  description: string;
  category: {
    id: string;
    slug: string;
    name: string;
  };
  variants: CatalogVariant[];
}

export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
  tokenType: string;
  accessExpiresIn: string;
  refreshExpiresIn: string;
  user: {
    id: string;
    email: string;
    role: string;
    customerId: string | null;
  };
}

function getAuthHeaders(token?: string): HeadersInit | undefined {
  return token ? { Authorization: `Bearer ${token}` } : undefined;
}

async function tryRefreshAccessToken(): Promise<string | null> {
  if (typeof window === "undefined") {
    return null;
  }

  const refreshToken = localStorage.getItem("azdek_refresh_token");
  if (!refreshToken) {
    return null;
  }

  try {
    const response = await fetch(`${API_BASE}/auth/refresh`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ refreshToken }),
      cache: "no-store",
    });

    if (!response.ok) {
      localStorage.removeItem("azdek_access_token");
      localStorage.removeItem("azdek_refresh_token");
      return null;
    }

    const payload = (await response.json()) as AuthTokens;
    localStorage.setItem("azdek_access_token", payload.accessToken);
    localStorage.setItem("azdek_refresh_token", payload.refreshToken);
    return payload.accessToken;
  } catch {
    return null;
  }
}

export async function apiGet<T>(path: string, token?: string): Promise<T> {
  let response: Response;
  try {
    response = await fetch(`${API_BASE}${path}`, {
      headers: getAuthHeaders(token),
      cache: "no-store",
    });
  } catch (error) {
    const reason = error instanceof Error ? error.message : "network_error";
    throw new Error(buildNetworkErrorMessage(path, reason));
  }

  if (response.status === 401 && token) {
    const refreshedToken = await tryRefreshAccessToken();
    if (refreshedToken) {
      response = await fetch(`${API_BASE}${path}`, {
        headers: getAuthHeaders(refreshedToken),
        cache: "no-store",
      });
    }
  }

  if (!response.ok) {
    throw new Error(`GET ${path} failed with ${response.status}`);
  }

  return response.json() as Promise<T>;
}

export async function apiPost<T>(path: string, body: unknown, token?: string): Promise<T> {
  let response: Response;
  try {
    response = await fetch(`${API_BASE}${path}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...(getAuthHeaders(token) ?? {}),
      },
      body: JSON.stringify(body),
      cache: "no-store",
    });
  } catch (error) {
    const reason = error instanceof Error ? error.message : "network_error";
    throw new Error(buildNetworkErrorMessage(path, reason));
  }

  if (response.status === 401 && token) {
    const refreshedToken = await tryRefreshAccessToken();
    if (refreshedToken) {
      response = await fetch(`${API_BASE}${path}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(getAuthHeaders(refreshedToken) ?? {}),
        },
        body: JSON.stringify(body),
        cache: "no-store",
      });
    }
  }

  if (!response.ok) {
    const text = await response.text();
    throw new Error(`POST ${path} failed with ${response.status}: ${text}`);
  }

  return response.json() as Promise<T>;
}

export async function apiPatch<T>(path: string, body: unknown, token?: string): Promise<T> {
  let response: Response;
  try {
    response = await fetch(`${API_BASE}${path}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        ...(getAuthHeaders(token) ?? {}),
      },
      body: JSON.stringify(body),
      cache: "no-store",
    });
  } catch (error) {
    const reason = error instanceof Error ? error.message : "network_error";
    throw new Error(buildNetworkErrorMessage(path, reason));
  }

  if (response.status === 401 && token) {
    const refreshedToken = await tryRefreshAccessToken();
    if (refreshedToken) {
      response = await fetch(`${API_BASE}${path}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          ...(getAuthHeaders(refreshedToken) ?? {}),
        },
        body: JSON.stringify(body),
        cache: "no-store",
      });
    }
  }

  if (!response.ok) {
    const text = await response.text();
    throw new Error(`PATCH ${path} failed with ${response.status}: ${text}`);
  }

  return response.json() as Promise<T>;
}

