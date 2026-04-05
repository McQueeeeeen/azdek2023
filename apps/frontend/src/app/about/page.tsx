import Container from "@/components/ui/container";
import Section from "@/components/ui/section";

export default function AboutPage() {
  return (
    <Section>
      <Container className="grid" style={{ gap: 14, maxWidth: 900 }}>
        <h1 className="h2">About Adzek</h1>
        <p className="text-secondary">
          We build practical household formulas focused on efficiency, safety, and repeat purchase confidence.
        </p>
        <div className="benefits-grid">
          <article className="ui-card"><h3 className="h4">Clear composition</h3><p className="text-secondary">Transparent ingredients and usage recommendations.</p></article>
          <article className="ui-card"><h3 className="h4">Performance first</h3><p className="text-secondary">High concentration for less effort and faster cleaning.</p></article>
          <article className="ui-card"><h3 className="h4">Scalable UX</h3><p className="text-secondary">Catalog and product templates designed for 100+ products.</p></article>
        </div>
      </Container>
    </Section>
  );
}
