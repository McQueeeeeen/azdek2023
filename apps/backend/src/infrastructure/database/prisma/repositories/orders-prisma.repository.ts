import { Injectable } from "@nestjs/common";
import { PaymentStatus, Prisma, OrderStatus as PrismaOrderStatus } from "@prisma/client";
import { CreateOrderInput, OrdersRepository } from "../../../../application/orders/repositories/orders.repository";
import { PrismaService } from "../../../../shared/infrastructure/prisma.service";

@Injectable()
export class OrdersPrismaRepository implements OrdersRepository {
  constructor(private readonly prisma: PrismaService) {}

  findByOrderNumber(orderNumber: string) {
    return this.prisma.order.findUnique({
      where: { orderNumber },
      include: {
        items: true,
        payments: true,
        statusHistory: true,
      },
    });
  }

  findById(orderId: string) {
    return this.prisma.order.findUnique({
      where: { id: orderId },
      include: {
        items: true,
        payments: true,
        statusHistory: true,
      },
    });
  }

  createOrder(input: CreateOrderInput) {
    return this.prisma.order.create({
      data: {
        orderNumber: input.orderNumber,
        customerId: input.customerId,
        customerName: input.customerName,
        customerEmail: input.customerEmail,
        customerPhone: input.customerPhone,
        deliveryCity: input.deliveryCity,
        deliveryAddress: input.deliveryAddress,
        deliveryMethod: input.deliveryMethod,
        paymentMethod: input.paymentMethod,
        source: input.source,
        sessionId: input.sessionId,
        utmSource: input.utmSource,
        utmMedium: input.utmMedium,
        utmCampaign: input.utmCampaign,
        channelGroup: input.channelGroup,
        firstTouchUtmSource: input.firstTouchUtmSource,
        firstTouchUtmMedium: input.firstTouchUtmMedium,
        firstTouchUtmCampaign: input.firstTouchUtmCampaign,
        firstTouchChannelGroup: input.firstTouchChannelGroup,
        status: PrismaOrderStatus.draft,
        paymentStatus: PaymentStatus.initiated,
        shipmentStatus: "pending",
        subtotalAmount: input.subtotalAmount,
        discountAmount: input.discountAmount,
        deliveryAmount: input.deliveryAmount,
        totalAmount: input.totalAmount,
        comment: input.comment,
        items: {
          create: input.items,
        },
        statusHistory: {
          create: [
            {
              toStatus: PrismaOrderStatus.draft,
              reason: "order_created",
              actorType: "system",
            },
          ],
        },
      },
      include: {
        items: true,
        payments: true,
        statusHistory: true,
      },
    });
  }

  async updateOrderPaymentStatus(orderId: string, paymentStatus: PaymentStatus) {
    await this.prisma.order.update({
      where: { id: orderId },
      data: { paymentStatus },
    });
  }

  async transitionOrderStatusWithHistory(input: {
    orderId: string;
    fromStatus: string;
    toStatus: string;
    paymentStatus: PaymentStatus;
    reason: string;
  }) {
    await this.prisma.$transaction(async (tx: Prisma.TransactionClient) => {
      await tx.order.update({
        where: { id: input.orderId },
        data: {
          status: input.toStatus as unknown as PrismaOrderStatus,
          paymentStatus: input.paymentStatus,
        },
      });
      await tx.orderStatusHistory.create({
        data: {
          orderId: input.orderId,
          fromStatus: input.fromStatus as unknown as PrismaOrderStatus,
          toStatus: input.toStatus as unknown as PrismaOrderStatus,
          reason: input.reason,
          actorType: "system",
        },
      });
    });
  }
}
