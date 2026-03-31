import { Inject, Injectable, Logger, NotFoundException } from "@nestjs/common";
import { genId } from "../../shared/infrastructure/id.util";
import { MockKzPaymentProvider } from "./providers/mock-kz.provider";
import { OrdersService } from "../orders/orders.service";
import { AnalyticsEventType, PaymentStatus, Prisma } from "@prisma/client";
import { InjectQueue } from "@nestjs/bullmq";
import { Queue } from "bullmq";
import {
  PAYMENTS_REPOSITORY,
  PaymentsRepository,
} from "../../application/payments/repositories/payments.repository";
import { ConfigService } from "@nestjs/config";
import { NotificationsService } from "../notifications/notifications.service";
import { AnalyticsService } from "../analytics/analytics.service";

@Injectable()
export class PaymentsService {
  private readonly logger = new Logger(PaymentsService.name);
  private readonly defaultProvider = "mock_kz";
  private readonly providers = new Map<string, MockKzPaymentProvider>();

  constructor(
    @Inject(PAYMENTS_REPOSITORY) private readonly repository: PaymentsRepository,
    private readonly ordersService: OrdersService,
    private readonly configService: ConfigService,
    private readonly notificationsService: NotificationsService,
    private readonly analyticsService: AnalyticsService,
    @InjectQueue("payments-events") private readonly paymentsEventsQueue: Queue,
  ) {
    this.providers.set(
      this.defaultProvider,
      new MockKzPaymentProvider(this.configService.getOrThrow<string>("PAYMENT_WEBHOOK_SECRET_MOCK_KZ")),
    );
  }

  async createPaymentForOrder(orderId: string) {
    const order = await this.ordersService.getById(orderId);
    const provider = this.providers.get(this.defaultProvider);
    if (!provider) {
      throw new Error("Payment provider is not configured");
    }

    const payment = await this.repository.createPayment({
      orderId: order.id,
      provider: this.defaultProvider,
      status: PaymentStatus.pending,
      amount: order.totalAmount,
      currency: order.currency,
      idempotencyKey: genId(),
    });

    const session = await provider.createPaymentSession({
      orderId: order.id,
      amount: Number(order.totalAmount),
      currency: order.currency,
      returnUrl: "https://example.kz/payment/return",
      customerEmail: order.customerEmail,
    });

    const updated = await this.repository.updatePaymentSession({
      paymentId: payment.id,
      externalPaymentId: session.externalPaymentId,
      paymentUrl: session.paymentUrl,
    });

    await this.ordersService.setPendingPayment(order.id);
    await this.analyticsService.trackInternalEvent({
      eventType: AnalyticsEventType.payment_initiated,
      idempotencyKey: `payment_initiated:${updated.id}`,
      sessionId: order.sessionId ?? undefined,
      customerId: order.customerId,
      orderId: order.id,
      utmSource: order.utmSource,
      utmMedium: order.utmMedium,
      utmCampaign: order.utmCampaign,
      channelGroup: order.channelGroup,
      metadata: {
        paymentId: updated.id,
        provider: updated.provider,
        amount: Number(updated.amount),
      },
    });
    return updated;
  }

  async retryPayment(paymentId: string) {
    const payment = await this.repository.findById(paymentId);
    if (!payment) {
      throw new NotFoundException("Payment not found");
    }

    const provider = this.providers.get(payment.provider);
    if (!provider) {
      throw new Error("Provider not found");
    }

    const newLink = await provider.generatePaymentLink({
      orderId: payment.orderId,
      amount: Number(payment.amount),
      currency: payment.currency,
    });

    return this.repository.updateRetryLink({
      paymentId: payment.id,
      paymentUrl: newLink.paymentUrl,
      externalPaymentId: newLink.externalPaymentId ?? payment.externalPaymentId,
      status: PaymentStatus.pending,
    });
  }

