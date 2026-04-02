"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Button from "./ui/button";
import { getSessionIdForCheckout, trackEvent } from "@/lib/analytics";

export default function AddToCartButton({ variantId }: { variantId: string }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  return (
    <Button
      className="full-width"
      disabled={loading}
      onClick={() => {
        if (loading) {
          return;
        }

        setLoading(true);
        localStorage.setItem("azdek_variant_id", variantId);
        void trackEvent({
          eventType: "add_to_cart",
          sessionId: getSessionIdForCheckout(),
          idempotencyKey: `add_to_cart:${variantId}:${Date.now()}`,
          metadata: { variantId },
        });
        router.push("/cart");
      }}
    >
      {loading ? "Переходим в корзину..." : "Добавить в корзину"}
    </Button>
  );
}
