import { Injectable } from "@nestjs/common";
import { CartService } from "../cart/cart.service";
import { CheckoutConfirmDto } from "./dto/checkout-confirm.dto";
import { OrdersService } from "../orders/orders.service";
import { PaymentsService } from "../payments/payments.service";
import { CartValidationError } from "../../common/errors/cart-validation.error";
import { NotificationsService } from "../notifications/notifications.service";
import { AnalyticsService } from "../analytics/analytics.service";
import { AnalyticsEventType, ChannelGroup } from "@prisma/client";
import { CustomersService } from "../customers/customers.service";

@Injectable()
export class CheckoutService {
  constructor(
    private readonly cartService: CartService,
    private readonly ordersService: OrdersService,
    private readonly paymentsService: PaymentsService,
    private readonly notificationsService: NotificationsService,
    private readonly analyticsService: AnalyticsService,
    private readonly customersService: CustomersService,
  ) {}

  async confirm(dto: CheckoutConfirmDto): Promise<{ orderId: string; orderNumber: string; paymentId?: string; paymentUrl?: string }> {
    const cart = await this.cartService.getCart(dto.cartId);
    if (cart.items.length === 0) {
      throw new CartValidationError("Cart is empty");
    }

    const resolvedChannelGroup: ChannelGroup =
      dto.channelGroup ?? this.analyticsService.mapChannelGroup(dto.utmSource, dto.utmMedium);
    const sessionId = dto.sessionId ?? `checkout:${dto.cartId}`;

    await this.analyticsService.trackEvent({
      idempotencyKey: `begin_checkout:${sessionId}:${dto.cartId}`,
      eventType: AnalyticsEventType.begin_checkout,
      sessionId,
      cartId: dto.cartId,
      utmSource: dto.utmSource ?? "direct",
      utmMedium: dto.utmMedium ?? "none",
      utmCampaign: dto.utmCampaign ?? "unattributed",
      channelGroup: resolvedChannelGroup,
      occurredAt: new Date(),
      metadata: {
        cartTotalAmount: Number(cart.totalAmount),
        cartItemsCount: cart.items.length,
        paymentMethod: dto.paymentMethod,
        deliveryMethod: dto.deliveryMethod,
      },
    });

    const touchedCustomer = await this.customersService.applyAttributionTouch({
      email: dto.customerEmail,
      channelGroup: resolvedChannelGroup,
      utmSource: dto.utmSource,
      utmMedium: dto.utmMedium,
      utmCampaign: dto.utmCampaign,
    });

    const order = await this.ordersService.create({
      customerId: touchedCustomer?.id,
      customerName: dto.customerName,
      customerEmail: dto.customerEmail,
      customerPhone: dto.customerPhone,
      deliveryCity: dto.deliveryCity,
      deliveryAddress: dto.deliveryAddress,
      deliveryMethod: dto.deliveryMethod,
      paymentMethod: dto.paymentMethod,
      source: dto.paymentMethod === "b2b_manual" ? "b2b" : "d2c",
      sessionId,
      utmSource: dto.utmSource,
      utmMedium: dto.utmMedium,
      utmCampaign: dto.utmCampaign,
      channelGroup: resolvedChannelGroup,
      firstTouchUtmSource: touchedCustomer?.firstTouchUtmSource ?? dto.utmSource,
      firstTouchUtmMedium: touchedCustomer?.firstTouchUtmMedium ?? dto.utmMedium,
      firstTouchUtmCampaign: touchedCustomer?.firstTouchUtmCampaign ?? dto.utmCampaign,
      firstTouchChannelGroup: touchedCustomer?.firstTouchChannelGroup ?? resolvedChannelGroup,
      subtotalAmount: Number(cart.subtotalAmount),
      discountAmount: Number(cart.discountAmount),
      deliveryAmount: Number(cart.deliveryAmount),
      totalAmount: Number(cart.totalAmount),
      comment: dto.comment,
      items: cart.items.map((item) => ({
        productVariantId: item.productVariantId,
        name: item.productVariant.product.name + " " + item.productVariant.title,
        quantity: item.quantity,
        unitPrice: Number(item.unitPrice),
        lineTotal: Number(item.lineTotal),
      })),
    });
    await this.notificationsService.enqueueEmail({
      type: "order_created",
      toEmail: order.customerEmail,
      subject: `Order ${order.orderNumber} created`,
      template: "order-created",
      data: {
        orderNumber: order.orderNumber,
        totalAmount: Number(order.totalAmount),
        currency: order.currency,
      },
    });

    if (dto.paymentMethod === "b2b_manual") {
      return {
        orderId: order.id,
        orderNumber: order.orderNumber,
      };
    }

    const payment = await this.paymentsService.createPaymentForOrder(order.id);
    return {
      orderId: order.id,
      orderNumber: order.orderNumber,
      paymentId: payment.id,
      paymentUrl: payment.paymentUrl ?? undefined,
    };
  }
}
