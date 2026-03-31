"use client";

import { useEffect } from "react";
import { getSessionIdForCheckout, trackEvent } from "@/lib/analytics";

export default function ProductViewTracker({ productId, slug }: { productId: string; slug: string }) {
  useEffect(() => {
    const sessionId = getSessionIdForCheckout();
    void trackEvent({
      eventType: "product_view",
      idempotencyKey: `product_view:${sessionId}:${productId}`,
      sessionId,
      productId,
      metadata: { slug },
    });
  }, [productId, slug]);

  return null;
}
