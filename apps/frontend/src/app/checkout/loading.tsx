import Container from "@/components/ui/container";
import Section from "@/components/ui/section";
import Card from "@/components/ui/card";
import Skeleton from "@/components/ui/skeleton";

export default function LoadingCheckout() {
  return (
    <Section>
      <Container className="checkout-layout">
        <Card className="grid">
          <Skeleton className="h-24" />
          <Skeleton className="h-24" />
          <Skeleton className="h-24" />
        </Card>
        <Card><Skeleton className="h-56" /></Card>
      </Container>
    </Section>
  );
}
