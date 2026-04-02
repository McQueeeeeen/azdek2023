"use client";

import Link from "next/link";
import { ReactNode, useEffect, useMemo, useState } from "react";
import Container from "@/components/ui/container";
import Section from "@/components/ui/section";
import Card from "@/components/ui/card";
import Button from "@/components/ui/button";
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

  if (checking) return null;

  if (!hasAccess) {
    return (
      <Section>
        <Container className="grid">
          <Card className="grid">
            <h1>Нет доступа к админ-панели</h1>
            <p className="text-secondary">Войдите под ролью с правами администратора.</p>
            <Link href="/login">
              <Button>Войти</Button>
            </Link>
          </Card>
        </Container>
      </Section>
    );
  }

  return <>{children}</>;
}