  async handleWebhook(
    providerName: string,
    headers: Record<string, string | string[] | undefined>,
    body: unknown,
    rawBody: string,
  ): Promise<{ ok: boolean; idempotent: boolean; paymentId?: string }> {
    const provider = this.providers.get(providerName);
    if (!provider) {
      throw new NotFoundException("Payment provider not found");
    }

    await provider.verifyWebhookSignature({ headers, rawBody });

    const externalEventId = this.extractEventId(headers, body);
    const normalized = await provider.handleWebhook({ headers, body });
    if (!normalized.accepted || !normalized.externalPaymentId) {
      return { ok: false, idempotent: false };
    }

    const payment = await this.repository.findByProviderAndExternalPaymentId(providerName, normalized.externalPaymentId);
    if (!payment) {
      throw new NotFoundException("Payment not found for external payment id");
    }

    const alreadyProcessed = await this.repository.hasProcessedEvent(providerName, externalEventId);
    if (alreadyProcessed) {
      return { ok: true, idempotent: true, paymentId: payment.id };
    }

    const mappedStatus = this.mapStatus(normalized.normalizedStatus);
    const rawPayload: Prisma.InputJsonValue = {
      headers: this.serializeHeaders(headers),
      body: (body ?? {}) as Prisma.InputJsonValue,
      rawBody,
      normalized: (normalized.raw ?? {}) as Prisma.InputJsonValue,
    };

    const result = await this.repository.applyWebhookEvent({
      paymentId: payment.id,
      provider: providerName,
      eventType: normalized.eventType ?? "payment.updated",
      externalEventId,
      externalTransactionId: normalized.externalTransactionId,
      paymentStatus: mappedStatus,
      rawPayload,
    });
    if (result.duplicate) {
      return { ok: true, idempotent: true, paymentId: payment.id };
    }

    const attributionOrder = await this.ordersService.getById(payment.orderId);

    if (mappedStatus === PaymentStatus.paid) {
      const paidOrder = await this.ordersService.setPaid(payment.orderId);
      await this.analyticsService.trackInternalEvent({
        eventType: AnalyticsEventType.purchase_success,
        idempotencyKey: `purchase_success:${payment.id}:${externalEventId}`,
        sessionId: paidOrder.sessionId ?? undefined,
        customerId: paidOrder.customerId,
        orderId: paidOrder.id,
        utmSource: paidOrder.utmSource,
        utmMedium: paidOrder.utmMedium,
        utmCampaign: paidOrder.utmCampaign,
        channelGroup: paidOrder.channelGroup,
        metadata: {
          provider: payment.provider,
          amount: Number(payment.amount),
        },
      });
      await this.notificationsService.enqueueEmail({
        type: "payment_succeeded",
        toEmail: paidOrder.customerEmail,
        subject: `Payment confirmed for ${paidOrder.orderNumber}`,
        template: "payment-succeeded",
        data: {
          orderNumber: paidOrder.orderNumber,
          amount: Number(payment.amount),
          currency: payment.currency,
        },
      });
    } else if (mappedStatus === PaymentStatus.failed) {
      await this.ordersService.setPaymentFailed(payment.orderId);
      await this.analyticsService.trackInternalEvent({
        eventType: AnalyticsEventType.purchase_failure,
        idempotencyKey: `purchase_failure:${payment.id}:${externalEventId}`,
        sessionId: attributionOrder.sessionId ?? undefined,
        orderId: payment.orderId,
        customerId: attributionOrder.customerId,
        utmSource: attributionOrder.utmSource,
        utmMedium: attributionOrder.utmMedium,
        utmCampaign: attributionOrder.utmCampaign,
        channelGroup: attributionOrder.channelGroup,
        metadata: {
          provider: payment.provider,
          amount: Number(payment.amount),
        },
      });
    }

    try {
      await this.paymentsEventsQueue.add(
        "payment.status.changed",
        {
          paymentId: payment.id,
          orderId: payment.orderId,
          status: mappedStatus,
        },
        {
          attempts: 5,
          backoff: {
            type: "exponential",
            delay: 2000,
          },
        },
      );
    } catch (error) {
      this.logger.error("Failed to enqueue payment.status.changed job", error as Error);
    }

    return { ok: true, idempotent: false, paymentId: payment.id };
  }

  private extractEventId(headers: Record<string, string | string[] | undefined>, body: unknown): string {
    const headerEventId = headers["x-event-id"];
    if (typeof headerEventId === "string" && headerEventId.length > 0) {
      return headerEventId;
    }
    const payload = (body ?? {}) as Record<string, unknown>;
    const payloadEventId = payload.eventId;
    if (typeof payloadEventId === "string" && payloadEventId.length > 0) {
      return payloadEventId;
    }
    return `fallback_${genId()}`;
  }

  private mapStatus(status?: string): PaymentStatus {
    if (status === "paid") {
      return PaymentStatus.paid;
    }
    if (status === "failed") {
      return PaymentStatus.failed;
    }
    if (status === "cancelled") {
      return PaymentStatus.cancelled;
    }
    return PaymentStatus.pending;
  }

  private serializeHeaders(headers: Record<string, string | string[] | undefined>): Record<string, string> {
    const serialized: Record<string, string> = {};
    for (const [key, value] of Object.entries(headers)) {
      if (typeof value === "string") {
        serialized[key] = value;
      } else if (Array.isArray(value) && value.length > 0) {
        serialized[key] = value.join(",");
      }
    }
    return serialized;
  }
}
