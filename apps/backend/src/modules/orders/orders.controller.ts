import { Controller, ForbiddenException, Get, Param, Post, Req, UseGuards } from "@nestjs/common";
import { Request } from "express";
import { OrdersService } from "./orders.service";
import { JwtAuthGuard } from "../auth/guards/jwt-auth.guard";
import { RolesGuard } from "../auth/guards/roles.guard";
import { Roles } from "../auth/decorators/roles.decorator";
import { JwtPayload } from "../auth/domain/jwt-payload.interface";

interface OrderResponse {
  id: string;
  orderNumber: string;
  status: string;
  paymentStatus: string;
  shipmentStatus: string;
  customer: {
    name: string;
    email: string;
    phone: string;
  };
  pricing: {
    subtotalAmount: number;
    discountAmount: number;
    deliveryAmount: number;
    totalAmount: number;
    currency: string;
  };
  items: Array<{
    id: string;
    name: string;
    quantity: number;
    unitPrice: number;
    lineTotal: number;
  }>;
  payments: Array<{
    id: string;
    provider: string;
    status: string;
    amount: number;
    paymentUrl: string | null;
  }>;
}

@Controller("orders")
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  @Post(":orderNumber/reorder")
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles("customer", "b2b_customer")
  async reorder(
    @Param("orderNumber") orderNumber: string,
    @Req() req: Request & { user: JwtPayload },
  ): Promise<{ orderNumber: string; orderId: string }> {
    const existing = await this.ordersService.getByOrderNumber(orderNumber);
    if (existing.customerEmail.toLowerCase() !== req.user.email.toLowerCase()) {
      throw new ForbiddenException("Order does not belong to current user");
    }
    const order = await this.ordersService.reorder(orderNumber);
    return {
      orderId: order.id,
      orderNumber: order.orderNumber,
    };
  }

  @Get(":orderNumber")
  async getByOrderNumber(@Param("orderNumber") orderNumber: string): Promise<OrderResponse> {
    const order = await this.ordersService.getByOrderNumber(orderNumber);
    return {
      id: order.id,
      orderNumber: order.orderNumber,
      status: order.status,
      paymentStatus: order.paymentStatus,
      shipmentStatus: order.shipmentStatus,
      customer: {
        name: order.customerName,
        email: order.customerEmail,
        phone: order.customerPhone,
      },
      pricing: {
        subtotalAmount: Number(order.subtotalAmount),
        discountAmount: Number(order.discountAmount),
        deliveryAmount: Number(order.deliveryAmount),
        totalAmount: Number(order.totalAmount),
        currency: order.currency,
      },
      items: order.items.map((item) => ({
        id: item.id,
        name: item.name,
        quantity: item.quantity,
        unitPrice: Number(item.unitPrice),
        lineTotal: Number(item.lineTotal),
      })),
      payments: order.payments.map((payment) => ({
        id: payment.id,
        provider: payment.provider,
        status: payment.status,
        amount: Number(payment.amount),
        paymentUrl: payment.paymentUrl,
      })),
    };
  }
}
