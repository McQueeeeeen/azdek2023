import { apiGet } from "@/lib/api";
import Container from "@/components/ui/container";
import Section from "@/components/ui/section";
import Card from "@/components/ui/card";
import OrderStatusBadge from "@/components/commerce/order-status-badge";
import Link from "next/link";
import Button from "@/components/ui/button";

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
        <Card className="grid">
          <h1>Заказ принят</h1>
          <p className="small">Номер заказа: {order.orderNumber}</p>
          <p>
            Сумма: <strong>{order.pricing.totalAmount} {order.pricing.currency}</strong>
          </p>
          <div className="grid">
            <div>
              <span className="small">Статус заказа: </span>
              <OrderStatusBadge status={order.status} />
            </div>
            <div>
              <span className="small">Оплата: </span>
              <OrderStatusBadge status={order.paymentStatus} />
            </div>
            <div>
              <span className="small">Доставка: </span>
              <OrderStatusBadge status={order.shipmentStatus} />
            </div>
          </div>
          <Link href="/catalog">
            <Button variant="secondary">Вернуться в каталог</Button>
          </Link>
        </Card>
      </Container>
    </Section>
  );
}