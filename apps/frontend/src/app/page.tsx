import Link from "next/link";
import Container from "@/components/ui/container";
import Section from "@/components/ui/section";
import Button from "@/components/ui/button";
import Card from "@/components/ui/card";
import SmartImage from "@/components/ui/smart-image";
import { getProductMedia } from "@/lib/product-media";

const PROMO_OFFERS = [
  "До 60 стирок с одной канистры",
  "Меньше расход, стабильный результат",
  "Формула, созданная химиком",
];

const ADVANTAGES = [
  { title: "Концентрат без воды", text: "Рабочая формула вместо лишнего объёма и переплаты." },
  { title: "Чисто с первого цикла", text: "Удаляет повседневные загрязнения без агрессивного запаха." },
  { title: "Предсказуемый расход", text: "Понятная дозировка и экономика каждой стирки." },
];

const HITS = [
  { slug: "azdek-laundry-gel", name: "Гель для стирки Color", tag: "Хит продаж" },
  { slug: "azdek-softener-fresh", name: "Кондиционер Fresh", tag: "Популярно" },
  { slug: "azdek-dish-liquid-citrus", name: "Средство для посуды Citrus", tag: "Для кухни" },
];

const TRUST_POINTS = [
  { title: "4.9/5 в отзывах", text: "Оценка покупателей на основных SKU." },
  { title: "Отгрузка в день заказа", text: "Для заказов, подтвержденных до 16:00." },
  { title: "Контроль партии", text: "Стабильный состав от партии к партии." },
  { title: "Поддержка B2B", text: "Опт, документы и персональные условия." },
];

export default function HomePage() {
  const heroMedia = getProductMedia("azdek-laundry-gel");

  return (
    <Section>
      <Container className="grid home-grid-ready">
        <Card className="promo-strip">
          <p className="small promo-strip-label">Премиум-линейка AZDEK</p>
          <div className="promo-strip-list">
            {PROMO_OFFERS.map((offer) => (
              <span key={offer} className="promo-chip">
                {offer}
              </span>
            ))}
          </div>
        </Card>

        <Card className="hero-card hero-card-premium">
          <p className="small">Казахстан · Performance Home Care</p>
          <h1 className="h1">Концентрированные средства для стирки, разработанные химиком</h1>
          <p className="text-secondary hero-copy">Максимум чистоты. Минимум лишнего. Продукт, который работает быстро и стабильно.</p>
          <div className="hero-actions">
            <Link href="/catalog">
              <Button>Смотреть продукцию</Button>
            </Link>
            <Link href="/checkout">
              <Button variant="secondary">Оформить заказ</Button>
            </Link>
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

        <div className="advantages-grid">
          {ADVANTAGES.map((item) => (
            <Card key={item.title} className="home-feature-card">
              <h2 className="h3">{item.title}</h2>
              <p className="text-secondary">{item.text}</p>
            </Card>
          ))}
        </div>

        <Card className="hits-section">
          <div className="page-header">
            <h2 className="h2">Наша продукция</h2>
            <Link href="/catalog">
              <Button variant="ghost">Смотреть всё</Button>
            </Link>
          </div>
          <div className="hits-grid">
            {HITS.map((item) => {
              const media = getProductMedia(item.slug);
              return (
                <article key={item.name} className="hit-item">
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
                  <Link href="/catalog">
                    <Button variant="secondary" className="full-width">
                      Смотреть товар
                    </Button>
                  </Link>
                </article>
              );
            })}
          </div>
        </Card>

        <Card className="trust-band">
          <div className="page-header">
            <h2 className="h2">Почему нам доверяют</h2>
            <Link href="/catalog">
              <Button variant="secondary">Перейти в каталог</Button>
            </Link>
          </div>
          <div className="trust-grid">
            {TRUST_POINTS.map((item) => (
              <article key={item.title} className="trust-item">
                <h3 className="h3">{item.title}</h3>
                <p className="text-secondary">{item.text}</p>
              </article>
            ))}
          </div>
        </Card>

        <Card className="promo-strip">
          <p className="small promo-strip-label">Сравните результат после первой стирки</p>
          <div className="hero-actions">
            <Link href="/catalog">
              <Button>Перейти в каталог</Button>
            </Link>
          </div>
        </Card>
      </Container>
    </Section>
  );
}
