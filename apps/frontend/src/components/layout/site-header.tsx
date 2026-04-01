"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import Container from "../ui/container";
import Button from "../ui/button";

const NAV_ITEMS = [
  { href: "/", label: "Overview" },
  { href: "/catalog", label: "Catalog" },
  { href: "/cart", label: "Cart" },
  { href: "/checkout", label: "Checkout" },
];

export default function SiteHeader() {
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

  const canSeeAdmin = useMemo(
    () => role === "owner" || role === "manager" || role === "support" || role === "content_editor" || role === "warehouse",
    [role],
  );

  const navItems = canSeeAdmin ? [...NAV_ITEMS, { href: "/admin", label: "Admin" }] : NAV_ITEMS;

  return (
    <header className="site-header">
      <Container className="site-header-inner">
        <div className="brand-wrap">
          <Link className="brand-mark" href="/">
            Azdek Elemental
          </Link>
        </div>
        <nav className="desktop-nav" aria-label="Основная навигация">
          {navItems.map((item) => (
            <Link key={item.href} href={item.href} className={pathname === item.href ? "is-active" : undefined}>
              {item.label}
            </Link>
          ))}
        </nav>
        <div className="header-tools">
          <input className="header-search" placeholder="Search..." aria-label="Поиск по магазину" />
          <Link href="/login">
            <Button className="header-cta" variant="secondary">
              Login
            </Button>
          </Link>
        </div>
      </Container>
    </header>
  );
}
