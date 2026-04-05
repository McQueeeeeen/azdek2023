import Container from "@/components/ui/container";
import Section from "@/components/ui/section";
import Card from "@/components/ui/card";
import Skeleton from "@/components/ui/skeleton";

export default function LoadingAccount() {
  return (
    <Section>
      <Container className="account-grid">
        <Card><Skeleton className="h-56" /></Card>
        <Card><Skeleton className="h-56" /></Card>
      </Container>
    </Section>
  );
}
