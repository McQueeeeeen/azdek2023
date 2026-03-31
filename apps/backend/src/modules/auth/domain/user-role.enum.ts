export const USER_ROLES = [
  "owner",
  "manager",
  "support",
  "content_editor",
  "warehouse",
  "customer",
  "b2b",
  "b2b_customer",
] as const;

export type UserRole = (typeof USER_ROLES)[number];
