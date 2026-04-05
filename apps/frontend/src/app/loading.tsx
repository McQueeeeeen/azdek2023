import Container from "@/components/ui/container";
import Section from "@/components/ui/section";
import Card from "@/components/ui/card";
import Skeleton from "@/components/ui/skeleton";

export default function GlobalLoading() {
  return (
    <Section>
      <Container className="grid" style={{ gap: 14 }}>
        <Card><Skeleton className="h-56" /></Card>
        <div className="grid" style={{ gridTemplateColumns: "repeat(3, minmax(0, 1fr))", gap: 12 }}>
          <Card><Skeleton className="h-24" /></Card>
          <Card><Skeleton className="h-24" /></Card>
          <Card><Skeleton className="h-24" /></Card>
        </div>
      </Container>
    </Section>
  );
}
