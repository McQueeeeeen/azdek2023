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
  { href: "/catalog", label: "Каталог" },
  { href: "/promotions", label: "Эко-линейка" },
  { href: "/about", label: "О бренде" },
  { href: "/support", label: "Доставка" },
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
    <header className="fixed top-0 w-full z-50 bg-white/70 backdrop-blur-md shadow-[0_20px_40px_rgba(0,88,188,0.06)] h-20 border-b border-slate-100">
      <Container className="flex justify-between items-center h-full">
        <div className="flex items-center gap-10">
          <Link href="/" className="text-2xl font-black text-blue-700 tracking-tighter font-headline">
            PureLab
          </Link>
          <nav className="hidden md:flex gap-8 items-center" aria-label="Главная навигация">
            {NAV_ITEMS.map((item) => {
              const active = pathname.startsWith(item.href);
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`font-headline tracking-tight font-semibold transition-transform duration-200 hover:scale-105 ${
                    active ? "text-blue-700 border-b-2 border-blue-600 pb-1" : "text-slate-600 hover:text-blue-500"
                  }`}
                >
                  {item.label}
                </Link>
              );
            })}
          </nav>
        </div>

        <div className="flex items-center gap-4">
          <form className="relative hidden lg:block" onSubmit={submitSearch}>
            <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-blue-700">search</span>
            <input
              className="bg-white border border-slate-200 rounded-full py-2 pl-10 pr-4 w-64 focus:ring-2 focus:ring-blue-200 text-sm outline-none"
              placeholder="Поиск чистоты..."
              type="search"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
            />
          </form>

          <Link href="/cart" className="relative p-2 rounded-full hover:bg-slate-100 transition-colors" aria-label="Корзина">
            <span className="material-symbols-outlined text-blue-700">shopping_cart</span>
            {cartCount > 0 ? (
              <span className="absolute -top-0.5 -right-0.5 bg-blue-700 text-white text-[10px] rounded-full min-w-[16px] h-4 px-1 flex items-center justify-center">
                {cartCount}
              </span>
            ) : null}
          </Link>

          {isAuthenticated ? (
            <>
              <Link href="/account" className="p-2 rounded-full hover:bg-slate-100 transition-colors" aria-label="Личный кабинет">
                <span className="material-symbols-outlined text-blue-700">person</span>
              </Link>
              {canSeeAdmin ? (
                <Link href="/admin">
                  <Button className="px-4" variant="outline">
                    Админ
                  </Button>
                </Link>
              ) : null}
              <Button className="px-5" variant="secondary" onClick={logout}>
                Выйти
              </Button>
            </>
          ) : (
            <Link href="/login">
              <Button className="ml-2 px-6 py-2.5 text-white rounded-lg font-headline font-semibold text-sm" variant="primary">
                Войти
              </Button>
            </Link>
          )}
        </div>
      </Container>
    </header>
  );
}
