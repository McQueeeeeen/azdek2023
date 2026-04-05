import Link from "next/link";
import Container from "@/components/ui/container";
import Section from "@/components/ui/section";
import { ReactNode } from "react";

const links = [
  { href: "/account/orders", label: "Мои заказы" },
  { href: "/account/profile", label: "Личные данные" },
  { href: "/account/addresses", label: "Адреса доставки" },
  { href: "/account/loyalty", label: "Программа лояльности" },
  { href: "/account/notifications", label: "Уведомления" },
];

export default function AccountShell({
  active,
  title,
  subtitle,
  children,
}: {
  active: string;
  title: string;
  subtitle?: string;
  children: ReactNode;
}) {
  return (
    <Section>
      <Container className="grid" style={{ gap: 14 }}>
        <div>
          <h1 className="h2">{title}</h1>
          {subtitle ? <p className="text-secondary">{subtitle}</p> : null}
        </div>

        <div className="account-grid">
          <nav className="account-menu" aria-label="Навигация личного кабинета">
            {links.map((link) => (
              <Link key={link.href} href={link.href} className={active === link.href ? "active" : undefined}>
                {link.label}
              </Link>
            ))}
          </nav>

          <section className="account-panel">{children}</section>
        </div>
      </Container>
    </Section>
  );
}
