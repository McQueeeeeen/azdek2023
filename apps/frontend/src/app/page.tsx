import Link from "next/link";
import Container from "@/components/ui/container";
import Section from "@/components/ui/section";
import Button from "@/components/ui/button";
import Card from "@/components/ui/card";
import SmartImage from "@/components/ui/smart-image";
import { getProductMedia } from "@/lib/product-media";

const VALUE_POINTS = [
  "До 60 стирок с одной канистры",
  "Формула без лишних наполнителей",
  "Стабильный результат с первого цикла",
];

const FEATURED = [
  { slug: "azdek-laundry-gel", name: "Гель для стирки Color", tag: "Для ежедневной стирки" },
  { slug: "azdek-softener-fresh", name: "Кондиционер Fresh", tag: "Мягкость и свежесть" },
  { slug: "azdek-dish-liquid-citrus", name: "Средство для посуды Citrus", tag: "Быстрое обезжиривание" },
];

const TRUST = [
  { title: "4.9/5", text: "средняя оценка покупателей" },
  { title: "Доставка день в день", text: "для заказов до 16:00" },
  { title: "B2B поддержка", text: "счета, документы, персональные условия" },
];

export default function HomePage() {
  const heroMedia = getProductMedia("azdek-laundry-gel");

  return (
    <Section>
      <Container className="grid home-grid-ready">
        <Card className="hero-card hero-card-premium">
          <p className="small">AZDEK · PERFORMANCE HOME CARE</p>
          <h1 className="h1">Концентрированные средства для стирки, разработанные химиком</h1>
          <p className="text-secondary hero-copy">Чистота с первого цикла, предсказуемый расход и быстрый путь до оформления.</p>
          <div className="hero-actions">
            <Link href="/catalog">
              <Button>Смотреть продукцию</Button>
            </Link>
            <Link href="/cart">
              <Button variant="secondary">Открыть корзину</Button>
            </Link>
          </div>
          <div className="promo-strip-list">
            {VALUE_POINTS.map((item) => (
              <span key={item} className="promo-chip">
                {item}
              </span>
            ))}
          </div>
        </Card>

        <Card className="hero-visual-card">
          <SmartImage
            className="hero-product-image"
            src={heroMedia.hero}
            fallbackSrc="/media/laundry-gel.svg"
            alt="AZDEK Laundry Gel"
            fill
            sizes="(max-width: 1024px) 100vw, 42vw"
            priority
          />
        </Card>

        <Card className="hits-section">
          <div className="page-header">
            <h2 className="h2">Хиты каталога</h2>
            <Link href="/catalog">
              <Button variant="ghost">Весь каталог</Button>
            </Link>
          </div>
          <div className="hits-grid">
            {FEATURED.map((item) => {
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
                      sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                      loading="lazy"
                    />
                  </div>
                  <p className="small">{item.tag}</p>
                  <h3 className="h3">{item.name}</h3>
                  <Link href={`/catalog/${item.slug}`}>
                    <Button variant="secondary" className="full-width">
                      Перейти к товару
                    </Button>
                  </Link>
                </article>
              );
            })}
          </div>
        </Card>

        <Card className="trust-band">
          <div className="page-header">
            <h2 className="h2">Почему выбирают AZDEK</h2>
            <Link href="/checkout">
              <Button>Перейти к оформлению</Button>
            </Link>
          </div>
          <div className="trust-grid" style={{ gridTemplateColumns: "repeat(3, minmax(0, 1fr))" }}>
            {TRUST.map((item) => (
              <article key={item.title} className="trust-item">
                <h3 className="h3">{item.title}</h3>
                <p className="text-secondary">{item.text}</p>
              </article>
            ))}
          </div>
        </Card>
      </Container>
    </Section>
  );
}
