import { formatMoney } from "@/lib/money";

export default function PriceBlock({
  amount,
  currency,
  compareAmount,
}: {
  amount: number;
  currency: string;
  compareAmount?: number | null;
}) {
  const showCompare = typeof compareAmount === "number" && compareAmount > amount;

  return (
    <p className="price-block">
      {showCompare ? <span className="price-block-compare">{formatMoney(compareAmount, currency)}</span> : null}
      <span>{formatMoney(amount, currency)}</span>
    </p>
  );
}
