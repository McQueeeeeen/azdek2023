"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
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

  const roleLabel = useMemo(() => {
    if (!me) {
      return "-";
    }
    return ROLE_LABELS[me.role] ?? me.role;
  }, [me]);

  if (loading) {
    return (
      <Section>
        <Container className="grid">
          <PageHeader title="Личный кабинет" subtitle="Загружаем профиль и активность аккаунта" />
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
          <PageHeader title="Личный кабинет" />
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
        <PageHeader title="Личный кабинет" subtitle="Ваш профиль, роль и статус клиентского аккаунта" />

        <Card className="account-hero-card">
          <span className="status-pill ok">Аккаунт активен</span>
          <h2 className="h2">Добро пожаловать в AZDEK</h2>
          <p className="text-secondary">Управляйте заказами, платежами и контактными данными в одном месте.</p>
        </Card>

        <div className="account-metrics">
          <div className="account-metric">
            <p className="small">Роль</p>
            <p className="h3">{roleLabel}</p>
          </div>
          <div className="account-metric">
            <p className="small">ID клиента</p>
            <p className="h3">{me?.customerId ?? "Не назначен"}</p>
          </div>
          <div className="account-metric">
            <p className="small">Статус</p>
            <p className="h3">Подключен</p>
          </div>
        </div>

        <Card>
          <h3 className="h3">Профиль</h3>
          <div className="account-kv">
            <p className="small">Email</p>
            <p>{me?.email}</p>
            <p className="small">Роль доступа</p>
            <p>{roleLabel}</p>
            <p className="small">Идентификатор</p>
            <p>{me?.id}</p>
          </div>
        </Card>

        {customer ? (
          <Card>
            <h3 className="h3">Профиль клиента</h3>
            <div className="code-block">
              <pre>{JSON.stringify(customer, null, 2)}</pre>
            </div>
          </Card>
        ) : null}
      </Container>
    </Section>
  );
}
