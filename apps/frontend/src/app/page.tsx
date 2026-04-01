import Link from "next/link";
import Container from "@/components/ui/container";
import Section from "@/components/ui/section";
import Button from "@/components/ui/button";
import Card from "@/components/ui/card";

const PROMO_OFFERS = [
  "Скидка 10% на первый заказ по промокоду START10",
  "Бесплатная доставка по Казахстану от 20 000 KZT",
  "Оплата картой, по ссылке или при подтверждении B2B-заказа",
];

const ADVANTAGES = [
  { title: "Бережные формулы", text: "Эффективно очищают и подходят для регулярного использования дома." },
  { title: "Доставка по Казахстану", text: "Отправляем заказы по городу и по регионам с понятными сроками." },
  { title: "Понятные составы", text: "В карточке товара: состав, применение, меры предосторожности и хранение." },
];

const HITS = [
  { name: "Гель для стирки Color", tag: "Хит продаж", image: "/media/laundry-gel.svg" },
  { name: "Кондиционер Fresh", tag: "Популярно", image: "/media/softener-fresh.svg" },
  { name: "Dish Liquid Citrus", tag: "Для кухни", image: "/media/dish-liquid-citrus.svg" },
];

const TRUST_POINTS = [
  { title: "4.9/5 по отзывам", text: "Реальные оценки покупателей по ключевым SKU." },
  { title: "Отправка в день заказа", text: "Для заказов до 16:00 в рабочие дни." },
  { title: "Контроль качества", text: "Стабильные формулы и проверка партий перед отгрузкой." },
  { title: "Поддержка B2B", text: "Оптовые условия, счета и персональные коммерческие предложения." },
];

export default function HomePage() {
  return (
    <Section>
      <Container className="grid home-grid-ready">
        <Card className="promo-strip">
          <p className="small promo-strip-label">Акции и условия</p>
          <div className="promo-strip-list">
            {PROMO_OFFERS.map((offer) => (
              <span key={offer} className="promo-chip">
                {offer}
              </span>
            ))}
          </div>
        </Card>

        <Card className="hero-card hero-card-premium">
          <p className="small">Казахстан · Бытовая химия AZDEK</p>
          <h1 className="h1">Чистота без компромиссов. Заказывайте онлайн уже сегодня.</h1>
          <p className="text-secondary hero-copy">
            Премиальный интернет-магазин бытовой химии: понятный каталог, быстрый заказ, безопасная оплата и
            прозрачная доставка.
          </p>
          <div className="hero-actions">
            <Link href="/catalog">
              <Button>Перейти в каталог</Button>
            </Link>
            <Link href="/checkout">
              <Button variant="secondary">Оформить заказ</Button>
            </Link>
          </div>
        </Card>

        <Card className="hero-visual-card">
          <img className="hero-product-image" src="/media/laundry-gel.svg" alt="AZDEK Laundry Gel" />
        </Card>

        <div className="advantages-grid">
          {ADVANTAGES.map((item) => (
            <Card key={item.title} className="home-feature-card">
              <h2 className="h3">{item.title}</h2>
              <p className="text-secondary">{item.text}</p>
            </Card>
          ))}
        </div>

        <Card className="trust-band">
          <div className="page-header">
            <h2 className="h2">Почему нам доверяют</h2>
            <Link href="/catalog">
              <Button variant="secondary">Собрать заказ</Button>
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

        <Card className="hits-section">
          <div className="page-header">
            <h2 className="h2">Популярные товары</h2>
            <Link href="/catalog">
              <Button variant="ghost">Смотреть все</Button>
            </Link>
          </div>
          <div className="hits-grid">
            {HITS.map((item) => (
              <article key={item.name} className="hit-item">
                <div className="hit-image-wrap">
                  <img className="hit-image" src={item.image} alt={item.name} loading="lazy" />
                </div>
                <p className="small">{item.tag}</p>
                <h3 className="h3">{item.name}</h3>
                <Link href="/catalog">
                  <Button variant="secondary" className="full-width">
                    Выбрать
                  </Button>
                </Link>
              </article>
            ))}
          </div>
        </Card>
      </Container>
    </Section>
  );
}
