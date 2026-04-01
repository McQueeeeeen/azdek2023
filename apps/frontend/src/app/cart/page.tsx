"use client";

import { useEffect, useState } from "react";
import Container from "@/components/ui/container";
import Section from "@/components/ui/section";
import PageHeader from "@/components/ui/page-header";
import Card from "@/components/ui/card";
import Skeleton from "@/components/ui/skeleton";
import EmptyState from "@/components/ui/empty-state";
import ErrorState from "@/components/ui/error-state";
import CartItem from "@/components/commerce/cart-item";
import CartSummary from "@/components/commerce/cart-summary";

const API_BASE = process.env.NEXT_PUBLIC_API_URL ?? "http://127.0.0.1:4000/v1";

interface CartView {
  id: string;
  totalAmount: number;
  currency: string;
  items: Array<{
    id: string;
    quantity: number;
    lineTotal: number;
    productVariant: {
      title: string;
      product: { name: string };
    };
  }>;
}

export default function CartPage() {
  const [cart, setCart] = useState<CartView | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const run = async () => {
    const variantId = localStorage.getItem("azdek_variant_id");
    const existingCartId = localStorage.getItem("azdek_cart_id");
    if (!variantId && !existingCartId) {
      setCart(null);
      setError(null);
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      let data: CartView;
      if (existingCartId) {
        const res = await fetch(`${API_BASE}/cart/${existingCartId}`);
        if (res.ok) {
          data = await res.json();
          setCart(data);
          setError(null);
          return;
        }
      }

      const create = await fetch(`${API_BASE}/cart/items`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ productVariantId: variantId, quantity: 1 }),
      });

      data = await create.json();
      localStorage.setItem("azdek_cart_id", data.id);
      setCart(data);
      setError(null);
    } catch (e) {
      setError((e as Error).message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void run();
  }, []);

  if (loading) {
    return (
      <Section>
        <Container className="grid">
          <PageHeader title="Корзина" subtitle="Загружаем ваши товары" />
          <Card className="grid">
            <Skeleton className="h-56" />
            <Skeleton className="h-56" />
          </Card>
        </Container>
      </Section>
    );
  }

  if (error) {
    return (
      <Section>
        <Container>
          <PageHeader title="Корзина" />
          <ErrorState title="Не удалось загрузить корзину" message={error} onRetry={() => void run()} />
        </Container>
      </Section>
    );
  }

  return (
    <Section>
      <Container className="grid">
        <PageHeader title="Корзина" subtitle="Проверьте товары перед оформлением" />
        {cart ? (
          <div className="cart-layout">
            <div className="grid">
              {cart.items.map((item) => (
                <CartItem key={item.id} item={item} />
              ))}
            </div>
            <CartSummary totalAmount={cart.totalAmount} currency={cart.currency} />
          </div>
        ) : (
          <EmptyState
            title="Ваша корзина пуста"
            description="Добавьте товары из каталога, чтобы перейти к оформлению заказа."
            actionHref="/catalog"
            actionText="Перейти в каталог"
          />
        )}
      </Container>
    </Section>
  );
}
