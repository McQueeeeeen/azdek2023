import Container from "@/components/ui/container";
import Section from "@/components/ui/section";

export default function AdminNodesPage() {
  return (
    <Section>
      <Container className="grid" style={{ gap: 14 }}>
        <h1 className="h2">Catalog nodes</h1>
        <div className="ui-card">
          <p className="text-secondary">Reusable catalog/product templates are active. Add new SKU without page redesign.</p>
        </div>
      </Container>
    </Section>
  );
}
