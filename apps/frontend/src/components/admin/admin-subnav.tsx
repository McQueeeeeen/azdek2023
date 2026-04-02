"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/cn";

const LINKS = [
  { href: "/admin", label: "Обзор" },
  { href: "/admin/billing", label: "Биллинг" },
  { href: "/admin/health", label: "Состояние" },
  { href: "/admin/nodes", label: "Ноды" },
];

export default function AdminSubnav() {
  const pathname = usePathname();

  return (
    <div className="admin-subnav" role="tablist" aria-label="Навигация админки">
      {LINKS.map((link) => (
        <Link
          key={link.href}
          href={link.href}
          className={cn("admin-subnav-link", pathname === link.href && "is-active")}
        >
          {link.label}
        </Link>
      ))}
    </div>
  );
}
