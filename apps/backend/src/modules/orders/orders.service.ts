import { Inject, Injectable, NotFoundException } from "@nestjs/common";
import { PaymentStatus as PrismaPaymentStatus } from "@prisma/client";
import { OrderStatus } from "./domain/order-status.enum";
import { canTransitionOrderStatus } from "./domain/order-state-machine";
import { OrderTransitionNotAllowedError } from "../../common/errors/order-transition-not-allowed.error";
import {
  CreateOrderInput as RepositoryCreateOrderInput,
  ORDERS_REPOSITORY,
  OrdersRepository,
} from "../../application/orders/repositories/orders.repository";

export type CreateOrderInput = Omit<RepositoryCreateOrderInput, "orderNumber">;

@Injectable()
export class OrdersService {
  constructor(
    @Inject(ORDERS_REPOSITORY) private readonly repository: OrdersRepository,
  ) {}

  async getByOrderNumber(orderNumber: string) {
    const order = await this.repository.findByOrderNumber(orderNumber);
    if (!order) {
      throw new NotFoundException("Order not found");
    }
    return order;
  }

  async getById(orderId: string) {
    const order = await this.repository.findById(orderId);
    if (!order) {
      throw new NotFoundException("Order not found");
    }
    return order;
  }

  async create(input: CreateOrderInput) {
    const orderNumber = this.generateOrderNumber();
    return this.repository.createOrder({
      ...input,
      orderNumber,
    });
  }

  async reorder(orderNumber: string) {
    const previous = await this.getByOrderNumber(orderNumber);
    const nextOrderNumber = this.generateOrderNumber();
    return this.repository.createOrder({
      orderNumber: nextOrderNumber,
      customerName: previous.customerName,
      customerEmail: previous.customerEmail,
      customerPhone: previous.customerPhone,
      deliveryCity: previous.deliveryCity,
      deliveryAddress: previous.deliveryAddress,
      deliveryMethod: previous.deliveryMethod,
      paymentMethod: previous.paymentMethod,
      subtotalAmount: Number(previous.subtotalAmount),
      discountAmount: Number(previous.discountAmount),
      deliveryAmount: Number(previous.deliveryAmount),
      totalAmount: Number(previous.totalAmount),
      comment: `reorder_of:${previous.orderNumber}`,
      items: previous.items.map((item) => ({
        productVariantId: item.productVariantId,
        name: item.name,
        quantity: item.quantity,
        unitPrice: Number(item.unitPrice),
        lineTotal: Number(item.lineTotal),
      })),
    });
  }

  async setPendingPayment(orderId: string) {
    return this.transitionOrder(orderId, OrderStatus.PENDING_PAYMENT, PrismaPaymentStatus.pending);
  }

  async setPaid(orderId: string) {
    return this.transitionOrder(orderId, OrderStatus.PAID, PrismaPaymentStatus.paid);
  }

  async setPaymentFailed(orderId: string) {
    const order = await this.getById(orderId);
    await this.repository.updateOrderPaymentStatus(order.id, PrismaPaymentStatus.failed);
    return this.getById(order.id);
  }

  private async transitionOrder(orderId: string, toStatus: OrderStatus, paymentStatus: PrismaPaymentStatus) {
    const order = await this.getById(orderId);
    const fromStatus = order.status as unknown as OrderStatus;
    if (!canTransitionOrderStatus(fromStatus, toStatus) && fromStatus !== toStatus) {
      throw new OrderTransitionNotAllowedError(fromStatus, toStatus);
    }

    await this.repository.transitionOrderStatusWithHistory({
      orderId,
      fromStatus,
      toStatus,
      paymentStatus,
      reason: "automatic_transition",
    });
    return this.getById(orderId);
  }

  private generateOrderNumber(): string {
    const date = new Date();
    const yyyy = date.getUTCFullYear();
    const mm = String(date.getUTCMonth() + 1).padStart(2, "0");
    const dd = String(date.getUTCDate()).padStart(2, "0");
    const rnd = Math.floor(Math.random() * 90000) + 10000;
    return `AZD-${yyyy}${mm}${dd}-${rnd}`;
  }
}
