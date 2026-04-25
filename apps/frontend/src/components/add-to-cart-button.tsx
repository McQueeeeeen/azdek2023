"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import Button from "./ui/button";
import { useCartStore } from "@/store/useCartStore";
import { cn } from "@/lib/cn";
import { StorefrontProduct } from "@/lib/storefront";

export default function AddToCartButton({
  product,
  quantity = 1,
  label = "Добавить в корзину",
  redirectToCart = true,
  className,
  pendingLabel = "Добавляем...",
  doneLabel = "Добавлено",
  failedLabel = "Попробовать снова",
}: {
  product: StorefrontProduct;
  quantity?: number;
  label?: string;
  redirectToCart?: boolean;
  className?: string;
  pendingLabel?: string;
  doneLabel?: string;
  failedLabel?: string;
}) {
  const router = useRouter();
  const [isPending, setIsPending] = useState(false);
  const addItem = useCartStore((state) => state.addItem);

  const handleAdd = async (e?: React.MouseEvent) => {
    if (e) e.preventDefault();
    if (isPending) return;

    try {
      setIsPending(true);
      const variant = product.variants[0];
      
      await addItem({
        slug: product.slug,
        name: product.name,
        sub: product.sub ?? "",
        price: variant?.price ?? 0,
      });

      toast.success('Товар добавлен в корзину!', { description: product.name });

      if (redirectToCart) {
        setTimeout(() => router.push("/cart"), 180);
      }
    } catch {
      toast.error('Ошибка', { description: 'Не удалось добавить товар' });
    } finally {
      setIsPending(false);
    }
  };

  return (
    <Button
      className={cn("full-width", className)}
      disabled={isPending}
      onClick={handleAdd}
    >
      {isPending ? pendingLabel : label}
    </Button>
  );
}

