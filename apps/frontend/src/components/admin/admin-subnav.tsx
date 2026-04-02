"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const LINKS = [
  { href: "/admin", label: "Обзор" },
  { href: "/admin/billing", label: "Биллинг" },
  { href: "/admin/health", label: "Состояние" },
  { href: "/admin/nodes", label: "Ноды" },
];

export default function AdminSubnav() {
  const pathname = usePathname();

  return (
    <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
      {LINKS.map((link) => (
        <Link
          key={link.href}
          href={link.href}
          style={{
            border: "1px solid #d1d5db",
            borderRadius: 8,
            padding: "8px 10px",
            fontSize: 14,
            fontWeight: pathname === link.href ? 700 : 500,
            background: pathname === link.href ? "#111827" : "#fff",
            color: pathname === link.href ? "#fff" : "#111827",
          }}
        >
          {link.label}
        </Link>
      ))}
    </div>
  );
}