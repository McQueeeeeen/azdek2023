export interface CreatePaymentSessionInput {
  orderId: string;
  amount: number;
  currency: string;
  returnUrl: string;
  customerEmail?: string;
}

export interface CreatePaymentSessionResult {
  externalPaymentId: string;
  paymentUrl: string;
  raw?: Record<string, unknown>;
}

export interface HandleWebhookInput {
  headers: Record<string, string | string[] | undefined>;
  body: unknown;
}

export interface VerifyWebhookSignatureInput {
  headers: Record<string, string | string[] | undefined>;
  rawBody: string;
}

export interface HandleWebhookResult {
  accepted: boolean;
  externalPaymentId?: string;
  externalTransactionId?: string;
  normalizedStatus?: string;
  eventType?: string;
  raw?: Record<string, unknown>;
}

export interface CheckPaymentStatusInput {
  externalPaymentId: string;
}

export interface CheckPaymentStatusResult {
  externalPaymentId: string;
  normalizedStatus: string;
  raw?: Record<string, unknown>;
}

export interface RefundPaymentInput {
  externalPaymentId: string;
  amount: number;
  reason?: string;
}

export interface RefundPaymentResult {
  accepted: boolean;
  externalRefundId?: string;
  raw?: Record<string, unknown>;
}

export interface GeneratePaymentLinkInput {
  orderId: string;
  amount: number;
  currency: string;
  expiresAt?: Date;
}

export interface GeneratePaymentLinkResult {
  paymentUrl: string;
  externalPaymentId?: string;
}

export interface PaymentProvider {
  createPaymentSession(input: CreatePaymentSessionInput): Promise<CreatePaymentSessionResult>;
  verifyWebhookSignature(input: VerifyWebhookSignatureInput): Promise<void>;
  handleWebhook(input: HandleWebhookInput): Promise<HandleWebhookResult>;
  checkPaymentStatus(input: CheckPaymentStatusInput): Promise<CheckPaymentStatusResult>;
  refundPayment(input: RefundPaymentInput): Promise<RefundPaymentResult>;
  generatePaymentLink(input: GeneratePaymentLinkInput): Promise<GeneratePaymentLinkResult>;
}
