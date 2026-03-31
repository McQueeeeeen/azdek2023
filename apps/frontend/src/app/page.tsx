import Link from "next/link";
import Container from "@/components/ui/container";
import Section from "@/components/ui/section";
import Button from "@/components/ui/button";
import Card from "@/components/ui/card";

export default function HomePage() {
  return (
    <Section>
      <Container className="grid home-grid">
        <Card className="hero-card">
          <p className="small">Казахстан: D2C и B2B продажи</p>
          <h1 className="h1">AZDEK</h1>
          <p className="text-secondary">
            Премиальная бытовая химия с быстрым оформлением заказа и надежной обработкой.
          </p>
          <div className="hero-actions">
            <Link href="/catalog">
              <Button>Смотреть каталог</Button>
            </Link>
            <Link href="/account">
              <Button variant="secondary">Мой кабинет</Button>
            </Link>
          </div>
        </Card>
        <Card className="home-feature-card">
          <h2 className="h3">Сделано для реальной торговли</h2>
          <p className="text-secondary">Каталог, корзина, checkout, оплаты, заказы, кабинет и B2B-сценарии.</p>
        </Card>
        <Card className="home-feature-card">
          <h2 className="h3">Быстрый и чистый продуктовый UI</h2>
          <p className="text-secondary">Минималистичный интерфейс на стабильных API-контрактах.</p>
        </Card>
      </Container>
    </Section>
  );
}
