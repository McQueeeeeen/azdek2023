import { PaymentStatus, Prisma } from "@prisma/client";

export interface CreateOrderItemInput {
  productVariantId: string;
  name: string;
  quantity: number;
  unitPrice: number;
  lineTotal: number;
}

export interface CreateOrderInput {
  orderNumber: string;
  customerId?: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  deliveryCity: string;
  deliveryAddress: string;
  deliveryMethod: "city" | "country" | "pickup";
  paymentMethod: "card_online" | "payment_link" | "b2b_manual";
  source?: "d2c" | "b2b" | "marketplace" | "offline";
  sessionId?: string;
  utmSource?: string;
  utmMedium?: string;
  utmCampaign?: string;
  channelGroup?: "paid_social" | "paid_search" | "organic_search" | "direct" | "referral" | "retargeting" | "marketplace" | "offline" | "unknown";
  firstTouchUtmSource?: string;
  firstTouchUtmMedium?: string;
  firstTouchUtmCampaign?: string;
  firstTouchChannelGroup?: "paid_social" | "paid_search" | "organic_search" | "direct" | "referral" | "retargeting" | "marketplace" | "offline" | "unknown";
  subtotalAmount: number;
  discountAmount: number;
  deliveryAmount: number;
  totalAmount: number;
  comment?: string;
  items: CreateOrderItemInput[];
}

export type OrderRecord = Prisma.OrderGetPayload<{
  include: {
    items: true;
    payments: true;
    statusHistory: true;
  };
}>;

export interface OrdersRepository {
  findByOrderNumber(orderNumber: string): Promise<OrderRecord | null>;
  findById(orderId: string): Promise<OrderRecord | null>;
  createOrder(input: CreateOrderInput): Promise<OrderRecord>;
  updateOrderPaymentStatus(orderId: string, paymentStatus: PaymentStatus): Promise<void>;
  transitionOrderStatusWithHistory(input: {
    orderId: string;
    fromStatus: string;
    toStatus: string;
    paymentStatus: PaymentStatus;
    reason: string;
  }): Promise<void>;
}

export const ORDERS_REPOSITORY = Symbol("ORDERS_REPOSITORY");
