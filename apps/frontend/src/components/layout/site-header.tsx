"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { FormEvent, useEffect, useMemo, useState } from "react";
import { canAccessAdmin, getClientRole } from "@/lib/roles";
import Container from "../ui/container";
import Button from "../ui/button";

const API_BASE = process.env.NEXT_PUBLIC_API_URL ?? "http://127.0.0.1:4000/v1";
const PENDING_VARIANTS_KEY = "azdek_pending_variant_ids";

const NAV_ITEMS = [
  { href: "/catalog", label: "Catalog" },
  { href: "/promotions", label: "Promotions" },
  { href: "/about", label: "About" },
  { href: "/support", label: "Support" },
];

export default function SiteHeader() {
  const router = useRouter();
  const pathname = usePathname();
  const [role, setRole] = useState<string | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [cartCount, setCartCount] = useState(0);
  const [search, setSearch] = useState("");

  const readPendingVariantIds = () => {
    try {
      const raw = localStorage.getItem(PENDING_VARIANTS_KEY);
      if (!raw) return [] as string[];
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

    const onStorage = () => void loadCartCount();
    const onCartUpdated = () => void loadCartCount();

    window.addEventListener("storage", onStorage);
    window.addEventListener("azdek-cart-updated", onCartUpdated);

    return () => {
      window.removeEventListener("storage", onStorage);
      window.removeEventListener("azdek-cart-updated", onCartUpdated);
    };
  }, []);

  const canSeeAdmin = useMemo(() => canAccessAdmin(role), [role]);

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

  const submitSearch = (event: FormEvent) => {
    event.preventDefault();
    const q = search.trim();
    router.push(q ? `/catalog?q=${encodeURIComponent(q)}` : "/catalog");
  };

  return (
    <header className="site-header">
      <Container className="site-header-inner">
        <div className="brand-wrap">
          <Link className="brand-mark" href="/">
            Adzek
          </Link>
        </div>

        <nav className="desktop-nav" aria-label="Main navigation">
          {NAV_ITEMS.map((item) => (
            <Link key={item.href} href={item.href} className={pathname.startsWith(item.href) ? "is-active" : undefined}>
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="header-tools">
          <form className="header-search-wrap" onSubmit={submitSearch}>
            <input
              className="header-search"
              placeholder="Search products"
              type="search"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
            />
            <span className="header-search-icon">⌕</span>
          </form>

          <Link href="/cart" aria-label="Cart">
            <Button className="header-cart-btn" variant="secondary">
              Cart
              {cartCount > 0 ? <span className="header-cart-count">{cartCount}</span> : null}
            </Button>
          </Link>

          {isAuthenticated ? (
            <div className="header-auth-links">
              <Link href="/account" aria-label="Account">
                <Button className="header-account-btn" variant="secondary">
                  Account
                </Button>
              </Link>
              {canSeeAdmin ? (
                <Link href="/admin" aria-label="Admin">
                  <Button className="header-role-btn" variant="outline">
                    Admin
                  </Button>
                </Link>
              ) : null}
              <Button className="header-logout-btn" variant="ghost" onClick={logout}>
                Sign out
              </Button>
            </div>
          ) : (
            <Link href="/login">
              <Button className="header-cta" variant="secondary">
                Sign in
              </Button>
            </Link>
          )}
        </div>
      </Container>
    </header>
  );
}
