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
import SmartImage from "@/components/ui/smart-image";
import { getProductMedia } from "@/lib/product-media";
import { formatMoney } from "@/lib/money";

const API_BASE = process.env.NEXT_PUBLIC_API_URL ?? "http://127.0.0.1:4000/v1";
const PENDING_VARIANTS_KEY = "azdek_pending_variant_ids";
const FREE_SHIPPING_THRESHOLD = 20000;

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
      product: { name: string; slug?: string };
    };
  }>;
}

function slugifyName(value: string): string {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9а-яё\s-]/gi, "")
    .trim()
    .replace(/\s+/g, "-");
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
  const freeShippingProgress = Math.min(100, Math.round((subtotal / FREE_SHIPPING_THRESHOLD) * 100));
  const shippingLeft = Math.max(0, FREE_SHIPPING_THRESHOLD - subtotal);
  const itemCount = cart?.items.reduce((sum, item) => sum + item.quantity, 0) ?? 0;

  const recommendationItems = useMemo(() => recommendations.slice(0, 2), [recommendations]);

  if (loading) {
    return (
      <Section>
        <Container className="grid">
          <div className="grid">
            <Skeleton className="h-24" />
            <Skeleton className="h-56" />
            <Skeleton className="h-56" />
          </div>
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

  if (!cart) {
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
      <Container className="cart-v5-shell">
        <header className="cart-v5-header motion-in">
          <h1>Ваша корзина</h1>
          <p>{itemCount} товар(ов) выбрано</p>
        </header>

        {actionState === "pending" ? <p className="small">Обновляем корзину...</p> : null}

        <div className="cart-v5-layout motion-in">
          <div className="cart-v5-items-col">
            <div className="cart-v5-shipping">
              <div className="cart-v5-shipping-head">
                <span>Бесплатная доставка</span>
                <span>
                  {shippingLeft > 0 ? `До подарочной доставки: ${formatMoney(shippingLeft, cart.currency)}` : "Бесплатная доставка активна"}
                </span>
              </div>
              <div className="cart-v5-progress">
                <div className="cart-v5-progress-bar" style={{ width: `${freeShippingProgress}%` }} />
              </div>
            </div>

            <div className="cart-v5-items">
              {cart.items.map((item) => {
                const busy = busyItemId === item.id;
                const guessedSlug = slugifyName(item.productVariant.product.name);
                const media = getProductMedia(guessedSlug);

                return (
                  <article key={item.id} className="cart-v5-item">
                    <div className="cart-v5-item-media">
                      <SmartImage
                        src={media.card}
                        fallbackSrc="/media/laundry-gel.svg"
                        alt={item.productVariant.product.name}
                        fill
                        className="cart-v5-item-image"
                        sizes="(max-width: 768px) 100vw, 192px"
                      />
                    </div>

                    <div className="cart-v5-item-content">
                      <div className="cart-v5-item-top">
                        <h3>{item.productVariant.product.name}</h3>
                        <p>{formatMoney(item.lineTotal, cart.currency)}</p>
                      </div>
                      <p className="cart-v5-variant">{item.productVariant.title}</p>

                      <div className="cart-v5-item-actions">
                        <div className="cart-v5-qty">
                          <button
                            type="button"
                            disabled={busy || item.quantity <= 1}
                            onClick={() => void updateItemQuantity(item.id, Math.max(1, item.quantity - 1))}
                          >
                            <span className="material-symbols-outlined">remove</span>
                          </button>
                          <span>{item.quantity}</span>
                          <button type="button" disabled={busy} onClick={() => void updateItemQuantity(item.id, item.quantity + 1)}>
                            <span className="material-symbols-outlined">add</span>
                          </button>
                        </div>

                        <button type="button" className="cart-v5-remove" disabled={busy} onClick={() => void removeItem(item.id)}>
                          <span className="material-symbols-outlined">close</span>
                          Удалить
                        </button>
                      </div>
                    </div>
                  </article>
                );
              })}
            </div>

            {recommendationItems.length > 0 ? (
              <section className="cart-v5-cross-sell">
                <h2>Дополните заказ</h2>
                <div className="cart-v5-cross-grid">
                  {recommendationItems.map((item) => {
                    const variant = item.variants[0];
                    const media = getProductMedia(item.slug);
                    return (
                      <article key={item.id} className="cart-v5-cross-card">
                        <div className="cart-v5-cross-media">
                          <SmartImage
                            src={media.card}
                            fallbackSrc="/media/laundry-gel.svg"
                            alt={item.name}
                            fill
                            className="cart-v5-cross-image"
                            sizes="(max-width: 1024px) 100vw, 50vw"
                            loading="lazy"
                          />
                        </div>
                        <div className="cart-v5-cross-bottom">
                          <div>
                            <h4>{item.name}</h4>
                            <p>{variant ? formatMoney(variant.price, variant.currency) : "Под заказ"}</p>
                          </div>
                          {variant ? (
                            <AddToCartButton
                              variantId={variant.id}
                              label="+"
                              redirectToCart={false}
                              className="cart-v5-cross-add"
                              pendingLabel="..."
                              doneLabel="✓"
                              failedLabel="!"
                            />
                          ) : null}
                        </div>
                      </article>
                    );
                  })}
                </div>
              </section>
            ) : null}
          </div>

          <aside className="cart-v5-summary">
            <div className="cart-v5-summary-card">
              <h2>Итог заказа</h2>
              <div className="cart-v5-summary-row">
                <span>Подытог</span>
                <strong>{formatMoney(subtotal, cart.currency)}</strong>
              </div>
              <div className="cart-v5-summary-row">
                <span>Доставка</span>
                <strong>{shippingLeft > 0 ? formatMoney(2000, cart.currency) : "Бесплатно"}</strong>
              </div>
              <div className="cart-v5-summary-row">
                <span>Налог</span>
                <strong>На оформлении</strong>
              </div>

              <div className="cart-v5-promo">
                <label htmlFor="promo-code">Промокод</label>
                <div>
                  <input id="promo-code" type="text" placeholder="AZDEK10" />
                  <button type="button">Применить</button>
                </div>
              </div>

              <div className="cart-v5-total">
                <span>Итого</span>
                <p>{formatMoney(subtotal, cart.currency)}</p>
              </div>

              <Link href="/checkout" className="cart-v5-checkout-link">
                <Button className="cart-v5-checkout-btn">Перейти к оформлению</Button>
              </Link>
            </div>

            <div className="cart-v5-meta">
              <p>
                <span className="material-symbols-outlined">local_shipping</span>
                Отправка в течение 24 часов
              </p>
              <p>
                <span className="material-symbols-outlined">verified_user</span>
                Гарантия возврата 60 дней
              </p>
            </div>
          </aside>
        </div>
      </Container>
    </Section>
  );
}