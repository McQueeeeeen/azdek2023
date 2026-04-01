const API_BASE = process.env.NEXT_PUBLIC_API_URL ?? "http://127.0.0.1:4000/v1";

function buildNetworkErrorMessage(path: string, reason: string): string {
  return [
    "Сервис каталога сейчас недоступен.",
    `Проверьте NEXT_PUBLIC_API_URL: ${API_BASE}`,
    `Запрос: ${path}`,
    `Причина: ${reason}`,
  ].join(" ");
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

export async function apiGet<T>(path: string, token?: string): Promise<T> {
  let response: Response;
  try {
    response = await fetch(`${API_BASE}${path}`, {
      headers: token ? { Authorization: `Bearer ${token}` } : undefined,
      cache: "no-store",
    });
  } catch (error) {
    const reason = error instanceof Error ? error.message : "network_error";
    throw new Error(buildNetworkErrorMessage(path, reason));
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
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
      body: JSON.stringify(body),
      cache: "no-store",
    });
  } catch (error) {
    const reason = error instanceof Error ? error.message : "network_error";
    throw new Error(buildNetworkErrorMessage(path, reason));
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
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
      body: JSON.stringify(body),
      cache: "no-store",
    });
  } catch (error) {
    const reason = error instanceof Error ? error.message : "network_error";
    throw new Error(buildNetworkErrorMessage(path, reason));
  }

  if (!response.ok) {
    const text = await response.text();
    throw new Error(`PATCH ${path} failed with ${response.status}: ${text}`);
  }

  return response.json() as Promise<T>;
}
