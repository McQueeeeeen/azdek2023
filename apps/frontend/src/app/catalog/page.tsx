import type { Metadata } from "next";
import { apiGet, CatalogProduct } from "@/lib/api";
import Container from "@/components/ui/container";
import Section from "@/components/ui/section";
import CatalogBrowser from "@/components/commerce/catalog-browser";
import EmptyState from "@/components/ui/empty-state";
import ErrorState from "@/components/ui/error-state";

export const metadata: Metadata = {
  title: "Каталог Azdek - решения для дома и бизнеса",
  description: "Выбирайте бытовую химию по задаче: убрать жир, налет, запах и другие проблемы уборки.",
};

export default async function CatalogPage() {
  try {
    const products = await apiGet<CatalogProduct[]>("/catalog/products");

    return (
      <Section>
        <Container className="grid">
          {products.length > 0 ? (
            <CatalogBrowser products={products} />
          ) : (
            <EmptyState
              title="Пока нет товаров"
              description="Каталог сейчас пуст. Попробуйте обновить страницу чуть позже."
              actionHref="/"
              actionText="На главную"
            />
          )}
        </Container>
      </Section>
    );
  } catch (error) {
    return (
      <Section>
        <Container>
          <ErrorState title="Каталог временно недоступен" message={(error as Error).message} />
        </Container>
      </Section>
    );
  }
}
