import type { Metadata } from "next";
import Link from "next/link";
import { apiGet, CatalogProduct } from "@/lib/api";
import AddToCartButton from "@/components/add-to-cart-button";
import ProductViewTracker from "@/components/product-view-tracker";
import Container from "@/components/ui/container";
import Section from "@/components/ui/section";
import ProductGallery from "@/components/commerce/product-gallery";
import ErrorState from "@/components/ui/error-state";
import Button from "@/components/ui/button";
import StockBadge from "@/components/commerce/stock-badge";
import { getProductCommercialContent } from "@/lib/product-commercial-content";
import { formatMoney } from "@/lib/money";

function renderStars(rating: number): string {
  const filled = "★".repeat(Math.max(0, Math.min(5, rating)));
  const empty = "☆".repeat(Math.max(0, 5 - rating));
  return `${filled}${empty}`;
}

export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  try {
    const product = await apiGet<CatalogProduct>(`/catalog/products/${params.slug}`);
    return {
      title: `${product.name} - Azdek`,
      description: product.description,
    };
  } catch {
    return {
      title: "Товар - Azdek",
      description: "Бытовая химия, которая работает с первого раза.",
    };
  }
}

export default async function ProductPage({ params }: { params: { slug: string } }) {
  try {
    const product = await apiGet<CatalogProduct>(`/catalog/products/${params.slug}`);
    const commercial = getProductCommercialContent(product.slug);
    const firstVariant = product.variants[0];

    let recommendations: CatalogProduct[] = [];
    try {
      recommendations = await apiGet<CatalogProduct[]>(`/catalog/products/${params.slug}/recommendations?limit=4`);
    } catch {
      recommendations = [];
    }

    return (
      <Section>
        <Container className="grid">
          <ProductViewTracker productId={product.id} slug={product.slug} />

          <div className="ui-card">
            <p className="small">{product.category.name}</p>
            <h1>{product.name}</h1>
            <p className="text-secondary">{commercial.cardPitch}</p>
          </div>

          <div className="grid" style={{ gridTemplateColumns: "1fr 1fr" }}>
            <div className="ui-card">
              <ProductGallery product={product} />
            </div>

            <aside className="ui-card">
              {firstVariant ? (
                <>
                  <div style={{ display: "flex", justifyContent: "space-between", gap: 8, alignItems: "center" }}>
                    <p>
                      <strong>{formatMoney(firstVariant.price, firstVariant.currency)}</strong>
                    </p>
                    <StockBadge stock={firstVariant.stock} />
                  </div>
                  <p className="small">SKU: {firstVariant.sku}</p>
                  <AddToCartButton
                    variantId={firstVariant.id}
                    label="Добавить в корзину"
                    pendingLabel="Добавляем"
                    doneLabel="Добавлено"
                    failedLabel="Ошибка"
                  />
                </>
              ) : (
                <p className="text-secondary">Вариант временно недоступен</p>
              )}

              <hr className="ui-divider" />
              <h3>Описание</h3>
              <p className="text-secondary">{commercial.shortDescription}</p>

              <h3>Преимущества</h3>
              <ul style={{ margin: 0, paddingLeft: 18 }}>
                {commercial.highlights.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>

              <h3>Как использовать</h3>
              <p className="text-secondary">{commercial.usage}</p>
            </aside>
          </div>

          <div className="grid" style={{ gridTemplateColumns: "1fr 1fr" }}>
            <article className="ui-card">
              <h3>Отзывы</h3>
              {commercial.reviews.map((review) => (
                <div key={`${review.author}:${review.text}`}>
                  <p>{renderStars(review.rating)}</p>
                  <p>{review.text}</p>
                  <p className="small">{review.author}</p>
                </div>
              ))}
            </article>

            <article className="ui-card">
              <h3>FAQ</h3>
              {commercial.faq.map((item) => (
                <details key={item.question}>
                  <summary>{item.question}</summary>
                  <p className="text-secondary">{item.answer}</p>
                </details>
              ))}
            </article>
          </div>

          {recommendations.length > 0 ? (
            <section className="ui-card">
              <h3>Похожие товары</h3>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
                {recommendations.map((item) => (
                  <Link key={item.id} href={`/catalog/${item.slug}`}>
                    <Button variant="secondary">{item.name}</Button>
                  </Link>
                ))}
              </div>
            </section>
          ) : null}

          <Link href="/catalog">
            <Button variant="secondary">Назад в каталог</Button>
          </Link>
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