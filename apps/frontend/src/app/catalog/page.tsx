'use client';

import Link from 'next/link';
import { useState, useMemo } from 'react';

const PRODUCTS = [
  { id: 1, slug: 'gel-dlya-posudy-myata-laym', name: 'Гель для посуды «Мята и Лайм»', category: 'kitchen', price: 890, badge: 'ЭКО', sub: 'Концентрат · 500 мл', rating: 4.9, reviews: 142 },
  { id: 2, slug: 'gel-dlya-posudy-apelsin', name: 'Гель для посуды «Апельсин»', category: 'kitchen', price: 890, badge: 'ЭКО', sub: 'Концентрат · 500 мл', rating: 4.8, reviews: 98 },
  { id: 3, slug: 'sprey-dlya-poverkhnostey-chainoe-derevo', name: 'Спрей для поверхностей', category: 'cleaning', price: 1290, badge: 'ОРГАНИК', sub: 'Чайное дерево · 750 мл', rating: 4.9, reviews: 207 },
  { id: 4, slug: 'sprey-dlya-poverkhnostey-lavanda', name: 'Спрей «Лаванда»', category: 'cleaning', price: 1290, badge: 'ОРГАНИК', sub: 'Для поверхностей · 750 мл', rating: 4.7, reviews: 134 },
  { id: 5, slug: 'gel-dlya-stirki', name: 'Гель для стирки', category: 'laundry', price: 1490, badge: 'ПРЕМИУМ', sub: 'Универсальный · 1 л', rating: 4.8, reviews: 89 },
  { id: 6, slug: 'gel-dlya-delikatnykh-tkaney', name: 'Гель для деликатных тканей', category: 'laundry', price: 1690, badge: 'ПРЕМИУМ', sub: 'Шёлк, шерсть · 1 л', rating: 4.9, reviews: 61 },
  { id: 7, slug: 'mylo-kontsentrat', name: 'Мыло-концентрат', category: 'bathroom', price: 590, badge: 'ЭКО', sub: 'Кусковое · 120 г', rating: 4.7, reviews: 178 },
  { id: 8, slug: 'sredstvo-dlya-okon', name: 'Средство для стёкол и окон', category: 'cleaning', price: 890, badge: 'ЭКО', sub: 'Без разводов · 500 мл', rating: 4.6, reviews: 95 },
  { id: 9, slug: 'dezinfektant', name: 'Универсальный дезинфектант', category: 'cleaning', price: 1190, badge: 'ЗАЩИТА', sub: 'Антибактериальный · 500 мл', rating: 4.8, reviews: 256 },
  { id: 10, slug: 'sredstvo-dlya-vannoy', name: 'Средство для ванной', category: 'bathroom', price: 990, badge: 'ОРГАНИК', sub: 'Чайное дерево · 500 мл', rating: 4.7, reviews: 113 },
  { id: 11, slug: 'otbelivatel-kislorodnyy', name: 'Кислородный отбеливатель', category: 'laundry', price: 790, badge: 'ЭКО', sub: 'Без хлора · 500 г', rating: 4.5, reviews: 72 },
  { id: 12, slug: 'sredstvo-ot-nakipi', name: 'Средство от накипи', category: 'kitchen', price: 590, badge: 'ЭКО', sub: 'Чайники, машины · 300 г', rating: 4.6, reviews: 88 },
];

const CATEGORIES = [
  { key: 'all', label: 'Все товары' },
  { key: 'kitchen', label: 'Для кухни' },
  { key: 'bathroom', label: 'Для ванной' },
  { key: 'cleaning', label: 'Для уборки' },
  { key: 'laundry', label: 'Для стирки' },
];

const SORTS = [
  { key: 'popular', label: 'По популярности' },
  { key: 'price-asc', label: 'Цена: дешевле' },
  { key: 'price-desc', label: 'Цена: дороже' },
  { key: 'rating', label: 'По рейтингу' },
];

