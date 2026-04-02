"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { canAccessAdmin, getClientRole } from "@/lib/roles";
import Container from "../ui/container";
import Button from "../ui/button";

const NAV_ITEMS = [
  { href: "/catalog?section=laundry", label: "Стирка" },
  { href: "/catalog?section=kitchen", label: "Кухня" },
  { href: "/catalog?section=refills", label: "Пополнения" },
  { href: "/catalog?section=rituals", label: "Ритуалы" },
];

export default function SiteHeader() {
  const router = useRouter();
  const pathname = usePathname();
  const [role, setRole] = useState<string | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    try {
      setRole(getClientRole());
      setIsAuthenticated(Boolean(localStorage.getItem("azdek_access_token")));
    } catch {
      setRole(null);
      setIsAuthenticated(false);
    }
  }, []);

  const canSeeAdmin = useMemo(() => canAccessAdmin(role), [role]);
  const authLabel = useMemo(() => {
    if (!role) {
      return "Аккаунт";
    }
    return role === "owner" ? "Владелец" : role === "admin" ? "Администратор" : "Аккаунт";
  }, [role]);

  const logout = () => {
    localStorage.removeItem("azdek_access_token");
    localStorage.removeItem("azdek_refresh_token");
    localStorage.removeItem("azdek_user_role");
    document.cookie = "azdek_access_token=; Path=/; Max-Age=0; SameSite=Lax";
    setIsAuthenticated(false);
    setRole(null);
    setMenuOpen(false);
    router.push("/");
  };

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
            <Link
              key={item.href}
              href={item.href}
              className={pathname === "/catalog" && item.label === "Стирка" ? "is-active" : undefined}
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="header-tools">
          <div className="header-search-wrap">
            <input className="header-search" placeholder="Поиск ритуалов..." type="text" />
            <span className="header-search-icon">⌕</span>
          </div>

          <Link href="/cart" aria-label="Корзина">
            <Button className="header-cart-btn" variant="secondary">
              Корзина
            </Button>
          </Link>

          {isAuthenticated ? (
            <div className="account-menu">
              <button
                type="button"
                className="account-menu-trigger"
                aria-expanded={menuOpen}
                aria-haspopup="menu"
                onClick={() => setMenuOpen((prev) => !prev)}
              >
                {authLabel}
              </button>
              {menuOpen ? (
                <div className="account-menu-dropdown" role="menu">
                  <Link href="/account" role="menuitem" onClick={() => setMenuOpen(false)}>
                    Личный кабинет
                  </Link>
                  {canSeeAdmin ? (
                    <Link href="/admin" role="menuitem" onClick={() => setMenuOpen(false)}>
                      Админ-панель
                    </Link>
                  ) : null}
                  <button type="button" className="account-menu-logout" role="menuitem" onClick={logout}>
                    Выйти
                  </button>
                </div>
              ) : null}
            </div>
          ) : (
            <Link href="/login">
              <Button className="header-cta" variant="secondary">
                Войти
              </Button>
            </Link>
          )}
        </div>
      </Container>
    </header>
  );
}
