"use client";

import { FormEvent, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { AuthTokens, apiPost } from "@/lib/api";
import Container from "@/components/ui/container";
import Section from "@/components/ui/section";
import Card from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import Button from "@/components/ui/button";
import ErrorState from "@/components/ui/error-state";

type AuthMode = "login" | "register";
type CustomerType = "b2c" | "b2b";

const GOOGLE_AUTH_URL = process.env.NEXT_PUBLIC_GOOGLE_AUTH_URL;

function persistTokens(tokens: AuthTokens): void {
  localStorage.setItem("azdek_access_token", tokens.accessToken);
  localStorage.setItem("azdek_refresh_token", tokens.refreshToken);
  localStorage.setItem("azdek_user_role", tokens.user.role);
  document.cookie = `azdek_access_token=${encodeURIComponent(tokens.accessToken)}; Path=/; Max-Age=2592000; SameSite=Lax`;
}

export default function LoginPage() {
  const router = useRouter();
  const [mode, setMode] = useState<AuthMode>("login");
  const [customerType, setCustomerType] = useState<CustomerType>("b2c");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const modeTitle = useMemo(() => (mode === "login" ? "Вход" : "Регистрация"), [mode]);

  const onSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError(null);
    setSubmitting(true);

    const formData = new FormData(event.currentTarget);
    const email = String(formData.get("email") ?? "").trim();
    const password = String(formData.get("password") ?? "").trim();

    try {
      let tokens: AuthTokens;
      if (mode === "login") {
        tokens = await apiPost<AuthTokens>("/auth/login", { email, password });
      } else {
        const firstName = String(formData.get("firstName") ?? "").trim();
        const lastName = String(formData.get("lastName") ?? "").trim();
        const phone = String(formData.get("phone") ?? "").trim();
        tokens = await apiPost<AuthTokens>("/auth/register/customer", {
          email,
          password,
          firstName: firstName || undefined,
          lastName: lastName || undefined,
          phone: phone || undefined,
          customerType,
        });
      }

      persistTokens(tokens);
      const redirectTo = typeof window !== "undefined" ? new URLSearchParams(window.location.search).get("redirect") : null;
      router.push(redirectTo && redirectTo.startsWith("/") ? redirectTo : "/account");
    } catch (e) {
      setError((e as Error).message || "Не удалось выполнить вход.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Section>
      <Container className="grid">
        <Card className="grid">
          <h1>{modeTitle}</h1>
          <div style={{ display: "flex", gap: 8 }}>
            <Button type="button" variant={mode === "login" ? "primary" : "secondary"} onClick={() => setMode("login")}>Вход</Button>
            <Button type="button" variant={mode === "register" ? "primary" : "secondary"} onClick={() => setMode("register")}>Регистрация</Button>
          </div>

          <form className="grid" onSubmit={onSubmit}>
            {mode === "register" ? (
              <>
                <Input name="firstName" placeholder="Имя" />
                <Input name="lastName" placeholder="Фамилия" />
                <Input name="phone" placeholder="Телефон" />
                <div style={{ display: "flex", gap: 8 }}>
                  <Button type="button" variant={customerType === "b2c" ? "primary" : "secondary"} onClick={() => setCustomerType("b2c")}>B2C</Button>
                  <Button type="button" variant={customerType === "b2b" ? "primary" : "secondary"} onClick={() => setCustomerType("b2b")}>B2B</Button>
                </div>
              </>
            ) : null}

            <Input name="email" type="email" placeholder="Email" required />
            <Input name="password" type="password" placeholder="Пароль" minLength={8} required />
            <Button type="submit" disabled={submitting}>{submitting ? "Подождите..." : mode === "login" ? "Войти" : "Создать аккаунт"}</Button>
          </form>

          {GOOGLE_AUTH_URL ? (
            <a href={GOOGLE_AUTH_URL} rel="noreferrer">
              <Button type="button" variant="secondary">Войти через Google</Button>
            </a>
          ) : null}
        </Card>

        {error ? <ErrorState title="Ошибка" message={error} /> : null}
      </Container>
    </Section>
  );
}