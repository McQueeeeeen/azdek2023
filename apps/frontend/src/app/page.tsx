import type { Metadata } from "next";
import Link from "next/link";
import Container from "@/components/ui/container";
import Section from "@/components/ui/section";
import Button from "@/components/ui/button";
import Card from "@/components/ui/card";
import SmartImage from "@/components/ui/smart-image";
import { getProductMedia } from "@/lib/product-media";

const SOLUTIONS = [
  "Убрать жир",
  "Убрать налет",
  "Убрать запах",
  "Для пола и поверхностей",
  "Для ванной",
  "Универсальная уборка",
];

const HOW_IT_WORKS = ["Выбираешь задачу", "Находишь средство", "Оформляешь заказ", "Получаешь результат"];

const WHY_US = [
  { title: "Работает", text: "Результат с первого применения" },
  { title: "Экономит время", text: "Меньше действий, больше эффекта" },
  { title: "В наличии", text: "Быстрая обработка и отправка" },
  { title: "Понятный выбор", text: "Каждый продукт под задачу" },
];

const REVIEWS = [
  { text: "Убрало жир с плиты за один проход. Без лишних повторов.", author: "Алия, Алматы" },
  { text: "Налет в ванной ушел быстро, запах спокойный.", author: "Нурсултан, Астана" },
  { text: "Понятный каталог: выбрал задачу и сразу нашел нужное.", author: "Айдана, Шымкент" },
];

const POPULAR = [
  { slug: "azdek-laundry-gel", name: "Azdek Laundry Gel", hint: "Универсальная уборка" },
  { slug: "azdek-softener-fresh", name: "Azdek Softener Fresh", hint: "Убрать налет" },
  { slug: "azdek-dish-liquid-citrus", name: "Azdek Dish Liquid Citrus", hint: "Убрать жир" },
];

export const metadata: Metadata = {
  title: "Azdek - Чистота без лишних затрат времени",
  description: "Бытовая химия, которая работает с первого раза. Решения по задачам: жир, налет, запах и универсальная уборка.",
  openGraph: {
    title: "Azdek - Чистота без лишних затрат времени",
    description: "Выбирайте средства, которые решают задачу сразу.",
    type: "website",
  },
};

export default function HomePage() {
  const heroMedia = getProductMedia("azdek-laundry-gel");

  return (
    <Section>
      <Container className="grid home-grid-ready">
        <Card className="hero-card hero-card-premium">
          <p className="small">AZDEK · HOME CARE</p>
          <h1 className="h1">Чистота без лишних затрат времени</h1>
          <p className="text-secondary hero-copy">Бытовая химия, которая работает с первого раза</p>
          <div className="promo-strip-list">
            <span className="promo-chip">Для дома</span>
            <span className="promo-chip">Для бизнеса</span>
            <span className="promo-chip">В наличии</span>
          </div>
          <div className="hero-actions">
            <Link href="/catalog">
              <Button>Перейти в каталог</Button>
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

        <Card className="hits-section">
          <h2 className="h2">Плохая химия — это потраченное время, лишние усилия и слабый результат</h2>
          <p className="text-secondary">Выбирайте средства, которые решают задачу сразу.</p>
        </Card>

        <Card className="hits-section">
          <div className="page-header">
            <h2 className="h2">Решения по задачам</h2>
            <Link href="/catalog">
              <Button variant="secondary">Смотреть решения</Button>
            </Link>
          </div>
          <div className="promo-strip-list">
            {SOLUTIONS.map((item) => (
              <span key={item} className="promo-chip">
                {item}
              </span>
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
                    <Button variant="secondary" className="full-width">
                      Взять сейчас
                    </Button>
                  </Link>
                </article>
              );
            })}
          </div>
        </Card>

        <Card className="hits-section">
          <h2 className="h2">Как это работает</h2>
          <div className="promo-strip-list">
            {HOW_IT_WORKS.map((step, index) => (
              <span key={step} className="promo-chip">
                {index + 1}. {step}
              </span>
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

        <Card className="hero-card hero-card-premium">
          <h2 className="h2">Перестаньте тратить время на слабые средства</h2>
          <p className="text-secondary hero-copy">Выбирайте то, что реально работает</p>
          <div className="hero-actions">
            <Link href="/catalog">
              <Button>Выбрать средство</Button>
            </Link>
          </div>
        </Card>
      </Container>
    </Section>
  );
}
