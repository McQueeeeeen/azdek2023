import type { Metadata } from "next";
import Link from "next/link";
import Container from "@/components/ui/container";
import Section from "@/components/ui/section";
import Button from "@/components/ui/button";
import Card from "@/components/ui/card";
import SmartImage from "@/components/ui/smart-image";
import { getProductMedia } from "@/lib/product-media";

const SOLUTION_CARDS = [
  { title: "Убрать жир", desc: "Плита, вытяжка, кухня" },
  { title: "Убрать налет", desc: "Краны, плитка, стекло" },
  { title: "Убрать запах", desc: "Ткань и мягкие зоны" },
  { title: "Для ванной", desc: "Налет и бактерии" },
  { title: "Универсальная уборка", desc: "Быстро на каждый день" },
];

const HOW_IT_WORKS = ["Выбираешь задачу", "Берешь средство", "Получаешь результат"];

const WHY_US = [
  { title: "Работает сразу", text: "Без повторной чистки" },
  { title: "Экономит время", text: "Сделал один раз - и все" },
  { title: "В наличии", text: "Не ждешь. Покупаешь сразу" },
  { title: "Понятный выбор", text: "Нашел за секунды" },
];

const REVIEWS = [
  { text: "Убрало жир с плиты за один проход.", author: "⭐ 5.0 · Алия, Алматы" },
  { text: "Налет в ванной ушел быстро.", author: "⭐ 5.0 · Нурсултан, Астана" },
  { text: "Выбрал за минуту и сразу оформил.", author: "⭐ 5.0 · Айдана, Шымкент" },
];

const POPULAR = [
  { slug: "azdek-laundry-gel", name: "Azdek Laundry Gel", hint: "Универсальная уборка", cta: "Добавить и забыть" },
  { slug: "azdek-softener-fresh", name: "Azdek Softener Fresh", hint: "Убрать налет", cta: "Убрать налет" },
  { slug: "azdek-dish-liquid-citrus", name: "Azdek Dish Liquid Citrus", hint: "Убрать жир", cta: "Убрать жир" },
];

export const metadata: Metadata = {
  title: "Azdek - Чистота без лишних затрат времени",
  description: "Жир, налет и грязь уходят с первого раза. Выбирайте решения, а не лишние товары.",
  openGraph: {
    title: "Azdek - Чистота без лишних затрат времени",
    description: "Выбирайте то, что реально работает.",
    type: "website",
  },
};

export default function HomePage() {
  const heroMedia = getProductMedia("azdek-laundry-gel");

  return (
    <Section>
      <Container className="grid home-grid-ready">
        <Card className="hero-card hero-card-premium hero-card-strong">
          <p className="hero-kicker">AZDEK · HOME CARE</p>
          <h1 className="h1 hero-title-strong">Чистота без лишних затрат времени</h1>
          <p className="hero-subtitle-strong">Жир, налет и грязь уходят с первого раза</p>
          <div className="hero-meta-line">
            <span>Для дома</span>
            <span>Для бизнеса</span>
            <span>В наличии</span>
          </div>
          <div className="hero-actions">
            <Link href="/catalog">
              <Button>Выбрать решение</Button>
            </Link>
          </div>
        </Card>

        <Card className="hero-visual-card">
          <SmartImage
            className="hero-product-image"
            src={heroMedia.hero}
            fallbackSrc="/media/laundry-gel.svg"
            alt="Azdek"
            fill
            sizes="(max-width: 1024px) 100vw, 42vw"
            priority
          />
        </Card>

        <Card className="hits-section pain-contrast">
          <div className="pain-side">
            <h2 className="h3">Плохая химия - это:</h2>
            <p>- потраченное время</p>
            <p>- лишние усилия</p>
            <p>- слабый результат</p>
          </div>
          <div className="pain-side pain-side-solution">
            <h2 className="h3">Azdek - это:</h2>
            <p>- быстро</p>
            <p>- чисто</p>
            <p>- с первого раза</p>
          </div>
        </Card>

        <Card className="hits-section">
          <div className="page-header">
            <h2 className="h2">Решения по задачам</h2>
            <Link href="/catalog">
              <Button variant="secondary">Смотреть решения</Button>
            </Link>
          </div>
          <div className="solution-grid">
            {SOLUTION_CARDS.map((item) => (
              <Link key={item.title} href="/catalog" className="solution-card">
                <h3 className="h3">{item.title}</h3>
                <p className="small">{item.desc}</p>
              </Link>
            ))}
          </div>
        </Card>

        <Card className="trust-band">
          <h2 className="h2">Почему Azdek</h2>
          <div className="trust-grid" style={{ gridTemplateColumns: "repeat(4, minmax(0, 1fr))" }}>
            {WHY_US.map((item) => (
              <article key={item.title} className="trust-item">
                <h3 className="h3">{item.title}</h3>
                <p className="text-secondary">{item.text}</p>
              </article>
            ))}
          </div>
        </Card>

        <Card className="hits-section">
          <div className="page-header">
            <h2 className="h2">Популярные товары</h2>
            <Link href="/catalog">
              <Button variant="ghost">Выбрать средство</Button>
            </Link>
          </div>
          <div className="hits-grid">
            {POPULAR.map((item) => {
              const media = getProductMedia(item.slug);
              return (
                <article key={item.slug} className="hit-item">
                  <div className="hit-image-wrap">
                    <SmartImage
                      className="hit-image"
                      src={media.card}
                      fallbackSrc="/media/laundry-gel.svg"
                      alt={item.name}
                      width={560}
                      height={700}
                      loading="lazy"
                    />
                  </div>
                  <p className="small">{item.hint}</p>
                  <h3 className="h3">{item.name}</h3>
                  <Link href={`/catalog/${item.slug}`}>
                    <Button className="full-width">{item.cta}</Button>
                  </Link>
                </article>
              );
            })}
          </div>
        </Card>

        <Card className="hits-section how-grid">
          <h2 className="h2">Как это работает</h2>
          <div className="how-steps">
            {HOW_IT_WORKS.map((step, index) => (
              <article key={step} className="how-step">
                <span className="how-step-index">{index + 1}</span>
                <p>{step}</p>
              </article>
            ))}
          </div>
        </Card>

        <Card className="hits-section">
          <h2 className="h2">Отзывы</h2>
          <div className="trust-grid" style={{ gridTemplateColumns: "repeat(3, minmax(0, 1fr))" }}>
            {REVIEWS.map((review) => (
              <article key={review.text} className="trust-item">
                <p>{review.text}</p>
                <p className="small">{review.author}</p>
              </article>
            ))}
          </div>
        </Card>

        <Card className="hero-card hero-card-premium final-cta-card">
          <div className="final-cta-main">
            <h2 className="h2">Перестань тратить время на слабые средства</h2>
            <p className="text-secondary">Реши проблему за одно применение</p>
            <div className="hero-actions">
              <Link href="/catalog">
                <Button>Выбрать решение</Button>
              </Link>
            </div>
          </div>
          <div className="final-cta-points">
            <p>Работает с первого применения</p>
            <p>Быстрый выбор без лишних шагов</p>
            <p>Доставка и обработка без задержек</p>
          </div>
        </Card>
      </Container>
    </Section>
  );
}
