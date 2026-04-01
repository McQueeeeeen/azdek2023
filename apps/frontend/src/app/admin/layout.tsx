"use client";

import Link from "next/link";
import { ReactNode, useEffect, useMemo, useState } from "react";
import Container from "@/components/ui/container";
import Section from "@/components/ui/section";
import Card from "@/components/ui/card";
import { canAccessAdmin } from "@/lib/roles";

export default function AdminLayout({ children }: { children: ReactNode }) {
  const [role, setRole] = useState<string | null>(null);
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    try {
      const savedRole = localStorage.getItem("azdek_user_role");
      setRole(savedRole);
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
          <Card>
            <h1 className="h2">Доступ ограничен</h1>
            <p className="text-secondary">Панель администратора доступна только пользователям с разрешенными ролями.</p>
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
