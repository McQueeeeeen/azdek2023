import {
  CheckPaymentStatusInput,
  CheckPaymentStatusResult,
  CreatePaymentSessionInput,
  CreatePaymentSessionResult,
  GeneratePaymentLinkInput,
  GeneratePaymentLinkResult,
  HandleWebhookInput,
  HandleWebhookResult,
  PaymentProvider,
  RefundPaymentInput,
  RefundPaymentResult,
  VerifyWebhookSignatureInput,
} from "../domain/payment-provider.interface";
import { createHmac, timingSafeEqual } from "crypto";
import { InvalidWebhookSignatureError } from "../../../common/errors/invalid-webhook-signature.error";

export class MockKzPaymentProvider implements PaymentProvider {
  constructor(private readonly webhookSecret: string) {}

  async createPaymentSession(input: CreatePaymentSessionInput): Promise<CreatePaymentSessionResult> {
    return {
      externalPaymentId: `mockpay_${input.orderId}`,
      paymentUrl: `https://pay.mock-kz.local/session/${input.orderId}`,
      raw: { sandbox: true },
    };
  }

  async verifyWebhookSignature(input: VerifyWebhookSignatureInput): Promise<void> {
    const ts = this.getHeader(input.headers, "x-webhook-timestamp");
    const signature = this.getHeader(input.headers, "x-webhook-signature");
    if (!ts || !signature) {
      throw new InvalidWebhookSignatureError("Missing webhook signature headers");
    }

    const timestamp = Number(ts);
    if (!Number.isFinite(timestamp)) {
      throw new InvalidWebhookSignatureError("Invalid webhook timestamp format");
    }

    const now = Math.floor(Date.now() / 1000);
    if (Math.abs(now - timestamp) > 300) {
      throw new InvalidWebhookSignatureError("Webhook timestamp is outside allowed window");
    }

    const payloadToSign = `${ts}.${input.rawBody}`;
    const expected = createHmac("sha256", this.webhookSecret).update(payloadToSign).digest("hex");
    const received = signature.startsWith("sha256=") ? signature.slice("sha256=".length) : signature;

    const expectedBuf = Buffer.from(expected, "hex");
    const receivedBuf = Buffer.from(received, "hex");
    if (expectedBuf.length === 0 || expectedBuf.length !== receivedBuf.length || !timingSafeEqual(expectedBuf, receivedBuf)) {
      throw new InvalidWebhookSignatureError();
    }
  }

  async handleWebhook(input: HandleWebhookInput): Promise<HandleWebhookResult> {
    const payload = (input.body ?? {}) as Record<string, unknown>;
    const externalPaymentId = String(payload.externalPaymentId ?? "");
    const normalizedStatus = String(payload.status ?? "pending");
    const externalTransactionId = String(payload.externalTransactionId ?? "");
    const eventType = String(payload.eventType ?? "payment.updated");
    return {
      accepted: Boolean(externalPaymentId),
      externalPaymentId,
      externalTransactionId,
      normalizedStatus,
      eventType,
      raw: payload,
    };
  }

  async checkPaymentStatus(input: CheckPaymentStatusInput): Promise<CheckPaymentStatusResult> {
    return {
      externalPaymentId: input.externalPaymentId,
      normalizedStatus: "pending",
    };
  }

  async refundPayment(input: RefundPaymentInput): Promise<RefundPaymentResult> {
    return {
      accepted: true,
      externalRefundId: `refund_${input.externalPaymentId}`,
      raw: { amount: input.amount },
    };
  }

  async generatePaymentLink(input: GeneratePaymentLinkInput): Promise<GeneratePaymentLinkResult> {
    return {
      externalPaymentId: `mockpay_${input.orderId}`,
      paymentUrl: `https://pay.mock-kz.local/link/${input.orderId}`,
    };
  }

  private getHeader(headers: Record<string, string | string[] | undefined>, name: string): string | undefined {
    const value = headers[name];
    if (Array.isArray(value)) {
      return value[0];
    }
    return value;
  }
}
