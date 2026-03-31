import { PaymentStatus, Prisma } from "@prisma/client";

export type PaymentRecord = Prisma.PaymentGetPayload<{}>;

export interface PaymentsRepository {
  createPayment(input: {
    orderId: string;
    provider: string;
    status: PaymentStatus;
    amount: Prisma.Decimal | number;
    currency: "KZT";
    idempotencyKey: string;
  }): Promise<PaymentRecord>;
  updatePaymentSession(input: { paymentId: string; externalPaymentId: string; paymentUrl: string }): Promise<PaymentRecord>;
  findById(paymentId: string): Promise<PaymentRecord | null>;
  updateRetryLink(input: {
    paymentId: string;
    paymentUrl: string;
    externalPaymentId?: string | null;
    status: PaymentStatus;
  }): Promise<PaymentRecord>;
  findByProviderAndExternalPaymentId(provider: string, externalPaymentId: string): Promise<PaymentRecord | null>;
  hasProcessedEvent(provider: string, externalEventId: string): Promise<boolean>;
  applyWebhookEvent(input: {
    paymentId: string;
    provider: string;
    eventType: string;
    externalEventId: string;
    externalTransactionId?: string;
    paymentStatus: PaymentStatus;
    rawPayload: Prisma.InputJsonValue;
  }): Promise<{ duplicate: boolean }>;
}

export const PAYMENTS_REPOSITORY = Symbol("PAYMENTS_REPOSITORY");

