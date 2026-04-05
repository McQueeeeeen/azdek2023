import Link from "next/link";
import Container from "@/components/ui/container";
import Section from "@/components/ui/section";
import Button from "@/components/ui/button";

export default function AdminPage() {
  return (
    <Section>
      <Container className="grid" style={{ gap: 14 }}>
        <h1 className="h2">Admin dashboard</h1>
        <div className="admin-grid">
          <article className="ui-card"><h3 className="h4">Catalog</h3><p className="text-secondary">Manage products and categories.</p><Link href="/admin/nodes"><Button variant="secondary">Open</Button></Link></article>
          <article className="ui-card"><h3 className="h4">Billing</h3><p className="text-secondary">Revenue and payment monitoring.</p><Link href="/admin/billing"><Button variant="secondary">Open</Button></Link></article>
          <article className="ui-card"><h3 className="h4">System health</h3><p className="text-secondary">Runtime status and API checks.</p><Link href="/admin/health"><Button variant="secondary">Open</Button></Link></article>
        </div>
      </Container>
    </Section>
  );
}
