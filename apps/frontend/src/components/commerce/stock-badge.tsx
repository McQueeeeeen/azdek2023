import Badge from "../ui/badge";

export default function StockBadge({ stock }: { stock: number }) {
  if (stock <= 0) {
    return <Badge variant="error">Нет в наличии</Badge>;
  }
  if (stock < 10) {
    return <Badge variant="neutral">Осталось мало</Badge>;
  }
  return <Badge variant="success">В наличии</Badge>;
}
