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
import { UiActionState } from "@/lib/ui-state";
import { useToast } from "@/components/ui/use-toast";

const API_BASE = process.env.NEXT_PUBLIC_API_URL ?? "http://127.0.0.1:4000/v1";

type FieldErrors = Partial<Record<"customerName" | "customerPhone" | "customerEmail" | "deliveryAddress", string>>;

export default function CheckoutPage() {
  const router = useRouter();
  const { toast } = useToast();
  const [state, setState] = useState<UiActionState>("idle");
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({});

  const submit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (state === "pending") {
      return;
    }

    setState("pending");
    setError(null);
    setFieldErrors({});
    setSuccess(null);

    const formData = new FormData(event.currentTarget);
    const cartId = localStorage.getItem("azdek_cart_id");
    const attribution = getCurrentAttribution();
    const sessionId = getSessionIdForCheckout();
    const customerName = String(formData.get("customerName") ?? "").trim();
    const customerPhone = String(formData.get("customerPhone") ?? "").trim();
    const customerEmail = String(formData.get("customerEmail") ?? "").trim();
    const deliveryAddress = String(formData.get("deliveryAddress") ?? "").trim();

    const nextFieldErrors: FieldErrors = {};

    if (!cartId) {
      setError("Корзина пуста. Добавьте товары перед оформлением.");
      setState("failed");
      return;
    }

    if (!customerName || customerName.length < 2) {
      nextFieldErrors.customerName = "Введите имя (минимум 2 символа).";
    }

    if (!/^[+0-9 ()-]{8,}$/.test(customerPhone)) {
      nextFieldErrors.customerPhone = "Введите корректный номер телефона.";
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(customerEmail)) {
      nextFieldErrors.customerEmail = "Введите корректный email.";
    }

    if (!deliveryAddress || deliveryAddress.length < 6) {
      nextFieldErrors.deliveryAddress = "Укажите полный адрес доставки.";
    }

    if (Object.keys(nextFieldErrors).length > 0) {
      setFieldErrors(nextFieldErrors);
      setState("failed");
      return;
    }

    try {
      const response = await fetch(`${API_BASE}/checkout/confirm`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          cartId,
          customerName,
          customerEmail,
          customerPhone,
          deliveryCity: "Алматы",
          deliveryAddress,
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
      setState("done");
      setSuccess("Заказ создан. Перенаправляем на страницу подтверждения...");
      toast({ title: "Заказ оформлен", description: "Открываем подтверждение", tone: "success" });
      if (payload.paymentUrl) {
        window.open(payload.paymentUrl, "_blank", "noopener,noreferrer");
      }
      window.setTimeout(() => {
        router.push(`/order/${payload.orderNumber}`);
      }, 240);
    } catch (e) {
      setState("failed");
      setError((e as Error).message);
      toast({ title: "Ошибка оформления", tone: "error" });
    }
  };

  return (
    <Section>
      <Container className="grid checkout-layout">
        <PageHeader title="Оформление заказа" subtitle="Минимум полей, быстрая проверка, безопасная оплата" />
        {success ? (
          <Card>
            <p className="small">{success}</p>
          </Card>
        ) : null}
        <form className="grid" onSubmit={submit}>
          <Card className="checkout-card grid">
            <h2 className="h3">Контакты</h2>

            <div className="grid">
              <Input name="customerName" placeholder="Имя" required aria-invalid={Boolean(fieldErrors.customerName)} />
              {fieldErrors.customerName ? <p className="small" role="alert">{fieldErrors.customerName}</p> : null}
            </div>

            <div className="grid">
              <Input name="customerPhone" placeholder="Телефон" required aria-invalid={Boolean(fieldErrors.customerPhone)} />
              {fieldErrors.customerPhone ? <p className="small" role="alert">{fieldErrors.customerPhone}</p> : null}
            </div>

            <div className="grid">
              <Input
                name="customerEmail"
                type="email"
                placeholder="Email"
                required
                aria-invalid={Boolean(fieldErrors.customerEmail)}
              />
              {fieldErrors.customerEmail ? <p className="small" role="alert">{fieldErrors.customerEmail}</p> : null}
            </div>

            <div className="grid">
              <Textarea
                name="deliveryAddress"
                placeholder="Адрес"
                required
                aria-invalid={Boolean(fieldErrors.deliveryAddress)}
              />
              {fieldErrors.deliveryAddress ? <p className="small" role="alert">{fieldErrors.deliveryAddress}</p> : null}
            </div>

            <p className="text-secondary">Мы используем безопасную оплату. Ваши данные защищены.</p>
            <div className="order-status-grid">
              <p className="small">Доступные методы</p>
              <p>Карты / Kaspi / другие провайдеры</p>
              <p className="small">Безопасность</p>
              <p>SSL / 3-D Secure</p>
              <p className="small">Подтверждение</p>
              <p>Email и статус заказа в кабинете</p>
            </div>
            <Button
              type="submit"
              disabled={state === "pending"}
              actionState={state}
              pendingLabel="Оформляем..."
              doneLabel="Готово"
              failedLabel="Проверить и повторить"
            >
              Оформить заказ
            </Button>
          </Card>
          {error ? <ErrorState title="Ошибка оформления" message={error} /> : null}
        </form>
      </Container>
    </Section>
  );
}

