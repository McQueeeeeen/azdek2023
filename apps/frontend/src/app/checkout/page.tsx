"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import { getCurrentAttribution, getSessionIdForCheckout } from "@/lib/analytics";
import Container from "@/components/ui/container";
import Section from "@/components/ui/section";
import Card from "@/components/ui/card";
import PageHeader from "@/components/ui/page-header";
import Button from "@/components/ui/button";
import { Input, Textarea } from "@/components/ui/input";
import ErrorState from "@/components/ui/error-state";

const API_BASE = process.env.NEXT_PUBLIC_API_URL ?? "http://127.0.0.1:4000/v1";

export default function CheckoutPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const submit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setLoading(true);
    setError(null);

    const formData = new FormData(event.currentTarget);
    const cartId = localStorage.getItem("azdek_cart_id");
    const attribution = getCurrentAttribution();
    const sessionId = getSessionIdForCheckout();

    try {
      const response = await fetch(`${API_BASE}/checkout/confirm`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          cartId,
          customerName: formData.get("customerName"),
          customerEmail: formData.get("customerEmail"),
          customerPhone: formData.get("customerPhone"),
          deliveryCity: formData.get("deliveryCity"),
          deliveryAddress: formData.get("deliveryAddress"),
          deliveryMethod: "city",
          paymentMethod: "card_online",
          sessionId,
          utmSource: attribution.utmSource,
          utmMedium: attribution.utmMedium,
          utmCampaign: attribution.utmCampaign,
          channelGroup: attribution.channelGroup,
        }),
      });

      if (!response.ok) {
        throw new Error(await response.text());
      }

      const payload = await response.json();
      if (payload.paymentUrl) {
        window.open(payload.paymentUrl, "_blank", "noopener,noreferrer");
      }
      router.push(`/order/${payload.orderNumber}`);
    } catch (e) {
      setError((e as Error).message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Section>
      <Container className="grid checkout-layout">
        <PageHeader title="Оформление заказа" subtitle="Контакты, доставка и оплата в 3 шага" />
        <form className="grid" onSubmit={submit}>
          <Card className="checkout-card grid">
            <h2 className="h3">Шаг 1 — Контакты</h2>
            <Input name="customerName" placeholder="Имя" required />
            <Input name="customerPhone" placeholder="Телефон" required />
            <Input name="customerEmail" type="email" placeholder="Email" required />
          </Card>
          <Card className="checkout-card grid">
            <h2 className="h3">Шаг 2 — Доставка</h2>
            <Input name="deliveryCity" placeholder="Город" defaultValue="Алматы" required />
            <Textarea name="deliveryAddress" placeholder="Адрес" required />
          </Card>
          <Card className="checkout-card grid">
            <h2 className="h3">Шаг 3 — Оплата</h2>
            <p className="text-secondary">Мы используем безопасную оплату. Ваши данные защищены.</p>
            <div className="order-status-grid">
              <p className="small">Доступные методы</p>
              <p>Карты / Kaspi / другие провайдеры</p>
              <p className="small">Безопасность</p>
              <p>SSL / 3-D Secure</p>
              <p className="small">Подтверждение</p>
              <p>Email и статус заказа в кабинете</p>
            </div>
            <Button type="submit" disabled={loading}>
              {loading ? "Создаём заказ..." : "Оформить заказ"}
            </Button>
          </Card>
          {error ? <ErrorState title="Ошибка оформления" message={error} /> : null}
        </form>
      </Container>
    </Section>
  );
}
