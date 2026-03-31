import { Injectable } from "@nestjs/common";
import { PaymentStatus, Prisma } from "@prisma/client";
import { PaymentsRepository } from "../../../../application/payments/repositories/payments.repository";
import { PrismaService } from "../../../../shared/infrastructure/prisma.service";

@Injectable()
export class PaymentsPrismaRepository implements PaymentsRepository {
  constructor(private readonly prisma: PrismaService) {}

  createPayment(input: {
    orderId: string;
    provider: string;
    status: PaymentStatus;
    amount: Prisma.Decimal | number;
    currency: "KZT";
    idempotencyKey: string;
  }) {
    return this.prisma.payment.create({ data: input });
  }

  updatePaymentSession(input: { paymentId: string; externalPaymentId: string; paymentUrl: string }) {
    return this.prisma.payment.update({
      where: { id: input.paymentId },
      data: {
        externalPaymentId: input.externalPaymentId,
        paymentUrl: input.paymentUrl,
      },
    });
  }

  findById(paymentId: string) {
    return this.prisma.payment.findUnique({ where: { id: paymentId } });
  }

  updateRetryLink(input: { paymentId: string; paymentUrl: string; externalPaymentId?: string | null; status: PaymentStatus }) {
    return this.prisma.payment.update({
      where: { id: input.paymentId },
      data: {
        paymentUrl: input.paymentUrl,
        externalPaymentId: input.externalPaymentId ?? undefined,
        status: input.status,
      },
    });
  }

  findByProviderAndExternalPaymentId(provider: string, externalPaymentId: string) {
    return this.prisma.payment.findFirst({
      where: {
        provider,
        externalPaymentId,
      },
    });
  }

  async hasProcessedEvent(provider: string, externalEventId: string) {
    const event = await this.prisma.paymentEvent.findUnique({
      where: {
        provider_externalEventId: {
          provider,
          externalEventId,
        },
      },
    });
    return Boolean(event);
  }

  async applyWebhookEvent(input: {
    paymentId: string;
    provider: string;
    eventType: string;
    externalEventId: string;
    externalTransactionId?: string;
    paymentStatus: PaymentStatus;
    rawPayload: Prisma.InputJsonValue;
  }) {
    const payment = await this.prisma.payment.findUnique({ where: { id: input.paymentId } });
    if (!payment) {
      throw new Error("Payment not found");
    }

    try {
      await this.prisma.$transaction(async (tx: Prisma.TransactionClient) => {
        await tx.paymentEvent.create({
          data: {
            paymentId: input.paymentId,
            provider: input.provider,
            eventType: input.eventType,
            externalEventId: input.externalEventId,
            payload: input.rawPayload,
            processedAt: new Date(),
          },
        });

        if (input.externalTransactionId) {
          await tx.paymentTransaction.upsert({
            where: {
              provider_externalTransactionId: {
                provider: input.provider,
                externalTransactionId: input.externalTransactionId,
              },
            },
            create: {
              paymentId: input.paymentId,
              provider: input.provider,
              externalTransactionId: input.externalTransactionId,
              status: input.paymentStatus,
              amount: payment.amount,
              payload: input.rawPayload,
            },
            update: {
              status: input.paymentStatus,
              payload: input.rawPayload,
            },
          });
        }

        await tx.payment.update({
          where: { id: input.paymentId },
          data: { status: input.paymentStatus },
        });
      });
      return { duplicate: false };
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === "P2002") {
        return { duplicate: true };
      }
      throw error;
    }
  }
}
