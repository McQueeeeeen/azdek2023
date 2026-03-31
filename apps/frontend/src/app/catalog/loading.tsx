import Container from "@/components/ui/container";
import Section from "@/components/ui/section";
import Card from "@/components/ui/card";
import Skeleton from "@/components/ui/skeleton";

export default function LoadingCatalog() {
  return (
    <Section>
      <Container className="grid">
        <Card className="grid">
          <Skeleton className="h-24" />
        </Card>
        <div className="product-grid">
          <Card><Skeleton className="h-56" /></Card>
          <Card><Skeleton className="h-56" /></Card>
          <Card><Skeleton className="h-56" /></Card>
        </div>
      </Container>
    </Section>
  );
}

