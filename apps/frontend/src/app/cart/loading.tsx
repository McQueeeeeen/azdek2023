import Container from "@/components/ui/container";
import Section from "@/components/ui/section";
import Card from "@/components/ui/card";
import Skeleton from "@/components/ui/skeleton";

export default function LoadingCart() {
  return (
    <Section>
      <Container className="grid" style={{ gap: 14 }}>
        <Card><Skeleton className="h-24" /></Card>
        <div className="cart-layout">
          <div className="grid" style={{ gap: 10 }}>
            <Card><Skeleton className="h-24" /></Card>
            <Card><Skeleton className="h-24" /></Card>
          </div>
          <Card><Skeleton className="h-56" /></Card>
        </div>
      </Container>
    </Section>
  );
}
