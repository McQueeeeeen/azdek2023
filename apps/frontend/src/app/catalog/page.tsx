import Container from "@/components/ui/container";
import Section from "@/components/ui/section";
import CatalogBrowser from "@/components/commerce/catalog-browser";
import { getStorefrontProducts } from "@/lib/storefront";

export default async function CatalogPage() {
  const products = await getStorefrontProducts();
  const hasError = products.length === 0;

  return (
    <Section>
      <Container>
        <CatalogBrowser products={products} hasError={hasError} />
      </Container>
    </Section>
  );
}
