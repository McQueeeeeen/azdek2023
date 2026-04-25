'use client';

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useCartStore } from "@/store/useCartStore";

export default function SiteHeader() {
  const [mounted, setMounted] = useState(false);
  const pathname = usePathname();
  const cartCount = useCartStore((state) => state.getCount());

  useEffect(() => {
    setMounted(true);
  }, []);

  const navLinks = [
    { href: "/catalog", label: "Каталог" },
    { href: "/promotions", label: "Новинки" },
    { href: "/#about", label: "О бренде" },
    { href: "/#values", label: "Принципы" },
  ];

  return (
    <nav className="fixed top-0 w-full z-50 bg-white/70 backdrop-blur-md shadow-[0_20px_40px_rgba(0,88,188,0.06)] h-20 border-b border-line">
      <div className="flex justify-between items-center px-8 h-full max-w-[1400px] mx-auto">
        <Link href="/" className="font-headline text-2xl font-black text-ink tracking-tighter hover:text-clay transition-colors">
          Adzek
        </Link>

        <div className="hidden md:flex gap-8 items-center">
          {navLinks.map((link) => {
            const isActive = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`font-semibold transition-all duration-200 hover:text-clay hover:scale-105 ${
                  isActive 
                    ? "text-clay border-b-2 border-clay pb-1" 
                    : "text-ink-variant"
                }`}
              >
                {link.label}
              </Link>
            );
          })}
        </div>

        <div className="flex items-center gap-6">
          <div className="relative hidden lg:block">
            <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-clay">
              search
            </span>
            <input
              className="bg-surface border border-line rounded-full py-2 pl-10 pr-4 w-64 focus:ring-1 focus:ring-clay focus:border-clay outline-none text-sm text-ink"
              placeholder="Поиск средств..."
              type="text"
            />
          </div>
          <div className="flex gap-4 items-center">
            <Link
              href="/cart"
              className="relative text-ink cursor-pointer hover:text-clay transition-colors flex items-center justify-center w-10 h-10 rounded-full hover:bg-clay-light"
              aria-label="Корзина"
            >
              <span className="material-symbols-outlined" style={{ fontSize: 24 }}>shopping_cart</span>
              {mounted && cartCount > 0 && (
                <motion.div
                  key={cartCount}
                  initial={{ scale: 0.5, y: 10 }}
                  animate={{ scale: [1, 1.3, 1], y: 0 }}
                  transition={{ duration: 0.3 }}
                  className="absolute -top-1 -right-1 bg-clay text-white text-[10px] font-bold w-5 h-5 flex items-center justify-center rounded-full shadow-sm"
                >
                  {cartCount}
                </motion.div>
              )}
            </Link>
            <Link
              href="/profile"
              className="text-ink cursor-pointer hover:text-clay transition-colors flex items-center justify-center w-10 h-10 rounded-full hover:bg-clay-light"
              aria-label="Профиль"
            >
              <span className="material-symbols-outlined" style={{ fontSize: 26 }}>person</span>
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
}
