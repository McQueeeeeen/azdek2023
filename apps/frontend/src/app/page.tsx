'use client';
import Link from 'next/link';
import { useState, useEffect } from 'react';

/* ── Scroll Reveal ─────────────────────────────────────── */
function useScrollReveal() {
  useEffect(() => {
    const els = document.querySelectorAll('[data-reveal]');
    if (!els.length) return;
    const io = new IntersectionObserver(
      (entries) =>
        entries.forEach((e) => {
          if (e.isIntersecting) {
            (e.target as HTMLElement).classList.add('revealed');
            io.unobserve(e.target);
          }
        }),
      { threshold: 0.1, rootMargin: '0px 0px -40px 0px' }
    );
    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, []);
}

/* ── Sticky header shadow on scroll ───────────────────── */
function useHeaderScroll() {
  useEffect(() => {
    const header = document.getElementById('site-header');
    if (!header) return;
    const handler = () =>
      header.classList.toggle('scrolled', window.scrollY > 12);
    window.addEventListener('scroll', handler, { passive: true });
    return () => window.removeEventListener('scroll', handler);
  }, []);
}

/* ── Data ──────────────────────────────────────────────── */
const PRODUCTS = [
  {
    id: 1,
    name: 'Концентрат для посуды',
    sub: 'Мята · Лайм · 500 мл',
    price: '380 ₽',
    tag: 'Ecolabel',
    img: 'https://images.unsplash.com/photo-1585441695325-21ea74b8e4ba?w=500&q=80',
  },
  {
    id: 2,
    name: 'Спрей для поверхностей',
    sub: 'Чайное дерево · 450 мл',
    price: '450 ₽',
    tag: 'Organic',
    img: 'https://images.unsplash.com/photo-1563453392212-326f5e854473?w=500&q=80',
  },
  {
    id: 3,
    name: 'Гель для стирки',
    sub: 'Лаванда · Хлопок · 1 л',
    price: '820 ₽',
    tag: 'Zero Waste',
    img: 'https://images.unsplash.com/photo-1604335399105-a0c585fd81a1?w=500&q=80',
  },
  {
    id: 4,
    name: 'Мыло-концентрат',
    sub: 'Хвоя · Эвкалипт · 250 г',
    price: '590 ₽',
    tag: '100% Bio',
    img: 'https://images.unsplash.com/photo-1556909172-8c2f041fca1e?w=500&q=80',
  },
];

const TICKER_ITEMS = [
  'Сертифицировано Ecolabel',
  'Без фосфатов',
  'Протестировано дерматологами',
  'Биоразлагаемо на 100%',
  'Без хлора и агрессивных ПАВ',
  'Упаковка из переработанного пластика',
  'Веган-формула',
  'Российское производство',
];

const VALUES = [
  {
    num: '01',
    icon: 'science',
    title: 'Формула без компромиссов',
    desc: 'Каждый ингредиент — с научным обоснованием. Мы публикуем полный состав и объясняем роль каждого компонента.',
  },
  {
    num: '02',
    icon: 'eco',
    title: 'Биоразложение за 28 дней',
    desc: 'Все активные вещества полностью разлагаются в природной среде. Никакого накопления в грунтовых водах.',
  },
  {
    num: '03',
    icon: 'recycling',
    title: 'Замкнутая упаковка',
    desc: 'Флаконы — из переработанного пластика. Сдайте пустую тару в наш пункт приёма и получите скидку 15%.',
  },
  {
    num: '04',
    icon: 'verified_user',
    title: 'Дерматологический контроль',
    desc: 'Средства тестируются в независимой лаборатории и подходят людям с чувствительной кожей и аллергией.',
  },
  {
    num: '05',
    icon: 'local_shipping',
    title: 'Доставка без пластика',
    desc: 'Отправляем в картонной упаковке без пластиковых наполнителей. Коробка идёт на переработку.',
  },
  {
    num: '06',
    icon: 'groups',
    title: 'Создано в России',
    desc: 'Производство и R&D — в Москве. Поддерживаем местные лаборатории и исследователей.',
  },
];

/* ══════════════════════════════════════════════════════════
   PAGE
══════════════════════════════════════════════════════════ */
export default function HomePage() {
  useScrollReveal();
  useHeaderScroll();

  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);
  const [cartCount] = useState(0);

  return (
    <>
      {/* ─── HEADER ──────────────────────────────────────────── */}
      <header className="site-header" id="site-header">
        <div className="wrap header-inner">
          {/* Logo */}
          <Link href="/" className="adzek-logo">
            Adzek<span>.</span>
          </Link>

          {/* Nav */}
          <nav className="header-nav">
            {[
              { label: 'Каталог',   href: '/catalog' },
              { label: 'Состав',    href: '#values' },
              { label: 'О бренде',  href: '#about' },
              { label: 'Доставка',  href: '#' },
            ].map((l) => (
              <Link key={l.label} href={l.href} className="hn-link">
                {l.label}
              </Link>
            ))}
          </nav>

          {/* Right */}
          <div className="header-end">
            <div className="h-search-wrap hidden lg:block">
              <span className="icon h-search-icon">search</span>
              <input
                className="input"
                placeholder="Найти средство…"
                type="search"
                aria-label="Поиск"
              />
            </div>

            <Link href="/profile" className="btn btn-ghost btn-icon hidden md:flex">
              <span className="icon" style={{ fontSize: 22 }}>person</span>
            </Link>

            <Link href="/cart" className="h-cart">
              <span className="icon" style={{ fontSize: 20 }}>shopping_bag</span>
              Корзина
              {cartCount > 0 && <span className="h-cart-badge">{cartCount}</span>}
            </Link>
          </div>
        </div>
      </header>

      <main>
        {/* ─── HERO ──────────────────────────────────────────── */}
        <section className="hero">
          <div className="wrap">
            <div className="hero-grid">

              {/* Left — copy */}
              <div>
                <div className="hero-label" data-reveal>
                  <span className="hero-label-line" />
                  Натуральная бытовая химия
                </div>

                <h1 className="hero-headline" data-reveal style={{ transitionDelay: '80ms' }}>
                  Чистота.<br />
                  Без <em>лишнего.</em>
                </h1>

                <p className="hero-desc" data-reveal style={{ transitionDelay: '160ms' }}>
                  Средства для уборки нового поколения — прозрачный состав, доказанная эффективность и полная безопасность для вашей семьи и природы.
                </p>

                <div className="hero-actions" data-reveal style={{ transitionDelay: '220ms' }}>
                  <Link href="/catalog" className="btn btn-clay btn-lg">
                    Смотреть каталог
                    <span className="icon" style={{ fontSize: 18 }}>arrow_forward</span>
                  </Link>
                  <Link href="#about" className="btn btn-outline btn-lg">
                    О бренде
                  </Link>
                </div>

                {/* Stats */}
                <div className="hero-stats-row" data-reveal style={{ transitionDelay: '300ms' }}>
                  {[
                    { n: '5', suf: ' лет', l: 'На рынке' },
                    { n: '12', suf: '+', l: 'Сертификатов' },
                    { n: '50К', suf: '+', l: 'Клиентов' },
                    { n: '98', suf: '%', l: 'Довольны' },
                  ].map((s) => (
                    <div key={s.l} className="hero-stat">
                      <div className="hero-stat-n">
                        {s.n}<span>{s.suf}</span>
                      </div>
                      <div className="hero-stat-l">{s.l}</div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Right — visual */}
              <div className="hero-visual" data-reveal="right" style={{ transitionDelay: '120ms' }}>
                <div className="hero-img-frame">
                  <img
                    src="https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=900&q=85"
                    alt="Средства Adzek"
                  />
                </div>
                {/* Floating badge */}
                <div className="hero-cert-badge">
                  <div className="hero-cert-icon">
                    <span className="icon icon-fill" style={{ fontSize: 20 }}>verified</span>
                  </div>
                  <div>
                    <div style={{ fontSize: 13, fontWeight: 700, color: 'var(--ink)' }}>Ecolabel</div>
                    <div style={{ fontSize: 11, color: 'var(--ink-3)' }}>Сертифицировано</div>
                  </div>
                </div>
              </div>

            </div>
          </div>
        </section>

        {/* ─── TICKER ────────────────────────────────────────── */}
        <div className="ticker" aria-hidden="true">
          <div className="ticker-track">
            {[...TICKER_ITEMS, ...TICKER_ITEMS].map((item, i) => (
              <span key={i} className="ticker-item">
                <span className="ticker-dot" />
                {item}
              </span>
            ))}
          </div>
        </div>

        {/* ─── PRODUCTS ──────────────────────────────────────── */}
        <section className="products-section" id="catalog">
          <div className="wrap">
            <div className="section-header-row" data-reveal>
              <div>
                <div className="section-label">Бестселлеры</div>
                <h2 className="section-title">Проверенные формулы</h2>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 24 }}>
                <div className="section-num" aria-hidden="true">01</div>
                <Link
                  href="/catalog"
                  className="btn btn-outline"
                  style={{ flexShrink: 0 }}
                >
                  Весь каталог
                  <span className="icon" style={{ fontSize: 16 }}>east</span>
                </Link>
              </div>
            </div>

            <div className="product-grid">
              {PRODUCTS.map((p, i) => (
                <div
                  key={p.id}
                  data-reveal
                  style={{ transitionDelay: `${i * 90}ms` }}
                >
                  <Link href={`/catalog/${p.id}`} style={{ display: 'contents' }}>
                    <article className="product-card">
                      <div className="product-img-area">
                        <span className="product-tag-pill">{p.tag}</span>
                        <button
                          className="product-fav"
                          aria-label="В избранное"
                          onClick={(e) => e.preventDefault()}
                        >
                          <span className="icon" style={{ fontSize: 16 }}>favorite_border</span>
                        </button>
                        <img src={p.img} alt={p.name} loading="lazy" />
                      </div>
                      <div className="product-info">
                        <div className="product-name">{p.name}</div>
                        <div className="product-sub">{p.sub}</div>
                      </div>
                      <div className="product-bottom">
                        <span className="product-price">{p.price}</span>
                        <button
                          className="add-to-cart-btn"
                          aria-label="В корзину"
                          onClick={(e) => e.preventDefault()}
                        >
                          <span className="icon" style={{ fontSize: 18 }}>add</span>
                        </button>
                      </div>
                    </article>
                  </Link>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ─── STATEMENT BAND ────────────────────────────────── */}
        <section className="statement-band" data-reveal>
          <div className="wrap">
            <div className="statement-inner">
              <div className="statement-meta">
                <span className="statement-meta-num">Философия</span>
                <span className="statement-meta-label">Adzek · с 2019</span>
              </div>
              <blockquote className="statement-quote">
                Мы убрали всё лишнее. Оставили только то,
                что <em>действительно работает</em> —
                и не вредит природе.
              </blockquote>
            </div>
          </div>
        </section>

        {/* ─── VALUES ────────────────────────────────────────── */}
        <section className="values-section" id="values">
          <div className="wrap">
            <div
              style={{ textAlign: 'center', marginBottom: 56 }}
              data-reveal
            >
              <div className="section-label" style={{ justifyContent: 'center', display: 'flex' }}>
                Наши принципы
              </div>
              <h2
                className="section-title"
                style={{ maxWidth: 480, margin: '0 auto' }}
              >
                Прозрачность на каждом этапе
              </h2>
            </div>

            <div className="values-grid">
              {VALUES.map((v, i) => (
                <div key={v.num} className="value-item" data-reveal style={{ transitionDelay: `${(i % 3) * 80}ms` }}>
                  <div className="value-num">{v.num}</div>
                  <div className="value-title">{v.title}</div>
                  <div className="value-desc">{v.desc}</div>
                  <div className="value-icon">
                    <span className="icon icon-fill" style={{ fontSize: 22 }}>{v.icon}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ─── PHILOSOPHY SPLIT ──────────────────────────────── */}
        <section className="philosophy-section" id="about">
          <div className="wrap">
            <div className="philosophy-grid">

              <div className="philosophy-img" data-reveal="left">
                <img
                  src="https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=900&q=80"
                  alt="Производство Adzek"
                />
              </div>

              <div data-reveal="right">
                <div className="philosophy-label">О бренде</div>
                <h2 className="philosophy-title">
                  Начали с простого вопроса: зачем в составе 40 ингредиентов?
                </h2>
                <p className="philosophy-body">
                  В 2019 году мы разобрали состав популярных чистящих средств и ужаснулись. Агрессивная химия, накопительный эффект, вред для кожи детей. Мы решили создать альтернативу — с открытым составом и доказанной безопасностью.
                </p>
                <div className="philosophy-points">
                  {[
                    'Полный состав на каждой этикетке',
                    'R&D-лаборатория в Москве',
                    'Тестирование на добровольцах, не на животных',
                    'Сотрудничество с экологическими организациями',
                  ].map((p) => (
                    <div key={p} className="philosophy-point">{p}</div>
                  ))}
                </div>
                <Link href="/catalog" className="btn btn-ink btn-lg">
                  Изучить продукты
                  <span className="icon" style={{ fontSize: 18 }}>arrow_forward</span>
                </Link>
              </div>

            </div>
          </div>
        </section>

        {/* ─── NEWSLETTER ────────────────────────────────────── */}
        <section className="newsletter-section">
          <div className="wrap">
            <div className="newsletter-wrap" data-reveal>
              <div className="newsletter-eyebrow">Подписка</div>
              <h2 className="newsletter-title">
                Советы по экоуборке — раз в неделю
              </h2>
              <p className="newsletter-sub">
                Никакого спама. Только полезные материалы и первый доступ к новинкам.
              </p>

              {subscribed ? (
                <div
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: 10,
                    background: 'var(--clay-light)',
                    color: 'var(--clay-dark)',
                    padding: '14px 28px',
                    borderRadius: 'var(--r-full)',
                    fontWeight: 700,
                    fontSize: 15,
                  }}
                >
                  <span className="icon icon-fill" style={{ fontSize: 20 }}>check_circle</span>
                  Подписка оформлена, спасибо!
                </div>
              ) : (
                <form
                  className="newsletter-form"
                  onSubmit={(e) => {
                    e.preventDefault();
                    if (email) setSubscribed(true);
                  }}
                >
                  <input
                    className="input"
                    type="email"
                    placeholder="Ваш e-mail"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                  <button type="submit" className="btn btn-clay" style={{ borderRadius: 'var(--r-full)', flexShrink: 0 }}>
                    Подписаться
                  </button>
                </form>
              )}
            </div>
          </div>
        </section>

      </main>

      {/* ─── FOOTER ────────────────────────────────────────── */}
      <footer className="site-footer">
        <div className="wrap">
          <div className="footer-grid">
            <div>
              <div className="footer-brand">Adzek<span>.</span></div>
              <p className="footer-tagline">
                Натуральная бытовая химия нового поколения. Прозрачный состав, доказанная эффективность.
              </p>
            </div>
            {[
              {
                title: 'Покупателям',
                links: ['Каталог', 'Доставка и оплата', 'Возврат', 'Сертификаты'],
              },
              {
                title: 'О компании',
                links: ['О бренде', 'Блог', 'Вакансии', 'Пресс-кит'],
              },
              {
                title: 'Контакты',
                links: ['hello@adzek.ru', '8 800 555-35-35', 'Telegram', 'ВКонтакте'],
              },
            ].map((col) => (
              <div key={col.title}>
                <div className="footer-col-title">{col.title}</div>
                <div className="footer-links">
                  {col.links.map((l) => (
                    <a key={l} href="#">{l}</a>
                  ))}
                </div>
              </div>
            ))}
          </div>

          <div className="footer-bottom">
            <span>© 2026 Adzek. Все права защищены.</span>
            <span>Экологичная химия · Российское производство</span>
          </div>
        </div>
      </footer>

      {/* ─── MOBILE NAV ────────────────────────────────────── */}
      <nav className="mob-nav" aria-label="Мобильная навигация">
        {[
          { href: '/',        icon: 'home',         label: 'Главная' },
          { href: '/catalog', icon: 'grid_view',    label: 'Каталог' },
          { href: '/cart',    icon: 'shopping_bag', label: 'Корзина' },
          { href: '/profile', icon: 'person',       label: 'Профиль' },
        ].map((n) => (
          <Link key={n.href} href={n.href} className={n.href === '/' ? 'active' : ''}>
            <span className="icon" style={{ fontSize: 22 }}>{n.icon}</span>
            {n.label}
          </Link>
        ))}
      </nav>
    </>
  );
}
