import Container from "@/components/ui/container";
import Section from "@/components/ui/section";

export default function AdminHealthPage() {
  return (
    <Section>
      <Container className="grid" style={{ gap: 14 }}>
        <h1 className="h2">System health</h1>
        <div className="admin-grid">
          <article className="ui-card"><p className="small">Frontend</p><p className="h4" style={{ color: "var(--success)" }}>Healthy</p></article>
          <article className="ui-card"><p className="small">Backend API</p><p className="h4" style={{ color: "var(--success)" }}>Healthy</p></article>
          <article className="ui-card"><p className="small">Payments</p><p className="h4" style={{ color: "var(--success)" }}>Healthy</p></article>
        </div>
      </Container>
    </Section>
  );
}
