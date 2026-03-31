"use client";

import { FormEvent, useState } from "react";
import { AuthTokens, apiPost } from "@/lib/api";
import Container from "@/components/ui/container";
import Section from "@/components/ui/section";
import Card from "@/components/ui/card";
import PageHeader from "@/components/ui/page-header";
import { Input } from "@/components/ui/input";
import Button from "@/components/ui/button";
import ErrorState from "@/components/ui/error-state";

export default function LoginPage() {
  const [error, setError] = useState<string | null>(null);
  const [ok, setOk] = useState<string | null>(null);

  const onSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError(null);
    setOk(null);

    const formData = new FormData(event.currentTarget);
    const email = String(formData.get("email") ?? "");
    const password = String(formData.get("password") ?? "");

    try {
      const tokens = await apiPost<AuthTokens>("/auth/login", { email, password });
      localStorage.setItem("azdek_access_token", tokens.accessToken);
      localStorage.setItem("azdek_refresh_token", tokens.refreshToken);
      setOk(`Вы вошли как ${tokens.user.email} (${tokens.user.role})`);
    } catch (e) {
      setError((e as Error).message);
    }
  };

  return (
    <Section>
      <Container className="grid auth-layout">
        <PageHeader title="Вход" subtitle="Войдите в кабинет и историю заказов" />
        <form className="grid" onSubmit={onSubmit}>
          <Card className="grid auth-card">
            <Input name="email" type="email" placeholder="Email" required />
            <Input name="password" type="password" placeholder="Пароль" required />
            <Button type="submit">Войти</Button>
          </Card>
          {ok ? (
            <Card>
              <p className="small">{ok}</p>
            </Card>
          ) : null}
          {error ? <ErrorState title="Ошибка входа" message={error} /> : null}
        </form>
      </Container>
    </Section>
  );
}
