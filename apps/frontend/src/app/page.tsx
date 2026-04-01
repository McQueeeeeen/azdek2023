import Link from "next/link";
import Container from "@/components/ui/container";
import Section from "@/components/ui/section";
import Button from "@/components/ui/button";
import Card from "@/components/ui/card";

const ADVANTAGES = [
  { title: "Бережные формулы", text: "Эффективно очищают и подходят для регулярного использования дома." },
  { title: "Доставка по Казахстану", text: "Отправляем заказы по городу и по регионам с понятными сроками." },
  { title: "Понятные составы", text: "В карточке товара: состав, применение, меры предосторожности и хранение." },
];

const HITS = [
  { name: "Гель для стирки Color", tag: "Хит продаж" },
  { name: "Концентрат Universal", tag: "Для дома" },
  { name: "Пятновыводитель Active", tag: "Новинка" },
];

export default function HomePage() {
  return (
    <Section>
      <Container className="grid home-grid-ready">
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
          <div className="hero-product-mock" aria-hidden>
            <div className="mock-bottle" />
            <div className="mock-bottle small" />
            <div className="mock-badge">Доставка от 24 часов</div>
          </div>
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
            <h2 className="h2">Популярные товары</h2>
            <Link href="/catalog">
              <Button variant="ghost">Смотреть все</Button>
            </Link>
          </div>
          <div className="hits-grid">
            {HITS.map((item) => (
              <article key={item.name} className="hit-item">
                <div className="hit-image" aria-hidden />
                <p className="small">{item.tag}</p>
                <h3 className="h3">{item.name}</h3>
                <Link href="/catalog">
                  <Button variant="secondary" className="full-width">Выбрать</Button>
                </Link>
              </article>
            ))}
          </div>
        </Card>
      </Container>
    </Section>
  );
}
