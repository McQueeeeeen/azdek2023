"use client";

import { useRouter } from "next/navigation";
import Button from "./ui/button";
import { getSessionIdForCheckout, trackEvent } from "@/lib/analytics";

export default function AddToCartButton({ variantId }: { variantId: string }) {
  const router = useRouter();

  return (
    <Button
      className="full-width"
      onClick={() => {
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
      Добавить в корзину
    </Button>
  );
}
