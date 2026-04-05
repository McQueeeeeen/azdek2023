import Link from "next/link";
import Card from "../ui/card";
import Button from "../ui/button";
import { formatMoney } from "@/lib/money";

export default function CartSummary({
  subtotalAmount,
  deliveryAmount,
  totalAmount,
  currency,
}: {
  subtotalAmount: number;
  deliveryAmount: number;
  totalAmount: number;
  currency: string;
}) {
  return (
    <Card className="cart-summary">
      <h3 className="h3">Order summary</h3>
      <div className="grid" style={{ gap: 6 }}>
        <div style={{ display: "flex", justifyContent: "space-between" }}>
          <span className="text-secondary">Subtotal</span>
          <span>{formatMoney(subtotalAmount, currency)}</span>
        </div>
        <div style={{ display: "flex", justifyContent: "space-between" }}>
          <span className="text-secondary">Delivery</span>
          <span>{formatMoney(deliveryAmount, currency)}</span>
        </div>
      </div>
      <hr className="ui-divider" />
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <p className="text-secondary">Total</p>
        <p className="h3">{formatMoney(totalAmount, currency)}</p>
      </div>
      <Link href="/checkout">
        <Button className="full-width">Proceed to checkout</Button>
      </Link>
    </Card>
  );
}
