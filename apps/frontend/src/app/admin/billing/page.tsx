import Container from "@/components/ui/container";
import Section from "@/components/ui/section";

export default function AdminBillingPage() {
  return (
    <Section>
      <Container className="grid" style={{ gap: 14 }}>
        <h1 className="h2">Billing</h1>
        <div className="admin-grid">
          <article className="ui-card"><p className="small">Today revenue</p><p className="h3">420,000 ₸</p></article>
          <article className="ui-card"><p className="small">Orders paid</p><p className="h3">37</p></article>
          <article className="ui-card"><p className="small">Average ticket</p><p className="h3">11,351 ₸</p></article>
        </div>
      </Container>
    </Section>
  );
}
