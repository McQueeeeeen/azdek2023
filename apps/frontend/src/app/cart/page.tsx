"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import Container from "@/components/ui/container";
import Section from "@/components/ui/section";
import Skeleton from "@/components/ui/skeleton";
import EmptyState from "@/components/ui/empty-state";
import ErrorState from "@/components/ui/error-state";
import { UiActionState } from "@/lib/ui-state";
import { useToast } from "@/components/ui/use-toast";
import { CatalogProduct } from "@/lib/api";
import Button from "@/components/ui/button";
import AddToCartButton from "@/components/add-to-cart-button";
import { formatMoney } from "@/lib/money";

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
      id?: string;
      title: string;
      product: { name: string; slug?: string };
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

  const emitCartUpdated = () => {
    window.dispatchEvent(new Event("azdek-cart-updated"));
  };

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
    emitCartUpdated();
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
          emitCartUpdated();
          setError(null);
          setActionState("done");
          return;
        }

        if (pendingVariantIds.length === 0) {
          localStorage.removeItem("azdek_cart_id");
          setCart(null);
          emitCartUpdated();
          setError(null);
          setActionState("done");
          return;
        }
      }

      const firstPending = pendingVariantIds[0];
      const create = await fetch(`${API_BASE}/cart/items`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          productVariantId: firstPending,
          quantity: groupedPending[firstPending] ?? 1,
        }),
      });

      if (!create.ok) {
        throw new Error(await create.text());
      }

      data = await create.json();
      localStorage.setItem("azdek_cart_id", data.id);
      emitCartUpdated();

      delete groupedPending[firstPending];
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
      emitCartUpdated();
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
      setRecommendations(items.slice(0, 3));
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
      emitCartUpdated();
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
      const response = await fetch(`${API_BASE}/cart/items/${cart.id}/${itemId}`, { method: "DELETE" });

      if (!response.ok) {
        throw new Error(await response.text());
      }

      const nextCart = (await response.json()) as CartView;
      const nextValue = nextCart.items.length > 0 ? nextCart : null;
      setCart(nextValue);

      if (!nextValue) {
        localStorage.removeItem("azdek_cart_id");
      }
      emitCartUpdated();
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

  const subtotal = cart?.totalAmount ?? 0;
  const itemCount = cart?.items.reduce((sum, item) => sum + item.quantity, 0) ?? 0;

  const recommendationItems = useMemo(() => recommendations.slice(0, 3), [recommendations]);

  if (loading) {
    return (
      <Section>
        <Container className="grid">
          <Skeleton className="h-24" />
          <Skeleton className="h-56" />
          <Skeleton className="h-56" />
        </Container>
      </Section>
    );
  }

  if (error) {
    return (
      <Section>
        <Container>
          <ErrorState title="Не удалось загрузить корзину" message={error} onRetry={() => void run()} />
        </Container>
      </Section>
    );
  }

  if (!cart || cart.items.length === 0) {
    try {
      localStorage.removeItem("azdek_cart_id");
      emitCartUpdated();
    } catch {
      // no-op
    }

    return (
      <Section>
        <Container>
          <EmptyState
            title="Ваша корзина пока пуста"
            description="Добавьте средство и решите задачу быстрее"
            actionHref="/catalog"
            actionText="Перейти в каталог"
          />
        </Container>
      </Section>
    );
  }

  return (
    <Section>
      <Container className="grid">
        <div className="ui-card">
          <h1>Корзина</h1>
          <p className="small">Товаров: {itemCount}</p>
        </div>

        {actionState === "pending" ? <p className="small">Обновляем корзину...</p> : null}

        <div className="grid" style={{ gridTemplateColumns: "1fr 320px" }}>
          <div className="grid">
            {cart.items.map((item) => {
              const busy = busyItemId === item.id;
              return (
                <article key={item.id} className="ui-card">
                  <h3>{item.productVariant.product.name}</h3>
                  <p className="text-secondary">{item.productVariant.title}</p>
                  <p>
                    Цена: <strong>{formatMoney(item.lineTotal, cart.currency)}</strong>
                  </p>
                  <div style={{ display: "flex", gap: 8, alignItems: "center", flexWrap: "wrap" }}>
                    <Button
                      variant="secondary"
                      disabled={busy || item.quantity <= 1}
                      onClick={() => void updateItemQuantity(item.id, Math.max(1, item.quantity - 1))}
                    >
                      -
                    </Button>
                    <span>{item.quantity}</span>
                    <Button variant="secondary" disabled={busy} onClick={() => void updateItemQuantity(item.id, item.quantity + 1)}>
                      +
                    </Button>
                    <Button variant="ghost" disabled={busy} onClick={() => void removeItem(item.id)}>
                      Удалить
                    </Button>
                  </div>
                </article>
              );
            })}

            {recommendationItems.length > 0 ? (
              <div className="ui-card">
                <h3>Рекомендуем добавить</h3>
                <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
                  {recommendationItems.map((item) => {
                    const variant = item.variants[0];
                    return (
                      <div key={item.id} style={{ display: "flex", gap: 8, alignItems: "center" }}>
                        <span>{item.name}</span>
                        {variant ? (
                          <AddToCartButton
                            variantId={variant.id}
                            label="Добавить"
                            redirectToCart={false}
                            pendingLabel="..."
                            doneLabel="Добавлено"
                            failedLabel="Ошибка"
                          />
                        ) : null}
                      </div>
                    );
                  })}
                </div>
              </div>
            ) : null}
          </div>

          <aside className="ui-card">
            <h2>Итог</h2>
            <p>
              Подытог: <strong>{formatMoney(subtotal, cart.currency)}</strong>
            </p>
            <p className="text-secondary">Доставка и налоги считаются на оформлении.</p>
            <Link href="/checkout">
              <Button>Перейти к оформлению</Button>
            </Link>
          </aside>
        </div>
      </Container>
    </Section>
  );
}