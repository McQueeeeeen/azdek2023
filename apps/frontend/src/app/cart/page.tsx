'use client';

import Link from 'next/link';
import { useEffect, useMemo, useState } from 'react';
import { getCartLineCount, getCartLineTotal, getInitialCartLines, removeCartLine, updateCartLine, type CartLine } from '@/lib/cart-store';

const DELIVERY_OPTIONS = [
  { id: 'courier', label: 'Курьер по городу', sub: '1–2 дня', price: 1500 },
  { id: 'kazpost', label: 'Казпочта', sub: '3–7 дней', price: 900 },
  { id: 'pickup', label: 'Самовывоз', sub: 'г. Алматы, ул. Абая 150', price: 0 },
] as const;

function CartLineRow({
  line,
  onChange,
  onRemove,
}: {
  line: CartLine;
  onChange: (lineId: string, nextQuantity: number) => void;
  onRemove: (lineId: string) => void;
}) {
  return (
    <div
      style={{
        background: 'var(--surface)',
        border: '1px solid var(--line)',
        borderRadius: 'var(--r-lg)',
        padding: '20px 24px',
        display: 'grid',
        gridTemplateColumns: '56px 1fr auto',
        gap: 16,
        alignItems: 'center',
      }}
    >
      <div
        style={{
          width: 56,
          height: 56,
          borderRadius: 'var(--r-md)',
          background: 'linear-gradient(135deg, var(--clay-light), var(--bg-alt))',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          flexShrink: 0,
        }}
      >
        <span className="icon" style={{ fontSize: 28, color: 'var(--clay)', opacity: 0.5 }}>
          water_drop
        </span>
      </div>

      <div>
        <Link href={`/catalog/${line.slug}`} style={{ textDecoration: 'none' }}>
          <p style={{ fontWeight: 600, fontSize: 15, color: 'var(--ink)', marginBottom: 2 }}>{line.name}</p>
        </Link>
        <p style={{ fontSize: 13, color: 'var(--ink-3)' }}>{line.sub}</p>
        <p style={{ fontFamily: 'Manrope', fontWeight: 800, fontSize: 17, color: 'var(--ink)', marginTop: 6 }}>
          {(line.price * line.quantity).toLocaleString('ru-KZ')} ₸
        </p>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 12 }}>
        <button
          onClick={() => onRemove(line.id)}
          style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--ink-3)', padding: 4 }}
          aria-label="Удалить товар"
        >
          <span className="icon" style={{ fontSize: 18 }}>
            close
          </span>
        </button>
        <div style={{ display: 'flex', alignItems: 'center', border: '1.5px solid var(--line-2)', borderRadius: 'var(--r-sm)', overflow: 'hidden' }}>
          <button
            onClick={() => onChange(line.id, line.quantity - 1)}
            style={{ width: 32, height: 32, background: 'none', border: 'none', cursor: 'pointer', fontSize: 16, color: 'var(--ink-2)' }}
          >
            −
          </button>
          <span style={{ width: 32, textAlign: 'center', fontWeight: 700, fontSize: 14 }}>{line.quantity}</span>
          <button
            onClick={() => onChange(line.id, line.quantity + 1)}
            style={{ width: 32, height: 32, background: 'none', border: 'none', cursor: 'pointer', fontSize: 16, color: 'var(--ink-2)' }}
          >
            +
          </button>
        </div>
      </div>
    </div>
  );
}

