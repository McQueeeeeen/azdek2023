import type { Metadata } from "next";
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

export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  try {
    const product = await apiGet<CatalogProduct>(`/catalog/products/${params.slug}`);
    const commercial = getProductCommercialContent(product.slug);
    return {
      title: `${commercial.cardTitle ?? product.name} - Azdek`,
      description: commercial.cardPitch,
      openGraph: {
        title: `${commercial.cardTitle ?? product.name} - Azdek`,
        description: commercial.cardPitch,
        type: "website",
        images: [{ url: "/media/laundry-gel-final.jpg" }],
      },
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
              <h1 className="h2">{commercial.cardTitle ?? product.name}</h1>
              <p className="text-secondary">{commercial.cardPitch}</p>
              <p className="text-secondary">{commercial.cardClosing}</p>
              {firstVariant ? (
                <Card className="product-purchase-rail">
                  <div className="product-purchase-top">
                    <div>
                      <p className="small">Цена</p>
                      <PriceBlock amount={firstVariant.price} currency={firstVariant.currency} />
                    </div>
                    <StockBadge stock={firstVariant.stock} />
                  </div>
                  <p className="small">SKU: {firstVariant.sku}</p>
                  <AddToCartButton variantId={firstVariant.id} />
                  <p className="text-secondary">В наличии. Быстрая обработка заказа. Безопасная оплата.</p>
                </Card>
              ) : (
                <Card>
                  <p className="text-secondary">Варианты товара временно недоступны.</p>
                </Card>
              )}

              <Divider />
              <div className="grid">
                <h2 className="h3">Что мешает получить чистый результат</h2>
                <div className="product-highlights">
                  {commercial.painPoints.map((item) => (
                    <p key={item}>{item}</p>
                  ))}
                </div>
              </div>
              <Divider />
              <div className="grid">
                <h2 className="h3">Что вы получаете после применения</h2>
                <div className="product-highlights">
                  {commercial.resultPoints.map((item) => (
                    <p key={item}>{item}</p>
                  ))}
                </div>
              </div>
              <Divider />
              <div className="grid">
                <h2 className="h3">Преимущества</h2>
                <div className="product-highlights">
                  {commercial.highlights.map((item) => (
                    <p key={item}>{item}</p>
                  ))}
                </div>
              </div>
              <Divider />
              <div className="grid">
                <h2 className="h3">Описание</h2>
                <p className="text-secondary">{commercial.shortDescription}</p>
                <p className="text-secondary">{product.description}</p>
              </div>
              <Divider />
              <div className="grid">
                <h2 className="h3">Как использовать</h2>
                <p className="text-secondary">{commercial.usage}</p>
              </div>
              <Divider />
              <div className="grid">
                <h2 className="h3">Экономика</h2>
                <p className="text-secondary">1 упаковка = до {commercial.washCount} стирок</p>
                {firstVariant ? (
                  <p className="text-secondary">
                    Стоимость одной стирки — от {formatMoney(firstVariant.price / Math.max(1, commercial.washCount), firstVariant.currency)}
                  </p>
                ) : null}
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
                  <Button variant="ghost">Смотреть решения</Button>
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

          <Card className="hero-card hero-card-premium">
            <h2 className="h2">Можете тратить время дальше или закрыть задачу за одно применение</h2>
            <div className="hero-actions">
              <Link href="/cart">
                <Button>Купить сейчас</Button>
              </Link>
            </div>
          </Card>
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
