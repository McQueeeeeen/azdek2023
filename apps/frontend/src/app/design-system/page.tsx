import Container from "@/components/ui/container";
import Section from "@/components/ui/section";
import Button from "@/components/ui/button";
import { Input, Textarea } from "@/components/ui/input";
import Badge from "@/components/ui/badge";
import Card from "@/components/ui/card";
import Skeleton from "@/components/ui/skeleton";

const TOKENS = [
  ["Background", "var(--bg)"],
  ["Surface", "var(--surface)"],
  ["Surface alt", "var(--surface-2)"],
  ["Border", "var(--border)"],
  ["Text", "var(--text)"],
  ["Muted", "var(--text-muted)"],
  ["Primary", "var(--primary)"],
  ["Success", "var(--success)"],
  ["Error", "var(--error)"],
];

const SPACING = ["4", "8", "12", "16", "24", "32", "48"];

export default function DesignSystemPage() {
  return (
    <Section>
      <Container className="grid" style={{ gap: 24 }}>
        <div>
          <h1 className="h2">Adzek UI System</h1>
          <p className="text-secondary">Production-ready UI kit: spacing, typography, states, shadows, and reusable commerce patterns.</p>
        </div>

        <Card className="grid" style={{ gap: 12 }}>
          <h3 className="h4">Typography</h3>
          <p className="h1">H1 • Hero headline</p>
          <p className="h2">H2 • Section title</p>
          <p className="h3">H3 • Card title</p>
          <p className="body">Body text for product details and key descriptions.</p>
          <p className="caption">Caption / metadata / helper text</p>
        </Card>

        <Card className="grid" style={{ gap: 12 }}>
          <h3 className="h4">Color tokens</h3>
          <div className="grid" style={{ gridTemplateColumns: "repeat(3, minmax(0, 1fr))", gap: 10 }}>
            {TOKENS.map(([label, color]) => (
              <div key={label} className="ui-card" style={{ gap: 8 }}>
                <div style={{ height: 44, borderRadius: 10, border: "1px solid var(--border)", background: String(color) }} />
                <span className="small">{label}</span>
              </div>
            ))}
          </div>
        </Card>

        <Card className="grid" style={{ gap: 12 }}>
          <h3 className="h4">Spacing scale (4/8 grid)</h3>
          <div className="grid" style={{ gridTemplateColumns: "repeat(7, minmax(0, 1fr))", gap: 8 }}>
            {SPACING.map((unit) => (
              <div key={unit} className="ui-card" style={{ placeItems: "center", padding: 10 }}>
                <span className="small">{unit}px</span>
              </div>
            ))}
          </div>
        </Card>

        <Card className="grid" style={{ gap: 12 }}>
          <h3 className="h4">Buttons + states</h3>
          <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
            <Button>Primary</Button>
            <Button variant="secondary">Secondary</Button>
            <Button variant="outline">Outline</Button>
            <Button variant="ghost">Ghost</Button>
            <Button disabled>Disabled</Button>
          </div>
          <p className="small">Hover: slight lift + shadow. Active: subtle press. Disabled: reduced contrast.</p>
        </Card>

        <Card className="grid" style={{ gap: 12 }}>
          <h3 className="h4">Inputs + forms</h3>
          <Input placeholder="Search products" />
          <Input className="ui-input-filled" defaultValue="Filled state" />
          <Input aria-invalid="true" placeholder="Error state" />
          <select className="ui-input" defaultValue="featured">
            <option value="featured">Sort: Featured</option>
            <option value="price_asc">Sort: Price low-high</option>
          </select>
          <div style={{ display: "flex", gap: 14 }}>
            <label className="filter-check">
              <input type="checkbox" defaultChecked /> Checkbox
            </label>
            <label className="filter-check">
              <input type="radio" name="ui-kit-radio" defaultChecked /> Radio
            </label>
          </div>
          <Textarea placeholder="Optional comment" />
        </Card>

        <Card className="grid" style={{ gap: 12 }}>
          <h3 className="h4">Feedback states</h3>
          <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
            <Badge>Default</Badge>
            <Badge variant="success">Success</Badge>
            <Badge variant="error">Error</Badge>
          </div>
          <div className="grid" style={{ gridTemplateColumns: "repeat(3, minmax(0, 1fr))", gap: 10 }}>
            <Skeleton className="h-24" />
            <Skeleton className="h-24" />
            <Skeleton className="h-24" />
          </div>
        </Card>
      </Container>
    </Section>
  );
}
