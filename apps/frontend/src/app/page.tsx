'use client';
import Link from 'next/link';
import { useState } from 'react';

const NAV = [
  { href: '/catalog',  label: 'Каталог' },
  { href: '/about',    label: 'О бренде' },
  { href: '/blog',     label: 'Блог' },
  { href: '/delivery', label: 'Доставка' },
];

const FEATURES = [
  { icon: 'eco',        title: '100% натурально',     desc: 'Только растительные и минеральные компоненты без синтетических добавок.' },
  { icon: 'recycling',  title: 'Экоупаковка',         desc: 'Биоразлагаемая тара из переработанного пластика и бумаги.' },
  { icon: 'verified',   title: 'Сертифицировано',     desc: 'Все продукты прошли независимую лабораторную проверку.' },
  { icon: 'child_care', title: 'Безопасно для детей', desc: 'Гипоаллергенные формулы, одобренные педиатрами.' },
];

const PRODUCTS = [
  { id: 1, name: 'Гель для посуды «Мята»',    price: 590,  old: 720,  rating: 4.8, reviews: 142, tag: 'Хит',    img: 'https://images.unsplash.com/photo-1585441695325-21ea74b8e4ba?w=400&q=80' },
  { id: 2, name: 'Антижир Bio-Force',         price: 750,  old: null, rating: 4.6, reviews: 89,  tag: 'Новинка', img: 'https://images.unsplash.com/photo-1563453392212-326f5e854473?w=400&q=80' },
  { id: 3, name: 'Набор Эко-губок (4 шт.)',   price: 320,  old: null, rating: 4.9, reviews: 203, tag: 'Эко',    img: 'https://images.unsplash.com/photo-1556909172-8c2f041fca1e?w=400&q=80' },
  { id: 4, name: 'Стиральный порошок Pure',   price: 1190, old: 1450, rating: 4.7, reviews: 76,  tag: 'Хит',    img: 'https://images.unsplash.com/photo-1604335399105-a0c585fd81a1?w=400&q=80' },
];

const STATS = [
  { val: '50 000+', lbl: 'довольных клиентов' },
  { val: '120+',    lbl: 'товаров в каталоге' },
  { val: '4.9 ★',  lbl: 'средний рейтинг' },
];

function Stars({ n }: { n: number }) {
  return <span className="stars">{'★'.repeat(Math.floor(n))}{'☆'.repeat(5 - Math.floor(n))}</span>;
}

