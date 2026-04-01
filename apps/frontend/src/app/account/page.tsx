"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { apiGet } from "@/lib/api";
import Container from "@/components/ui/container";
import Section from "@/components/ui/section";
import PageHeader from "@/components/ui/page-header";
import Card from "@/components/ui/card";
import ErrorState from "@/components/ui/error-state";
import Skeleton from "@/components/ui/skeleton";

interface MeResponse {
  id: string;
  email: string;
  role: string;
  customerId: string | null;
}

const ROLE_LABELS: Record<string, string> = {
  admin: "Администратор",
  administrator: "Администратор",
  owner: "Владелец",
  operator: "Оператор",
  manager: "Менеджер",
  support: "Поддержка",
  content_editor: "Контент-редактор",
  warehouse: "Склад",
  user: "Пользователь",
  customer: "Покупатель",
  vip_client: "ВИП-клиент",
  vip: "ВИП-клиент",
  wholesaler: "Оптовик",
  b2b: "B2B",
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
        setError("Вы не авторизованы. Выполните вход в аккаунт.");
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

  if (loading) {
    return (
      <Section>
        <Container className="grid">
          <PageHeader title="Admin Profile" subtitle="Loading identity and account context" />
          <Card className="grid">
            <Skeleton className="h-24" />
            <Skeleton className="h-56" />
          </Card>
        </Container>
      </Section>
    );
  }

  if (error) {
    return (
      <Section>
        <Container className="grid">
          <PageHeader title="Admin Profile" />
          <ErrorState title="Кабинет временно недоступен" message={error} />
          <Link href="/login">
            <button className="ui-button ui-button-primary">Войти в аккаунт</button>
          </Link>
        </Container>
      </Section>
    );
  }

  return (
    <Section>
      <Container className="grid">
        <PageHeader title="Admin Profile" subtitle="Identity, role and customer metadata" />
        <Card className="grid">
          {me ? (
            <>
              <p>
                <strong>Email:</strong> {me.email}
              </p>
              <p>
                <strong>Роль:</strong> {ROLE_LABELS[me.role] ?? me.role}
              </p>
              <p>
                <strong>ID клиента:</strong> {me.customerId ?? "-"}
              </p>
            </>
          ) : null}
        </Card>
        {customer ? (
          <Card className="code-block">
            <pre>{JSON.stringify(customer, null, 2)}</pre>
          </Card>
        ) : null}
      </Container>
    </Section>
  );
}

