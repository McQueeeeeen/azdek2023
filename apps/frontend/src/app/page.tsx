import Link from "next/link";
import Container from "@/components/ui/container";
import Section from "@/components/ui/section";
import Button from "@/components/ui/button";
import Card from "@/components/ui/card";

const PROMO_OFFERS = [
  "START10: welcome discount for your first order",
  "Free delivery across Kazakhstan from 20 000 KZT",
  "Secure checkout for B2C and B2B flows",
];

const ADVANTAGES = [
  { title: "Clean Formulas", text: "Эффективные и аккуратные формулы для ежедневного использования дома." },
  { title: "Fast Delivery", text: "Быстрая отгрузка по городу и в регионы с понятными сроками." },
  { title: "Transparent Labels", text: "Состав, инструкция и меры предосторожности в каждой карточке." },
];

const HITS = [
  { name: "Гель для стирки Color", tag: "Хит продаж", image: "/media/laundry-gel.svg" },
  { name: "Кондиционер Fresh", tag: "Популярно", image: "/media/softener-fresh.svg" },
  { name: "Dish Liquid Citrus", tag: "Для кухни", image: "/media/dish-liquid-citrus.svg" },
];

const TRUST_POINTS = [
  { title: "4.9/5 reviews", text: "Проверенные оценки покупателей по ключевым SKU." },
  { title: "Same-day dispatch", text: "Для заказов, созданных до 16:00 в рабочие дни." },
  { title: "Quality control", text: "Контроль партий и стабильные формулы перед отгрузкой." },
  { title: "B2B support", text: "Коммерческие предложения, счета и персональные условия." },
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
              <h1 className="h1">Commerce infrastructure, simplified for household essentials.</h1>
              <p className="text-secondary hero-copy">
            Премиальный storefront в эстетике Elemental: прозрачный каталог, чистый checkout и предсказуемая доставка.
              </p>
              <div className="hero-actions">
                <Link href="/catalog">
                  <Button>Browse catalog</Button>
                </Link>
                <Link href="/checkout">
                  <Button variant="secondary">Start checkout</Button>
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
                  <Button variant="secondary">Start shopping</Button>
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
                  <Button variant="ghost">View all</Button>
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
                    View item
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
