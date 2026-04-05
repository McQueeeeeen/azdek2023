import Container from "@/components/ui/container";
import Section from "@/components/ui/section";
import { Input, Textarea } from "@/components/ui/input";
import Button from "@/components/ui/button";

export default function SupportPage() {
  return (
    <Section>
      <Container className="grid" style={{ gap: 14, maxWidth: 900 }}>
        <h1 className="h2">Support</h1>
        <p className="text-secondary">Need help with order, payment, or delivery? Send request and we reply quickly.</p>
        <div className="ui-card">
          <div className="form-grid">
            <Input placeholder="Your email" type="email" />
            <Input placeholder="Order number (optional)" />
            <Textarea className="full" placeholder="Describe your issue" />
          </div>
          <Button>Send request</Button>
        </div>
      </Container>
    </Section>
  );
}
