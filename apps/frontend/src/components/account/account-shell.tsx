import Link from "next/link";
import Container from "@/components/ui/container";
import Section from "@/components/ui/section";
import { ReactNode } from "react";

const links = [
  { href: "/account", label: "Overview" },
  { href: "/account/profile", label: "Profile" },
  { href: "/account/orders", label: "Orders" },
  { href: "/account/payment-methods", label: "Payment" },
  { href: "/account/notifications", label: "Notifications" },
];

export default function AccountShell({ active, title, subtitle, children }: { active: string; title: string; subtitle?: string; children: ReactNode }) {
  return (
    <Section>
      <Container className="grid" style={{ gap: 14 }}>
        <div>
          <h1 className="h2">{title}</h1>
          {subtitle ? <p className="text-secondary">{subtitle}</p> : null}
        </div>

        <div className="account-grid">
          <nav className="account-menu" aria-label="Account navigation">
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
