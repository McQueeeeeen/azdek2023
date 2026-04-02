import { formatMoney } from "@/lib/money";

export default function PriceBlock({ amount, currency }: { amount: number; currency: string }) {
  return (
    <p className="price-block">
      {formatMoney(amount, currency)}
    </p>
  );
}
