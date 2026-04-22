'use client';

import Link from 'next/link';
import { useMemo, useState } from 'react';
import { addProductToCart } from '@/lib/cart-store';
import { getCatalogProductDetails, getCatalogRelatedProducts } from '@/lib/catalog-data';

export default function ProductPage({ params }: { params: { slug: string } }) {
  const product = getCatalogProductDetails(params.slug);
  const relatedProducts = useMemo(() => getCatalogRelatedProducts(params.slug, 3), [params.slug]);
  const [quantity, setQuantity] = useState(1);
  const [selectedVolume, setSelectedVolume] = useState(product?.volume[0] ?? '500 мл');
  const [added, setAdded] = useState(false);
  const [activeTab, setActiveTab] = useState<'desc' | 'ingredients' | 'how' | 'reviews' | 'faq'>('desc');

  if (!product) {
    return (
      <div style={{ minHeight: '100vh', background: 'var(--bg)', paddingTop: 'var(--header-h)' }}>
        <div style={{ maxWidth: 'var(--max-w)', margin: '0 auto', padding: '40px var(--gutter)' }}>
          <p style={{ color: 'var(--ink-2)' }}>Товар не найден.</p>
          <Link href="/catalog" className="btn btn-clay" style={{ marginTop: 16, display: 'inline-flex' }}>
            Вернуться в каталог
          </Link>
        </div>
      </div>
    );
  }

  const handleAddToCart = () => {
    addProductToCart({
      id: product.id,
      slug: product.slug,
      name: product.name,
      category: product.category,
      price: product.price,
      badge: product.badge,
      sub: product.sub,
      rating: product.rating,
      reviews: product.reviews,
      description: product.description,
    });
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg)', paddingTop: 'var(--header-h)' }}>
      <div style={{ borderBottom: '1px solid var(--line)', padding: '16px var(--gutter)', background: 'var(--surface)' }}>
        <div style={{ maxWidth: 'var(--max-w)', margin: '0 auto' }}>
          <nav style={{ display: 'flex', gap: 8, alignItems: 'center', fontSize: 13, color: 'var(--ink-3)' }}>
            <Link href="/" style={{ color: 'var(--ink-3)', textDecoration: 'none' }}>
              Главная
            </Link>
            <span>/</span>
            <Link href="/catalog" style={{ color: 'var(--ink-3)', textDecoration: 'none' }}>
              Каталог
            </Link>
            <span>/</span>
            <span style={{ color: 'var(--ink)', fontWeight: 600 }}>{product.name}</span>
          </nav>
        </div>
      </div>

      <div style={{ maxWidth: 'var(--max-w)', margin: '0 auto', padding: '40px var(--gutter) 80px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 64, alignItems: 'start' }}>
          <div
            style={{
              background: 'linear-gradient(135deg, var(--clay-light) 0%, var(--bg-alt) 100%)',
              borderRadius: 'var(--r-xl)',
              aspectRatio: '1/1',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              position: 'relative',
              overflow: 'hidden',
            }}
          >
            <span className="icon" style={{ fontSize: 180, color: 'var(--clay)', opacity: 0.2 }}>
              water_drop
            </span>
            <div style={{ position: 'absolute', top: 16, left: 16 }}>
              <span
                style={{
                  background: 'var(--ink)',
                  color: 'var(--ink-inv)',
                  fontSize: 10,
                  fontWeight: 800,
                  letterSpacing: '0.1em',
                  textTransform: 'uppercase',
                  padding: '5px 12px',
                  borderRadius: 'var(--r-full)',
                }}
              >
                {product.badge}
              </span>
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
            <div>
              <p
                style={{
                  fontSize: 12,
                  fontWeight: 700,
                  letterSpacing: '0.1em',
                  textTransform: 'uppercase',
                  color: 'var(--clay)',
                  marginBottom: 8,
                }}
              >
                {product.sub}
              </p>
              <h1
                style={{
                  fontFamily: 'Manrope',
                  fontWeight: 800,
                  fontSize: 'clamp(22px,2.5vw,32px)',
                  letterSpacing: '-0.03em',
                  color: 'var(--ink)',
                  lineHeight: 1.2,
                  marginBottom: 12,
                }}
              >
                {product.name}
              </h1>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <div style={{ display: 'flex', gap: 2 }}>
                  {[1, 2, 3, 4, 5].map((i) => (
                    <span
                      key={i}
                      style={{ color: i <= Math.round(product.rating) ? 'var(--clay)' : 'var(--line-2)', fontSize: 18 }}
                    >
                      ★
                    </span>
                  ))}
                </div>
                <span style={{ fontWeight: 700, fontSize: 15, color: 'var(--ink)' }}>{product.rating}</span>
                <span style={{ color: 'var(--ink-3)', fontSize: 13 }}>{product.reviews} отзывов</span>
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'baseline', gap: 12 }}>
              <span
                style={{
                  fontFamily: 'Manrope',
                  fontWeight: 800,
                  fontSize: 36,
                  letterSpacing: '-0.04em',
                  color: 'var(--ink)',
                }}
              >
                {product.price.toLocaleString('ru-KZ')} ₸
              </span>
              {product.oldPrice && (
                <span style={{ fontSize: 18, color: 'var(--ink-3)', textDecoration: 'line-through' }}>
                  {product.oldPrice.toLocaleString('ru-KZ')} ₸
                </span>
              )}
            </div>

            <div>
              <p
                style={{
                  fontSize: 12,
                  fontWeight: 700,
                  letterSpacing: '0.08em',
                  textTransform: 'uppercase',
                  color: 'var(--ink-2)',
                  marginBottom: 10,
                }}
              >
                Объём
              </p>
              <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                {product.volume.map((volume) => (
                  <button
                    key={volume}
                    onClick={() => setSelectedVolume(volume)}
                    style={{
                      padding: '8px 16px',
                      borderRadius: 'var(--r-sm)',
                      fontSize: 13,
                      fontWeight: 600,
                      cursor: 'pointer',
                      border: selectedVolume === volume ? '2px solid var(--ink)' : '1.5px solid var(--line-2)',
                      background: selectedVolume === volume ? 'var(--ink)' : 'transparent',
                      color: selectedVolume === volume ? 'var(--ink-inv)' : 'var(--ink-2)',
                      transition: 'all 140ms',
                    }}
                  >
                    {volume}
                  </button>
                ))}
              </div>
            </div>

            <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  border: '1.5px solid var(--line-2)',
                  borderRadius: 'var(--r-sm)',
                  overflow: 'hidden',
                }}
              >
                <button
                  onClick={() => setQuantity((current) => Math.max(1, current - 1))}
                  style={{
                    width: 40,
                    height: 48,
                    background: 'none',
                    border: 'none',
                    cursor: 'pointer',
                    fontSize: 20,
                    color: 'var(--ink-2)',
                  }}
                >
                  −
                </button>
                <span style={{ width: 48, textAlign: 'center', fontWeight: 700, fontSize: 16 }}>{quantity}</span>
                <button
                  onClick={() => setQuantity((current) => current + 1)}
                  style={{
                    width: 40,
                    height: 48,
                    background: 'none',
                    border: 'none',
                    cursor: 'pointer',
                    fontSize: 20,
                    color: 'var(--ink-2)',
                  }}
                >
                  +
                </button>
              </div>
              <button
                className={`btn ${added ? 'btn-outline' : 'btn-clay'} btn-lg`}
                onClick={handleAddToCart}
                style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}
              >
                <span className="icon" style={{ fontSize: 20 }}>
                  {added ? 'check' : 'add_shopping_cart'}
                </span>
                {added ? 'Добавлено в корзину' : 'В корзину'}
              </button>
            </div>

            <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
              {product.certifications.map((certification) => (
                <span
                  key={certification}
                  style={{
                    padding: '5px 12px',
                    borderRadius: 'var(--r-full)',
                    border: '1.5px solid var(--clay)',
                    color: 'var(--clay)',
                    fontSize: 11,
                    fontWeight: 700,
                    letterSpacing: '0.06em',
                  }}
                >
                  {certification}
                </span>
              ))}
            </div>

            <div style={{ background: 'var(--clay-light)', borderRadius: 'var(--r-md)', padding: '16px 20px', display: 'flex', gap: 16 }}>
              <span className="icon" style={{ color: 'var(--clay)', fontSize: 24, flexShrink: 0 }}>
                local_shipping
              </span>
              <div>
                <p style={{ fontWeight: 700, fontSize: 14, color: 'var(--ink)', marginBottom: 2 }}>Доставка по Казахстану</p>
                <p style={{ fontSize: 13, color: 'var(--ink-2)' }}>{product.deliveryNote}</p>
              </div>
            </div>
          </div>
        </div>

        <div style={{ marginTop: 56 }}>
          <div style={{ display: 'flex', borderBottom: '2px solid var(--line)', gap: 0, marginBottom: 32, flexWrap: 'wrap' }}>
            {([
              ['desc', 'Описание'],
              ['ingredients', 'Состав'],
              ['how', 'Как использовать'],
              ['reviews', 'Отзывы'],
              ['faq', 'Вопросы'],
            ] as const).map(([key, label]) => (
              <button
                key={key}
                onClick={() => setActiveTab(key)}
                style={{
                  padding: '12px 24px',
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  fontWeight: 700,
                  fontSize: 14,
                  letterSpacing: '0.02em',
                  color: activeTab === key ? 'var(--ink)' : 'var(--ink-3)',
                  borderBottom: activeTab === key ? '2px solid var(--clay)' : '2px solid transparent',
                  marginBottom: -2,
                  transition: 'color 140ms',
                }}
              >
                {label}
              </button>
            ))}
          </div>

          <div style={{ maxWidth: 760, lineHeight: 1.7, color: 'var(--ink-2)', fontSize: 15 }}>
            {activeTab === 'desc' && <p>{product.description}</p>}
            {activeTab === 'ingredients' && <p>{product.ingredients}</p>}
            {activeTab === 'how' && <p>{product.howToUse}</p>}
            {activeTab === 'reviews' && (
              <div style={{ display: 'grid', gap: 16 }}>
                {product.reviewsList.map((review) => (
                  <div
                    key={review.author}
                    style={{
                      border: '1px solid var(--line)',
                      borderRadius: 'var(--r-lg)',
                      padding: 16,
                      background: 'var(--surface)',
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 }}>
                      <strong style={{ color: 'var(--ink)' }}>{review.author}</strong>
                      <span style={{ color: 'var(--clay)', fontWeight: 700 }}>★ {review.rating}</span>
                    </div>
                    <p>{review.text}</p>
                  </div>
                ))}
              </div>
            )}
            {activeTab === 'faq' && (
              <div style={{ display: 'grid', gap: 16 }}>
                {product.faq.map((item) => (
                  <div
                    key={item.question}
                    style={{
                      border: '1px solid var(--line)',
                      borderRadius: 'var(--r-lg)',
                      padding: 16,
                      background: 'var(--surface)',
                    }}
                  >
                    <strong style={{ display: 'block', marginBottom: 8, color: 'var(--ink)' }}>{item.question}</strong>
                    <p>{item.answer}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        <div style={{ marginTop: 56 }}>
          <h2
            style={{
              fontFamily: 'Manrope',
              fontWeight: 800,
              fontSize: 22,
              letterSpacing: '-0.02em',
              marginBottom: 24,
            }}
          >
            Вам также понравится
          </h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 20 }}>
            {relatedProducts.map((related) => (
              <Link key={related.slug} href={`/catalog/${related.slug}`} style={{ textDecoration: 'none' }}>
                <article className="product-card">
                  <div className="product-img-area" style={{ height: 160 }}>
                    <div
                      style={{
                        position: 'absolute',
                        inset: 0,
                        background: 'linear-gradient(135deg, var(--clay-light), var(--bg-alt))',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                      }}
                    >
                      <span className="icon" style={{ fontSize: 48, color: 'var(--clay)', opacity: 0.3 }}>
                        water_drop
                      </span>
                    </div>
                    <span className="product-tag-pill">{related.badge}</span>
                  </div>
                  <div className="product-info">
                    <p className="product-name">{related.name}</p>
                    <p className="product-sub">{related.sub}</p>
                  </div>
                  <div className="product-bottom">
                    <span className="product-price">
                      {related.price.toLocaleString('ru-KZ')} ₸
                    </span>
                  </div>
                </article>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
