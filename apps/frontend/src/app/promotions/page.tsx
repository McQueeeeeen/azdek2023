import Link from "next/link";
import Container from "@/components/ui/container";
import Section from "@/components/ui/section";
import Button from "@/components/ui/button";

export default function PromotionsPage() {
  return (
    <Section>
      <Container className="grid" style={{ gap: 14 }}>
        <h1 className="h2">Promotions</h1>
        <div className="product-grid">
          <article className="ui-card"><h3 className="h4">Starter bundle -15%</h3><p className="text-secondary">Laundry + Kitchen + Bathroom essential set.</p><Button>Copy code START15</Button></article>
          <article className="ui-card"><h3 className="h4">Free delivery</h3><p className="text-secondary">For orders over 25,000 KZT this week.</p><Button variant="secondary">Apply automatically</Button></article>
          <article className="ui-card"><h3 className="h4">Reorder bonus</h3><p className="text-secondary">Second order gets +5% discount in account.</p><Link href="/account/orders"><Button variant="outline">See order history</Button></Link></article>
        </div>
      </Container>
    </Section>
  );
}
