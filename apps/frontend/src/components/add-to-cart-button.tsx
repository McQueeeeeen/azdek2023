"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Button from "./ui/button";
import { getSessionIdForCheckout, trackEvent } from "@/lib/analytics";
import { UiActionState } from "@/lib/ui-state";
import { useToast } from "@/components/ui/use-toast";

export default function AddToCartButton({ variantId }: { variantId: string }) {
  const router = useRouter();
  const { toast } = useToast();
  const [state, setState] = useState<UiActionState>("idle");

  return (
    <Button
      className="full-width"
      disabled={state === "pending"}
      actionState={state}
      pendingLabel="Добавляем..."
      doneLabel="Добавлено"
      failedLabel="Попробовать снова"
      onClick={() => {
        if (state === "pending") {
          return;
        }

        try {
          setState("pending");
          localStorage.setItem("azdek_variant_id", variantId);
          void trackEvent({
            eventType: "add_to_cart",
            sessionId: getSessionIdForCheckout(),
            idempotencyKey: `add_to_cart:${variantId}:${Date.now()}`,
            metadata: { variantId },
          });
          setState("done");
          toast({ title: "Товар добавлен", description: "Переходим в корзину", tone: "success" });
          window.setTimeout(() => {
            router.push("/cart");
          }, 180);
        } catch {
          setState("failed");
          toast({ title: "Не удалось добавить товар", tone: "error" });
          window.setTimeout(() => setState("idle"), 900);
        }
      }}
    >
      Добавить в корзину
    </Button>
  );
}

