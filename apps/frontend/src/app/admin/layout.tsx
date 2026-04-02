"use client";

import Link from "next/link";
import { ReactNode, useEffect, useMemo, useState } from "react";
import Container from "@/components/ui/container";
import Section from "@/components/ui/section";
import Card from "@/components/ui/card";
import { canAccessAdmin, getClientRole } from "@/lib/roles";

export default function AdminLayout({ children }: { children: ReactNode }) {
  const [role, setRole] = useState<string | null>(null);
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    try {
      setRole(getClientRole());
    } catch {
      setRole(null);
    } finally {
      setChecking(false);
    }
  }, []);

  const hasAccess = useMemo(() => canAccessAdmin(role), [role]);

  if (checking) {
    return null;
  }

  if (!hasAccess) {
    return (
      <Section>
        <Container className="grid">
          <Card className="account-hero-card">
            <span className="status-pill warn">Ограниченный доступ</span>
            <h1 className="h2">Админ-панель недоступна для текущей роли</h1>
            <p className="text-secondary">
              Панель управления доступна только владельцу, администратору и оператору.
              Войдите под аккаунтом с разрешенными правами доступа.
            </p>
            <div>
              <Link href="/login">
                <button className="ui-button ui-button-primary">Войти под админ-аккаунтом</button>
              </Link>
            </div>
          </Card>
        </Container>
      </Section>
    );
  }

  return <>{children}</>;
}
