"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { canAccessAdmin, getClientRole } from "@/lib/roles";
import Container from "../ui/container";
import Button from "../ui/button";

const NAV_ITEMS = [
  { href: "/", label: "Главная" },
  { href: "/catalog", label: "Каталог" },
  { href: "/cart", label: "Корзина" },
  { href: "/checkout", label: "Оформление" },
];

export default function SiteHeader() {
  const pathname = usePathname();
  const [role, setRole] = useState<string | null>(null);

  useEffect(() => {
    try {
      setRole(getClientRole());
    } catch {
      setRole(null);
    }
  }, []);

  const canSeeAdmin = useMemo(() => canAccessAdmin(role), [role]);

  const navItems = canSeeAdmin ? [...NAV_ITEMS, { href: "/admin", label: "Админ" }] : NAV_ITEMS;

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
          <input className="header-search" placeholder="Поиск..." aria-label="Поиск по магазину" />
          <Link href="/login">
            <Button className="header-cta" variant="secondary">
              Войти
            </Button>
          </Link>
        </div>
      </Container>
    </header>
  );
}
