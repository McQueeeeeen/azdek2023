export type CanonicalRole =
  | "admin"
  | "owner"
  | "operator"
  | "user"
  | "vip_client"
  | "wholesaler"
  | "unknown";

export function normalizeRole(rawRole: string | null | undefined): CanonicalRole {
  if (!rawRole) {
    return "unknown";
  }

  const role = rawRole.toLowerCase();

  if (role === "owner") {
    return "owner";
  }

  if (role === "admin" || role === "administrator") {
    return "admin";
  }

  // Existing internal staff roles are treated as "operator" for access control.
  if (role === "operator" || role === "manager" || role === "support" || role === "content_editor" || role === "warehouse") {
    return "operator";
  }

  if (role === "vip_client" || role === "vip") {
    return "vip_client";
  }

  if (role === "wholesaler" || role === "b2b" || role === "b2b_customer") {
    return "wholesaler";
  }

  if (role === "customer" || role === "user") {
    return "user";
  }

  return "unknown";
}

export function canAccessAdmin(rawRole: string | null | undefined): boolean {
  const role = normalizeRole(rawRole);
  return role === "admin" || role === "owner" || role === "operator";
}

function decodeJwtPayload(token: string): Record<string, unknown> | null {
  const parts = token.split(".");
  if (parts.length < 2) {
    return null;
  }

  try {
    const normalized = parts[1].replace(/-/g, "+").replace(/_/g, "/");
    const padded = normalized + "=".repeat((4 - (normalized.length % 4 || 4)) % 4);
    const json = atob(padded);
    return JSON.parse(json) as Record<string, unknown>;
  } catch {
    return null;
  }
}

export function getClientRole(): string | null {
  if (typeof window === "undefined") {
    return null;
  }

  const explicit = localStorage.getItem("azdek_user_role");
  if (explicit) {
    return explicit;
  }

  const accessToken = localStorage.getItem("azdek_access_token");
  if (!accessToken) {
    return null;
  }

  const payload = decodeJwtPayload(accessToken);
  const role = typeof payload?.role === "string" ? payload.role : null;
  if (role) {
    localStorage.setItem("azdek_user_role", role);
  }
  return role;
}
