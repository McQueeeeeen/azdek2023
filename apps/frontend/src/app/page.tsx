import type { Metadata } from "next";
import Link from "next/link";
import Container from "@/components/ui/container";
import Section from "@/components/ui/section";
import Button from "@/components/ui/button";
import SmartImage from "@/components/ui/smart-image";
import { getProductMedia } from "@/lib/product-media";

const ESSENTIALS = [
  {
    slug: "azdek-dish-liquid-citrus",
    title: "Средство для удаления жира",
    subtitle: "Для кухни",
    price: "1490 KZT",
  },
  {
    slug: "azdek-softener-fresh",
    title: "Средство от известкового налета",
    subtitle: "Для ванной",
    price: "2290 KZT",
  },
  {
    slug: "azdek-laundry-gel",
    title: "Универсальное чистящее средство",
    subtitle: "На каждый день",
    price: "3990 KZT",
  },
  {
    slug: "azdek-dish-liquid-citrus",
    title: "Набор для кухни",
    subtitle: "Базовый набор",
    price: "1890 KZT",
  },
];

const SCENTS = [
  { name: "Fresh", note: "Чистый и бодрый" },
  { name: "Soft", note: "Спокойный и мягкий" },
  { name: "Neutral", note: "Без резкого запаха" },
  { name: "Citrus", note: "Яркий и свежий" },
  { name: "Herbal", note: "Травяной и фокусный" },
];

export const metadata: Metadata = {
  title: "Azdek - Главная",
  description: "Современная бытовая химия для дома и бизнеса. Чисто, быстро, предсказуемо.",
};

