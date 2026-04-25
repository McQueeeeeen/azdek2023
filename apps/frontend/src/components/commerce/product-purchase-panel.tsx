"use client";

import { useState } from "react";
import AddToCartButton from "@/components/add-to-cart-button";
import WishlistToggle from "./wishlist-toggle";
import { StorefrontProduct } from "@/lib/storefront";

export default function ProductPurchasePanel({ product }: { product: StorefrontProduct }) {
  const [quantity, setQuantity] = useState(1);
  const stock = product.variants[0]?.stock ?? 0;

  const decrease = () => setQuantity((value) => Math.max(1, value - 1));
  const increase = () => setQuantity((value) => Math.min(Math.max(1, stock), value + 1));

  return (
    <div className="product-purchase-panel">
      <div className="qty-row">
        <span className="small">Quantity</span>
        <div className="qty-control" role="group" aria-label="Quantity selector">
          <button type="button" className="qty-chip" onClick={decrease} aria-label="Decrease quantity">
            -
          </button>
          <span className="qty-value">{quantity}</span>
          <button
            type="button"
            className="qty-chip"
            onClick={increase}
            aria-label="Increase quantity"
            disabled={quantity >= stock}
          >
            +
          </button>
        </div>
      </div>

      <div className="product-cta-row">
        <AddToCartButton
          className="full-width"
          product={product}
          quantity={quantity}
          label="Add to cart"
          redirectToCart={false}
          pendingLabel="Adding..."
          doneLabel="Added"
          failedLabel="Retry"
        />
        <WishlistToggle slug={product.slug} />
      </div>
    </div>
  );
}
