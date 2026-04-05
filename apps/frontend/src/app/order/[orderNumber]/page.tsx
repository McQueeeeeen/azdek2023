import Link from "next/link";
import Container from "@/components/ui/container";
import Section from "@/components/ui/section";
import Button from "@/components/ui/button";
import EmptyState from "@/components/ui/empty-state";
import { formatMoney } from "@/lib/money";

const API_BASE = process.env.NEXT_PUBLIC_API_URL ?? "http://127.0.0.1:4000/v1";

type OrderResponse = {
  orderNumber: string;
  status: string;
  paymentStatus: string;
  shipmentStatus: string;
  customer: { name: string; email: string; phone: string };
  pricing: { totalAmount: number; subtotalAmount: number; deliveryAmount: number; currency: string };
  items: Array<{ id: string; name: string; quantity: number; lineTotal: number }>;
};

async function getOrder(orderNumber: string): Promise<OrderResponse | null> {
  try {
    const response = await fetch(`${API_BASE}/orders/${orderNumber}`, { cache: "no-store" });
    if (!response.ok) return null;
    return (await response.json()) as OrderResponse;
  } catch {
    return null;
  }
}

export default async function OrderPage({ params }: { params: { orderNumber: string } }) {
  const order = await getOrder(params.orderNumber);

  if (!order) {
    return (
      <Section>
        <Container>
          <EmptyState
            title="Order not found"
            description="Check order number or contact support."
            action={
              <Link href="/support">
                <Button>Contact support</Button>
              </Link>
            }
          />
        </Container>
      </Section>
    );
  }

  return (
    <Section>
      <Container className="grid" style={{ gap: 16 }}>
        <div className="ui-card">
          <p className="small">Order confirmed</p>
          <h1 className="h2">Thank you for your purchase</h1>
          <p className="text-secondary">Order #{order.orderNumber} has been accepted and is now in processing.</p>
        </div>

        <div className="grid" style={{ gridTemplateColumns: "1fr 320px", gap: 16 }}>
          <div className="ui-card">
            <h3 className="h3">Items</h3>
            <div className="grid" style={{ gap: 10 }}>
              {order.items.map((item) => (
                <div key={item.id} style={{ display: "flex", justifyContent: "space-between", gap: 8 }}>
                  <span>
                    {item.name} × {item.quantity}
                  </span>
                  <strong>{formatMoney(item.lineTotal, order.pricing.currency)}</strong>
                </div>
              ))}
            </div>
          </div>

          <aside className="ui-card">
            <h3 className="h3">Summary</h3>
            <p className="text-secondary">Status: {order.status}</p>
            <p className="text-secondary">Payment: {order.paymentStatus}</p>
            <p className="text-secondary">Shipment: {order.shipmentStatus}</p>
            <hr className="ui-divider" />
            <p className="h3">{formatMoney(order.pricing.totalAmount, order.pricing.currency)}</p>
            <Link href="/catalog">
              <Button className="full-width">Continue shopping</Button>
            </Link>
          </aside>
        </div>
      </Container>
    </Section>
  );
}
