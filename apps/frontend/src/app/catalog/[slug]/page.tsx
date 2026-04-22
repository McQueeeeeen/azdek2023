'use client';

import Link from 'next/link';
import { useState } from 'react';

const PRODUCTS: Record<string, {
  id: number; name: string; price: number; oldPrice?: number; badge: string;
  sub: string; rating: number; reviews: number; category: string;
  description: string; ingredients: string; volume: string[];
  certifications: string[]; howToUse: string;
}> = {
  'gel-dlya-posudy-myata-laym': {
    id: 1, name: 'Гель для посуды «Мята и Лайм»', price: 890, oldPrice: 1090,
    badge: 'ЭКО', sub: 'Концентрат', category: 'kitchen', rating: 4.9, reviews: 142,
    description: 'Концентрированный эко-гель для мытья посуды на основе натуральных компонентов. Эффективно расщепляет жир, не сушит кожу рук. Освежающий аромат мяты и цитруса.',
    ingredients: 'Вода, кокосульфат натрия (растительный), глюкозид децила, экстракт мяты, лимонная кислота, эфирное масло лайма.',
    volume: ['250 мл', '500 мл', '1 л'],
    certifications: ['EcoLabel', 'Vegan', 'Cruelty-Free'],
    howToUse: 'Нанесите небольшое количество (1–2 мл) на губку. Вспеньте и мойте посуду. Тщательно смойте водой. Концентрат — расходуется в 3× меньше чем обычный гель.'
  },
  'sprey-dlya-poverkhnostey-chainoe-derevo': {
    id: 3, name: 'Спрей для поверхностей', price: 1290,
    badge: 'ОРГАНИК', sub: 'Чайное дерево · 750 мл', category: 'cleaning', rating: 4.9, reviews: 207,
    description: 'Многофункциональный органический спрей для уборки любых твёрдых поверхностей. Масло чайного дерева обладает природными антибактериальными свойствами.',
    ingredients: 'Вода, цитрат натрия, эфирное масло чайного дерева, алкилполиглюкозид, экстракт тимьяна.',
    volume: ['500 мл', '750 мл'],
    certifications: ['Organic', 'EcoLabel'],
    howToUse: 'Распылите на поверхность. Оставьте на 30 секунд для дезинфекции. Протрите влажной тряпкой или смойте водой.'
  },
  'gel-dlya-stirki': {
    id: 5, name: 'Гель для стирки', price: 1490,
    badge: 'ПРЕМИУМ', sub: 'Универсальный · 1 л', category: 'laundry', rating: 4.8, reviews: 89,
    description: 'Эффективно стирает при 30–60°C, удаляет сложные загрязнения. Бережет цвет и волокна ткани. Подходит для машинной и ручной стирки.',
    ingredients: 'Вода, анионный ПАВ (растительный), неионогенный ПАВ, цеолит, энзимы, цитрат натрия, отдушка.',
    volume: ['500 мл', '1 л', '2 л'],
    certifications: ['EcoLabel', 'Hypoallergenic'],
    howToUse: 'Налейте 40–60 мл в отсек барабана. Для предварительного замачивания: 30 мл на 5 л воды. Температура стирки 30–60°C.'
  },
};

// fallback product
const DEFAULT_PRODUCT = PRODUCTS['gel-dlya-posudy-myata-laym'];

const RELATED = [
  { slug: 'sprey-dlya-poverkhnostey-chainoe-derevo', name: 'Спрей для поверхностей', price: 1290, badge: 'ОРГАНИК' },
  { slug: 'gel-dlya-stirki', name: 'Гель для стирки', price: 1490, badge: 'ПРЕМИУМ' },
  { slug: 'dezinfektant', name: 'Дезинфектант', price: 1190, badge: 'ЗАЩИТА' },
];

