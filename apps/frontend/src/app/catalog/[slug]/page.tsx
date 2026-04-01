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
import { getProductCommercialContent } from "@/lib/product-commercial-content";

function renderStars(rating: number): string {
  const filled = "★".repeat(Math.max(0, Math.min(5, rating)));
  const empty = "☆".repeat(Math.max(0, 5 - rating));
  return `${filled}${empty}`;
}

function formatMoney(amount: number, currency: string): string {
  return `${Math.round(amount)} ${currency}`;
}

export default async function ProductPage({ params }: { params: { slug: string } }) {
  try {
    const product = await apiGet<CatalogProduct>(`/catalog/products/${params.slug}`);
    const commercial = getProductCommercialContent(product.slug);

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
              <p className="text-secondary">{commercial.shortDescription}</p>
              <Divider />
              <div className="product-highlights">
                {commercial.highlights.map((item) => (
                  <p key={item}>{item}</p>
                ))}
              </div>
              <Divider />
              <div className="grid">
                <h2 className="h3">Как использовать</h2>
                <p className="text-secondary">{commercial.usage}</p>
              </div>
              <Divider />
              <div className="grid">
                <h2 className="h3">Состав</h2>
                <p className="text-secondary">{commercial.composition}</p>
              </div>
              <Divider />
              <div className="grid">
                <h2 className="h3">Меры предосторожности</h2>
                <p className="text-secondary">{commercial.precautions}</p>
              </div>
              <Divider />
              <Card>
                <h2 className="h3">Экономика</h2>
                <p className="text-secondary">1 упаковка = до {commercial.washCount} стирок</p>
                {product.variants[0] ? (
                  <p className="text-secondary">
                    Стоимость одной стирки — от{" "}
                    {formatMoney(product.variants[0].price / Math.max(1, commercial.washCount), product.variants[0].currency)}
                  </p>
                ) : null}
              </Card>
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

          <div className="product-content-grid">
            <Card>
              <h2 className="h3">Отзывы покупателей</h2>
              <div className="reviews-list">
                {commercial.reviews.map((review) => (
                  <article key={`${review.author}:${review.text}`} className="review-item">
                    <p className="review-stars" aria-label={`Оценка ${review.rating} из 5`}>
                      {renderStars(review.rating)}
                    </p>
                    <p>{review.text}</p>
                    <p className="small">{review.author}</p>
                  </article>
                ))}
              </div>
            </Card>

            <Card>
              <h2 className="h3">Вопросы по использованию</h2>
              <div className="faq-list">
                {commercial.faq.map((item) => (
                  <details key={item.question} className="faq-item">
                    <summary>{item.question}</summary>
                    <p className="text-secondary">{item.answer}</p>
                  </details>
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
