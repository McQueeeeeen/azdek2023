import { AnalyticsEventType, Prisma } from "@prisma/client";

export const ANALYTICS_REPOSITORY = Symbol("ANALYTICS_REPOSITORY");

export interface CreateAnalyticsEventInput {
  idempotencyKey: string;
  eventType: AnalyticsEventType;
  sessionId: string;
  customerId?: string;
  orderId?: string;
  cartId?: string;
  productId?: string;
  utmSource: string;
  utmMedium: string;
  utmCampaign: string;
  channelGroup: "paid_social" | "paid_search" | "organic_search" | "direct" | "referral" | "retargeting" | "marketplace" | "offline" | "unknown";
  occurredAt: Date;
  metadata?: Prisma.InputJsonValue;
}

export interface FunnelDailyPoint {
  day: string;
  eventType: AnalyticsEventType;
  count: number;
}

export interface AnalyticsRepository {
  createEvent(input: CreateAnalyticsEventInput): Promise<{ id: string; idempotent: boolean }>;
  countEventsByTypeSince(since: Date): Promise<Array<{ eventType: AnalyticsEventType; count: number }>>;
  getDailyFunnelPointsSince(since: Date): Promise<FunnelDailyPoint[]>;
}
