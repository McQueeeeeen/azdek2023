import Link from "next/link";
import Card from "../ui/card";
import Button from "../ui/button";
import PriceBlock from "./price-block";
import SmartImage from "../ui/smart-image";
import AddToCartButton from "../add-to-cart-button";
import WishlistToggle from "./wishlist-toggle";
import { StorefrontProduct } from "@/lib/storefront";

export default function ProductCard({ product }: { product: StorefrontProduct }) {
  const firstVariant = product.variants[0];
  const isInStock = (firstVariant?.stock ?? 0) > 0;
  const comparePrice = product.isDiscount && firstVariant ? Math.round(firstVariant.price * 1.2) : null;

  return (
    <Card className={`product-card ${!isInStock ? "is-out" : ""}`}>
      <div className="product-image-frame">
        <SmartImage
          className="product-image"
          src={product.image}
          fallbackSrc="/media/laundry-gel-final.jpg"
          alt={product.name}
          fill
          sizes="(max-width: 900px) 100vw, 33vw"
          loading="lazy"
        />
        <WishlistToggle slug={product.slug} />
        {product.isDiscount ? <span className="product-image-tag product-image-tag-discount">Discount</span> : null}
        {!product.isDiscount ? <span className="product-image-tag product-image-tag-featured">Top pick</span> : null}
      </div>

      <div className="product-card-body">
        <div className="product-proof-row">
          <span className="small">{product.category.name}</span>
          {isInStock ? <span className="small" style={{ color: "var(--success)" }}>In stock</span> : <span className="small" style={{ color: "var(--error)" }}>Out of stock</span>}
        </div>

        <h3 className="h3 product-title">{product.name}</h3>
        <p className="small">{product.short}</p>
        <p className="product-pitch">{product.description}</p>

        <PriceBlock amount={firstVariant?.price ?? 0} currency={firstVariant?.currency ?? "KZT"} compareAmount={comparePrice} />
      </div>

      <div className="product-card-cta">
        {firstVariant ? (
          <AddToCartButton
            className="full-width"
            product={product}
            label="Add to cart"
            redirectToCart={false}
            pendingLabel="Adding..."
            doneLabel="Added"
            failedLabel="Retry"
          />
        ) : (
          <Button className="full-width" disabled>
            Out of stock
          </Button>
        )}
        <Link href={`/catalog/${product.slug}`}>
          <Button className="product-view-link" variant="outline">
            View details
          </Button>
        </Link>
      </div>
    </Card>
  );
}
