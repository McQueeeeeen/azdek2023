"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import { getCurrentAttribution, getSessionIdForCheckout } from "@/lib/analytics";
import Container from "@/components/ui/container";
import Section from "@/components/ui/section";
import Card from "@/components/ui/card";
import Button from "@/components/ui/button";
import { Input, Textarea } from "@/components/ui/input";
import ErrorState from "@/components/ui/error-state";
import { UiActionState } from "@/lib/ui-state";
import { useToast } from "@/components/ui/use-toast";

const API_BASE = process.env.NEXT_PUBLIC_API_URL ?? "http://127.0.0.1:4000/v1";

type FieldErrors = Partial<Record<"customerName" | "customerPhone" | "deliveryAddress", string>>;

export default function CheckoutPage() {
  const router = useRouter();
  const { toast } = useToast();
  const [state, setState] = useState<UiActionState>("idle");
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({});

  const submit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (state === "pending") return;

    setState("pending");
    setError(null);
    setSuccess(null);
    setFieldErrors({});

    const formData = new FormData(event.currentTarget);
    const cartId = localStorage.getItem("azdek_cart_id");
    const attribution = getCurrentAttribution();
    const sessionId = getSessionIdForCheckout();
    const customerName = String(formData.get("customerName") ?? "").trim();
    const customerPhone = String(formData.get("customerPhone") ?? "").trim();
    const deliveryAddress = String(formData.get("deliveryAddress") ?? "").trim();
    const customerEmail = `${customerPhone.replace(/\D/g, "").slice(-10) || "guest"}@azdek.local`;

    const nextFieldErrors: FieldErrors = {};

    if (!cartId) {
      setError("Корзина пуста. Добавьте товары перед оформлением.");
      setState("failed");
      return;
    }
    if (!customerName || customerName.length < 2) nextFieldErrors.customerName = "Введите имя.";
    if (!/^[+0-9 ()-]{8,}$/.test(customerPhone)) nextFieldErrors.customerPhone = "Введите корректный номер телефона.";
    if (!deliveryAddress || deliveryAddress.length < 6) nextFieldErrors.deliveryAddress = "Укажите адрес доставки.";

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

      if (!response.ok) throw new Error(await response.text());

      const payload = await response.json();
      setState("done");
      setSuccess("Заказ принят. Открываем подтверждение.");
      toast({ title: "Заказ оформлен", tone: "success" });
      if (payload.paymentUrl) window.open(payload.paymentUrl, "_blank", "noopener,noreferrer");
      window.setTimeout(() => router.push(`/order/${payload.orderNumber}`), 200);
    } catch (e) {
      setState("failed");
      setError((e as Error).message || "Не удалось оформить заказ.");
      toast({ title: "Ошибка оформления", tone: "error" });
    }
  };

  return (
    <Section>
      <Container className="grid">
        <Card className="grid">
          <h1>Оформление заказа</h1>
          <p className="text-secondary">Минимум полей. Проверка сразу.</p>
        </Card>

        {success ? (
          <Card>
            <p>{success}</p>
          </Card>
        ) : null}

        <form className="grid" onSubmit={submit}>
          <Card className="grid">
            <Input name="customerName" placeholder="Имя" required aria-invalid={Boolean(fieldErrors.customerName)} />
            {fieldErrors.customerName ? <p className="small">{fieldErrors.customerName}</p> : null}

            <Input name="customerPhone" placeholder="Телефон" required aria-invalid={Boolean(fieldErrors.customerPhone)} />
            {fieldErrors.customerPhone ? <p className="small">{fieldErrors.customerPhone}</p> : null}

            <Textarea name="deliveryAddress" placeholder="Адрес" required aria-invalid={Boolean(fieldErrors.deliveryAddress)} />
            {fieldErrors.deliveryAddress ? <p className="small">{fieldErrors.deliveryAddress}</p> : null}

            <Button type="submit" disabled={state === "pending"} actionState={state} pendingLabel="Оформляем..." doneLabel="Готово" failedLabel="Повторить">
              Завершить заказ
            </Button>
          </Card>
        </form>

        {error ? <ErrorState title="Ошибка" message={error} /> : null}
      </Container>
    </Section>
  );
}