import Link from "next/link";
import Container from "@/components/ui/container";
import Section from "@/components/ui/section";
import Button from "@/components/ui/button";

export default function SeasonalPage() {
  return (
    <Section>
      <Container className="grid" style={{ gap: 14 }}>
        <div className="ui-card">
          <p className="small">Seasonal</p>
          <h1 className="h2">Winter cleaning protocol</h1>
          <p className="text-secondary">Products selected for heavy fabric care and anti-scale protection in cold season.</p>
          <Link href="/catalog"><Button>Open seasonal selection</Button></Link>
        </div>
      </Container>
    </Section>
  );
}
