'use client';

import Link from 'next/link';
import { useState } from 'react';

interface CartItem {
  id: string;
  slug: string;
  name: string;
  sub: string;
  price: number;
  quantity: number;
}

const INITIAL_ITEMS: CartItem[] = [
  { id: '1', slug: 'gel-dlya-posudy-myata-laym', name: 'Гель для посуды «Мята и Лайм»', sub: 'Концентрат · 500 мл', price: 890, quantity: 2 },
  { id: '2', slug: 'sprey-dlya-poverkhnostey-chainoe-derevo', name: 'Спрей для поверхностей', sub: 'Чайное дерево · 750 мл', price: 1290, quantity: 1 },
  { id: '3', slug: 'dezinfektant', name: 'Универсальный дезинфектант', sub: 'Антибактериальный · 500 мл', price: 1190, quantity: 1 },
];

const DELIVERY_OPTIONS = [
  { id: 'courier', label: 'Курьер по городу', sub: '1–2 дня', price: 1500 },
  { id: 'kazpost', label: 'Казпочта', sub: '3–7 дней', price: 900 },
  { id: 'pickup', label: 'Самовывоз', sub: 'г. Алматы', price: 0 },
];

export default function CartPage() {
  const [items, setItems] = useState<CartItem[]>(INITIAL_ITEMS);
  const [delivery, setDelivery] = useState('courier');
  const [promoCode, setPromoCode] = useState('');
  const [promoApplied, setPromoApplied] = useState(false);
  const [promoError, setPromoError] = useState('');

  const updateQty = (id: string, delta: number) => {
    setItems(prev => prev
      .map(item => item.id === id ? { ...item, quantity: Math.max(0, item.quantity + delta) } : item)
      .filter(item => item.quantity > 0)
    );
  };

  const removeItem = (id: string) => setItems(prev => prev.filter(item => item.id !== id));

  const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const deliveryPrice = DELIVERY_OPTIONS.find(d => d.id === delivery)?.price ?? 0;
  const discount = promoApplied ? Math.round(subtotal * 0.1) : 0;
  const total = subtotal + deliveryPrice - discount;

  const applyPromo = () => {
    if (promoCode.toUpperCase() === 'ADZEK10') {
      setPromoApplied(true);
      setPromoError('');
    } else {
      setPromoError('Промокод не найден');
      setPromoApplied(false);
    }
  };

  if (items.length === 0) {
    return (
      <div style={{ minHeight: '100vh', background: 'var(--bg)', paddingTop: 'var(--header-h)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ textAlign: 'center', padding: 48 }}>
          <span className="icon" style={{ fontSize: 80, color: 'var(--line-2)', display: 'block', marginBottom: 24 }}>shopping_cart</span>
          <h2 style={{ fontFamily: 'Manrope', fontWeight: 800, fontSize: 24, marginBottom: 12 }}>Корзина пуста</h2>
          <p style={{ color: 'var(--ink-2)', marginBottom: 32 }}>Добавьте товары из каталога</p>
          <Link href="/catalog" className="btn btn-clay btn-lg">Перейти в каталог</Link>
        </div>
      </div>
    );
  }

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg)', paddingTop: 'var(--header-h)' }}>

      {/* Header */}
      <div style={{ borderBottom: '1px solid var(--line)', padding: '20px var(--gutter)', background: 'var(--surface)' }}>
        <div style={{ maxWidth: 'var(--max-w)', margin: '0 auto' }}>
          <nav style={{ display: 'flex', gap: 8, fontSize: 13, color: 'var(--ink-3)', marginBottom: 8 }}>
            <Link href="/" style={{ color: 'var(--ink-3)', textDecoration: 'none' }}>Главная</Link>
            <span>/</span>
            <span style={{ color: 'var(--ink)', fontWeight: 600 }}>Корзина</span>
          </nav>
          <h1 style={{ fontFamily: 'Manrope', fontWeight: 800, fontSize: 28, letterSpacing: '-0.02em', color: 'var(--ink)' }}>
            Корзина · {items.length} {items.length === 1 ? 'товар' : items.length < 5 ? 'товара' : 'товаров'}
          </h1>
        </div>
      </div>

      <div style={{ maxWidth: 'var(--max-w)', margin: '0 auto', padding: '32px var(--gutter) 64px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 360px', gap: 32, alignItems: 'start' }}>

          {/* Items list */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {items.map(item => (
              <div key={item.id} style={{
                background: 'var(--surface)', border: '1px solid var(--line)',
                borderRadius: 'var(--r-lg)', padding: '20px 24px',
                display: 'grid', gridTemplateColumns: '56px 1fr auto', gap: 16, alignItems: 'center'
              }}>
                {/* Image */}
                <div style={{
                  width: 56, height: 56, borderRadius: 'var(--r-md)',
                  background: 'linear-gradient(135deg, var(--clay-light), var(--bg-alt))',
                  display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0
                }}>
                  <span className="icon" style={{ fontSize: 28, color: 'var(--clay)', opacity: 0.5 }}>water_drop</span>
                </div>

                {/* Info */}
                <div>
                  <Link href={`/catalog/${item.slug}`} style={{ textDecoration: 'none' }}>
                    <p style={{ fontWeight: 600, fontSize: 15, color: 'var(--ink)', marginBottom: 2 }}>{item.name}</p>
                  </Link>
                  <p style={{ fontSize: 13, color: 'var(--ink-3)' }}>{item.sub}</p>
                  <p style={{ fontFamily: 'Manrope', fontWeight: 800, fontSize: 17, color: 'var(--ink)', marginTop: 6 }}>
                    {(item.price * item.quantity).toLocaleString('ru-KZ')} ₸
                  </p>
                </div>

                {/* Controls */}
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 12 }}>
                  <button onClick={() => removeItem(item.id)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--ink-3)', padding: 4 }}>
                    <span className="icon" style={{ fontSize: 18 }}>close</span>
                  </button>
                  <div style={{ display: 'flex', alignItems: 'center', border: '1.5px solid var(--line-2)', borderRadius: 'var(--r-sm)', overflow: 'hidden' }}>
                    <button onClick={() => updateQty(item.id, -1)} style={{ width: 32, height: 32, background: 'none', border: 'none', cursor: 'pointer', fontSize: 16, color: 'var(--ink-2)' }}>−</button>
                    <span style={{ width: 32, textAlign: 'center', fontWeight: 700, fontSize: 14 }}>{item.quantity}</span>
                    <button onClick={() => updateQty(item.id, 1)} style={{ width: 32, height: 32, background: 'none', border: 'none', cursor: 'pointer', fontSize: 16, color: 'var(--ink-2)' }}>+</button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Order summary — sticky */}
          <div style={{ position: 'sticky', top: 'calc(var(--header-h) + 24px)' }}>
            <div style={{ background: 'var(--surface)', border: '1px solid var(--line)', borderRadius: 'var(--r-lg)', overflow: 'hidden' }}>

              {/* Delivery */}
              <div style={{ padding: '20px 24px', borderBottom: '1px solid var(--line)' }}>
                <p style={{ fontWeight: 700, fontSize: 12, letterSpacing: '0.08em', textTransform: 'uppercase', color: 'var(--ink-2)', marginBottom: 12 }}>Доставка</p>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                  {DELIVERY_OPTIONS.map(opt => (
                    <label key={opt.id} style={{ display: 'flex', alignItems: 'center', gap: 10, cursor: 'pointer', padding: '10px 12px', borderRadius: 'var(--r-sm)', background: delivery === opt.id ? 'var(--clay-light)' : 'transparent', border: `1.5px solid ${delivery === opt.id ? 'var(--clay)' : 'var(--line)'}`, transition: 'all 140ms' }}>
                      <input type="radio" name="delivery" value={opt.id} checked={delivery === opt.id} onChange={() => setDelivery(opt.id)} style={{ accentColor: 'var(--clay)', flexShrink: 0 }} />
                      <div style={{ flex: 1 }}>
                        <p style={{ fontWeight: 600, fontSize: 13, color: 'var(--ink)' }}>{opt.label}</p>
                        <p style={{ fontSize: 11, color: 'var(--ink-3)' }}>{opt.sub}</p>
                      </div>
                      <span style={{ fontWeight: 700, fontSize: 13, color: opt.price === 0 ? 'var(--clay)' : 'var(--ink)', whiteSpace: 'nowrap' }}>
                        {opt.price === 0 ? 'Бесплатно' : `${opt.price.toLocaleString('ru-KZ')} ₸`}
                      </span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Promo */}
              <div style={{ padding: '16px 24px', borderBottom: '1px solid var(--line)' }}>
                <p style={{ fontWeight: 700, fontSize: 12, letterSpacing: '0.08em', textTransform: 'uppercase', color: 'var(--ink-2)', marginBottom: 10 }}>Промокод</p>
                <div style={{ display: 'flex', gap: 8 }}>
                  <input
                    className="input"
                    placeholder="ADZEK10"
                    value={promoCode}
                    onChange={e => { setPromoCode(e.target.value); setPromoError(''); }}
                    style={{ flex: 1, paddingTop: 8, paddingBottom: 8, fontSize: 13 }}
                  />
                  <button onClick={applyPromo} className="btn btn-outline" style={{ padding: '8px 14px', fontSize: 13 }}>
                    Применить
                  </button>
                </div>
                {promoError && <p style={{ fontSize: 12, color: '#DC2626', marginTop: 6 }}>{promoError}</p>}
                {promoApplied && <p style={{ fontSize: 12, color: 'var(--clay)', fontWeight: 600, marginTop: 6 }}>✓ Скидка 10% применена</p>}
              </div>

              {/* Totals */}
              <div style={{ padding: '20px 24px' }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginBottom: 20 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 14, color: 'var(--ink-2)' }}>
                    <span>Товары</span>
                    <span>{subtotal.toLocaleString('ru-KZ')} ₸</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 14, color: 'var(--ink-2)' }}>
                    <span>Доставка</span>
                    <span>{deliveryPrice === 0 ? 'Бесплатно' : `${deliveryPrice.toLocaleString('ru-KZ')} ₸`}</span>
                  </div>
                  {discount > 0 && (
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 14, color: 'var(--clay)', fontWeight: 600 }}>
                      <span>Скидка</span>
                      <span>−{discount.toLocaleString('ru-KZ')} ₸</span>
                    </div>
                  )}
                  <div style={{ height: 1, background: 'var(--line)', margin: '4px 0' }} />
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontFamily: 'Manrope', fontWeight: 800, fontSize: 20, letterSpacing: '-0.02em', color: 'var(--ink)' }}>
                    <span>Итого</span>
                    <span>{total.toLocaleString('ru-KZ')} ₸</span>
                  </div>
                </div>
                <Link href="/checkout" className="btn btn-clay btn-lg" style={{ width: '100%', textAlign: 'center', display: 'block' }}>
                  Оформить заказ
                </Link>
                <Link href="/catalog" style={{ display: 'block', textAlign: 'center', marginTop: 12, fontSize: 13, color: 'var(--ink-3)', textDecoration: 'none' }}>
                  ← Продолжить покупки
                </Link>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
