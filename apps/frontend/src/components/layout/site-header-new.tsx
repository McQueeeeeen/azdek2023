'use client';

import Link from 'next/link';
import { useState } from 'react';

export default function SiteHeaderNew() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <nav className="fixed top-0 w-full z-50 bg-surface/70 dark:bg-slate-900/70 backdrop-blur-xl shadow-[0px_20px_40px_rgba(0,88,188,0.06)]">
      <div className="flex justify-between items-center px-8 py-4 max-w-7xl mx-auto">
        {/* Logo */}
        <div className="text-2xl font-black text-on-surface dark:text-white tracking-tighter font-headline">
          PureLab
        </div>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center space-x-8">
          <Link
            href="/catalog"
            className="font-headline tracking-tight font-semibold text-primary border-b-2 border-primary pb-1 transition-all hover:opacity-80"
          >
            Каталог
          </Link>
          <Link
            href="#"
            className="font-headline tracking-tight font-semibold text-on-surface dark:text-slate-300 opacity-70 hover:opacity-100 hover:text-primary transition-all"
          >
            О нас
          </Link>
          <Link
            href="#"
            className="font-headline tracking-tight font-semibold text-on-surface dark:text-slate-300 opacity-70 hover:opacity-100 hover:text-primary transition-all"
          >
            Контакты
          </Link>
          <Link
            href="#"
            className="font-headline tracking-tight font-semibold text-on-surface dark:text-slate-300 opacity-70 hover:opacity-100 hover:text-primary transition-all"
          >
            Блог
          </Link>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-6">
          {/* Search */}
          <div className="hidden lg:flex items-center bg-surface-container-lowest rounded-full px-4 py-2 border border-outline-variant/15">
            <span className="material-symbols-outlined text-primary text-5 w-5 h-5">search</span>
            <input
              className="bg-transparent border-none focus:ring-0 text-sm w-48 outline-none"
              placeholder="Поиск чистоты..."
              type="text"
            />
          </div>

          {/* Icons */}
          <div className="flex items-center gap-4">
            {/* Cart */}
            <Link
              href="/cart"
              className="relative hover:opacity-100 hover:text-primary transition-all text-on-surface dark:text-white"
            >
              <span className="material-symbols-outlined text-xl w-6 h-6">shopping_cart</span>
              <span className="absolute -top-1 -right-1 bg-primary text-white text-[10px] w-4 h-4 flex items-center justify-center rounded-full font-bold">
                0
              </span>
            </Link>

            {/* Account */}
            <Link
              href="/account"
              className="hover:opacity-100 hover:text-primary transition-all text-on-surface dark:text-white"
            >
              <span className="material-symbols-outlined text-xl w-6 h-6">person</span>
            </Link>

            {/* Mobile Menu Toggle */}
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="md:hidden text-on-surface dark:text-white"
            >
              <span className="material-symbols-outlined text-xl w-6 h-6">
                {isMenuOpen ? 'close' : 'menu'}
              </span>
            </button>
          </div>
        </div>
      </div>

      {/* Divider */}
      <div className="bg-surface-variant/50 dark:bg-slate-700 h-px w-full absolute bottom-0 opacity-15"></div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="md:hidden absolute top-full left-0 right-0 bg-surface dark:bg-slate-900 border-b border-outline-variant/15">
          <div className="px-8 py-4 space-y-3">
            <Link
              href="/catalog"
              className="block font-headline tracking-tight font-semibold text-primary pb-1"
            >
              Каталог
            </Link>
            <Link
              href="#"
              className="block font-headline tracking-tight font-semibold text-on-surface dark:text-slate-300 pb-1"
            >
              О нас
            </Link>
            <Link
              href="#"
              className="block font-headline tracking-tight font-semibold text-on-surface dark:text-slate-300 pb-1"
            >
              Контакты
            </Link>
            <Link
              href="#"
              className="block font-headline tracking-tight font-semibold text-on-surface dark:text-slate-300 pb-1"
            >
              Блог
            </Link>
          </div>
        </div>
      )}
    </nav>
  );
}
