import { OrderStatus } from "./order-status.enum";

const orderTransitions: Record<OrderStatus, OrderStatus[]> = {
  [OrderStatus.DRAFT]: [OrderStatus.PENDING_CONFIRMATION, OrderStatus.PENDING_PAYMENT, OrderStatus.CANCELLED],
  [OrderStatus.PENDING_CONFIRMATION]: [OrderStatus.PENDING_PAYMENT, OrderStatus.CANCELLED],
  [OrderStatus.PENDING_PAYMENT]: [OrderStatus.PAID, OrderStatus.CANCELLED],
  [OrderStatus.PAID]: [OrderStatus.PROCESSING, OrderStatus.PARTIALLY_REFUNDED, OrderStatus.REFUNDED],
  [OrderStatus.PROCESSING]: [OrderStatus.READY_FOR_SHIPMENT, OrderStatus.CANCELLED],
  [OrderStatus.READY_FOR_SHIPMENT]: [OrderStatus.SHIPPED],
  [OrderStatus.SHIPPED]: [OrderStatus.DELIVERED, OrderStatus.CANCELLED],
  [OrderStatus.DELIVERED]: [OrderStatus.COMPLETED, OrderStatus.PARTIALLY_REFUNDED, OrderStatus.REFUNDED],
  [OrderStatus.COMPLETED]: [OrderStatus.PARTIALLY_REFUNDED, OrderStatus.REFUNDED],
  [OrderStatus.CANCELLED]: [],
  [OrderStatus.REFUNDED]: [],
  [OrderStatus.PARTIALLY_REFUNDED]: [OrderStatus.REFUNDED],
};

export function canTransitionOrderStatus(from: OrderStatus, to: OrderStatus): boolean {
  return orderTransitions[from].includes(to);
}

