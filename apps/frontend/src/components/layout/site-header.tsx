"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import Container from "../ui/container";
import Button from "../ui/button";

const NAV_ITEMS = [
  { href: "/", label: "Overview" },
  { href: "/catalog", label: "Catalog" },
  { href: "/cart", label: "Cart" },
  { href: "/checkout", label: "Checkout" },
  { href: "/admin", label: "Admin" },
];

export default function SiteHeader() {
  const pathname = usePathname();

  return (
    <header className="site-header">
      <Container className="site-header-inner">
        <div className="brand-wrap">
          <Link className="brand-mark" href="/">
            Azdek Elemental
          </Link>
        </div>
        <nav className="desktop-nav" aria-label="Основная навигация">
          {NAV_ITEMS.map((item) => (
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
