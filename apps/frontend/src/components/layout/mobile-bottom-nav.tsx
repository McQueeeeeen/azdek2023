"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export default function MobileBottomNav() {
  const pathname = usePathname();

  const items = [
    { href: "/", label: "Overview" },
    { href: "/catalog", label: "Catalog" },
    { href: "/cart", label: "Cart" },
    { href: "/admin", label: "Admin" },
  ];

  return (
    <nav className="mobile-bottom-nav" aria-label="Мобильная навигация">
      {items.map((item) => (
        <Link key={item.href} href={item.href} className={pathname === item.href ? "is-active" : undefined}>
          {item.label}
        </Link>
      ))}
    </nav>
  );
}
