import Link from "next/link";
import { apiGet, CatalogProduct } from "@/lib/api";
import Container from "@/components/ui/container";
import Section from "@/components/ui/section";
import PageHeader from "@/components/ui/page-header";
import CatalogBrowser from "@/components/commerce/catalog-browser";
import EmptyState from "@/components/ui/empty-state";
import ErrorState from "@/components/ui/error-state";
import Button from "@/components/ui/button";

export default async function CatalogPage() {
  try {
    const products = await apiGet<CatalogProduct[]>("/catalog/products");

    return (
      <Section>
        <Container className="grid">
          <PageHeader
            title="Каталог"
            subtitle="Чистый ассортимент без шума: выберите продукт, добавьте в корзину и оформите за минуту"
            action={
              <Link href="/cart">
                <Button variant="secondary">Открыть корзину</Button>
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
