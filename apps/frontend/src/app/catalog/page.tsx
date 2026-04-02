import type { Metadata } from "next";
import Link from "next/link";
import { apiGet, CatalogProduct } from "@/lib/api";
import Container from "@/components/ui/container";
import Section from "@/components/ui/section";
import PageHeader from "@/components/ui/page-header";
import CatalogBrowser from "@/components/commerce/catalog-browser";
import EmptyState from "@/components/ui/empty-state";
import ErrorState from "@/components/ui/error-state";
import Button from "@/components/ui/button";

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
          <PageHeader
            title="Каталог"
            subtitle="Только нужные средства. Без лишнего."
            action={
              <Link href="/cart">
                <Button variant="secondary">Найти нужное</Button>
              </Link>
            }
          />
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
