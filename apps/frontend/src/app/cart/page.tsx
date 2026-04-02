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
import { UiActionState } from "@/lib/ui-state";
import { useToast } from "@/components/ui/use-toast";
import { CatalogProduct } from "@/lib/api";
import ProductCard from "@/components/commerce/product-card";

const API_BASE = process.env.NEXT_PUBLIC_API_URL ?? "http://127.0.0.1:4000/v1";
const PENDING_VARIANTS_KEY = "azdek_pending_variant_ids";

interface CartView {
  id: string;
  totalAmount: number;
  currency: string;
  items: Array<{
    id: string;
    quantity: number;
    unitPrice: number;
    lineTotal: number;
    productVariant: {
      title: string;
      product: { name: string };
    };
  }>;
}

export default function CartPage() {
  const { toast } = useToast();
  const [cart, setCart] = useState<CartView | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [busyItemId, setBusyItemId] = useState<string | null>(null);
  const [actionState, setActionState] = useState<UiActionState>("idle");
  const [recommendations, setRecommendations] = useState<CatalogProduct[]>([]);

  const readPendingVariantIds = (): string[] => {
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
  };

  const clearPendingVariantIds = () => {
    localStorage.removeItem(PENDING_VARIANTS_KEY);
    localStorage.removeItem("azdek_variant_id");
  };

  const run = async () => {
    const legacyVariantId = localStorage.getItem("azdek_variant_id");
    const pendingVariantIds = readPendingVariantIds();
    if (legacyVariantId && pendingVariantIds.length === 0) {
      pendingVariantIds.push(legacyVariantId);
    }
    const groupedPending = pendingVariantIds.reduce<Record<string, number>>((acc, variantId) => {
      acc[variantId] = (acc[variantId] ?? 0) + 1;
      return acc;
    }, {});

    const existingCartId = localStorage.getItem("azdek_cart_id");
    if (pendingVariantIds.length === 0 && !existingCartId) {
      setCart(null);
      setError(null);
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setActionState("pending");
      let data: CartView;
      if (existingCartId) {
        if (pendingVariantIds.length > 0) {
          for (const [variantId, quantity] of Object.entries(groupedPending)) {
            const append = await fetch(`${API_BASE}/cart/items`, {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ cartId: existingCartId, productVariantId: variantId, quantity }),
            });
            if (!append.ok) {
              throw new Error(await append.text());
            }
          }
          clearPendingVariantIds();
          toast({ title: "Товары добавлены в корзину", tone: "success" });
        }

        const res = await fetch(`${API_BASE}/cart/${existingCartId}`, { cache: "no-store" });
        if (res.ok) {
          data = await res.json();
          setCart(data);
          setError(null);
          setActionState("done");
          return;
        }

        if (pendingVariantIds.length === 0) {
          localStorage.removeItem("azdek_cart_id");
          setCart(null);
          setError(null);
          setActionState("done");
          return;
        }
      }

      const create = await fetch(`${API_BASE}/cart/items`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          productVariantId: pendingVariantIds[0],
          quantity: groupedPending[pendingVariantIds[0]] ?? 1,
        }),
      });
      if (!create.ok) {
        throw new Error(await create.text());
      }
      data = await create.json();
      localStorage.setItem("azdek_cart_id", data.id);
      const firstVariantId = pendingVariantIds[0];
      delete groupedPending[firstVariantId];

      for (const [variantId, quantity] of Object.entries(groupedPending)) {
        const append = await fetch(`${API_BASE}/cart/items`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ cartId: data.id, productVariantId: variantId, quantity }),
        });
        if (!append.ok) {
          throw new Error(await append.text());
        }
        data = await append.json();
      }

      clearPendingVariantIds();
      setCart(data);
      setError(null);
      setActionState("done");
      toast({ title: "Товары добавлены в корзину", tone: "success" });
    } catch (e) {
      setActionState("failed");
      setError((e as Error).message);
      toast({ title: "Ошибка загрузки корзины", tone: "error" });
    } finally {
      setLoading(false);
    }
  };

  const loadRecommendations = async () => {
    try {
      const res = await fetch(`${API_BASE}/catalog/products`, { cache: "no-store" });
      if (!res.ok) {
        return;
      }
      const items = (await res.json()) as CatalogProduct[];
      setRecommendations(items.slice(0, 2));
    } catch {
      setRecommendations([]);
    }
  };

  const updateItemQuantity = async (itemId: string, nextQuantity: number) => {
    if (!cart) {
      return;
    }

    try {
      setBusyItemId(itemId);
      setActionState("pending");
      const response = await fetch(`${API_BASE}/cart/items/${cart.id}/${itemId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ quantity: nextQuantity }),
      });

      if (!response.ok) {
        throw new Error(await response.text());
      }

      const nextCart = (await response.json()) as CartView;
      setCart(nextCart);
      setActionState("done");
      toast({ title: "Количество обновлено", tone: "success", durationMs: 1600 });
    } catch (e) {
      setActionState("failed");
      setError((e as Error).message);
      toast({ title: "Не удалось обновить количество", tone: "error" });
    } finally {
      setBusyItemId(null);
    }
  };

  const removeItem = async (itemId: string) => {
    if (!cart) {
      return;
    }

    try {
      setBusyItemId(itemId);
      setActionState("pending");
      const response = await fetch(`${API_BASE}/cart/items/${cart.id}/${itemId}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error(await response.text());
      }

      const nextCart = (await response.json()) as CartView;
      const nextValue = nextCart.items.length > 0 ? nextCart : null;
      setCart(nextValue);
      if (!nextValue) {
        localStorage.removeItem("azdek_cart_id");
      }
      setActionState("done");
      toast({ title: "Товар удален", tone: "info", durationMs: 1600 });
    } catch (e) {
      setActionState("failed");
      setError((e as Error).message);
      toast({ title: "Не удалось удалить товар", tone: "error" });
    } finally {
      setBusyItemId(null);
    }
  };

  useEffect(() => {
    void run();
    void loadRecommendations();
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
        <PageHeader title="Корзина" subtitle="Проверьте заказ перед оформлением" />
        {actionState === "pending" ? (
          <Card>
            <p className="small">Обновляем корзину...</p>
          </Card>
        ) : null}
        {cart ? (
          <div className="cart-layout">
            <div className="grid">
              {cart.items.map((item) => (
                <CartItem
                  key={item.id}
                  item={item}
                  busy={busyItemId === item.id}
                  onIncrease={(itemId, quantity) => void updateItemQuantity(itemId, quantity + 1)}
                  onDecrease={(itemId, quantity) => void updateItemQuantity(itemId, Math.max(1, quantity - 1))}
                  onRemove={(itemId) => void removeItem(itemId)}
                />
              ))}
            </div>
            <CartSummary totalAmount={cart.totalAmount} currency={cart.currency} />
          </div>
        ) : (
          <EmptyState
            title="Твоя корзина пока пуста"
            description="Добавь средство и реши задачу быстрее."
            actionHref="/catalog"
            actionText="Перейти в каталог"
          />
        )}

        {recommendations.length > 0 ? (
          <Card>
            <h2 className="h3">Добавьте еще и закройте уборку полностью</h2>
            <p className="text-secondary">Один товар - не вся задача.</p>
            <div className="product-grid" style={{ gridTemplateColumns: "repeat(2, minmax(0, 1fr))" }}>
              {recommendations.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          </Card>
        ) : null}
      </Container>
    </Section>
  );
}