export default function HomePage() {
  const hero = getProductMedia("azdek-laundry-gel");
  const bento = getProductMedia("azdek-softener-fresh");
  const story = getProductMedia("azdek-dish-liquid-citrus");

  return (
    <Section className="home-v3-section">
      <Container className="home-v3-shell">
        <section className="home-v3-hero">
          <div className="home-v3-hero-copy">
            <p className="home-v3-kicker">Azdek Home Care</p>
            <h1 className="home-v3-title">Чистота без лишних затрат времени</h1>
            <p className="home-v3-subtitle">
              Жир, налет и грязь уходят с первого раза. Выбирайте средство под задачу и получайте результат без лишних усилий.
            </p>
            <div className="home-v3-actions">
              <Link href="/catalog">
                <Button>Выбрать решение</Button>
              </Link>
              <Link href="/catalog">
                <Button variant="secondary">Смотреть решения</Button>
              </Link>
            </div>
          </div>
          <div className="home-v3-hero-media">
            <SmartImage
              className="home-v3-hero-image"
              src={hero.hero}
              fallbackSrc="/media/laundry-gel.svg"
              alt="Azdek hero"
              fill
              sizes="(max-width: 1024px) 100vw, 56vw"
              priority
            />
          </div>
        </section>

        <section className="home-v3-scent-bar">
          <div className="home-v3-row-head">
            <h2 className="home-v3-heading">Решения по задачам</h2>
            <p>Выберите направление и переходите к нужному средству</p>
          </div>
          <div className="home-v3-scent-bubbles">
            {SCENTS.map((item) => (
              <article key={item.name} className="home-v3-bubble-item">
                <div className="home-v3-bubble-media">
                  <SmartImage
                    src={
                      item.name === "Fresh"
                        ? hero.card
                        : item.name === "Soft"
                        ? bento.card
                        : item.name === "Neutral"
                        ? story.card
                        : item.name === "Citrus"
                        ? hero.hero
                        : bento.hero
                    }
                    fallbackSrc="/media/laundry-gel.svg"
                    alt={item.name}
                    width={200}
                    height={200}
                    loading="lazy"
                  />
                </div>
                <h3>{item.name === "Fresh" ? "Убрать жир" : item.name === "Soft" ? "Убрать налет" : item.name === "Neutral" ? "Убрать запах" : item.name === "Citrus" ? "Для ванной" : "Универсальная уборка"}</h3>
                <p>{item.note}</p>
              </article>
            ))}
          </div>
        </section>

        <section className="home-v3-bento">
          <article className="home-v3-bento-main">
            <SmartImage
              className="home-v3-bento-image"
              src={bento.hero}
              fallbackSrc="/media/laundry-gel.svg"
              alt="Refilling the future"
              fill
              sizes="(max-width: 1024px) 100vw, 66vw"
            />
            <div className="home-v3-bento-overlay">
              <h3>Плохая химия тратит ваше время</h3>
              <p>Azdek работает сразу. Без повторной чистки. Без лишних движений.</p>
              <Link href="/catalog">
                <Button>Выбрать средство</Button>
              </Link>
            </div>
          </article>
          <article className="home-v3-bento-side">
            <p className="home-v3-kicker">Почему Azdek</p>
            <h3>Быстро. Чисто. Без перегруза.</h3>
            <p>Сильнее обычного масс-маркета. Экономит время. Четкий результат без «почти чисто».</p>
          </article>
        </section>

        <section className="home-v3-story">
          <article className="home-v3-story-main">
            <SmartImage
              className="home-v3-story-image"
              src={story.hero}
              fallbackSrc="/media/laundry-gel.svg"
              alt="Kitchen Alchemy"
              fill
              sizes="(max-width: 1024px) 100vw, 64vw"
            />
            <div className="home-v3-story-overlay">
              <h3>Результат, а не процесс</h3>
              <p>Вы убираете проблему, а не тратите полдня на уборку.</p>
              <Link href="/catalog">
                <Button variant="secondary">Купить</Button>
              </Link>
            </div>
          </article>
          <article className="home-v3-story-side">
            <div className="home-v3-story-tile">
              <p className="home-v3-kicker">Ключевая идея</p>
              <h4>Меньше шума. Больше покупки.</h4>
              <p>Каждый блок ведет к действию. Каждый текст отвечает на вопрос «зачем мне это сейчас».</p>
            </div>
            <div className="home-v3-story-thumb">
              <SmartImage
                className="home-v3-story-thumb-image"
                src={bento.card}
                fallbackSrc="/media/laundry-gel.svg"
                alt="Azdek shelf"
                width={700}
                height={500}
                loading="lazy"
              />
            </div>
          </article>
        </section>

        <section className="home-v3-essentials">
          <div className="home-v3-row-head">
            <h2 className="home-v3-heading">Популярные товары</h2>
            <Link href="/catalog">
              <Button variant="ghost">Все товары</Button>
            </Link>
          </div>
          <div className="home-v3-product-grid">
            {ESSENTIALS.map((item) => {
              const media = getProductMedia(item.slug);
              return (
                <article key={item.slug} className="home-v3-product-card">
                  <div className="home-v3-product-media">
                    <SmartImage
                      className="home-v3-product-image"
                      src={media.card}
                      fallbackSrc="/media/laundry-gel.svg"
                      alt={item.title}
                      width={560}
                      height={700}
                      loading="lazy"
                    />
                  </div>
                  <div className="home-v3-product-copy">
                    <p className="home-v3-meta">{item.subtitle}</p>
                    <h3>{item.title}</h3>
                    <p className="home-v3-product-note">Понятный выбор для ежедневной уборки</p>
                    <div className="home-v3-product-foot">
                      <span>{item.price}</span>
                      <Link href={`/catalog/${item.slug}`}>
                        <Button variant="secondary">Купить</Button>
                      </Link>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        </section>

        <section className="home-v3-newsletter">
          <p className="home-v3-kicker">Финальный дожим</p>
          <h2 className="home-v3-heading">Перестаньте тратить время на слабые средства</h2>
          <div className="home-v3-news-form">
            <input type="email" className="ui-input" placeholder="Ваш email для подтверждения заказа" />
            <Button>Выбрать решение</Button>
          </div>
        </section>
      </Container>
    </Section>
  );
}

