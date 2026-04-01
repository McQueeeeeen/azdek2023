import Link from "next/link";
import { apiGet, CatalogProduct } from "@/lib/api";
import AddToCartButton from "@/components/add-to-cart-button";
import ProductViewTracker from "@/components/product-view-tracker";
import Container from "@/components/ui/container";
import Section from "@/components/ui/section";
import Card from "@/components/ui/card";
import PriceBlock from "@/components/commerce/price-block";
import StockBadge from "@/components/commerce/stock-badge";
import Divider from "@/components/ui/divider";
import ErrorState from "@/components/ui/error-state";
import Button from "@/components/ui/button";
import ProductGallery from "@/components/commerce/product-gallery";

export default async function ProductPage({ params }: { params: { slug: string } }) {
  try {
    const product = await apiGet<CatalogProduct>(`/catalog/products/${params.slug}`);
    let recommendations: CatalogProduct[] = [];
    try {
      recommendations = await apiGet<CatalogProduct[]>(`/catalog/products/${params.slug}/recommendations?limit=3`);
    } catch {
      recommendations = [];
    }

    return (
      <Section>
        <Container className="grid">
          <ProductViewTracker productId={product.id} slug={product.slug} />
          <div className="product-layout">
            <Card className="product-gallery">
              <ProductGallery product={product} />
            </Card>
            <Card className="product-info">
              <p className="small">{product.category.name}</p>
              <h1 className="h2">{product.name}</h1>
              <p className="text-secondary">{product.description}</p>
              <Divider />
              <div className="product-highlights">
                <p>Оптимальная концентрация для ежедневного использования.</p>
                <p>Стабильная формула для дома, розницы и малого опта.</p>
                <p>Подходит для повторных заказов и регулярных поставок.</p>
              </div>
              <Divider />
              <div className="grid">
                {product.variants.map((variant) => (
                  <Card key={variant.id} className="variant-row">
                    <div className="variant-row-main">
                      <h3 className="h3">{variant.title}</h3>
                      <p className="small">SKU: {variant.sku}</p>
                      <PriceBlock amount={variant.price} currency={variant.currency} />
                    </div>
                    <div className="variant-row-actions">
                      <StockBadge stock={variant.stock} />
                      <AddToCartButton variantId={variant.id} />
                    </div>
                  </Card>
                ))}
              </div>
            </Card>
          </div>

          {recommendations.length > 0 ? (
            <Card>
              <div className="page-header">
                <h2 className="h3">Похожие товары</h2>
                <Link href="/catalog">
                  <Button variant="ghost">Все товары</Button>
                </Link>
              </div>
              <div className="recommend-list">
                {recommendations.map((item) => (
                  <Link key={item.id} href={`/catalog/${item.slug}`} className="recommend-item">
                    <p>{item.name}</p>
                    <p className="small">
                      {item.variants[0]?.price ?? 0} {item.variants[0]?.currency ?? "KZT"}
                    </p>
                  </Link>
                ))}
              </div>
            </Card>
          ) : null}
        </Container>
      </Section>
    );
  } catch (error) {
    return (
      <Section>
        <Container>
          <ErrorState title="Товар временно недоступен" message={(error as Error).message} />
        </Container>
      </Section>
    );
  }
}