export default function CatalogPage() {
  const [category, setCategory] = useState('all');
  const [sortBy, setSortBy] = useState('popular');
  const [cartItems, setCartItems] = useState<number[]>([]);

  const filtered = useMemo(() => {
    let list = category === 'all' ? PRODUCTS : PRODUCTS.filter(p => p.category === category);
    if (sortBy === 'price-asc') list = [...list].sort((a, b) => a.price - b.price);
    if (sortBy === 'price-desc') list = [...list].sort((a, b) => b.price - a.price);
    if (sortBy === 'rating') list = [...list].sort((a, b) => b.rating - a.rating);
    return list;
  }, [category, sortBy]);

  const addToCart = (id: number, e: React.MouseEvent) => {
    e.preventDefault();
    setCartItems(prev => [...prev, id]);
  };

  return (
    <div className="catalog-page" style={{ minHeight: '100vh', background: 'var(--bg)', paddingTop: 'var(--header-h)' }}>

      {/* Header strip */}
      <div style={{ background: 'var(--surface)', borderBottom: '1px solid var(--line)', padding: '24px var(--gutter)' }}>
        <div style={{ maxWidth: 'var(--max-w)', margin: '0 auto' }}>
          <nav style={{ display: 'flex', gap: 8, alignItems: 'center', fontSize: 13, color: 'var(--ink-3)', marginBottom: 12 }}>
            <Link href="/" style={{ color: 'var(--ink-3)', textDecoration: 'none' }}>Главная</Link>
            <span>/</span>
            <span style={{ color: 'var(--ink)', fontWeight: 600 }}>Каталог</span>
          </nav>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', flexWrap: 'wrap', gap: 16 }}>
            <div>
              <h1 style={{ fontFamily: 'Manrope', fontWeight: 800, fontSize: 'clamp(24px,3vw,36px)', letterSpacing: '-0.03em', color: 'var(--ink)', marginBottom: 4 }}>
                Каталог товаров
              </h1>
              <p style={{ fontSize: 14, color: 'var(--ink-2)' }}>
                {filtered.length} товаров · Натуральная бытовая химия из Алматы
              </p>
            </div>
            {cartItems.length > 0 && (
              <Link href="/cart" className="btn btn-clay" style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <span className="icon" style={{ fontSize: 20 }}>shopping_cart</span>
                Корзина ({cartItems.length})
              </Link>
            )}
          </div>
        </div>
      </div>

      <div style={{ maxWidth: 'var(--max-w)', margin: '0 auto', padding: '32px var(--gutter) 64px' }}>

        {/* Filters row */}
        <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'center', gap: 16, marginBottom: 32 }}>
          {/* Category pills */}
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
            {CATEGORIES.map(cat => (
              <button
                key={cat.key}
                onClick={() => setCategory(cat.key)}
                style={{
                  padding: '8px 18px',
                  borderRadius: 'var(--r-full)',
                  border: category === cat.key ? 'none' : '1.5px solid var(--line-2)',
                  background: category === cat.key ? 'var(--ink)' : 'transparent',
                  color: category === cat.key ? 'var(--ink-inv)' : 'var(--ink-2)',
                  fontSize: 13,
                  fontWeight: 600,
                  cursor: 'pointer',
                  transition: 'all 160ms',
                  letterSpacing: '0.01em',
                }}
              >
                {cat.label}
              </button>
            ))}
          </div>
          {/* Sort */}
          <select
            value={sortBy}
            onChange={e => setSortBy(e.target.value)}
            className="input"
            style={{ width: 'auto', minWidth: 200, paddingTop: 8, paddingBottom: 8 }}
          >
            {SORTS.map(s => (
              <option key={s.key} value={s.key}>{s.label}</option>
            ))}
          </select>
        </div>

        {/* Products grid */}
        <div className="product-grid">
          {filtered.map(product => (
            <Link key={product.id} href={`/catalog/${product.slug}`} style={{ textDecoration: 'none' }}>
              <div className="product-card">
                <div className="product-img-area">
                  {/* Product image placeholder — replace with real photos */}
                  <div style={{
                    width: '100%', height: '100%', position: 'absolute', inset: 0,
                    background: `linear-gradient(135deg, var(--clay-light) 0%, var(--bg-alt) 100%)`,
                    display: 'flex', alignItems: 'center', justifyContent: 'center'
                  }}>
                    <span className="icon" style={{ fontSize: 72, color: 'var(--clay)', opacity: 0.35 }}>water_drop</span>
                  </div>
                  <span className="product-tag-pill">{product.badge}</span>
                  <button
                    className="product-fav"
                    onClick={e => { e.preventDefault(); }}
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
                  <span className="product-price">{product.price.toLocaleString('ru-KZ')} ₸</span>
                  <button
                    className="add-to-cart-btn"
                    onClick={e => addToCart(product.id, e)}
                    aria-label="В корзину"
                    title="Добавить в корзину"
                  >
                    <span className="icon">add_shopping_cart</span>
                  </button>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
