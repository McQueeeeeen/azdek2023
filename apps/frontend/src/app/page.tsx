import Link from "next/link";
import Container from "@/components/ui/container";
import Section from "@/components/ui/section";
import Button from "@/components/ui/button";
import Card from "@/components/ui/card";

export default function HomePage() {
  return (
    <Section>
      <Container className="grid home-grid">
        <Card className="hero-card hero-card-premium">
          <p className="small">Казахстан · D2C и B2B-продажи</p>
          <h1 className="h1">Премиальная бытовая химия без лишнего шума</h1>
          <p className="text-secondary hero-copy">
            AZDEK объединяет продуктовый опыт storefront и надежный backend commerce: каталог, корзина, оформление,
            оплаты и статусы заказов в одном чистом интерфейсе.
          </p>
          <div className="hero-actions">
            <Link href="/catalog">
              <Button>Смотреть каталог</Button>
            </Link>
            <Link href="/login">
              <Button variant="secondary">Войти в кабинет</Button>
            </Link>
          </div>
        </Card>

        <Card className="home-feature-card">
          <h2 className="h3">Собран для реальной коммерции</h2>
          <p className="text-secondary">Рабочие сценарии: каталог, корзина, checkout, платежи, заказы, кабинет и B2B.</p>
        </Card>

        <Card className="home-feature-card">
          <h2 className="h3">Product-first интерфейс</h2>
          <p className="text-secondary">Минимум визуального шума, единая дизайн-система и стабильная мобильная версия.</p>
        </Card>
      </Container>
    </Section>
  );
}
