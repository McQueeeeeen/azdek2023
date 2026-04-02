"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Button from "./ui/button";
import { getSessionIdForCheckout, trackEvent } from "@/lib/analytics";
import { UiActionState } from "@/lib/ui-state";
import { useToast } from "@/components/ui/use-toast";
import { cn } from "@/lib/cn";

const PENDING_VARIANTS_KEY = "azdek_pending_variant_ids";

function readPendingVariantIds(): string[] {
  try {
    const raw = localStorage.getItem(PENDING_VARIANTS_KEY);
    if (!raw) {
      return [];
    }
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed.filter((item) => typeof item === "string") : [];
  } catch {
    return [];
  }
}

function enqueueVariantId(variantId: string) {
  const current = readPendingVariantIds();
  current.push(variantId);
  localStorage.setItem(PENDING_VARIANTS_KEY, JSON.stringify(current));
  window.dispatchEvent(new Event("azdek-cart-updated"));
}

export default function AddToCartButton({
  variantId,
  label = "Добавить в корзину",
  redirectToCart = true,
  className,
  pendingLabel,
  doneLabel,
  failedLabel,
}: {
  variantId: string;
  label?: string;
  redirectToCart?: boolean;
  className?: string;
  pendingLabel?: string;
  doneLabel?: string;
  failedLabel?: string;
}) {
  const router = useRouter();
  const { toast } = useToast();
  const [state, setState] = useState<UiActionState>("idle");

  return (
    <Button
      className={cn("full-width", className)}
      disabled={state === "pending"}
      actionState={state}
      pendingLabel={pendingLabel ?? "Добавляем..."}
      doneLabel={doneLabel ?? "Добавлено"}
      failedLabel={failedLabel ?? "Попробовать снова"}
      onClick={() => {
        if (state === "pending") {
          return;
        }

        try {
          setState("pending");
          // Backward-compatible single key + queue for multi-add flow.
          localStorage.setItem("azdek_variant_id", variantId);
          enqueueVariantId(variantId);
          void trackEvent({
            eventType: "add_to_cart",
            sessionId: getSessionIdForCheckout(),
            idempotencyKey: `add_to_cart:${variantId}:${Date.now()}`,
            metadata: { variantId },
          });
          setState("done");
          toast({
            title: "Товар добавлен",
            description: redirectToCart ? "Переходим в корзину" : "Продолжайте покупки",
            tone: "success",
          });
          if (redirectToCart) {
            window.setTimeout(() => {
              router.push("/cart");
            }, 180);
          } else {
            window.setTimeout(() => setState("idle"), 700);
          }
        } catch {
          setState("failed");
          toast({ title: "Не удалось добавить товар", tone: "error" });
          window.setTimeout(() => setState("idle"), 900);
        }
      }}
    >
      {label}
    </Button>
  );
}

