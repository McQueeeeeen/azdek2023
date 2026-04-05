import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import Container from "@/components/ui/container";
import Section from "@/components/ui/section";
import Button from "@/components/ui/button";
import ProductGallery from "@/components/commerce/product-gallery";
import ProductGrid from "@/components/commerce/product-grid";
import AddToCartButton from "@/components/add-to-cart-button";
import WishlistToggle from "@/components/commerce/wishlist-toggle";
import PriceBlock from "@/components/commerce/price-block";
import { getRelatedProducts, getStorefrontProductBySlug } from "@/lib/storefront";
import { getProductCommercialContent } from "@/lib/product-commercial-content";

export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  const product = await getStorefrontProductBySlug(params.slug);
  return {
    title: product ? `${product.name} | Adzek` : "Product | Adzek",
    description: product?.description ?? "Product details",
  };
}

export default async function ProductPage({ params }: { params: { slug: string } }) {
  const product = await getStorefrontProductBySlug(params.slug);
  if (!product) notFound();

  const variant = product.variants[0];
  const commercial = getProductCommercialContent(product.slug);
  const related = await getRelatedProducts(product.slug);

  return (
    <>
      <Section>
        <Container className="grid" style={{ gap: 16 }}>
          <Link href="/catalog" className="small">
            ← Back to catalog
          </Link>

          <div className="product-layout">
            <ProductGallery product={product} />

            <div className="product-info">
              <p className="small" style={{ textTransform: "uppercase", letterSpacing: "0.06em" }}>
                {product.category.name}
              </p>
              <h1 className="h2">{product.name}</h1>
              <p className="text-secondary">{commercial.shortDescription}</p>

              <PriceBlock amount={variant?.price ?? 0} currency={variant?.currency ?? "KZT"} />

              <div className="qty-row">
                <span className="small">Availability:</span>
                <span className="small" style={{ color: (variant?.stock ?? 0) > 0 ? "var(--success)" : "var(--error)" }}>
                  {(variant?.stock ?? 0) > 0 ? "In stock" : "Out of stock"}
                </span>
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "1fr auto", gap: 8 }}>
                {variant ? (
                  <AddToCartButton
                    variantId={variant.id}
                    label="Add to cart"
                    redirectToCart={false}
                    pendingLabel="Adding..."
                    doneLabel="Added"
                    failedLabel="Retry"
                  />
                ) : (
                  <Button disabled>Out of stock</Button>
                )}
                <WishlistToggle slug={product.slug} />
              </div>

              <div className="product-tabs">
                <h3 className="h4">Specifications</h3>
                <div className="tab-grid">
                  {product.specs.map((spec) => (
                    <span className="ui-badge" key={spec}>
                      {spec}
                    </span>
                  ))}
                </div>
                <p className="text-secondary">Usage: {commercial.usage}</p>
                <p className="text-secondary">Composition: {commercial.composition}</p>
                <p className="text-secondary">Delivery: 1-3 business days across Kazakhstan.</p>
              </div>
            </div>
          </div>

          <div className="sticky-mobile-cta">
            {variant ? (
              <AddToCartButton variantId={variant.id} label="Add to cart" redirectToCart={false} />
            ) : (
              <Button className="full-width" disabled>
                Out of stock
              </Button>
            )}
          </div>
        </Container>
      </Section>

      <Section>
        <Container className="grid" style={{ gap: 14 }}>
          <div className="page-header">
            <h2 className="h2">Related products</h2>
            <Link href="/catalog">
              <Button variant="outline">See all</Button>
            </Link>
          </div>
          <ProductGrid products={related} />
        </Container>
      </Section>
    </>
  );
}
