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
