"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import Container from "@/components/ui/container";
import Section from "@/components/ui/section";
import EmptyState from "@/components/ui/empty-state";
import Button from "@/components/ui/button";
import CartItem from "@/components/commerce/cart-item";
import CartSummary from "@/components/commerce/cart-summary";

const API_BASE = process.env.NEXT_PUBLIC_API_URL ?? "http://127.0.0.1:4000/v1";
const PENDING_VARIANTS_KEY = "azdek_pending_variant_ids";

type CartResponse = {
  id: string;
  currency: string;
  subtotalAmount: number;
  discountAmount: number;
  deliveryAmount: number;
  totalAmount: number;
  items: Array<{
    id: string;
    quantity: number;
    unitPrice: number;
    lineTotal: number;
    productVariant: {
      id: string;
      sku: string;
      title: string;
      product: { id: string; slug: string; name: string };
    };
  }>;
};

function readPendingVariantIds(): string[] {
  try {
    const raw = localStorage.getItem(PENDING_VARIANTS_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed.filter((item) => typeof item === "string") : [];
  } catch {
    return [];
  }
}

function writePendingVariantIds(ids: string[]) {
  localStorage.setItem(PENDING_VARIANTS_KEY, JSON.stringify(ids));
}

export default function CartPage() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [busyItemId, setBusyItemId] = useState<string | null>(null);
  const [cart, setCart] = useState<CartResponse | null>(null);

  const syncPending = useCallback(async () => {
    const pendingIds = readPendingVariantIds();
    if (pendingIds.length === 0) return;

    let cartId = localStorage.getItem("azdek_cart_id") ?? undefined;
    for (const variantId of pendingIds) {
      const response = await fetch(`${API_BASE}/cart/items`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ cartId, variantId, quantity: 1 }),
      });
      if (!response.ok) continue;
      const nextCart = (await response.json()) as CartResponse;
      cartId = nextCart.id;
      localStorage.setItem("azdek_cart_id", nextCart.id);
      setCart(nextCart);
    }

    writePendingVariantIds([]);
    window.dispatchEvent(new Event("azdek-cart-updated"));
  }, []);

  const loadCart = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      await syncPending();
      const cartId = localStorage.getItem("azdek_cart_id");
      if (!cartId) {
        setCart(null);
        return;
      }

      const response = await fetch(`${API_BASE}/cart/${cartId}`, { cache: "no-store" });
      if (!response.ok) {
        localStorage.removeItem("azdek_cart_id");
        setCart(null);
        return;
      }

      const payload = (await response.json()) as CartResponse;
      setCart(payload);
    } catch {
      setError("Could not load cart");
      setCart(null);
    } finally {
      setLoading(false);
    }
  }, [syncPending]);

  useEffect(() => {
    void loadCart();
  }, [loadCart]);

  const patchItem = async (itemId: string, quantity: number) => {
    if (!cart) return;
    setBusyItemId(itemId);
    try {
      const response = await fetch(`${API_BASE}/cart/items/${cart.id}/${itemId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ quantity }),
      });
      if (!response.ok) throw new Error();
      setCart((await response.json()) as CartResponse);
      window.dispatchEvent(new Event("azdek-cart-updated"));
    } catch {
      setError("Failed to update item");
    } finally {
      setBusyItemId(null);
    }
  };

  const removeItem = async (itemId: string) => {
    if (!cart) return;
    setBusyItemId(itemId);
    try {
      const response = await fetch(`${API_BASE}/cart/items/${cart.id}/${itemId}`, {
        method: "DELETE",
      });
      if (!response.ok) throw new Error();
      const next = (await response.json()) as CartResponse;
      setCart(next.items.length > 0 ? next : null);
      if (next.items.length === 0) {
        localStorage.removeItem("azdek_cart_id");
      }
      window.dispatchEvent(new Event("azdek-cart-updated"));
    } catch {
      setError("Failed to remove item");
    } finally {
      setBusyItemId(null);
    }
  };

  const isEmpty = useMemo(() => !cart || cart.items.length === 0, [cart]);

  return (
    <Section>
      <Container className="grid" style={{ gap: 16 }}>
        <div className="page-header">
          <div>
            <h1 className="h2">Cart</h1>
            <p className="text-secondary">Review items before checkout.</p>
          </div>
        </div>

        {loading ? (
          <div className="ui-card">
            <p className="text-secondary">Loading cart...</p>
          </div>
        ) : error ? (
          <EmptyState
            title="Cart error"
            description={error}
            action={<Button onClick={() => void loadCart()}>Retry</Button>}
          />
        ) : isEmpty ? (
          <EmptyState
            title="Cart is empty"
            description="Add products from catalog to continue checkout."
            action={
              <Link href="/catalog">
                <Button>Go to catalog</Button>
              </Link>
            }
          />
        ) : cart ? (
          <div className="cart-layout">
            <div className="grid" style={{ gap: 10 }}>
              {cart.items.map((item) => (
                <CartItem
                  key={item.id}
                  item={item}
                  busy={busyItemId === item.id}
                  onIncrease={(itemId, quantity) => void patchItem(itemId, quantity + 1)}
                  onDecrease={(itemId, quantity) => void patchItem(itemId, Math.max(1, quantity - 1))}
                  onRemove={(itemId) => void removeItem(itemId)}
                />
              ))}
            </div>

            <CartSummary
              subtotalAmount={cart.subtotalAmount}
              deliveryAmount={cart.deliveryAmount}
              totalAmount={cart.totalAmount}
              currency={cart.currency}
            />
          </div>
        ) : null}
      </Container>
    </Section>
  );
}
