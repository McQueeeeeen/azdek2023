"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { canAccessAdmin } from "@/lib/roles";

export default function MobileBottomNav() {
  const pathname = usePathname();
  const [role, setRole] = useState<string | null>(null);

  useEffect(() => {
    try {
      const explicitRole = localStorage.getItem("azdek_user_role");
      setRole(explicitRole);
    } catch {
      setRole(null);
    }
  }, []);

  const canSeeAdmin = useMemo(() => canAccessAdmin(role), [role]);

  const items = [
    { href: "/", label: "Overview" },
    { href: "/catalog", label: "Catalog" },
    { href: "/cart", label: "Cart" },
  ];
  const navItems = canSeeAdmin ? [...items, { href: "/admin", label: "Admin" }] : items;

  return (
    <nav className="mobile-bottom-nav" aria-label="Мобильная навигация">
      {navItems.map((item) => (
        <Link key={item.href} href={item.href} className={pathname === item.href ? "is-active" : undefined}>
          {item.label}
        </Link>
      ))}
    </nav>
  );
}