export default function HomePage() {
  const [cartCount] = useState(0);
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  return (
    <>
      {/* ── HEADER ── */}
      <header className="site-header">
        <div className="container header-inner">
          <Link href="/" className="logo-mark">adzek<span className="logo-dot">.</span></Link>
          <nav className="nav-links">
            {NAV.map(n => (
              <Link key={n.href} href={n.href} className="nav-link">{n.label}</Link>
            ))}
          </nav>
          <div className="header-search">
            <span className="material-symbols-outlined header-search-icon">search</span>
            <input className="input" placeholder="Поиск чистоты..." />
          </div>
          <div className="header-actions">
            <Link href="/auth" className="btn btn-ghost btn-sm">Войти</Link>
            <Link href="/cart" className="cart-btn">
              <span className="material-symbols-outlined" style={{fontSize:20}}>shopping_cart</span>
              {cartCount > 0 && <span className="cart-count">{cartCount}</span>}
            </Link>
          </div>
        </div>
      </header>

      {/* ── HERO ── */}
      <section className="hero">
        <div className="container hero-inner">
          <div className="fade-up">
            <div className="hero-eyebrow">
              <span className="material-symbols-outlined" style={{fontSize:16}}>eco</span>
              100% натуральный состав
            </div>
            <h1 className="hero-title">
              Чистота,<br />которая <span>не вредит</span>
            </h1>
            <p className="hero-sub">
              Бытовая химия нового поколения — эффективная, безопасная и дружелюбная к планете. Без компромиссов.
            </p>
            <div className="hero-actions">
              <Link href="/catalog" className="btn btn-accent btn-lg">
                <span className="material-symbols-outlined">storefront</span>
                Смотреть каталог
              </Link>
              <Link href="/about" className="btn btn-lg" style={{background:'rgba(255,255,255,.15)', color:'#fff', borderColor:'rgba(255,255,255,.25)'}}>
                О бренде
              </Link>
            </div>
            <div className="hero-stats">
              {STATS.map(s => (
                <div key={s.val}>
                  <div className="hero-stat-val">{s.val}</div>
                  <div className="hero-stat-lbl">{s.lbl}</div>
                </div>
              ))}
            </div>
          </div>
          <div className="hero-img-wrap">
            <img
              src="https://images.unsplash.com/photo-1556909172-8c2f041fca1e?w=800&q=80"
              alt="Натуральные средства для дома"
            />
          </div>
        </div>
      </section>

      {/* ── FEATURES ── */}
      <section className="section-sm" style={{background:'var(--c-surface)'}}>
        <div className="container">
          <div className="grid-4">
            {FEATURES.map(f => (
              <div key={f.title} className="feature-card">
                <div className="feature-icon">
                  <span className="material-symbols-outlined">{f.icon}</span>
                </div>
                <h3 className="t-h4" style={{marginBottom:8}}>{f.title}</h3>
                <p className="t-sm t-muted">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── PRODUCTS ── */}
      <section className="section">
        <div className="container">
          <div className="section-header" style={{display:'flex', justifyContent:'space-between', alignItems:'flex-end'}}>
            <div>
              <div className="section-eyebrow">Популярное</div>
              <h2 className="t-h2">Хиты продаж</h2>
            </div>
            <Link href="/catalog" className="btn btn-ghost btn-sm">
              Весь каталог
              <span className="material-symbols-outlined" style={{fontSize:18}}>arrow_forward</span>
            </Link>
          </div>
          <div className="grid-4 product-grid-home">
            {PRODUCTS.map(p => (
              <Link href={`/catalog/${p.id}`} key={p.id} style={{textDecoration:'none'}}>
                <div className="product-card">
                  <div className="product-img-wrap">
                    <img src={p.img} alt={p.name} />
                    <div className="product-tag">
                      <span className={`badge ${p.tag === 'Хит' ? 'badge-amber' : p.tag === 'Новинка' ? 'badge-blue' : 'badge-brand'}`}>
                        {p.tag}
                      </span>
                    </div>
                    <button className="product-wish" onClick={e => e.preventDefault()}>
                      <span className="material-symbols-outlined" style={{fontSize:18}}>favorite</span>
                    </button>
                  </div>
                  <div className="product-body">
                    <div className="product-name">{p.name}</div>
                    <div className="product-rating">
                      <Stars n={p.rating} />
                      <span className="t-muted">{p.rating} ({p.reviews})</span>
                    </div>
                    <div className="product-footer">
                      <div>
                        <div className="product-price">{p.price} ₽</div>
                        {p.old && <div className="product-price-old">{p.old} ₽</div>}
                      </div>
                      <button className="btn btn-primary btn-sm" onClick={e => e.preventDefault()}>
                        <span className="material-symbols-outlined" style={{fontSize:16}}>add_shopping_cart</span>
                      </button>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ── SUBSCRIPTION BANNER ── */}
      <section style={{background:'linear-gradient(120deg,#e8f5ee 0%,#d1fae5 100%)', padding:'64px 0'}}>
        <div className="container sub-grid-mobile" style={{display:'grid', gridTemplateColumns:'1fr 1fr', gap:48, alignItems:'center'}}>
          <div>
            <div className="section-eyebrow">Подписка</div>
            <h2 className="t-h2" style={{marginBottom:12}}>Чистота каждый месяц</h2>
            <p className="t-body t-muted" style={{marginBottom:24}}>
              Подпишитесь на регулярную доставку любимых средств и экономьте до 20%.
            </p>
            <Link href="/subscription" className="btn btn-primary btn-lg">
              <span className="material-symbols-outlined">autorenew</span>
              Оформить подписку
            </Link>
          </div>
          <div style={{display:'flex', gap:12, flexWrap:'wrap'}}>
            {['Гибкий интервал', 'Скидка 20%', 'Бесплатная доставка', 'Отмена в любой момент'].map(b => (
              <div key={b} className="badge badge-green" style={{padding:'10px 16px', fontSize:14}}>
                <span className="material-symbols-outlined" style={{fontSize:16}}>check_circle</span>
                {b}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── NEWSLETTER ── */}
      <section className="section" style={{background:'var(--c-surface)'}}>
        <div className="container" style={{maxWidth:520, margin:'0 auto', textAlign:'center'}}>
          <div className="section-eyebrow">Новости</div>
          <h2 className="t-h2" style={{marginBottom:12}}>Будьте в курсе</h2>
          <p className="t-body t-muted" style={{marginBottom:28}}>
            Получайте советы по уборке, новинки и эксклюзивные скидки прямо в почту.
          </p>
          {subscribed ? (
            <div className="badge badge-green" style={{padding:'14px 24px', fontSize:15, display:'inline-flex'}}>
              <span className="material-symbols-outlined">check_circle</span>
              Вы подписались! Спасибо 🎉
            </div>
          ) : (
            <div style={{display:'flex', gap:10}}>
              <input
                className="input"
                type="email"
                placeholder="ваш@email.ru"
                value={email}
                onChange={e => setEmail(e.target.value)}
              />
              <button className="btn btn-primary" style={{whiteSpace:'nowrap'}} onClick={() => email && setSubscribed(true)}>
                Подписаться
              </button>
            </div>
          )}
        </div>
      </section>

      {/* ── FOOTER ── */}
      <footer className="site-footer">
        <div className="container">
          <div className="footer-grid">
            <div>
              <div className="footer-brand-name">adzek<span style={{color:'#f0a500'}}>.</span></div>
              <p style={{fontSize:14, marginTop:12, lineHeight:1.65, maxWidth:280}}>
                Натуральные средства для дома — эффективно, экологично, с заботой о вашей семье.
              </p>
            </div>
            {[
              { title:'Магазин',   links:['Каталог','Новинки','Акции','Подписка'] },
              { title:'Компания',  links:['О нас','Блог','Пресса','Карьера'] },
              { title:'Поддержка', links:['Доставка','Возврат','FAQ','Контакты'] },
            ].map(col => (
              <div key={col.title}>
                <div className="footer-col-title">{col.title}</div>
                <div className="footer-col-links">
                  {col.links.map(l => <a key={l} href="#">{l}</a>)}
                </div>
              </div>
            ))}
          </div>
          <div className="footer-bottom">
            <span>© 2026 Adzek. Все права защищены.</span>
            <div style={{display:'flex', gap:16}}>
              <a href="#">Политика конфиденциальности</a>
              <a href="#">Оферта</a>
            </div>
          </div>
        </div>
      </footer>

      {/* ── MOBILE NAV ── */}
      <nav className="mobile-nav">
        {[
          { href:'/',        icon:'home',          label:'Главная' },
          { href:'/catalog', icon:'grid_view',     label:'Каталог' },
          { href:'/cart',    icon:'shopping_cart', label:'Корзина' },
          { href:'/profile', icon:'person',        label:'Профиль' },
        ].map(n => (
          <Link key={n.href} href={n.href} className={n.href === '/' ? 'active' : ''}>
            <span className="material-symbols-outlined">{n.icon}</span>
            {n.label}
          </Link>
        ))}
      </nav>
    </>
  );
}
