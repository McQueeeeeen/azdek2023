import Link from "next/link";
import { CatalogProduct } from "@/lib/api";
import Card from "../ui/card";
import Button from "../ui/button";
import PriceBlock from "./price-block";
import { getProductMedia } from "@/lib/product-media";
import { getProductCommercialContent } from "@/lib/product-commercial-content";

export default function ProductCard({ product }: { product: CatalogProduct }) {
  const firstVariant = product.variants[0];
  const media = getProductMedia(product.slug);
  const commercial = getProductCommercialContent(product.slug);
  const reviewCount = commercial.reviews.length;
  const rating =
    reviewCount > 0
      ? (commercial.reviews.reduce((sum, review) => sum + review.rating, 0) / reviewCount).toFixed(1)
      : "4.9";
  const isInStock = (firstVariant?.stock ?? 0) > 0;

  return (
    <Card className="product-card">
      <div className="product-image-frame">
        <img className="product-image" src={media.cover} alt={product.name} loading="lazy" />
        {media.tag ? <span className="product-image-tag">{media.tag}</span> : null}
      </div>
      <div className="product-card-body">
        <p className="small">{product.category.name}</p>
        <h3 className="h3 product-title">{product.name}</h3>
        <p className="text-secondary product-description">{product.description}</p>
        <p className="product-pitch">{commercial.cardPitch}</p>
        <div className="product-benefits">
          {commercial.highlights.slice(0, 2).map((highlight) => (
            <span key={highlight} className="product-benefit-chip">
              {highlight}
            </span>
          ))}
        </div>
        <div className="product-proof-row">
          <span className="product-rating">★ {rating} · {reviewCount}+ отзывов</span>
          <span className={isInStock ? "product-stock ok" : "product-stock warn"}>
            {isInStock ? "В наличии" : "Под заказ"}
          </span>
        </div>
        <PriceBlock amount={firstVariant?.price ?? 0} currency={firstVariant?.currency ?? "KZT"} />
      </div>
      <Link href={`/catalog/${product.slug}`}>
        <Button variant="secondary" className="full-width product-card-cta">
          Купить сейчас
        </Button>
      </Link>
    </Card>
  );
}
