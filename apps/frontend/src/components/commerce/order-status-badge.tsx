import Badge from "../ui/badge";

const STATUS_LABELS: Record<string, string> = {
  draft: "Черновик",
  pending_confirmation: "Ожидает подтверждения",
  pending_payment: "Ожидает оплаты",
  paid: "Оплачен",
  processing: "В обработке",
  ready_for_shipment: "Готов к отправке",
  shipped: "Отправлен",
  delivered: "Доставлен",
  completed: "Завершен",
  cancelled: "Отменен",
  refunded: "Возвращен",
  partially_refunded: "Частичный возврат",
  initiated: "Инициирован",
  pending: "В ожидании",
  authorized: "Авторизован",
  failed: "Ошибка",
  prepared: "Подготовлен",
  handed_to_courier: "Передан курьеру",
  in_transit: "В пути",
  returned: "Возвращен",
};

export default function OrderStatusBadge({ status }: { status: string }) {
  const label = STATUS_LABELS[status] ?? status;
  if (status.includes("cancel") || status.includes("fail")) {
    return <Badge variant="error">{label}</Badge>;
  }
  if (status.includes("paid") || status.includes("deliver") || status.includes("complete")) {
    return <Badge variant="success">{label}</Badge>;
  }
  return <Badge>{label}</Badge>;
}
