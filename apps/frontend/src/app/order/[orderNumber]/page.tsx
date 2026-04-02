import { apiGet } from "@/lib/api";
import Container from "@/components/ui/container";
import Section from "@/components/ui/section";
import Card from "@/components/ui/card";
import PageHeader from "@/components/ui/page-header";
import OrderStatusBadge from "@/components/commerce/order-status-badge";
import Divider from "@/components/ui/divider";
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
        <PageHeader title="Заказ принят" subtitle="Мы уже начали обработку. Скоро с вами свяжутся." />
        <Card className="grid">
          <p className="small">Номер заказа</p>
          <p className="h3">{order.orderNumber}</p>
          <Divider />
          <div className="order-status-grid">
            <p className="small">Статус заказа</p>
            <OrderStatusBadge status={order.status} />
            <p className="small">Оплата</p>
            <OrderStatusBadge status={order.paymentStatus} />
            <p className="small">Доставка</p>
            <OrderStatusBadge status={order.shipmentStatus} />
          </div>
          <Divider />
          <p className="h2">
            {order.pricing.totalAmount} {order.pricing.currency}
          </p>
        </Card>
        <Card className="grid">
          <h2 className="h3">Пока ждете заказ, закройте уборку полностью</h2>
          <p className="text-secondary">Дополните набор: средство для ванной, пола или универсальное решение.</p>
          <Link href="/catalog">
            <Button variant="secondary">Смотреть решения</Button>
          </Link>
        </Card>
      </Container>
    </Section>
  );
}