export default function CartPage() {
  const [items, setItems] = useState<CartLine[]>([]);
  const [delivery, setDelivery] = useState<(typeof DELIVERY_OPTIONS)[number]['id']>('courier');
  const [promoCode, setPromoCode] = useState('');
  const [promoApplied, setPromoApplied] = useState(false);
  const [promoError, setPromoError] = useState('');

  useEffect(() => {
    setItems(getInitialCartLines());
  }, []);

  const subtotal = useMemo(() => getCartLineTotal(items), [items]);
  const deliveryPrice = DELIVERY_OPTIONS.find((option) => option.id === delivery)?.price ?? 0;
  const discount = promoApplied ? Math.round(subtotal * 0.1) : 0;
  const total = subtotal + deliveryPrice - discount;
  const lineCount = getCartLineCount(items);

  const syncUpdate = (lineId: string, nextQuantity: number) => {
    const next = updateCartLine(lineId, nextQuantity);
    setItems(next);
  };

  const syncRemove = (lineId: string) => {
    const next = removeCartLine(lineId);
    setItems(next);
  };

  const handleApplyPromo = () => {
    if (promoCode.trim().toUpperCase() === 'ADZEK10') {
      setPromoApplied(true);
      setPromoError('');
      return;
    }

    setPromoApplied(false);
    setPromoError('Промокод не найден');
  };

  if (items.length === 0) {
    return (
      <div style={{ minHeight: '100vh', background: 'var(--bg)', paddingTop: 'var(--header-h)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ textAlign: 'center', padding: 48, maxWidth: 440 }}>
          <span className="icon" style={{ fontSize: 80, color: 'var(--line-2)', display: 'block', marginBottom: 24 }}>
            shopping_cart
          </span>
          <h2 style={{ fontFamily: 'Manrope', fontWeight: 800, fontSize: 24, marginBottom: 12 }}>Корзина пуста</h2>
          <p style={{ color: 'var(--ink-2)', marginBottom: 32 }}>Добавьте товары из каталога, чтобы продолжить оформление.</p>
          <Link href="/catalog" className="btn btn-clay btn-lg">
            Перейти в каталог
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg)', paddingTop: 'var(--header-h)' }}>
      <div style={{ borderBottom: '1px solid var(--line)', padding: '20px var(--gutter)', background: 'var(--surface)' }}>
        <div style={{ maxWidth: 'var(--max-w)', margin: '0 auto' }}>
          <nav style={{ display: 'flex', gap: 8, fontSize: 13, color: 'var(--ink-3)', marginBottom: 8 }}>
            <Link href="/" style={{ color: 'var(--ink-3)', textDecoration: 'none' }}>
              Главная
            </Link>
            <span>/</span>
            <span style={{ color: 'var(--ink)', fontWeight: 600 }}>Корзина</span>
          </nav>
          <h1 style={{ fontFamily: 'Manrope', fontWeight: 800, fontSize: 28, letterSpacing: '-0.02em', color: 'var(--ink)' }}>
            Корзина · {lineCount} {lineCount === 1 ? 'товар' : lineCount < 5 ? 'товара' : 'товаров'}
          </h1>
        </div>
      </div>

      <div style={{ maxWidth: 'var(--max-w)', margin: '0 auto', padding: '32px var(--gutter) 64px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 360px', gap: 32, alignItems: 'start' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {items.map((item) => (
              <CartLineRow key={item.id} line={item} onChange={syncUpdate} onRemove={syncRemove} />
            ))}
          </div>

          <div style={{ position: 'sticky', top: 'calc(var(--header-h) + 24px)' }}>
            <div style={{ background: 'var(--surface)', border: '1px solid var(--line)', borderRadius: 'var(--r-lg)', overflow: 'hidden' }}>
              <div style={{ padding: '20px 24px', borderBottom: '1px solid var(--line)' }}>
                <p style={{ fontWeight: 700, fontSize: 12, letterSpacing: '0.08em', textTransform: 'uppercase', color: 'var(--ink-2)', marginBottom: 12 }}>
                  Доставка
                </p>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                  {DELIVERY_OPTIONS.map((option) => (
                    <label
                      key={option.id}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: 10,
                        cursor: 'pointer',
                        padding: '10px 12px',
                        borderRadius: 'var(--r-sm)',
                        background: delivery === option.id ? 'var(--clay-light)' : 'transparent',
                        border: `1.5px solid ${delivery === option.id ? 'var(--clay)' : 'var(--line)'}`,
                        transition: 'all 140ms',
                      }}
                    >
                      <input
                        type="radio"
                        name="delivery"
                        value={option.id}
                        checked={delivery === option.id}
                        onChange={() => setDelivery(option.id)}
                        style={{ accentColor: 'var(--clay)', flexShrink: 0 }}
                      />
                      <div style={{ flex: 1 }}>
                        <p style={{ fontWeight: 600, fontSize: 13, color: 'var(--ink)' }}>{option.label}</p>
                        <p style={{ fontSize: 11, color: 'var(--ink-3)' }}>{option.sub}</p>
                      </div>
                      <span style={{ fontWeight: 700, fontSize: 13, color: option.price === 0 ? 'var(--clay)' : 'var(--ink)', whiteSpace: 'nowrap' }}>
                        {option.price === 0 ? 'Бесплатно' : `${option.price.toLocaleString('ru-KZ')} ₸`}
                      </span>
                    </label>
                  ))}
                </div>
              </div>

              <div style={{ padding: '16px 24px', borderBottom: '1px solid var(--line)' }}>
                <p style={{ fontWeight: 700, fontSize: 12, letterSpacing: '0.08em', textTransform: 'uppercase', color: 'var(--ink-2)', marginBottom: 10 }}>
                  Промокод
                </p>
                <div style={{ display: 'flex', gap: 8 }}>
                  <input
                    className="input"
                    placeholder="ADZEK10"
                    value={promoCode}
                    onChange={(event) => {
                      setPromoCode(event.target.value);
                      setPromoError('');
                    }}
                    style={{ flex: 1, paddingTop: 8, paddingBottom: 8, fontSize: 13 }}
                  />
                  <button onClick={handleApplyPromo} className="btn btn-outline" style={{ padding: '8px 14px', fontSize: 13 }}>
                    Применить
                  </button>
                </div>
                {promoError && <p style={{ fontSize: 12, color: '#DC2626', marginTop: 6 }}>{promoError}</p>}
                {promoApplied && <p style={{ fontSize: 12, color: 'var(--clay)', fontWeight: 600, marginTop: 6 }}>✓ Скидка 10% применена</p>}
              </div>

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
