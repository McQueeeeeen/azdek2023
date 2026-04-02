export function formatMoney(amount: number, currency: string): string {
  const normalizedCurrency = (currency || "KZT").toUpperCase();
  const value = Number.isFinite(amount) ? amount : 0;

  try {
    return new Intl.NumberFormat("ru-KZ", {
      style: "currency",
      currency: normalizedCurrency,
      maximumFractionDigits: 0,
    }).format(value);
  } catch {
    return `${value} ${normalizedCurrency}`;
  }
}

