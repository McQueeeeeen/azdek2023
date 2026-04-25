'use client';

import Link from 'next/link';
import { useEffect, useMemo, useState } from 'react';
import { useCartStore, type CartLine } from '@/store/useCartStore';
import { CATALOG_PRODUCTS } from '@/lib/catalog-data';

const KZ_CITIES = ['Астана', 'Алматы', 'Шымкент', 'Караганда', 'Актобе', 'Тараз', 'Павлодар', 'Усть-Каменогорск', 'Семей', 'Атырау', 'Костанай', 'Кызылорда', 'Уральск', 'Петропавловск', 'Актау', 'Темиртау', 'Туркестан'];

const STEPS = ['Адрес', 'Доставка', 'Оплата', 'Подтверждение'];

const DELIVERY_OPTIONS = [
  { id: 'courier', icon: 'local_shipping', label: 'Курьер', sub: 'До двери · 1–2 дня', price: 1500 },
  { id: 'kazpost', icon: 'mail', label: 'Казпочта', sub: 'Почтовое отделение · 3–7 дней', price: 900 },
  { id: 'pickup', icon: 'store', label: 'Самовывоз', sub: 'г. Алматы, ул. Абая 150', price: 0 },
] as const;

const PAYMENT_OPTIONS = [
  { id: 'card', icon: 'credit_card', label: 'Банковская карта', sub: 'Visa, Mastercard, Мир' },
  { id: 'kaspi', icon: 'account_balance_wallet', label: 'Kaspi Pay', sub: 'Оплата через Kaspi' },
  { id: 'cash', icon: 'payments', label: 'Наличными', sub: 'При получении курьеру' },
] as const;

type CheckoutStep = 1 | 2 | 3 | 4;

function formatCartItems(lines: CartLine[]) {
  return lines
    .map((line) => {
      const product = CATALOG_PRODUCTS.find((item) => item.slug === line.slug);
      return {
        name: product?.name ?? line.name,
        sub: `${line.sub} × ${line.quantity}`,
        price: line.price * line.quantity,
      };
    })
    .filter(Boolean);
}

