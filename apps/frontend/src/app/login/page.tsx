"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import Container from "@/components/ui/container";
import Section from "@/components/ui/section";
import { Input } from "@/components/ui/input";
import Button from "@/components/ui/button";

const API_BASE = process.env.NEXT_PUBLIC_API_URL ?? "http://127.0.0.1:4000/v1";

type Mode = "login" | "register";

export default function LoginPage() {
  const router = useRouter();
  const [mode, setMode] = useState<Mode>("login");
  const [pending, setPending] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [form, setForm] = useState({
    email: "",
    password: "",
    firstName: "",
    lastName: "",
    phone: "",
  });

  const submit = async (event: FormEvent) => {
    event.preventDefault();
    setPending(true);
    setError(null);

    try {
      if (mode === "register") {
        const registerRes = await fetch(`${API_BASE}/auth/register/customer`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            email: form.email,
            password: form.password,
            firstName: form.firstName,
            lastName: form.lastName,
            phone: form.phone,
            customerType: "b2c",
          }),
        });
        if (!registerRes.ok) throw new Error("Registration failed");
      }

      const loginRes = await fetch(`${API_BASE}/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: form.email, password: form.password }),
      });
      if (!loginRes.ok) throw new Error("Login failed");

      const payload = (await loginRes.json()) as {
        accessToken: string;
        refreshToken: string;
        user: { role: string };
      };

      localStorage.setItem("azdek_access_token", payload.accessToken);
      localStorage.setItem("azdek_refresh_token", payload.refreshToken);
      localStorage.setItem("azdek_user_role", payload.user.role);
      document.cookie = `azdek_access_token=${encodeURIComponent(payload.accessToken)}; Path=/; Max-Age=2592000; SameSite=Lax`;

      router.push("/account");
    } catch {
      setError("Auth request failed. Check email/password.");
    } finally {
      setPending(false);
    }
  };

  return (
    <Section>
      <Container style={{ maxWidth: 560 }}>
        <form className="ui-card" onSubmit={submit}>
          <p className="small">Account access</p>
          <h1 className="h2">{mode === "login" ? "Sign in" : "Create account"}</h1>

          {mode === "register" ? (
            <div className="form-grid">
              <Input placeholder="First name" value={form.firstName} onChange={(e) => setForm((v) => ({ ...v, firstName: e.target.value }))} />
              <Input placeholder="Last name" value={form.lastName} onChange={(e) => setForm((v) => ({ ...v, lastName: e.target.value }))} />
              <Input className="full" placeholder="Phone" value={form.phone} onChange={(e) => setForm((v) => ({ ...v, phone: e.target.value }))} />
            </div>
          ) : null}

          <Input placeholder="Email" type="email" value={form.email} onChange={(e) => setForm((v) => ({ ...v, email: e.target.value }))} />
          <Input placeholder="Password" type="password" value={form.password} onChange={(e) => setForm((v) => ({ ...v, password: e.target.value }))} />

          {error ? <p style={{ color: "var(--error)" }}>{error}</p> : null}

          <Button type="submit" actionState={pending ? "pending" : "idle"} pendingLabel="Please wait..." disabled={pending}>
            {mode === "login" ? "Sign in" : "Create and sign in"}
          </Button>

          <Button type="button" variant="secondary" onClick={() => setMode((m) => (m === "login" ? "register" : "login"))}>
            {mode === "login" ? "Need an account? Register" : "Already have account? Sign in"}
          </Button>
        </form>
      </Container>
    </Section>
  );
}
