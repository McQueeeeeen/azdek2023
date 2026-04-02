import type { Metadata } from "next";
import Link from "next/link";
import Container from "@/components/ui/container";
import Section from "@/components/ui/section";
import Button from "@/components/ui/button";

export const metadata: Metadata = {
  title: "Azdek - Главная",
  description: "Интернет-магазин бытовой химии Azdek",
};

const QUICK_POINTS = [
  "Жир и налет уходят с первого раза",
  "Понятный выбор по задачам",
  "Быстрое оформление заказа",
];

const QUICK_CATEGORIES = ["Кухня", "Ванная", "Полы", "Ткань", "Универсальная уборка"];

export default function HomePage() {
  return (
    <Section>
      <Container className="grid">
        <div className="ui-card">
          <h1>Azdek</h1>
          <p className="text-secondary">Бытовая химия без лишнего шума. Только рабочие средства и быстрый результат.</p>
          <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
            <Link href="/catalog">
              <Button>Перейти в каталог</Button>
            </Link>
            <Link href="/cart">
              <Button variant="secondary">Открыть корзину</Button>
            </Link>
          </div>
        </div>

        <div className="ui-card">
          <h2>Почему выбирают Azdek</h2>
          <ul style={{ margin: 0, paddingLeft: 18 }}>
            {QUICK_POINTS.map((point) => (
              <li key={point}>{point}</li>
            ))}
          </ul>
        </div>

        <div className="ui-card">
          <h2>Решения по задачам</h2>
          <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
            {QUICK_CATEGORIES.map((item) => (
              <span key={item} className="ui-badge">
                {item}
              </span>
            ))}
          </div>
        </div>
      </Container>
    </Section>
  );
}