export default function ProductPage({ params }: { params: { slug: string } }) {
  const product = PRODUCTS[params.slug] || DEFAULT_PRODUCT;
  const [quantity, setQuantity] = useState(1);
  const [selectedVolume, setSelectedVolume] = useState(product.volume[1] || product.volume[0]);
  const [added, setAdded] = useState(false);
  const [activeTab, setActiveTab] = useState<'desc' | 'ingredients' | 'how'>('desc');

  const handleAddToCart = () => {
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg)', paddingTop: 'var(--header-h)' }}>

      {/* Breadcrumb */}
      <div style={{ borderBottom: '1px solid var(--line)', padding: '16px var(--gutter)', background: 'var(--surface)' }}>
        <div style={{ maxWidth: 'var(--max-w)', margin: '0 auto' }}>
          <nav style={{ display: 'flex', gap: 8, alignItems: 'center', fontSize: 13, color: 'var(--ink-3)' }}>
            <Link href="/" style={{ color: 'var(--ink-3)', textDecoration: 'none' }}>Главная</Link>
            <span>/</span>
            <Link href="/catalog" style={{ color: 'var(--ink-3)', textDecoration: 'none' }}>Каталог</Link>
            <span>/</span>
            <span style={{ color: 'var(--ink)', fontWeight: 600 }}>{product.name}</span>
          </nav>
        </div>
      </div>

      <div style={{ maxWidth: 'var(--max-w)', margin: '0 auto', padding: '40px var(--gutter) 80px' }}>

        {/* Main product layout */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 64, alignItems: 'start' }}>

          {/* Image area */}
          <div style={{
            background: 'linear-gradient(135deg, var(--clay-light) 0%, var(--bg-alt) 100%)',
            borderRadius: 'var(--r-xl)',
            aspectRatio: '1/1',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            position: 'relative', overflow: 'hidden',
          }}>
            <span className="icon" style={{ fontSize: 180, color: 'var(--clay)', opacity: 0.2 }}>water_drop</span>
            <div style={{ position: 'absolute', top: 16, left: 16 }}>
              <span style={{
                background: 'var(--ink)', color: 'var(--ink-inv)', fontSize: 10,
                fontWeight: 800, letterSpacing: '0.1em', textTransform: 'uppercase',
                padding: '5px 12px', borderRadius: 'var(--r-full)'
              }}>{product.badge}</span>
            </div>
          </div>

          {/* Product info */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>

            {/* Title & rating */}
            <div>
              <p style={{ fontSize: 12, fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--clay)', marginBottom: 8 }}>
                {product.sub}
              </p>
              <h1 style={{ fontFamily: 'Manrope', fontWeight: 800, fontSize: 'clamp(22px,2.5vw,32px)', letterSpacing: '-0.03em', color: 'var(--ink)', lineHeight: 1.2, marginBottom: 12 }}>
                {product.name}
              </h1>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <div style={{ display: 'flex', gap: 2 }}>
                  {[1,2,3,4,5].map(i => (
                    <span key={i} style={{ color: i <= Math.round(product.rating) ? 'var(--clay)' : 'var(--line-2)', fontSize: 18 }}>★</span>
                  ))}
                </div>
                <span style={{ fontWeight: 700, fontSize: 15, color: 'var(--ink)' }}>{product.rating}</span>
                <span style={{ color: 'var(--ink-3)', fontSize: 13 }}>{product.reviews} отзывов</span>
              </div>
            </div>

            {/* Price */}
            <div style={{ display: 'flex', alignItems: 'baseline', gap: 12 }}>
              <span style={{ fontFamily: 'Manrope', fontWeight: 800, fontSize: 36, letterSpacing: '-0.04em', color: 'var(--ink)' }}>
                {product.price.toLocaleString('ru-KZ')} ₸
              </span>
              {product.oldPrice && (
                <span style={{ fontSize: 18, color: 'var(--ink-3)', textDecoration: 'line-through' }}>
                  {product.oldPrice.toLocaleString('ru-KZ')} ₸
                </span>
              )}
            </div>

            {/* Volume selector */}
            <div>
              <p style={{ fontSize: 12, fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', color: 'var(--ink-2)', marginBottom: 10 }}>Объём</p>
              <div style={{ display: 'flex', gap: 8 }}>
                {product.volume.map(vol => (
                  <button
                    key={vol}
                    onClick={() => setSelectedVolume(vol)}
                    style={{
                      padding: '8px 16px', borderRadius: 'var(--r-sm)', fontSize: 13, fontWeight: 600, cursor: 'pointer',
                      border: selectedVolume === vol ? '2px solid var(--ink)' : '1.5px solid var(--line-2)',
                      background: selectedVolume === vol ? 'var(--ink)' : 'transparent',
                      color: selectedVolume === vol ? 'var(--ink-inv)' : 'var(--ink-2)',
                      transition: 'all 140ms',
                    }}
                  >{vol}</button>
                ))}
              </div>
            </div>

            {/* Quantity + Add to cart */}
            <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
              <div style={{
                display: 'flex', alignItems: 'center', border: '1.5px solid var(--line-2)',
                borderRadius: 'var(--r-sm)', overflow: 'hidden'
              }}>
                <button onClick={() => setQuantity(q => Math.max(1, q - 1))}
                  style={{ width: 40, height: 48, background: 'none', border: 'none', cursor: 'pointer', fontSize: 20, color: 'var(--ink-2)' }}>−</button>
                <span style={{ width: 48, textAlign: 'center', fontWeight: 700, fontSize: 16 }}>{quantity}</span>
                <button onClick={() => setQuantity(q => q + 1)}
                  style={{ width: 40, height: 48, background: 'none', border: 'none', cursor: 'pointer', fontSize: 20, color: 'var(--ink-2)' }}>+</button>
              </div>
              <button
                className={`btn ${added ? 'btn-outline' : 'btn-clay'} btn-lg`}
                onClick={handleAddToCart}
                style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}
              >
                <span className="icon" style={{ fontSize: 20 }}>{added ? 'check' : 'add_shopping_cart'}</span>
                {added ? 'Добавлено в корзину!' : 'В корзину'}
              </button>
            </div>

            {/* Certifications */}
            <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
              {product.certifications.map(cert => (
                <span key={cert} style={{
                  padding: '5px 12px', borderRadius: 'var(--r-full)',
                  border: '1.5px solid var(--clay)', color: 'var(--clay)',
                  fontSize: 11, fontWeight: 700, letterSpacing: '0.06em'
                }}>{cert}</span>
              ))}
            </div>

            {/* Delivery info */}
            <div style={{ background: 'var(--clay-light)', borderRadius: 'var(--r-md)', padding: '16px 20px', display: 'flex', gap: 16 }}>
              <span className="icon" style={{ color: 'var(--clay)', fontSize: 24, flexShrink: 0 }}>local_shipping</span>
              <div>
                <p style={{ fontWeight: 700, fontSize: 14, color: 'var(--ink)', marginBottom: 2 }}>Доставка по Казахстану</p>
                <p style={{ fontSize: 13, color: 'var(--ink-2)' }}>Алматы и Астана — 1-2 дня · Остальные города — 3-5 дней</p>
              </div>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div style={{ marginTop: 56 }}>
          <div style={{ display: 'flex', borderBottom: '2px solid var(--line)', gap: 0, marginBottom: 32 }}>
            {([['desc', 'Описание'], ['ingredients', 'Состав'], ['how', 'Как использовать']] as const).map(([key, label]) => (
              <button
                key={key}
                onClick={() => setActiveTab(key)}
                style={{
                  padding: '12px 24px', background: 'none', border: 'none', cursor: 'pointer',
                  fontWeight: 700, fontSize: 14, letterSpacing: '0.02em',
                  color: activeTab === key ? 'var(--ink)' : 'var(--ink-3)',
                  borderBottom: activeTab === key ? '2px solid var(--clay)' : '2px solid transparent',
                  marginBottom: -2, transition: 'color 140ms',
                }}
              >{label}</button>
            ))}
          </div>
          <div style={{ maxWidth: 640, lineHeight: 1.7, color: 'var(--ink-2)', fontSize: 15 }}>
            {activeTab === 'desc' && <p>{product.description}</p>}
            {activeTab === 'ingredients' && <p>{product.ingredients}</p>}
            {activeTab === 'how' && <p>{product.howToUse}</p>}
          </div>
        </div>

        {/* Related products */}
        <div style={{ marginTop: 56 }}>
          <h2 style={{ fontFamily: 'Manrope', fontWeight: 800, fontSize: 22, letterSpacing: '-0.02em', marginBottom: 24 }}>
            Вам также понравится
          </h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 20 }}>
            {RELATED.filter(r => r.slug !== params.slug).slice(0, 3).map(rel => (
              <Link key={rel.slug} href={`/catalog/${rel.slug}`} style={{ textDecoration: 'none' }}>
                <div className="product-card">
                  <div className="product-img-area" style={{ height: 160 }}>
                    <div style={{
                      position: 'absolute', inset: 0,
                      background: 'linear-gradient(135deg, var(--clay-light), var(--bg-alt))',
                      display: 'flex', alignItems: 'center', justifyContent: 'center'
                    }}>
                      <span className="icon" style={{ fontSize: 48, color: 'var(--clay)', opacity: 0.3 }}>water_drop</span>
                    </div>
                    <span className="product-tag-pill">{rel.badge}</span>
                  </div>
                  <div className="product-info">
                    <p className="product-name">{rel.name}</p>
                  </div>
                  <div className="product-bottom">
                    <span className="product-price">{rel.price.toLocaleString('ru-KZ')} ₸</span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
