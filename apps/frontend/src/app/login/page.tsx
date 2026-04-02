"use client";

import { FormEvent, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { AuthTokens, apiPost } from "@/lib/api";
import Container from "@/components/ui/container";
import Section from "@/components/ui/section";
import Card from "@/components/ui/card";
import PageHeader from "@/components/ui/page-header";
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
  const [ok, setOk] = useState<string | null>(null);

  const modeTitle = useMemo(() => {
    if (mode === "login") {
      return "Быстрый доступ к заказам";
    }
    return "Создать аккаунт";
  }, [mode]);

  const modeSubtitle = useMemo(() => {
    if (mode === "login") {
      return "Без лишних данных. Только необходимое.";
    }
    return "Пара полей - и вы внутри.";
  }, [mode]);

  const onSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError(null);
    setOk(null);
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
      setOk(`Вы вошли как ${tokens.user.email} (${tokens.user.role}).`);
      const redirectTo =
        typeof window !== "undefined" ? new URLSearchParams(window.location.search).get("redirect") : null;
      router.push(redirectTo && redirectTo.startsWith("/") ? redirectTo : "/account");
    } catch (e) {
      setError((e as Error).message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Section>
      <Container className="grid auth-layout">
        <PageHeader title={modeTitle} subtitle={modeSubtitle} />

        <Card className="auth-card grid">
          <div className="auth-mode-switch" role="tablist" aria-label="Режим авторизации">
            <Button
              type="button"
              variant={mode === "login" ? "primary" : "secondary"}
              className="full-width"
              onClick={() => setMode("login")}
            >
              Вход
            </Button>
            <Button
              type="button"
              variant={mode === "register" ? "primary" : "secondary"}
              className="full-width"
              onClick={() => setMode("register")}
            >
              Регистрация
            </Button>
          </div>

          <form className="grid auth-form" onSubmit={onSubmit}>
            {mode === "register" ? (
              <>
                <div className="auth-grid-2">
                  <Input name="firstName" placeholder="Имя" />
                  <Input name="lastName" placeholder="Фамилия" />
                </div>
                <Input name="phone" placeholder="Телефон" />
                <div className="auth-customer-type">
                  <Button
                    type="button"
                    variant={customerType === "b2c" ? "primary" : "secondary"}
                    onClick={() => setCustomerType("b2c")}
                  >
                    Розница (B2C)
                  </Button>
                  <Button
                    type="button"
                    variant={customerType === "b2b" ? "primary" : "secondary"}
                    onClick={() => setCustomerType("b2b")}
                  >
                    Опт (B2B)
                  </Button>
                </div>
              </>
            ) : null}

            <Input name="email" type="email" placeholder="Email" required />
            <Input name="password" type="password" placeholder="Пароль (минимум 8 символов)" minLength={8} required />

            <Button type="submit" disabled={submitting}>
              {submitting ? "Подождите..." : mode === "login" ? "Войти" : "Создать аккаунт"}
            </Button>
          </form>

          <div className="auth-divider" aria-hidden>
            <span>или</span>
          </div>

          {GOOGLE_AUTH_URL ? (
            <a href={GOOGLE_AUTH_URL} className="auth-social-link" rel="noreferrer">
              <Button type="button" variant="secondary" className="full-width auth-google-btn">
                Продолжить через Google
              </Button>
            </a>
          ) : (
            <Button type="button" variant="secondary" className="full-width auth-google-btn" disabled>
              Google-вход будет доступен после подключения OAuth
            </Button>
          )}
        </Card>

        {ok ? (
          <Card>
            <p className="small">{ok}</p>
          </Card>
        ) : null}

        {error ? <ErrorState title="Не удалось войти" message={error} /> : null}
      </Container>
    </Section>
  );
}
