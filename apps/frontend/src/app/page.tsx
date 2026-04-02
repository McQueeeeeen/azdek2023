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
    subtitle: "Kitchen Ritual",
    price: "1490 KZT",
  },
  {
    slug: "azdek-softener-fresh",
    title: "Средство от известкового налета",
    subtitle: "Bathroom Ritual",
    price: "2290 KZT",
  },
  {
    slug: "azdek-laundry-gel",
    title: "Универсальное чистящее средство",
    subtitle: "Daily Ritual",
    price: "3990 KZT",
  },
];

const SCENTS = [
  { name: "Fresh", note: "Чистый и бодрый" },
  { name: "Soft", note: "Спокойный и мягкий" },
  { name: "Neutral", note: "Без резкого запаха" },
  { name: "Citrus", note: "Яркий и свежий" },
];

export const metadata: Metadata = {
  title: "Azdek - Sustainable Rituals",
  description: "Современная бытовая химия для дома и бизнеса. Чисто, быстро, предсказуемо.",
};

export default function HomePage() {
  const hero = getProductMedia("azdek-laundry-gel");
  const bento = getProductMedia("azdek-softener-fresh");

  return (
    <Section className="home-v3-section">
      <Container className="home-v3-shell">
        <section className="home-v3-hero">
          <div className="home-v3-hero-copy">
            <p className="home-v3-kicker">New collection</p>
            <h1 className="home-v3-title">Elevating the daily clean.</h1>
            <p className="home-v3-subtitle">
              Экологичная бытовая химия Azdek, которая делает уборку частью понятного и спокойного ритуала.
            </p>
            <div className="home-v3-actions">
              <Link href="/catalog">
                <Button>Купить</Button>
              </Link>
              <Link href="/catalog">
                <Button variant="secondary">Смотреть каталог</Button>
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
            <h2 className="home-v3-heading">The Sensory Bar</h2>
            <p>Подберите тон аромата под свое пространство</p>
          </div>
          <div className="home-v3-scent-grid">
            {SCENTS.map((item) => (
              <article key={item.name} className="home-v3-scent-item">
                <h3>{item.name}</h3>
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
              <h3>Refilling the future</h3>
              <p>Меньше лишнего пластика. Больше понятных и рабочих формул на каждый день.</p>
              <Link href="/catalog">
                <Button>Купить</Button>
              </Link>
            </div>
          </article>
          <article className="home-v3-bento-side">
            <p className="home-v3-kicker">Plant-derived potency</p>
            <h3>Быстро. Чисто. Без перегруза.</h3>
            <p>Каталог собран как подборка решений, а не хаотичный список товаров.</p>
          </article>
        </section>

        <section className="home-v3-essentials">
          <div className="home-v3-row-head">
            <h2 className="home-v3-heading">The Essentials</h2>
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
          <p className="home-v3-kicker">Inner circle</p>
          <h2 className="home-v3-heading">Получайте короткие подборки и новости Azdek</h2>
          <div className="home-v3-news-form">
            <input type="email" className="ui-input" placeholder="Ваш email" />
            <Button>Подписаться</Button>
          </div>
        </section>
      </Container>
    </Section>
  );
}