export default function CheckoutPage() {
  const [step, setStep] = useState<CheckoutStep>(1);
  const items = useCartStore((state) => state.items);
  const subtotal = useCartStore((state) => state.getTotal());
  const lineCount = useCartStore((state) => state.getCount());
  const clearCart = useCartStore((state) => state.clearCart);
  
  const [form, setForm] = useState({
    firstName: '',
    lastName: '',
    phone: '',
    email: '',
    city: '',
    street: '',
    house: '',
    apt: '',
    zip: '',
    delivery: 'courier',
    payment: 'card',
    comment: '',
    saveAddress: false,
    newsletter: false,
  });
  const [placed, setPlaced] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  
  const deliveryCost = form.delivery === 'courier' ? 1500 : form.delivery === 'kazpost' ? 900 : 0;
  const total = subtotal + deliveryCost;
  
  const displayItems = useMemo(() => formatCartItems(items), [items]);

  const set = (field: string, value: string | boolean) => {
    setForm((current) => ({ ...current, [field]: value }));
  };

  const canContinue = () => {
    if (step === 1) return Boolean(form.firstName && form.lastName && form.phone && form.city && form.street && form.house);
    if (step === 2) return Boolean(form.delivery);
    if (step === 3) return Boolean(form.payment);
    return true;
  };

  const handleConfirm = () => {
    clearCart();
    setPlaced(true);
  };

  if (!mounted) return null;

  if (items.length === 0 && !placed) {
    return (
      <div style={{ minHeight: '100vh', background: 'var(--bg)', paddingTop: 'var(--header-h)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ textAlign: 'center', padding: 48, maxWidth: 480 }}>
          <span className="icon" style={{ fontSize: 80, color: 'var(--line-2)', display: 'block', marginBottom: 24 }}>
            shopping_cart
          </span>
          <h2 style={{ fontFamily: 'Manrope', fontWeight: 800, fontSize: 28, marginBottom: 12 }}>Оформление пока недоступно</h2>
          <p style={{ color: 'var(--ink-2)', fontSize: 15, lineHeight: 1.6, marginBottom: 32 }}>
            В корзине нет товаров. Вернитесь в каталог и добавьте продукты перед оформлением.
          </p>
          <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap' }}>
            <Link href="/catalog" className="btn btn-clay btn-lg">
              В каталог
            </Link>
            <Link href="/cart" className="btn btn-outline btn-lg">
              В корзину
            </Link>
          </div>
        </div>
      </div>
    );
  }

  if (placed) {
    const orderNumber = `#AZ-${Math.floor(Math.random() * 90000) + 10000}`;

    return (
      <div style={{ minHeight: '100vh', background: 'var(--bg)', paddingTop: 'var(--header-h)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ textAlign: 'center', padding: 48, maxWidth: 520 }}>
          <div style={{ width: 80, height: 80, borderRadius: '50%', background: 'var(--clay)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 24px' }}>
            <span className="icon" style={{ fontSize: 40, color: '#fff' }}>
              check
            </span>
          </div>
          <h2 style={{ fontFamily: 'Manrope', fontWeight: 800, fontSize: 28, letterSpacing: '-0.02em', marginBottom: 12 }}>Заказ оформлен</h2>
          <p style={{ color: 'var(--ink-2)', fontSize: 15, lineHeight: 1.6, marginBottom: 8 }}>
            Номер заказа: <strong>{orderNumber}</strong>
          </p>
          <p style={{ color: 'var(--ink-2)', fontSize: 14, marginBottom: 32 }}>
            Подтверждение отправлено на {form.email || 'вашу почту'}. Мы свяжемся с вами в ближайшее время.
          </p>
          <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap' }}>
            <Link href="/profile" className="btn btn-clay btn-lg">
              Мои заказы
            </Link>
            <Link href="/catalog" className="btn btn-outline btn-lg">
              Продолжить покупки
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg)', paddingTop: 'var(--header-h)' }}>
      <div style={{ borderBottom: '1px solid var(--line)', padding: '20px var(--gutter)', background: 'var(--surface)' }}>
        <div style={{ maxWidth: 'var(--max-w)', margin: '0 auto' }}>
          <nav style={{ display: 'flex', gap: 8, fontSize: 13, color: 'var(--ink-3)', marginBottom: 12 }}>
            <Link href="/" style={{ color: 'var(--ink-3)', textDecoration: 'none' }}>
              Главная
            </Link>
            <span>/</span>
            <Link href="/cart" style={{ color: 'var(--ink-3)', textDecoration: 'none' }}>
              Корзина
            </Link>
            <span>/</span>
            <span style={{ color: 'var(--ink)', fontWeight: 600 }}>Оформление</span>
          </nav>

          <div style={{ display: 'flex', alignItems: 'center', gap: 0, flexWrap: 'wrap' }}>
            {STEPS.map((label, index) => {
              const stepNumber = (index + 1) as CheckoutStep;
              const active = stepNumber === step;
              const done = stepNumber < step;

              return (
                <div key={stepNumber} style={{ display: 'flex', alignItems: 'center' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <div
                      style={{
                        width: 28,
                        height: 28,
                        borderRadius: '50%',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        background: done ? 'var(--clay)' : active ? 'var(--ink)' : 'var(--line-2)',
                        color: done || active ? '#fff' : 'var(--ink-3)',
                        fontSize: 13,
                        fontWeight: 700,
                        flexShrink: 0,
                      }}
                    >
                      {done ? <span className="icon" style={{ fontSize: 16 }}>check</span> : stepNumber}
                    </div>
                    <span style={{ fontSize: 13, fontWeight: active ? 700 : 500, color: active ? 'var(--ink)' : done ? 'var(--clay)' : 'var(--ink-3)' }}>
                      {label}
                    </span>
                  </div>
                  {index < STEPS.length - 1 && (
                    <div style={{ width: 40, height: 1, background: stepNumber < step ? 'var(--clay)' : 'var(--line-2)', margin: '0 12px' }} />
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>

      <div style={{ maxWidth: 'var(--max-w)', margin: '0 auto', padding: '32px var(--gutter) 64px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 340px', gap: 32, alignItems: 'start' }}>
          <div style={{ background: 'var(--surface)', border: '1px solid var(--line)', borderRadius: 'var(--r-lg)', padding: '32px' }}>
            {step === 1 && (
              <div>
                <h2 style={{ fontFamily: 'Manrope', fontWeight: 800, fontSize: 20, marginBottom: 24 }}>Адрес доставки</h2>
                <div className="signup-form">
                  <div className="form-row">
                    <div className="form-group">
                      <label className="form-label">Имя</label>
                      <input className="input" placeholder="Алибек" value={form.firstName} onChange={(event) => set('firstName', event.target.value)} />
                    </div>
                    <div className="form-group">
                      <label className="form-label">Фамилия</label>
                      <input className="input" placeholder="Жаксыбеков" value={form.lastName} onChange={(event) => set('lastName', event.target.value)} />
                    </div>
                  </div>

                  <div className="form-row">
                    <div className="form-group">
                      <label className="form-label">Телефон</label>
                      <input className="input" placeholder="+7 7XX XXX XX XX" value={form.phone} onChange={(event) => set('phone', event.target.value)} />
                    </div>
                    <div className="form-group">
                      <label className="form-label">Email</label>
                      <input className="input" type="email" placeholder="you@example.com" value={form.email} onChange={(event) => set('email', event.target.value)} />
                    </div>
                  </div>

                  <div className="form-group">
                    <label className="form-label">Город</label>
                    <select className="input" value={form.city} onChange={(event) => set('city', event.target.value)}>
                      <option value="">Выберите город...</option>
                      {KZ_CITIES.map((city) => (
                        <option key={city} value={city}>
                          {city}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="form-group">
                    <label className="form-label">Улица</label>
                    <input className="input" placeholder="ул. Абая" value={form.street} onChange={(event) => set('street', event.target.value)} />
                  </div>

                  <div className="form-row">
                    <div className="form-group">
                      <label className="form-label">Дом / корпус</label>
                      <input className="input" placeholder="12А" value={form.house} onChange={(event) => set('house', event.target.value)} />
                    </div>
                    <div className="form-group">
                      <label className="form-label">Квартира</label>
                      <input className="input" placeholder="45" value={form.apt} onChange={(event) => set('apt', event.target.value)} />
                    </div>
                  </div>

                  <div className="form-group">
                    <label className="form-label">Индекс</label>
                    <input className="input" placeholder="010000" value={form.zip} onChange={(event) => set('zip', event.target.value)} />
                  </div>

                  <div className="form-checkbox">
                    <input type="checkbox" id="save" checked={form.saveAddress} onChange={(event) => set('saveAddress', event.target.checked)} />
                    <label htmlFor="save">Сохранить адрес для следующих заказов</label>
                  </div>
                </div>
              </div>
            )}

            {step === 2 && (
              <div>
                <h2 style={{ fontFamily: 'Manrope', fontWeight: 800, fontSize: 20, marginBottom: 24 }}>Способ доставки</h2>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                  {DELIVERY_OPTIONS.map((option) => (
                    <label
                      key={option.id}
                      onClick={() => set('delivery', option.id)}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: 16,
                        cursor: 'pointer',
                        padding: '16px 20px',
                        borderRadius: 'var(--r-md)',
                        border: `2px solid ${form.delivery === option.id ? 'var(--clay)' : 'var(--line)'}`,
                        background: form.delivery === option.id ? 'var(--clay-light)' : 'var(--surface)',
                        transition: 'all 140ms',
                      }}
                    >
                      <input type="radio" name="delivery" value={option.id} checked={form.delivery === option.id} readOnly style={{ accentColor: 'var(--clay)' }} />
                      <span className="icon" style={{ fontSize: 28, color: form.delivery === option.id ? 'var(--clay)' : 'var(--ink-3)' }}>
                        {option.icon}
                      </span>
                      <div style={{ flex: 1 }}>
                        <p style={{ fontWeight: 700, fontSize: 15, color: 'var(--ink)' }}>{option.label}</p>
                        <p style={{ fontSize: 13, color: 'var(--ink-3)' }}>{option.sub}</p>
                      </div>
                      <span style={{ fontFamily: 'Manrope', fontWeight: 800, fontSize: 16, color: option.price === 0 ? 'var(--clay)' : 'var(--ink)' }}>
                        {option.price === 0 ? 'Бесплатно' : `${option.price.toLocaleString('ru-KZ')} ₸`}
                      </span>
                    </label>
                  ))}
                </div>
                <div className="form-group" style={{ marginTop: 24 }}>
                  <label className="form-label">Комментарий к заказу</label>
                  <input className="input" placeholder="Позвоните за час до доставки..." value={form.comment} onChange={(event) => set('comment', event.target.value)} />
                </div>
              </div>
            )}

            {step === 3 && (
              <div>
                <h2 style={{ fontFamily: 'Manrope', fontWeight: 800, fontSize: 20, marginBottom: 24 }}>Способ оплаты</h2>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                  {PAYMENT_OPTIONS.map((option) => (
                    <label
                      key={option.id}
                      onClick={() => set('payment', option.id)}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: 16,
                        cursor: 'pointer',
                        padding: '16px 20px',
                        borderRadius: 'var(--r-md)',
                        border: `2px solid ${form.payment === option.id ? 'var(--clay)' : 'var(--line)'}`,
                        background: form.payment === option.id ? 'var(--clay-light)' : 'var(--surface)',
                        transition: 'all 140ms',
                      }}
                    >
                      <input type="radio" name="payment" value={option.id} checked={form.payment === option.id} readOnly style={{ accentColor: 'var(--clay)' }} />
                      <span className="icon" style={{ fontSize: 28, color: form.payment === option.id ? 'var(--clay)' : 'var(--ink-3)' }}>
                        {option.icon}
                      </span>
                      <div>
                        <p style={{ fontWeight: 700, fontSize: 15, color: 'var(--ink)' }}>{option.label}</p>
                        <p style={{ fontSize: 13, color: 'var(--ink-3)' }}>{option.sub}</p>
                      </div>
                    </label>
                  ))}
                </div>

                <div className="form-checkbox" style={{ marginTop: 20 }}>
                  <input type="checkbox" id="news" checked={form.newsletter} onChange={(event) => set('newsletter', event.target.checked)} />
                  <label htmlFor="news">Получать акции и новости Adzek на email</label>
                </div>
              </div>
            )}

            {step === 4 && (
              <div>
                <h2 style={{ fontFamily: 'Manrope', fontWeight: 800, fontSize: 20, marginBottom: 24 }}>Проверьте заказ</h2>
                <div style={{ display: 'grid', gap: 12 }}>
                  {[
                    { label: 'Получатель', value: `${form.firstName} ${form.lastName}`.trim() },
                    { label: 'Телефон', value: form.phone },
                    { label: 'Email', value: form.email },
                    { label: 'Адрес', value: `${form.city}, ${form.street} ${form.house}${form.apt ? `, кв. ${form.apt}` : ''}`.trim() },
                    { label: 'Доставка', value: form.delivery === 'courier' ? 'Курьер (1 500 ₸)' : form.delivery === 'kazpost' ? 'Казпочта (900 ₸)' : 'Самовывоз (бесплатно)' },
                    { label: 'Оплата', value: form.payment === 'card' ? 'Банковская карта' : form.payment === 'kaspi' ? 'Kaspi Pay' : 'Наличными' },
                  ].map((row) => (
                    <div key={row.label} style={{ display: 'flex', justifyContent: 'space-between', padding: '12px 0', borderBottom: '1px solid var(--line)', fontSize: 14 }}>
                      <span style={{ color: 'var(--ink-2)' }}>{row.label}</span>
                      <span style={{ fontWeight: 600, color: 'var(--ink)' }}>{row.value || '—'}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 32, gap: 12, flexWrap: 'wrap' }}>
              {step > 1 ? (
                <button onClick={() => setStep((current) => (current - 1) as CheckoutStep)} className="btn btn-outline btn-lg">
                  ← Назад
                </button>
              ) : (
                <Link href="/cart" className="btn btn-outline btn-lg">
                  ← Корзина
                </Link>
              )}

              {step < 4 ? (
                <button
                  onClick={() => {
                    if (canContinue()) {
                      setStep((current) => (current + 1) as CheckoutStep);
                    }
                  }}
                  className="btn btn-clay btn-lg"
                  style={{ opacity: canContinue() ? 1 : 0.5 }}
                >
                  Далее →
                </button>
              ) : (
                <button onClick={handleConfirm} className="btn btn-clay btn-lg">
                  Подтвердить заказ
                </button>
              )}
            </div>
          </div>

          <div style={{ position: 'sticky', top: 'calc(var(--header-h) + 24px)', background: 'var(--surface)', border: '1px solid var(--line)', borderRadius: 'var(--r-lg)', overflow: 'hidden' }}>
            <div style={{ padding: '20px 24px', borderBottom: '1px solid var(--line)' }}>
              <p style={{ fontWeight: 700, fontSize: 12, letterSpacing: '0.08em', textTransform: 'uppercase', color: 'var(--ink-2)', marginBottom: 16 }}>
                Ваш заказ
              </p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                {displayItems.map((item, index) => (
                  <div key={`${item.name}-${index}`} style={{ display: 'flex', justifyContent: 'space-between', gap: 12 }}>
                    <div>
                      <p style={{ fontSize: 13, fontWeight: 600, color: 'var(--ink)' }}>{item.name}</p>
                      <p style={{ fontSize: 12, color: 'var(--ink-3)' }}>{item.sub}</p>
                    </div>
                    <span style={{ fontWeight: 700, fontSize: 13, whiteSpace: 'nowrap', color: 'var(--ink)' }}>
                      {item.price.toLocaleString('ru-KZ')} ₸
                    </span>
                  </div>
                ))}
              </div>
            </div>

            <div style={{ padding: '16px 24px' }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13, color: 'var(--ink-2)' }}>
                  <span>Товары</span>
                  <span>{subtotal.toLocaleString('ru-KZ')} ₸</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13, color: 'var(--ink-2)' }}>
                  <span>Доставка</span>
                  <span>{deliveryCost === 0 ? 'Бесплатно' : `${deliveryCost.toLocaleString('ru-KZ')} ₸`}</span>
                </div>
                <div style={{ height: 1, background: 'var(--line)', margin: '4px 0' }} />
                <div style={{ display: 'flex', justifyContent: 'space-between', fontFamily: 'Manrope', fontWeight: 800, fontSize: 18, letterSpacing: '-0.02em', color: 'var(--ink)' }}>
                  <span>Итого</span>
                  <span>{total.toLocaleString('ru-KZ')} ₸</span>
                </div>
                <p style={{ fontSize: 12, color: 'var(--ink-3)', marginTop: 6 }}>
                  Товаров в корзине: {lineCount}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
