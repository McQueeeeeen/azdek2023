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
import SmartImage from "@/components/ui/smart-image";
import { getProductCommercialContent } from "@/lib/product-commercial-content";
import { getProductMedia } from "@/lib/product-media";
import { formatMoney } from "@/lib/money";

function renderStars(rating: number): string {
  const filled = "★".repeat(Math.max(0, Math.min(5, rating)));
  const empty = "☆".repeat(Math.max(0, 5 - rating));
  return `${filled}${empty}`;
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
        images: [{ url: getProductMedia(product.slug).hero }],
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
    const media = getProductMedia(product.slug);
    const firstVariant = product.variants[0];

    let recommendations: CatalogProduct[] = [];
    try {
      recommendations = await apiGet<CatalogProduct[]>(`/catalog/products/${params.slug}/recommendations?limit=4`);
    } catch {
      recommendations = [];
    }

    return (
      <Section>
        <Container className="grid product-v5-shell">
          <ProductViewTracker productId={product.id} slug={product.slug} />

          <section className="product-v5-hero motion-in">
            <SmartImage
              src={media.hero}
              fallbackSrc="/media/laundry-gel.svg"
              alt={commercial.cardTitle ?? product.name}
              fill
              className="product-v5-hero-image"
              priority
              sizes="100vw"
            />
            <div className="product-v5-hero-overlay" />
            <div className="product-v5-hero-copy">
              <p>{product.category.name}</p>
              <h1>{commercial.cardTitle ?? product.name}</h1>
              <span>{commercial.cardPitch}</span>
            </div>
          </section>

          <section className="product-v5-main motion-in">
            <div className="product-v5-gallery ui-card">
              <ProductGallery product={product} />
            </div>

            <aside className="product-v5-purchase ui-card">
              <p className="product-v5-kicker">{commercial.solution}</p>
              <h2>{commercial.cardTitle ?? product.name}</h2>
              <p className="product-v5-lead">{commercial.cardClosing}</p>

              {firstVariant ? (
                <div className="product-v5-price-row">
                  <div>
                    <p className="small">Цена</p>
                    <p className="product-v5-price">{formatMoney(firstVariant.price, firstVariant.currency)}</p>
                  </div>
                  <StockBadge stock={firstVariant.stock} />
                </div>
              ) : (
                <p className="text-secondary">Вариант временно недоступен</p>
              )}

              {firstVariant ? <p className="small">SKU: {firstVariant.sku}</p> : null}
              {firstVariant ? (
                <AddToCartButton
                  variantId={firstVariant.id}
                  label="Добавить в корзину"
                  className="product-v5-buy"
                  pendingLabel="Добавляем"
                  doneLabel="Добавлено"
                  failedLabel="Ошибка"
                />
              ) : null}
              <p className="product-v5-secure">Безопасная оплата. Быстрая обработка заказа.</p>

              <div className="product-v5-block">
                <h3>Описание</h3>
                <p>{commercial.shortDescription}</p>
              </div>

              <div className="product-v5-block">
                <h3>Преимущества</h3>
                <ul>
                  {commercial.highlights.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              </div>

              <div className="product-v5-block">
                <h3>Как использовать</h3>
                <p>{commercial.usage}</p>
              </div>

              <div className="product-v5-block">
                <h3>Экономика</h3>
                <p>1 упаковка = до {commercial.washCount} применений</p>
                {firstVariant ? (
                  <p>
                    Стоимость одного применения: {formatMoney(firstVariant.price / Math.max(1, commercial.washCount), firstVariant.currency)}
                  </p>
                ) : null}
              </div>

              <div className="product-v5-block">
                <h3>Состав</h3>
                <p>{commercial.composition}</p>
              </div>

              <div className="product-v5-block">
                <h3>Меры предосторожности</h3>
                <p>{commercial.precautions}</p>
              </div>
            </aside>
          </section>

          <section className="product-v5-detail-grid motion-in">
            <article className="ui-card product-v5-card">
              <h3>Что мешает чистому результату</h3>
              <ul>
                {commercial.painPoints.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </article>
            <article className="ui-card product-v5-card">
              <h3>Что получите после применения</h3>
              <ul>
                {commercial.resultPoints.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </article>
          </section>

          <section className="product-v5-social-grid motion-in">
            <article className="ui-card product-v5-card">
              <h3>Отзывы</h3>
              <div className="product-v5-reviews">
                {commercial.reviews.map((review) => (
                  <div key={`${review.author}:${review.text}`} className="product-v5-review">
                    <p className="review-stars" aria-label={`Оценка ${review.rating} из 5`}>
                      {renderStars(review.rating)}
                    </p>
                    <p>{review.text}</p>
                    <span>{review.author}</span>
                  </div>
                ))}
              </div>
            </article>

            <article className="ui-card product-v5-card">
              <h3>FAQ</h3>
              <div className="product-v5-faq">
                {commercial.faq.map((item) => (
                  <details key={item.question} className="faq-item">
                    <summary>{item.question}</summary>
                    <p className="text-secondary">{item.answer}</p>
                  </details>
                ))}
              </div>
            </article>
          </section>

          {recommendations.length > 0 ? (
            <section className="product-v5-reco motion-in">
              <div className="product-v5-reco-head">
                <h3>Похожие товары</h3>
                <Link href="/catalog">
                  <Button variant="ghost">Смотреть каталог</Button>
                </Link>
              </div>
              <div className="product-v5-reco-grid">
                {recommendations.map((item) => {
                  const variant = item.variants[0];
                  const itemMedia = getProductMedia(item.slug);
                  return (
                    <Link key={item.id} href={`/catalog/${item.slug}`} className="product-v5-reco-item">
                      <div className="product-v5-reco-media">
                        <SmartImage
                          src={itemMedia.card}
                          fallbackSrc="/media/laundry-gel.svg"
                          alt={item.name}
                          fill
                          className="product-v5-reco-image"
                          sizes="(max-width: 1024px) 50vw, 25vw"
                          loading="lazy"
                        />
                      </div>
                      <p>{item.name}</p>
                      <span>{variant ? formatMoney(variant.price, variant.currency) : "Под заказ"}</span>
                    </Link>
                  );
                })}
              </div>
            </section>
          ) : null}

          {firstVariant ? (
            <div className="pdp-sticky-cta">
              <AddToCartButton variantId={firstVariant.id} label="Добавить в корзину" />
            </div>
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