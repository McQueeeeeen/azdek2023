import Link from "next/link";
import Card from "../ui/card";
import Button from "../ui/button";

export default function CartSummary({
  totalAmount,
  currency,
}: {
  totalAmount: number;
  currency: string;
}) {
  return (
    <Card className="cart-summary">
      <p className="text-secondary">Итого к оплате</p>
      <p className="h2">
        {totalAmount} {currency}
      </p>
      <Link href="/checkout">
        <Button className="full-width">Перейти к оформлению</Button>
      </Link>
    </Card>
  );
}
