"use client";

import { FormEvent, useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import Container from "@/components/ui/container";
import Section from "@/components/ui/section";
import { Input, Textarea } from "@/components/ui/input";
import Button from "@/components/ui/button";
import EmptyState from "@/components/ui/empty-state";
import { formatMoney } from "@/lib/money";

const API_BASE = process.env.NEXT_PUBLIC_API_URL ?? "http://127.0.0.1:4000/v1";

type CartPreview = {
  id: string;
  currency: string;
  subtotalAmount: number;
  deliveryAmount: number;
  totalAmount: number;
  items: Array<{ id: string; quantity: number; productVariant: { product: { name: string } } }>;
};

export default function CheckoutPage() {
  const router = useRouter();
  const [cart, setCart] = useState<CartPreview | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const [form, setForm] = useState({
    customerName: "",
    customerEmail: "",
    customerPhone: "",
    deliveryCity: "Almaty",
    deliveryAddress: "",
    deliveryMethod: "city",
    paymentMethod: "card_online",
    comment: "",
  });

  useEffect(() => {
    const loadCart = async () => {
      setLoading(true);
      try {
        const cartId = localStorage.getItem("azdek_cart_id");
        if (!cartId) {
          setCart(null);
          return;
        }

        const response = await fetch(`${API_BASE}/cart/${cartId}`, { cache: "no-store" });
        if (!response.ok) throw new Error();
        setCart((await response.json()) as CartPreview);
      } catch {
        setError("Could not load checkout data");
      } finally {
        setLoading(false);
      }
    };

    void loadCart();
  }, []);

  const disabled = useMemo(() => {
    return !form.customerName || !form.customerEmail || !form.customerPhone || !form.deliveryAddress;
  }, [form]);

  const submit = async (event: FormEvent) => {
    event.preventDefault();
    if (!cart) return;
    setSubmitting(true);
    setError(null);

    try {
      const response = await fetch(`${API_BASE}/checkout/confirm`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          cartId: cart.id,
          ...form,
          sessionId: "web-session",
        }),
      });

      if (!response.ok) throw new Error();
      const payload = (await response.json()) as { orderNumber: string };
      localStorage.removeItem("azdek_cart_id");
      window.dispatchEvent(new Event("azdek-cart-updated"));
      router.push(`/order/${payload.orderNumber}`);
    } catch {
      setError("Checkout failed. Please check fields and try again.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Section>
      <Container className="grid" style={{ gap: 16 }}>
        <div>
          <h1 className="h2">Checkout</h1>
          <p className="text-secondary">Contact, delivery and payment in one quick flow.</p>
        </div>

        {loading ? (
          <div className="ui-card">
            <p className="text-secondary">Loading checkout...</p>
          </div>
        ) : !cart ? (
          <EmptyState
            title="No items for checkout"
            description="Add products to cart before checkout."
            action={<Button onClick={() => router.push("/catalog")}>Go to catalog</Button>}
          />
        ) : (
          <div className="checkout-layout">
            <form className="ui-card" onSubmit={submit}>
              <h3 className="h3">Contact details</h3>
              <div className="form-grid">
                <Input className="full" placeholder="Full name" value={form.customerName} onChange={(e) => setForm((v) => ({ ...v, customerName: e.target.value }))} />
                <Input placeholder="Email" type="email" value={form.customerEmail} onChange={(e) => setForm((v) => ({ ...v, customerEmail: e.target.value }))} />
                <Input placeholder="Phone" value={form.customerPhone} onChange={(e) => setForm((v) => ({ ...v, customerPhone: e.target.value }))} />

                <select className="ui-input" value={form.deliveryMethod} onChange={(e) => setForm((v) => ({ ...v, deliveryMethod: e.target.value }))}>
                  <option value="city">City delivery</option>
                  <option value="country">Country delivery</option>
                  <option value="pickup">Pickup</option>
                </select>
                <select className="ui-input" value={form.paymentMethod} onChange={(e) => setForm((v) => ({ ...v, paymentMethod: e.target.value }))}>
                  <option value="card_online">Card online</option>
                  <option value="payment_link">Payment link</option>
                  <option value="b2b_manual">B2B invoice</option>
                </select>

                <Input placeholder="City" value={form.deliveryCity} onChange={(e) => setForm((v) => ({ ...v, deliveryCity: e.target.value }))} />
                <Input placeholder="Address" className="full" value={form.deliveryAddress} onChange={(e) => setForm((v) => ({ ...v, deliveryAddress: e.target.value }))} />
                <Textarea className="full" placeholder="Comment (optional)" value={form.comment} onChange={(e) => setForm((v) => ({ ...v, comment: e.target.value }))} />
              </div>

              {error ? <p style={{ color: "var(--error)" }}>{error}</p> : null}

              <Button type="submit" disabled={disabled || submitting} actionState={submitting ? "pending" : "idle"} pendingLabel="Processing...">
                Confirm order
              </Button>
            </form>

            <aside className="ui-card cart-summary">
              <h3 className="h3">Summary</h3>
              <div style={{ display: "grid", gap: 6 }}>
                {cart.items.map((item) => (
                  <div key={item.id} style={{ display: "flex", justifyContent: "space-between", gap: 8 }}>
                    <span className="text-secondary">{item.productVariant.product.name} × {item.quantity}</span>
                  </div>
                ))}
              </div>
              <hr className="ui-divider" />
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <span className="text-secondary">Subtotal</span>
                <span>{formatMoney(cart.subtotalAmount, cart.currency)}</span>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <span className="text-secondary">Delivery</span>
                <span>{formatMoney(cart.deliveryAmount, cart.currency)}</span>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <strong>Total</strong>
                <strong>{formatMoney(cart.totalAmount, cart.currency)}</strong>
              </div>
            </aside>
          </div>
        )}
      </Container>
    </Section>
  );
}
