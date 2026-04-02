"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { apiGet } from "@/lib/api";
import Container from "@/components/ui/container";
import Section from "@/components/ui/section";
import Card from "@/components/ui/card";
import ErrorState from "@/components/ui/error-state";
import Skeleton from "@/components/ui/skeleton";
import Button from "@/components/ui/button";

interface MeResponse {
  id: string;
  email: string;
  role: string;
  customerId: string | null;
}

const ROLE_LABELS: Record<string, string> = {
  admin: "Администратор",
  owner: "Владелец",
  operator: "Оператор",
  manager: "Менеджер",
  user: "Пользователь",
  customer: "Покупатель",
  b2b_customer: "B2B клиент",
};

export default function AccountPage() {
  const [me, setMe] = useState<MeResponse | null>(null);
  const [customer, setCustomer] = useState<Record<string, unknown> | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const run = async () => {
      const token = localStorage.getItem("azdek_access_token") ?? "";
      if (!token) {
        setError("Вы не авторизованы.");
        setLoading(false);
        return;
      }

      try {
        const meData = await apiGet<MeResponse>("/auth/me", token);
        setMe(meData);
        if (meData.role === "customer" || meData.role === "b2b_customer") {
          const customerData = await apiGet<Record<string, unknown>>("/customers/me", token);
          setCustomer(customerData);
        }
      } catch (e) {
        setError((e as Error).message);
      } finally {
        setLoading(false);
      }
    };

    void run();
  }, []);

  const roleLabel = useMemo(() => (!me ? "-" : ROLE_LABELS[me.role] ?? me.role), [me]);

  if (loading) {
    return (
      <Section>
        <Container className="grid">
          <Skeleton className="h-24" />
          <Skeleton className="h-56" />
        </Container>
      </Section>
    );
  }

  if (error) {
    return (
      <Section>
        <Container className="grid">
          <ErrorState title="Кабинет недоступен" message={error} />
          <Link href="/login">
            <Button>Войти</Button>
          </Link>
        </Container>
      </Section>
    );
  }

  return (
    <Section>
      <Container className="grid">
        <Card className="grid">
          <h1>Личный кабинет</h1>
          <p>Email: {me?.email}</p>
          <p>Роль: {roleLabel}</p>
          <p>ID клиента: {me?.customerId ?? "Не назначен"}</p>
        </Card>

        {customer ? (
          <Card className="grid">
            <h2>Данные клиента</h2>
            <pre style={{ whiteSpace: "pre-wrap", margin: 0 }}>{JSON.stringify(customer, null, 2)}</pre>
          </Card>
        ) : null}
      </Container>
    </Section>
  );
}