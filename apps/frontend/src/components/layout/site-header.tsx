"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { canAccessAdmin, getClientRole } from "@/lib/roles";
import Container from "../ui/container";
import Button from "../ui/button";

const API_BASE = process.env.NEXT_PUBLIC_API_URL ?? "http://127.0.0.1:4000/v1";
const PENDING_VARIANTS_KEY = "azdek_pending_variant_ids";

const NAV_ITEMS = [
  { href: "/catalog", label: "Каталог" },
];

export default function SiteHeader() {
  const router = useRouter();
  const pathname = usePathname();
  const [role, setRole] = useState<string | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [cartCount, setCartCount] = useState(0);

  const readPendingVariantIds = () => {
    try {
      const raw = localStorage.getItem(PENDING_VARIANTS_KEY);
      if (!raw) {
        return [] as string[];
      }
      const parsed = JSON.parse(raw);
      return Array.isArray(parsed) ? parsed.filter((item) => typeof item === "string") : [];
    } catch {
      return [] as string[];
    }
  };

  const loadCartCount = async () => {
    try {
      const pendingCount = readPendingVariantIds().length;
      const cartId = localStorage.getItem("azdek_cart_id");

      if (!cartId) {
        setCartCount(pendingCount);
        return;
      }

      const response = await fetch(`${API_BASE}/cart/${cartId}`, { cache: "no-store" });
      if (!response.ok) {
        localStorage.removeItem("azdek_cart_id");
        setCartCount(pendingCount);
        return;
      }

      const cart = (await response.json()) as { items?: Array<{ quantity: number }> };
      const serverCount = (cart.items ?? []).reduce((sum, item) => sum + (item.quantity ?? 0), 0);
      setCartCount(serverCount + pendingCount);
    } catch {
      setCartCount(readPendingVariantIds().length);
    }
  };

  useEffect(() => {
    try {
      setRole(getClientRole());
      setIsAuthenticated(Boolean(localStorage.getItem("azdek_access_token")));
      void loadCartCount();
    } catch {
      setRole(null);
      setIsAuthenticated(false);
      setCartCount(0);
    }

    const onStorage = () => {
      void loadCartCount();
    };

    const onCartUpdated = () => {
      void loadCartCount();
    };

    window.addEventListener("storage", onStorage);
    window.addEventListener("azdek-cart-updated", onCartUpdated);

    return () => {
      window.removeEventListener("storage", onStorage);
      window.removeEventListener("azdek-cart-updated", onCartUpdated);
    };
  }, []);

  const canSeeAdmin = canAccessAdmin(role);

  const logout = () => {
    localStorage.removeItem("azdek_access_token");
    localStorage.removeItem("azdek_refresh_token");
    localStorage.removeItem("azdek_user_role");
    document.cookie = "azdek_access_token=; Path=/; Max-Age=0; SameSite=Lax";
    setIsAuthenticated(false);
    setRole(null);
    setCartCount(0);
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
              className={pathname.startsWith(item.href) ? "is-active" : undefined}
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
              {cartCount > 0 ? <span className="header-cart-count">{cartCount}</span> : null}
            </Button>
          </Link>

          {isAuthenticated ? (
            <div className="header-auth-links">
              <Link href="/account" aria-label="Личный кабинет">
                <Button className="header-account-btn" variant="secondary">
                  Личный кабинет
                </Button>
              </Link>
              {canSeeAdmin ? (
                <Link href="/admin" aria-label="Админ-панель">
                  <Button className="header-role-btn" variant="secondary">
                    {role === "owner" ? "Владелец" : role === "admin" ? "Администратор" : "Оператор"}
                  </Button>
                </Link>
              ) : null}
              <Button className="header-logout-btn" variant="ghost" onClick={logout}>
                Выйти
              </Button>
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
