'use client';

import Link from 'next/link';
import { useState } from 'react';
import { clearAuthSession } from '@/lib/api';

const TABS = [
  { id: 'orders', label: 'Заказы', icon: 'receipt_long' },
  { id: 'loyalty', label: 'Бонусы', icon: 'stars' },
  { id: 'addresses', label: 'Адреса', icon: 'location_on' },
  { id: 'settings', label: 'Настройки', icon: 'settings' },
];

const ORDERS = [
  { id: 'AZ-48291', date: '18 апр 2026', status: 'delivered', statusLabel: 'Доставлен', total: 5760, items: 3 },
  { id: 'AZ-37104', date: '02 апр 2026', status: 'processing', statusLabel: 'В обработке', total: 2180, items: 2 },
  { id: 'AZ-29553', date: '15 мар 2026', status: 'delivered', statusLabel: 'Доставлен', total: 3490, items: 4 },
  { id: 'AZ-18802', date: '01 мар 2026', status: 'cancelled', statusLabel: 'Отменён', total: 1190, items: 1 },
];

const LOYALTY_HISTORY = [
  { date: '18 апр 2026', desc: 'Заказ #AZ-48291', points: +286, type: 'earn' },
  { date: '02 апр 2026', desc: 'Заказ #AZ-37104', points: +109, type: 'earn' },
  { date: '01 апр 2026', desc: 'Скидка по бонусам', points: -200, type: 'spend' },
  { date: '15 мар 2026', desc: 'Заказ #AZ-29553', points: +174, type: 'earn' },
];

const STATUS_COLORS: Record<string, { bg: string; color: string }> = {
  delivered: { bg: '#DCFCE7', color: '#166534' },
  processing: { bg: '#FEF9C3', color: '#854D0E' },
  shipping: { bg: '#DBEAFE', color: '#1E40AF' },
  cancelled: { bg: '#FEE2E2', color: '#991B1B' },
};

function formatKazakhstanPhone(value: string): string {
  const digits = value.replace(/\D/g, '');
  if (!digits) {
    return '';
  }

  const normalized = digits.startsWith('8')
    ? `7${digits.slice(1)}`
    : digits.startsWith('7')
      ? digits
      : `7${digits}`;

  const trimmed = normalized.slice(0, 11);
  const national = trimmed.slice(1);

  let formatted = '+7';
  if (national.length > 0) formatted += ` ${national.slice(0, 3)}`;
  if (national.length > 3) formatted += ` ${national.slice(3, 6)}`;
  if (national.length > 6) formatted += ` ${national.slice(6, 8)}`;
  if (national.length > 8) formatted += ` ${national.slice(8, 10)}`;
  return formatted;
}

