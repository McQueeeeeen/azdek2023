'use client';

import Link from 'next/link';
import { useMemo, useState } from 'react';
import { addProductToCart } from '@/lib/cart-store';
import {
  CATALOG_CATEGORIES,
  CATALOG_PRODUCTS,
  CATALOG_SORTS,
  type CatalogCategory,
  type CatalogProductSummary,
} from '@/lib/catalog-data';

function sortProducts(products: CatalogProductSummary[], sortBy: string): CatalogProductSummary[] {
  if (sortBy === 'price-asc') return [...products].sort((a, b) => a.price - b.price);
  if (sortBy === 'price-desc') return [...products].sort((a, b) => b.price - a.price);
  if (sortBy === 'rating') return [...products].sort((a, b) => b.rating - a.rating);
  return [...products].sort((a, b) => b.reviews - a.reviews);
}

export default function CatalogPage() {
  const [category, setCategory] = useState<'all' | CatalogCategory>('all');
  const [sortBy, setSortBy] = useState<(typeof CATALOG_SORTS)[number]['key']>('popular');
  const [query, setQuery] = useState('');
  const [cartItems, setCartItems] = useState<number[]>([]);

  const filtered = useMemo(() => {
    const normalized = query.trim().toLowerCase();
    let products = CATALOG_PRODUCTS.filter((product) => {
      const matchesCategory = category === 'all' || product.category === category;
      const matchesQuery =
        normalized === '' ||
        product.name.toLowerCase().includes(normalized) ||
        product.description.toLowerCase().includes(normalized) ||
        product.sub.toLowerCase().includes(normalized);
      return matchesCategory && matchesQuery;
    });

    products = sortProducts(products, sortBy);
    return products;
  }, [category, query, sortBy]);

  const addToCart = (id: number, event: React.MouseEvent) => {
    event.preventDefault();
    const product = CATALOG_PRODUCTS.find((item) => item.id === id);
    if (!product) {
      return;
    }

    addProductToCart(product);
    setCartItems((prev) => [...prev, id]);
  };

  return (
    <div className="catalog-page" style={{ minHeight: '100vh', background: 'var(--bg)', paddingTop: 'var(--header-h)' }}>
      <div style={{ background: 'var(--surface)', borderBottom: '1px solid var(--line)', padding: '24px var(--gutter)' }}>
        <div style={{ maxWidth: 'var(--max-w)', margin: '0 auto' }}>
          <nav style={{ display: 'flex', gap: 8, alignItems: 'center', fontSize: 13, color: 'var(--ink-3)', marginBottom: 12 }}>
            <Link href="/" style={{ color: 'var(--ink-3)', textDecoration: 'none' }}>
              Главная
            </Link>
            <span>/</span>
            <span style={{ color: 'var(--ink)', fontWeight: 600 }}>Каталог</span>
          </nav>

          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', flexWrap: 'wrap', gap: 16 }}>
            <div>
              <h1
                style={{
                  fontFamily: 'Manrope',
                  fontWeight: 800,
                  fontSize: 'clamp(24px,3vw,36px)',
                  letterSpacing: '-0.03em',
                  color: 'var(--ink)',
                  marginBottom: 4,
                }}
              >
                Каталог Adzek
              </h1>
              <p style={{ fontSize: 14, color: 'var(--ink-2)' }}>
                {filtered.length} товаров · Натуральная бытовая химия из Казахстана
              </p>
            </div>

            {cartItems.length > 0 && (
              <Link href="/cart" className="btn btn-clay" style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <span className="icon" style={{ fontSize: 20 }}>
                  shopping_cart
                </span>
                Корзина ({cartItems.length})
              </Link>
            )}
          </div>
        </div>
      </div>

      <div style={{ maxWidth: 'var(--max-w)', margin: '0 auto', padding: '32px var(--gutter) 64px' }}>
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'minmax(0, 1.5fr) minmax(180px, 320px)',
            gap: 16,
            marginBottom: 24,
          }}
        >
          <input
            className="input"
            type="search"
            placeholder="Поиск по товарам, ароматам и назначению"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
          />

          <select
            value={sortBy}
            onChange={(event) => setSortBy(event.target.value as (typeof CATALOG_SORTS)[number]['key'])}
            className="input"
          >
            {CATALOG_SORTS.map((sort) => (
              <option key={sort.key} value={sort.key}>
                {sort.label}
              </option>
            ))}
          </select>
        </div>

        <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'center', gap: 16, marginBottom: 32 }}>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
            {CATALOG_CATEGORIES.map((item) => (
              <button
                key={item.key}
                onClick={() => setCategory(item.key)}
                style={{
                  padding: '8px 18px',
                  borderRadius: 'var(--r-full)',
                  border: category === item.key ? 'none' : '1.5px solid var(--line-2)',
                  background: category === item.key ? 'var(--ink)' : 'transparent',
                  color: category === item.key ? 'var(--ink-inv)' : 'var(--ink-2)',
                  fontSize: 13,
                  fontWeight: 600,
                  cursor: 'pointer',
                  transition: 'all 160ms',
                  letterSpacing: '0.01em',
                }}
              >
                {item.label}
              </button>
            ))}
          </div>

          <p style={{ fontSize: 13, color: 'var(--ink-3)' }}>
            Данные пока подаются из локального каталога, пока API не подключен.
          </p>
        </div>

        {filtered.length === 0 ? (
          <div
            style={{
              border: '1px solid var(--line)',
              borderRadius: 'var(--r-lg)',
              padding: 32,
              textAlign: 'center',
              color: 'var(--ink-2)',
              background: 'var(--surface)',
            }}
          >
            <p style={{ fontWeight: 700, marginBottom: 6 }}>Ничего не найдено</p>
            <p>Попробуйте другой запрос или смените категорию.</p>
          </div>
        ) : (
          <div className="product-grid">
            {filtered.map((product) => (
              <Link key={product.id} href={`/catalog/${product.slug}`} style={{ textDecoration: 'none' }}>
                <article className="product-card">
                  <div className="product-img-area">
                    <div
                      style={{
                        width: '100%',
                        height: '100%',
                        position: 'absolute',
                        inset: 0,
                        background: 'linear-gradient(135deg, var(--clay-light) 0%, var(--bg-alt) 100%)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                      }}
                    >
                      <span className="icon" style={{ fontSize: 72, color: 'var(--clay)', opacity: 0.35 }}>
                        water_drop
                      </span>
                    </div>
                    <span className="product-tag-pill">{product.badge}</span>
                    <button
                      className="product-fav"
                      onClick={(event) => {
                        event.preventDefault();
                      }}
                      aria-label="В избранное"
                    >
                      <span className="icon">favorite</span>
                    </button>
                  </div>

                  <div className="product-info">
                    <p className="product-name">{product.name}</p>
                    <p className="product-sub">{product.sub}</p>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginTop: 4 }}>
                      <span style={{ color: 'var(--clay)', fontSize: 13 }}>★ {product.rating}</span>
                      <span style={{ fontSize: 12, color: 'var(--ink-3)' }}>({product.reviews} отзывов)</span>
                    </div>
                  </div>

                  <div className="product-bottom">
                    <span className="product-price">
                      {product.price.toLocaleString('ru-KZ')} ₸
                    </span>
                    <button
                      className="add-to-cart-btn"
                      onClick={(event) => addToCart(product.id, event)}
                      aria-label="В корзину"
                      title="Добавить в корзину"
                    >
                      <span className="icon">add_shopping_cart</span>
                    </button>
                  </div>
                </article>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
