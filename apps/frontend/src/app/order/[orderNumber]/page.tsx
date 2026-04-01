import { apiGet } from "@/lib/api";
import Container from "@/components/ui/container";
import Section from "@/components/ui/section";
import Card from "@/components/ui/card";
import PageHeader from "@/components/ui/page-header";
import OrderStatusBadge from "@/components/commerce/order-status-badge";
import Divider from "@/components/ui/divider";

interface OrderView {
  orderNumber: string;
  status: string;
  paymentStatus: string;
  shipmentStatus: string;
  pricing: {
    totalAmount: number;
    currency: string;
  };
}

export default async function OrderPage({ params }: { params: { orderNumber: string } }) {
  const order = await apiGet<OrderView>(`/orders/${params.orderNumber}`);

  return (
    <Section>
      <Container className="grid">
        <PageHeader title="Order Confirmed" subtitle="Your transaction has been recorded successfully" />
        <Card className="grid">
          <p className="small">Order number</p>
          <p className="h3">{order.orderNumber}</p>
          <Divider />
          <div className="order-status-grid">
            <p className="small">Order status</p>
            <OrderStatusBadge status={order.status} />
            <p className="small">Payment</p>
            <OrderStatusBadge status={order.paymentStatus} />
            <p className="small">Shipment</p>
            <OrderStatusBadge status={order.shipmentStatus} />
          </div>
          <Divider />
          <p className="h2">
            {order.pricing.totalAmount} {order.pricing.currency}
          </p>
        </Card>
      </Container>
    </Section>
  );
}