export default function ProfilePage() {
  const [tab, setTab] = useState('orders');
  const [editing, setEditing] = useState(false);
  const [profile, setProfile] = useState({ firstName: 'Алибек', lastName: 'Жаксыбеков', email: 'alibek@example.com', phone: formatKazakhstanPhone('+7 (701) 234-56-78'), city: 'Алматы' });
  const [saved, setSaved] = useState(false);

  const totalPoints = LOYALTY_HISTORY.reduce((s, h) => s + h.points, 0);

  const handleSave = () => {
    setSaved(true);
    setEditing(false);
    setTimeout(() => setSaved(false), 2500);
  };

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg)', paddingTop: 'var(--header-h)' }}>

      {/* Profile header */}
      <div style={{ background: 'var(--ink-bg)', padding: '32px var(--gutter)' }}>
        <div style={{ maxWidth: 'var(--max-w)', margin: '0 auto', display: 'flex', alignItems: 'center', gap: 24 }}>
          <div style={{ width: 64, height: 64, borderRadius: '50%', background: 'var(--clay)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
            <span style={{ fontFamily: 'Manrope', fontWeight: 800, fontSize: 24, color: '#fff' }}>
              {profile.firstName[0]}{profile.lastName[0]}
            </span>
          </div>
          <div>
            <h1 style={{ fontFamily: 'Manrope', fontWeight: 800, fontSize: 22, color: 'var(--ink-inv)', marginBottom: 4 }}>
              {profile.firstName} {profile.lastName}
            </h1>
            <p style={{ fontSize: 13, color: 'rgba(250,250,248,.5)' }}>{profile.email} · {profile.city}</p>
          </div>
          <div style={{ marginLeft: 'auto', textAlign: 'right' }}>
            <p style={{ fontFamily: 'Manrope', fontWeight: 800, fontSize: 28, color: 'var(--clay)', letterSpacing: '-0.03em' }}>{totalPoints}</p>
            <p style={{ fontSize: 12, color: 'rgba(250,250,248,.4)', letterSpacing: '0.06em', textTransform: 'uppercase' }}>бонусных баллов</p>
          </div>
        </div>
      </div>

      <div style={{ maxWidth: 'var(--max-w)', margin: '0 auto', padding: '32px var(--gutter) 64px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '220px 1fr', gap: 32, alignItems: 'start' }}>

          {/* Sidebar tabs */}
          <div style={{ background: 'var(--surface)', border: '1px solid var(--line)', borderRadius: 'var(--r-lg)', overflow: 'hidden', position: 'sticky', top: 'calc(var(--header-h) + 24px)' }}>
            {TABS.map(t => (
              <button key={t.id} onClick={() => setTab(t.id)} style={{ width: '100%', display: 'flex', alignItems: 'center', gap: 12, padding: '14px 20px', background: tab === t.id ? 'var(--clay-light)' : 'transparent', border: 'none', borderLeft: `3px solid ${tab === t.id ? 'var(--clay)' : 'transparent'}`, cursor: 'pointer', textAlign: 'left', transition: 'all 140ms' }}>
                <span className="icon" style={{ fontSize: 20, color: tab === t.id ? 'var(--clay)' : 'var(--ink-3)' }}>{t.icon}</span>
                <span style={{ fontSize: 14, fontWeight: 600, color: tab === t.id ? 'var(--clay)' : 'var(--ink-2)' }}>{t.label}</span>
              </button>
            ))}
            <div style={{ height: 1, background: 'var(--line)', margin: '8px 0' }} />
            <button
              onClick={() => {
                clearAuthSession();
                window.location.href = '/login';
              }}
              className="btn-logout"
            >
              <span className="icon" style={{ fontSize: 20 }}>logout</span>
              <span style={{ fontSize: 14, fontWeight: 600 }}>Выйти</span>
            </button>
          </div>

          {/* Content area */}
          <div>

            {/* ORDERS TAB */}
            {tab === 'orders' && (
              <div>
                <h2 style={{ fontFamily: 'Manrope', fontWeight: 800, fontSize: 20, marginBottom: 20 }}>История заказов</h2>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                  {ORDERS.map(order => (
                    <div key={order.id} style={{ background: 'var(--surface)', border: '1px solid var(--line)', borderRadius: 'var(--r-lg)', padding: '20px 24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 16 }}>
                      <div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 6 }}>
                          <span style={{ fontFamily: 'Manrope', fontWeight: 800, fontSize: 16, color: 'var(--ink)' }}>#{order.id}</span>
                          <span style={{ padding: '3px 10px', borderRadius: 'var(--r-full)', fontSize: 11, fontWeight: 700, ...STATUS_COLORS[order.status] }}>
                            {order.statusLabel}
                          </span>
                        </div>
                        <p style={{ fontSize: 13, color: 'var(--ink-3)' }}>{order.date} · {order.items} {order.items === 1 ? 'товар' : order.items < 5 ? 'товара' : 'товаров'}</p>
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 20 }}>
                        <span style={{ fontFamily: 'Manrope', fontWeight: 800, fontSize: 18, color: 'var(--ink)' }}>{order.total.toLocaleString('ru-KZ')} ₸</span>
                        <Link href={`/orders/${order.id}`} className="btn btn-outline" style={{ padding: '8px 16px', fontSize: 13 }}>Детали</Link>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* LOYALTY TAB */}
            {tab === 'loyalty' && (
              <div>
                <h2 style={{ fontFamily: 'Manrope', fontWeight: 800, fontSize: 20, marginBottom: 20 }}>Программа лояльности</h2>

                {/* Balance card */}
                <div style={{ background: 'var(--ink-bg)', borderRadius: 'var(--r-xl)', padding: '32px', marginBottom: 24, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div>
                    <p style={{ fontSize: 12, fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'rgba(250,250,248,.4)', marginBottom: 8 }}>Ваш баланс</p>
                    <p style={{ fontFamily: 'Manrope', fontWeight: 800, fontSize: 48, letterSpacing: '-0.04em', color: 'var(--clay)' }}>{totalPoints}</p>
                    <p style={{ fontSize: 13, color: 'rgba(250,250,248,.5)' }}>баллов · ≈ {(totalPoints * 5).toLocaleString('ru-KZ')} ₸</p>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <p style={{ fontSize: 12, color: 'rgba(250,250,248,.4)', marginBottom: 4 }}>1 покупка = 5% баллов</p>
                    <p style={{ fontSize: 12, color: 'rgba(250,250,248,.4)' }}>1 балл = 5 ₸ скидки</p>
                  </div>
                </div>

                <h3 style={{ fontWeight: 700, fontSize: 15, marginBottom: 12, color: 'var(--ink-2)' }}>История операций</h3>
                <div style={{ background: 'var(--surface)', border: '1px solid var(--line)', borderRadius: 'var(--r-lg)', overflow: 'hidden' }}>
                  {LOYALTY_HISTORY.map((row, i) => (
                    <div key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '14px 20px', borderBottom: i < LOYALTY_HISTORY.length - 1 ? '1px solid var(--line)' : 'none' }}>
                      <div>
                        <p style={{ fontSize: 14, fontWeight: 600, color: 'var(--ink)' }}>{row.desc}</p>
                        <p style={{ fontSize: 12, color: 'var(--ink-3)' }}>{row.date}</p>
                      </div>
                      <span style={{ fontFamily: 'Manrope', fontWeight: 800, fontSize: 16, color: row.type === 'earn' ? '#166534' : 'var(--clay)' }}>
                        {row.type === 'earn' ? '+' : ''}{row.points}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* ADDRESSES TAB */}
            {tab === 'addresses' && (
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
                  <h2 style={{ fontFamily: 'Manrope', fontWeight: 800, fontSize: 20 }}>Адреса доставки</h2>
                  <button className="btn btn-outline" style={{ padding: '8px 16px', fontSize: 13, display: 'flex', alignItems: 'center', gap: 8 }}>
                    <span className="icon" style={{ fontSize: 18 }}>add</span>Добавить адрес
                  </button>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                  {[
                    { label: 'Дом', address: 'г. Алматы, ул. Абая 150, кв. 45', default: true },
                    { label: 'Работа', address: 'г. Алматы, пр. Аль-Фараби 77Б', default: false },
                  ].map((addr, i) => (
                    <div key={i} style={{ background: 'var(--surface)', border: `1.5px solid ${addr.default ? 'var(--clay)' : 'var(--line)'}`, borderRadius: 'var(--r-lg)', padding: '20px 24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <div style={{ display: 'flex', alignItems: 'flex-start', gap: 14 }}>
                        <span className="icon" style={{ fontSize: 24, color: addr.default ? 'var(--clay)' : 'var(--ink-3)', marginTop: 2 }}>location_on</span>
                        <div>
                          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
                            <span style={{ fontWeight: 700, fontSize: 15, color: 'var(--ink)' }}>{addr.label}</span>
                            {addr.default && <span style={{ background: 'var(--clay-light)', color: 'var(--clay)', fontSize: 10, fontWeight: 800, letterSpacing: '0.06em', textTransform: 'uppercase', padding: '2px 8px', borderRadius: 'var(--r-full)' }}>По умолчанию</span>}
                          </div>
                          <p style={{ fontSize: 14, color: 'var(--ink-2)' }}>{addr.address}</p>
                        </div>
                      </div>
                      <div style={{ display: 'flex', gap: 8 }}>
                        <button style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--ink-3)', padding: 6 }}><span className="icon" style={{ fontSize: 20 }}>edit</span></button>
                        <button style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--ink-3)', padding: 6 }}><span className="icon" style={{ fontSize: 20 }}>delete</span></button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* SETTINGS TAB */}
            {tab === 'settings' && (
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
                  <h2 style={{ fontFamily: 'Manrope', fontWeight: 800, fontSize: 20 }}>Настройки профиля</h2>
                  {!editing && (
                    <button onClick={() => setEditing(true)} className="btn btn-outline" style={{ padding: '8px 16px', fontSize: 13, display: 'flex', alignItems: 'center', gap: 8 }}>
                      <span className="icon" style={{ fontSize: 18 }}>edit</span>Редактировать
                    </button>
                  )}
                </div>
                {saved && (
                  <div style={{ background: '#DCFCE7', border: '1px solid #BBF7D0', borderRadius: 'var(--r-sm)', padding: '12px 16px', fontSize: 14, fontWeight: 600, color: '#166534', marginBottom: 20, display: 'flex', alignItems: 'center', gap: 8 }}>
                    <span className="icon" style={{ fontSize: 18 }}>check_circle</span>Данные сохранены
                  </div>
                )}
                <div style={{ background: 'var(--surface)', border: '1px solid var(--line)', borderRadius: 'var(--r-lg)', padding: '28px' }}>
                  <div className="signup-form">
                    <div className="form-row">
                      <div className="form-group">
                        <label className="form-label">Имя</label>
                        <input className="input" value={profile.firstName} onChange={e => setProfile(p => ({ ...p, firstName: e.target.value }))} disabled={!editing} style={{ opacity: editing ? 1 : 0.7 }} />
                      </div>
                      <div className="form-group">
                        <label className="form-label">Фамилия</label>
                        <input className="input" value={profile.lastName} onChange={e => setProfile(p => ({ ...p, lastName: e.target.value }))} disabled={!editing} style={{ opacity: editing ? 1 : 0.7 }} />
                      </div>
                    </div>
                    <div className="form-group">
                      <label className="form-label">Email</label>
                      <input className="input" type="email" value={profile.email} onChange={e => setProfile(p => ({ ...p, email: e.target.value }))} disabled={!editing} style={{ opacity: editing ? 1 : 0.7 }} />
                    </div>
                    <div className="form-group">
                      <label className="form-label">Телефон</label>
                      <input className="input" value={profile.phone} onChange={e => setProfile(p => ({ ...p, phone: formatKazakhstanPhone(e.target.value) }))} disabled={!editing} style={{ opacity: editing ? 1 : 0.7 }} />
                    </div>
                    {editing && (
                      <div style={{ display: 'flex', gap: 12 }}>
                        <button onClick={handleSave} className="btn btn-clay btn-lg" style={{ flex: 1 }}>Сохранить</button>
                        <button onClick={() => setEditing(false)} className="btn btn-outline btn-lg">Отмена</button>
                      </div>
                    )}
                  </div>

                  <div style={{ marginTop: 28, paddingTop: 24, borderTop: '1px solid var(--line)' }}>
                    <h3 style={{ fontWeight: 700, fontSize: 14, letterSpacing: '0.08em', textTransform: 'uppercase', color: 'var(--ink-2)', marginBottom: 16 }}>Уведомления</h3>
                    {[
                      { id: 'email_orders', label: 'Статус заказов по email' },
                      { id: 'email_promo', label: 'Акции и скидки' },
                      { id: 'sms_delivery', label: 'SMS при доставке' },
                    ].map(n => (
                      <div key={n.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px 0', borderBottom: '1px solid var(--line)' }}>
                        <span style={{ fontSize: 14, color: 'var(--ink)' }}>{n.label}</span>
                        <label style={{ display: 'flex', alignItems: 'center', cursor: 'pointer' }}>
                          <input type="checkbox" defaultChecked style={{ accentColor: 'var(--clay)', width: 18, height: 18 }} />
                        </label>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

          </div>
        </div>
      </div>
    </div>
  );
}
