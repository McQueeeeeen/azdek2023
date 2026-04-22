'use client';

import Link from 'next/link';
import { useState } from 'react';

const KZ_CITIES = ['Алматы','Нур-Султан','Шымкент','Актобе','Актау','Атырау','Өскемен','Кокшетау','Костанай','Павлодар','Петропавловск','Тараз','Туркестан','Уральск','Жанаозен','Кызылорда','Семей'];

const ORDER_ITEMS = [
  { name: 'Гель для посуды «Мята и Лайм»', sub: '500 мл × 2', price: 1780 },
  { name: 'Спрей для поверхностей', sub: '750 мл × 1', price: 1290 },
  { name: 'Универсальный дезинфектант', sub: '500 мл × 1', price: 1190 },
];

const STEPS = ['Адрес', 'Доставка', 'Оплата', 'Подтверждение'];

export default function CheckoutPage() {
  const [step, setStep] = useState(1);
  const [form, setForm] = useState({
    firstName: '', lastName: '', phone: '', email: '',
    city: '', street: '', house: '', apt: '', zip: '',
    delivery: 'courier', payment: 'card', comment: '',
    saveAddress: false, newsletter: false,
  });
  const [placed, setPlaced] = useState(false);

  const subtotal = ORDER_ITEMS.reduce((s, i) => s + i.price, 0);
  const deliveryCost = form.delivery === 'courier' ? 1500 : form.delivery === 'kazpost' ? 900 : 0;
  const total = subtotal + deliveryCost;

  const set = (field: string, value: string | boolean) =>
    setForm(prev => ({ ...prev, [field]: value }));

  const canNext = () => {
    if (step === 1) return form.firstName && form.lastName && form.phone && form.city && form.street && form.house;
    if (step === 2) return !!form.delivery;
    if (step === 3) return !!form.payment;
    return true;
  };

  if (placed) {
    return (
      <div style={{ minHeight: '100vh', background: 'var(--bg)', paddingTop: 'var(--header-h)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ textAlign: 'center', padding: 48, maxWidth: 480 }}>
          <div style={{ width: 80, height: 80, borderRadius: '50%', background: 'var(--clay)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 24px' }}>
            <span className="icon" style={{ fontSize: 40, color: '#fff' }}>check</span>
          </div>
          <h2 style={{ fontFamily: 'Manrope', fontWeight: 800, fontSize: 28, letterSpacing: '-0.02em', marginBottom: 12 }}>Заказ оформлен!</h2>
          <p style={{ color: 'var(--ink-2)', fontSize: 15, lineHeight: 1.6, marginBottom: 8 }}>
            Номер заказа: <strong>#AZ-{Math.floor(Math.random() * 90000) + 10000}</strong>
          </p>
          <p style={{ color: 'var(--ink-2)', fontSize: 14, marginBottom: 32 }}>
            Подтверждение отправлено на {form.email || 'вашу почту'}. Мы свяжемся с вами в ближайшее время.
          </p>
          <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap' }}>
            <Link href="/profile" className="btn btn-clay btn-lg">Мои заказы</Link>
            <Link href="/catalog" className="btn btn-outline btn-lg">Продолжить покупки</Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg)', paddingTop: 'var(--header-h)' }}>

      {/* Header */}
      <div style={{ borderBottom: '1px solid var(--line)', padding: '20px var(--gutter)', background: 'var(--surface)' }}>
        <div style={{ maxWidth: 'var(--max-w)', margin: '0 auto' }}>
          <nav style={{ display: 'flex', gap: 8, fontSize: 13, color: 'var(--ink-3)', marginBottom: 12 }}>
            <Link href="/" style={{ color: 'var(--ink-3)', textDecoration: 'none' }}>Главная</Link>
            <span>/</span>
            <Link href="/cart" style={{ color: 'var(--ink-3)', textDecoration: 'none' }}>Корзина</Link>
            <span>/</span>
            <span style={{ color: 'var(--ink)', fontWeight: 600 }}>Оформление</span>
          </nav>

          {/* Step indicator */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 0 }}>
            {STEPS.map((label, i) => {
              const n = i + 1;
              const active = n === step;
              const done = n < step;
              return (
                <div key={n} style={{ display: 'flex', alignItems: 'center' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <div style={{
                      width: 28, height: 28, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center',
                      background: done ? 'var(--clay)' : active ? 'var(--ink)' : 'var(--line-2)',
                      color: done || active ? '#fff' : 'var(--ink-3)',
                      fontSize: 13, fontWeight: 700, flexShrink: 0,
                    }}>
                      {done ? <span className="icon" style={{ fontSize: 16 }}>check</span> : n}
                    </div>
                    <span style={{ fontSize: 13, fontWeight: active ? 700 : 500, color: active ? 'var(--ink)' : done ? 'var(--clay)' : 'var(--ink-3)' }}>
                      {label}
                    </span>
                  </div>
                  {i < STEPS.length - 1 && (
                    <div style={{ width: 40, height: 1, background: n < step ? 'var(--clay)' : 'var(--line-2)', margin: '0 12px' }} />
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>

      <div style={{ maxWidth: 'var(--max-w)', margin: '0 auto', padding: '32px var(--gutter) 64px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 340px', gap: 32, alignItems: 'start' }}>

          {/* Form panel */}
          <div style={{ background: 'var(--surface)', border: '1px solid var(--line)', borderRadius: 'var(--r-lg)', padding: '32px' }}>

            {/* Step 1: Address */}
            {step === 1 && (
              <div>
                <h2 style={{ fontFamily: 'Manrope', fontWeight: 800, fontSize: 20, marginBottom: 24 }}>Адрес доставки</h2>
                <div className="signup-form">
                  <div className="form-row">
                    <div className="form-group">
                      <label className="form-label">Имя</label>
                      <input className="input" placeholder="Алибек" value={form.firstName} onChange={e => set('firstName', e.target.value)} />
                    </div>
                    <div className="form-group">
                      <label className="form-label">Фамилия</label>
                      <input className="input" placeholder="Жаксыбеков" value={form.lastName} onChange={e => set('lastName', e.target.value)} />
                    </div>
                  </div>
                  <div className="form-row">
                    <div className="form-group">
                      <label className="form-label">Телефон</label>
                      <input className="input" placeholder="+7 (XXX) XXX-XX-XX" value={form.phone} onChange={e => set('phone', e.target.value)} />
                    </div>
                    <div className="form-group">
                      <label className="form-label">Email</label>
                      <input className="input" type="email" placeholder="you@example.com" value={form.email} onChange={e => set('email', e.target.value)} />
                    </div>
                  </div>
                  <div className="form-group">
                    <label className="form-label">Город</label>
                    <select className="input" value={form.city} onChange={e => set('city', e.target.value)}>
                      <option value="">Выберите город...</option>
                      {KZ_CITIES.map(c => <option key={c} value={c}>{c}</option>)}
                    </select>
                  </div>
                  <div className="form-group">
                    <label className="form-label">Улица</label>
                    <input className="input" placeholder="ул. Абая" value={form.street} onChange={e => set('street', e.target.value)} />
                  </div>
                  <div className="form-row">
                    <div className="form-group">
                      <label className="form-label">Дом / корпус</label>
                      <input className="input" placeholder="12А" value={form.house} onChange={e => set('house', e.target.value)} />
                    </div>
                    <div className="form-group">
                      <label className="form-label">Квартира</label>
                      <input className="input" placeholder="45" value={form.apt} onChange={e => set('apt', e.target.value)} />
                    </div>
                  </div>
                  <div className="form-checkbox">
                    <input type="checkbox" id="save" checked={form.saveAddress} onChange={e => set('saveAddress', e.target.checked)} />
                    <label htmlFor="save">Сохранить адрес для следующих заказов</label>
                  </div>
                </div>
              </div>
            )}

            {/* Step 2: Delivery */}
            {step === 2 && (
              <div>
                <h2 style={{ fontFamily: 'Manrope', fontWeight: 800, fontSize: 20, marginBottom: 24 }}>Способ доставки</h2>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                  {[
                    { id: 'courier', icon: 'local_shipping', label: 'Курьер', sub: 'До двери · 1–2 дня', price: 1500 },
                    { id: 'kazpost', icon: 'mail', label: 'Казпочта', sub: 'Почтовое отделение · 3–7 дней', price: 900 },
                    { id: 'pickup', icon: 'store', label: 'Самовывоз', sub: 'г. Алматы, ул. Абая 150', price: 0 },
                  ].map(opt => (
                    <label key={opt.id} onClick={() => set('delivery', opt.id)} style={{ display: 'flex', alignItems: 'center', gap: 16, cursor: 'pointer', padding: '16px 20px', borderRadius: 'var(--r-md)', border: `2px solid ${form.delivery === opt.id ? 'var(--clay)' : 'var(--line)'}`, background: form.delivery === opt.id ? 'var(--clay-light)' : 'var(--surface)', transition: 'all 140ms' }}>
                      <input type="radio" name="delivery" value={opt.id} checked={form.delivery === opt.id} readOnly style={{ accentColor: 'var(--clay)' }} />
                      <span className="icon" style={{ fontSize: 28, color: form.delivery === opt.id ? 'var(--clay)' : 'var(--ink-3)' }}>{opt.icon}</span>
                      <div style={{ flex: 1 }}>
                        <p style={{ fontWeight: 700, fontSize: 15, color: 'var(--ink)' }}>{opt.label}</p>
                        <p style={{ fontSize: 13, color: 'var(--ink-3)' }}>{opt.sub}</p>
                      </div>
                      <span style={{ fontFamily: 'Manrope', fontWeight: 800, fontSize: 16, color: opt.price === 0 ? 'var(--clay)' : 'var(--ink)' }}>
                        {opt.price === 0 ? 'Бесплатно' : `${opt.price.toLocaleString('ru-KZ')} ₸`}
                      </span>
                    </label>
                  ))}
                </div>
                <div className="form-group" style={{ marginTop: 24 }}>
                  <label className="form-label">Комментарий к заказу</label>
                  <input className="input" placeholder="Позвоните за час до доставки..." value={form.comment} onChange={e => set('comment', e.target.value)} />
                </div>
              </div>
            )}

            {/* Step 3: Payment */}
            {step === 3 && (
              <div>
                <h2 style={{ fontFamily: 'Manrope', fontWeight: 800, fontSize: 20, marginBottom: 24 }}>Способ оплаты</h2>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                  {[
                    { id: 'card', icon: 'credit_card', label: 'Банковская карта', sub: 'Visa, Mastercard, Мир' },
                    { id: 'kaspi', icon: 'account_balance_wallet', label: 'Kaspi Pay', sub: 'Оплата через Kaspi' },
                    { id: 'cash', icon: 'payments', label: 'Наличными', sub: 'При получении курьеру' },
                  ].map(opt => (
                    <label key={opt.id} onClick={() => set('payment', opt.id)} style={{ display: 'flex', alignItems: 'center', gap: 16, cursor: 'pointer', padding: '16px 20px', borderRadius: 'var(--r-md)', border: `2px solid ${form.payment === opt.id ? 'var(--clay)' : 'var(--line)'}`, background: form.payment === opt.id ? 'var(--clay-light)' : 'var(--surface)', transition: 'all 140ms' }}>
                      <input type="radio" name="payment" value={opt.id} checked={form.payment === opt.id} readOnly style={{ accentColor: 'var(--clay)' }} />
                      <span className="icon" style={{ fontSize: 28, color: form.payment === opt.id ? 'var(--clay)' : 'var(--ink-3)' }}>{opt.icon}</span>
                      <div>
                        <p style={{ fontWeight: 700, fontSize: 15, color: 'var(--ink)' }}>{opt.label}</p>
                        <p style={{ fontSize: 13, color: 'var(--ink-3)' }}>{opt.sub}</p>
                      </div>
                    </label>
                  ))}
                </div>
                <div className="form-checkbox" style={{ marginTop: 20 }}>
                  <input type="checkbox" id="news" checked={form.newsletter} onChange={e => set('newsletter', e.target.checked)} />
                  <label htmlFor="news">Получать акции и новости Adzek на email</label>
                </div>
              </div>
            )}

            {/* Step 4: Confirm */}
            {step === 4 && (
              <div>
                <h2 style={{ fontFamily: 'Manrope', fontWeight: 800, fontSize: 20, marginBottom: 24 }}>Проверьте заказ</h2>
                {[
                  { label: 'Получатель', value: `${form.firstName} ${form.lastName}` },
                  { label: 'Телефон', value: form.phone },
                  { label: 'Email', value: form.email },
                  { label: 'Адрес', value: `${form.city}, ${form.street} ${form.house}${form.apt ? `, кв. ${form.apt}` : ''}` },
                  { label: 'Доставка', value: form.delivery === 'courier' ? 'Курьер (1 500 ₸)' : form.delivery === 'kazpost' ? 'Казпочта (900 ₸)' : 'Самовывоз (бесплатно)' },
                  { label: 'Оплата', value: form.payment === 'card' ? 'Банковская карта' : form.payment === 'kaspi' ? 'Kaspi Pay' : 'Наличными' },
                ].map(row => (
                  <div key={row.label} style={{ display: 'flex', justifyContent: 'space-between', padding: '12px 0', borderBottom: '1px solid var(--line)', fontSize: 14 }}>
                    <span style={{ color: 'var(--ink-2)' }}>{row.label}</span>
                    <span style={{ fontWeight: 600, color: 'var(--ink)' }}>{row.value || '—'}</span>
                  </div>
                ))}
              </div>
            )}

            {/* Navigation buttons */}
            <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 32, gap: 12 }}>
              {step > 1 ? (
                <button onClick={() => setStep(s => s - 1)} className="btn btn-outline btn-lg">
                  ← Назад
                </button>
              ) : (
                <Link href="/cart" className="btn btn-outline btn-lg">← Корзина</Link>
              )}
              {step < 4 ? (
                <button onClick={() => canNext() && setStep(s => s + 1)} className="btn btn-clay btn-lg" style={{ opacity: canNext() ? 1 : 0.5 }}>
                  Далее →
                </button>
              ) : (
                <button onClick={() => setPlaced(true)} className="btn btn-clay btn-lg">
                  Подтвердить заказ
                </button>
              )}
            </div>
          </div>

          {/* Order summary */}
          <div style={{ position: 'sticky', top: 'calc(var(--header-h) + 24px)', background: 'var(--surface)', border: '1px solid var(--line)', borderRadius: 'var(--r-lg)', overflow: 'hidden' }}>
            <div style={{ padding: '20px 24px', borderBottom: '1px solid var(--line)' }}>
              <p style={{ fontWeight: 700, fontSize: 12, letterSpacing: '0.08em', textTransform: 'uppercase', color: 'var(--ink-2)', marginBottom: 16 }}>Ваш заказ</p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                {ORDER_ITEMS.map((item, i) => (
                  <div key={i} style={{ display: 'flex', justifyContent: 'space-between', gap: 12 }}>
                    <div>
                      <p style={{ fontSize: 13, fontWeight: 600, color: 'var(--ink)' }}>{item.name}</p>
                      <p style={{ fontSize: 12, color: 'var(--ink-3)' }}>{item.sub}</p>
                    </div>
                    <span style={{ fontWeight: 700, fontSize: 13, whiteSpace: 'nowrap', color: 'var(--ink)' }}>{item.price.toLocaleString('ru-KZ')} ₸</span>
                  </div>
                ))}
              </div>
            </div>
            <div style={{ padding: '16px 24px' }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13, color: 'var(--ink-2)' }}>
                  <span>Товары</span><span>{subtotal.toLocaleString('ru-KZ')} ₸</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13, color: 'var(--ink-2)' }}>
                  <span>Доставка</span>
                  <span>{deliveryCost === 0 ? 'Бесплатно' : `${deliveryCost.toLocaleString('ru-KZ')} ₸`}</span>
                </div>
                <div style={{ height: 1, background: 'var(--line)', margin: '4px 0' }} />
                <div style={{ display: 'flex', justifyContent: 'space-between', fontFamily: 'Manrope', fontWeight: 800, fontSize: 18, letterSpacing: '-0.02em', color: 'var(--ink)' }}>
                  <span>Итого</span><span>{total.toLocaleString('ru-KZ')} ₸</span>
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
