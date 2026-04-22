'use client';

import Link from 'next/link';
import { useState } from 'react';
import { usePathname } from 'next/navigation';

export default function AdzekHeader() {
  const [menuOpen, setMenuOpen] = useState(false);
  const pathname = usePathname();

  const navLinks = [
    { label: 'Каталог', href: '/catalog' },
    { label: 'О бренде', href: '/about' },
    { label: 'Доставка', href: '/support' },
  ];

  const mobileLinks = [
    { label: 'Главная', href: '/' },
    ...navLinks,
    { label: 'Корзина', href: '/cart' },
    { label: 'Профиль', href: '/profile' },
    { label: 'Войти', href: '/login' },
  ];

  return (
    <>
      <header className="site-header" id="site-header">
        <div
          style={{
            maxWidth: 'var(--max-w)',
            margin: '0 auto',
            width: '100%',
            display: 'flex',
            alignItems: 'center',
            gap: 40,
          }}
        >
          <Link
            href="/"
            style={{
              fontFamily: 'Manrope',
              fontWeight: 900,
              fontSize: 22,
              letterSpacing: '-0.04em',
              color: 'var(--ink)',
              textDecoration: 'none',
              flexShrink: 0,
            }}
          >
            Adzek<span style={{ color: 'var(--clay)' }}>.</span>
          </Link>

          <nav className="header-nav" aria-label="Основная навигация">
            {navLinks.map(link => (
              <Link
                key={link.href}
                href={link.href}
                className={`hn-link ${pathname.startsWith(link.href) ? 'active' : ''}`}
              >
                {link.label}
              </Link>
            ))}
          </nav>

          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginLeft: 'auto' }}>
            <Link
              href="/catalog"
              title="Поиск"
              style={{
                width: 36,
                height: 36,
                borderRadius: 'var(--r-sm)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'var(--ink-2)',
                textDecoration: 'none',
                transition: 'all 140ms',
              }}
            >
              <span className="icon" style={{ fontSize: 22 }}>search</span>
            </Link>
            <Link
              href="/cart"
              title="Корзина"
              style={{
                width: 36,
                height: 36,
                borderRadius: 'var(--r-sm)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'var(--ink-2)',
                textDecoration: 'none',
                transition: 'all 140ms',
              }}
            >
              <span className="icon" style={{ fontSize: 22 }}>shopping_cart</span>
            </Link>
            <Link
              href="/profile"
              title="Профиль"
              style={{
                width: 36,
                height: 36,
                borderRadius: 'var(--r-sm)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: pathname === '/profile' ? 'var(--clay)' : 'var(--ink-2)',
                textDecoration: 'none',
                transition: 'all 140ms',
              }}
            >
              <span className="icon" style={{ fontSize: 22 }}>person</span>
            </Link>

            <button
              type="button"
              onClick={() => setMenuOpen(prev => !prev)}
              className="hamburger-btn"
              aria-label="Меню"
              aria-expanded={menuOpen}
              aria-controls="mobile-menu"
            >
              <span
                className="hamburger-line"
                style={{
                  width: 22,
                  height: 2,
                  background: 'var(--ink)',
                  borderRadius: 2,
                  transition: 'all 300ms',
                  transform: menuOpen ? 'rotate(45deg) translate(5px,5px)' : 'none',
                }}
              />
              <span
                className="hamburger-line"
                style={{
                  width: 22,
                  height: 2,
                  background: 'var(--ink)',
                  borderRadius: 2,
                  opacity: menuOpen ? 0 : 1,
                  transition: 'all 300ms',
                }}
              />
              <span
                className="hamburger-line"
                style={{
                  width: 22,
                  height: 2,
                  background: 'var(--ink)',
                  borderRadius: 2,
                  transition: 'all 300ms',
                  transform: menuOpen ? 'rotate(-45deg) translate(5px,-5px)' : 'none',
                }}
              />
            </button>
          </div>
        </div>
      </header>

      {menuOpen && (
        <div className="mobile-menu-overlay" onClick={() => setMenuOpen(false)}>
          <aside id="mobile-menu" className="mobile-menu-sidebar open" onClick={e => e.stopPropagation()}>
            <div className="mobile-menu-header">
              <button
                type="button"
                className="mobile-menu-close"
                onClick={() => setMenuOpen(false)}
                aria-label="Закрыть меню"
              >
                <span className="icon">close</span>
              </button>
            </div>

            <nav className="mobile-menu-nav" aria-label="Мобильная навигация">
              {mobileLinks.map(link => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setMenuOpen(false)}
                  className="mobile-menu-link"
                  style={{ background: pathname === link.href ? 'var(--clay-light)' : 'transparent' }}
                >
                  {link.label}
                </Link>
              ))}
            </nav>
          </aside>
        </div>
      )}
    </>
  );
}
