import Container from "@/components/ui/container";
import Section from "@/components/ui/section";
import Button from "@/components/ui/button";
import { Input, Textarea } from "@/components/ui/input";
import Badge from "@/components/ui/badge";
import Card from "@/components/ui/card";
import Skeleton from "@/components/ui/skeleton";

export default function DesignSystemPage() {
  return (
    <Section>
      <Container className="grid" style={{ gap: 18 }}>
        <div>
          <h1 className="h2">Design System</h1>
          <p className="text-secondary">Tokens, components, states and patterns for scalable e-commerce UI.</p>
        </div>

        <Card className="grid" style={{ gap: 10 }}>
          <h3 className="h4">Typography</h3>
          <p className="h1">H1 • Conversion headline</p>
          <p className="h2">H2 • Section headline</p>
          <p className="h3">H3 • Block headline</p>
          <p className="body">Body text for descriptions and helpful copy.</p>
          <p className="caption">Caption / helper copy</p>
        </Card>

        <Card className="grid" style={{ gap: 10 }}>
          <h3 className="h4">Color tokens</h3>
          <div className="grid" style={{ gridTemplateColumns: "repeat(6, minmax(0, 1fr))", gap: 8 }}>
            {[
              ["bg", "var(--bg)"],
              ["surface", "var(--surface)"],
              ["border", "var(--border)"],
              ["text", "var(--text)"],
              ["primary", "var(--primary)"],
              ["error", "var(--error)"],
            ].map(([label, color]) => (
              <div key={String(label)} className="ui-card" style={{ gap: 6 }}>
                <div style={{ height: 36, borderRadius: 8, border: "1px solid var(--border)", background: String(color) }} />
                <span className="small">{String(label)}</span>
              </div>
            ))}
          </div>
        </Card>

        <Card className="grid" style={{ gap: 10 }}>
          <h3 className="h4">Buttons</h3>
          <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
            <Button>Primary</Button>
            <Button variant="secondary">Secondary</Button>
            <Button variant="outline">Outline</Button>
            <Button variant="ghost">Ghost</Button>
            <Button disabled>Disabled</Button>
          </div>
        </Card>

        <Card className="grid" style={{ gap: 10 }}>
          <h3 className="h4">Inputs</h3>
          <Input placeholder="Search input" />
          <Input className="ui-input-filled" defaultValue="Filled state" />
          <Input aria-invalid="true" placeholder="Error state" />
          <select className="ui-input" defaultValue="one">
            <option value="one">Dropdown option</option>
            <option value="two">Another option</option>
          </select>
          <div style={{ display: "flex", gap: 14 }}>
            <label className="filter-check"><input type="checkbox" defaultChecked /> Checkbox</label>
            <label className="filter-check"><input type="radio" name="ds-radio" defaultChecked /> Radio</label>
          </div>
          <Textarea placeholder="Textarea" />
        </Card>

        <Card className="grid" style={{ gap: 10 }}>
          <h3 className="h4">Status</h3>
          <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
            <Badge>Default</Badge>
            <Badge variant="success">Success</Badge>
            <Badge variant="error">Error</Badge>
          </div>
          <div className="grid" style={{ gridTemplateColumns: "repeat(3, minmax(0, 1fr))", gap: 8 }}>
            <Skeleton className="h-24" />
            <Skeleton className="h-24" />
            <Skeleton className="h-24" />
          </div>
        </Card>
      </Container>
    </Section>
  );
}
