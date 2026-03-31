export default function PriceBlock({ amount, currency }: { amount: number; currency: string }) {
  return (
    <p className="price-block">
      {amount} {currency}
    </p>
  );
}

