import { Inject, Injectable } from "@nestjs/common";
import { AnalyticsEventType, ChannelGroup, Prisma } from "@prisma/client";
import {
  ANALYTICS_REPOSITORY,
  AnalyticsRepository,
} from "../../application/analytics/repositories/analytics.repository";
import { TrackEventDto } from "./dto/track-event.dto";
import { genId } from "../../shared/infrastructure/id.util";

type FunnelSummary = {
  windowDays: number;
  totals: Record<AnalyticsEventType, number>;
  conversion: {
    addToCartToCheckout: number;
    checkoutToPaymentInit: number;
    paymentInitToPurchaseSuccess: number;
  };
  daily: Array<{
    day: string;
    eventType: AnalyticsEventType;
    count: number;
  }>;
};

const FUNNEL_EVENTS: AnalyticsEventType[] = [
  AnalyticsEventType.session_started,
  AnalyticsEventType.page_view,
  AnalyticsEventType.product_view,
  AnalyticsEventType.add_to_cart,
  AnalyticsEventType.begin_checkout,
  AnalyticsEventType.payment_initiated,
  AnalyticsEventType.purchase_success,
  AnalyticsEventType.purchase_failure,
];

@Injectable()
export class AnalyticsService {
  constructor(
    @Inject(ANALYTICS_REPOSITORY)
    private readonly repository: AnalyticsRepository,
  ) {}

  trackEvent(dto: TrackEventDto): Promise<{ id: string; idempotent: boolean }> {
    return this.repository.createEvent({
      idempotencyKey: dto.idempotencyKey,
      eventType: dto.eventType,
      sessionId: dto.sessionId,
      customerId: dto.customerId,
      orderId: dto.orderId,
      cartId: dto.cartId,
      productId: dto.productId,
      utmSource: dto.utmSource,
      utmMedium: dto.utmMedium,
      utmCampaign: dto.utmCampaign,
      channelGroup: dto.channelGroup,
      occurredAt: dto.occurredAt,
      metadata: dto.metadata as Prisma.InputJsonValue | undefined,
    });
  }

  async trackInternalEvent(input: {
    eventType: AnalyticsEventType;
    idempotencyKey?: string;
    sessionId?: string;
    customerId?: string | null;
    orderId?: string;
    cartId?: string;
    productId?: string;
    utmSource?: string | null;
    utmMedium?: string | null;
    utmCampaign?: string | null;
    channelGroup?: ChannelGroup;
    occurredAt?: Date;
    metadata?: Record<string, unknown>;
  }): Promise<void> {
    const utmSource = input.utmSource ?? "direct";
    const utmMedium = input.utmMedium ?? "none";
    const utmCampaign = input.utmCampaign ?? "unattributed";
    const channelGroup = input.channelGroup ?? this.mapChannelGroup(utmSource, utmMedium);
    await this.repository.createEvent({
      idempotencyKey:
        input.idempotencyKey ??
        `internal:${input.eventType}:${input.orderId ?? input.cartId ?? input.productId ?? genId()}`,
      eventType: input.eventType,
      sessionId: input.sessionId ?? `srv:${input.orderId ?? input.cartId ?? "unknown"}`,
      customerId: input.customerId ?? undefined,
      orderId: input.orderId,
      cartId: input.cartId,
      productId: input.productId,
      utmSource,
      utmMedium,
      utmCampaign,
      channelGroup,
      occurredAt: input.occurredAt ?? new Date(),
      metadata: input.metadata as Prisma.InputJsonValue | undefined,
    });
  }

  async getFunnelSummary(windowDays = 30): Promise<FunnelSummary> {
    const safeWindow = Number.isFinite(windowDays) && windowDays > 0 ? Math.min(windowDays, 180) : 30;
    const since = new Date(Date.now() - safeWindow * 24 * 60 * 60 * 1000);

    const [counts, daily] = await Promise.all([
      this.repository.countEventsByTypeSince(since),
      this.repository.getDailyFunnelPointsSince(since),
    ]);

    const totals = FUNNEL_EVENTS.reduce<Record<AnalyticsEventType, number>>(
      (acc, eventType) => ({ ...acc, [eventType]: 0 }),
      {} as Record<AnalyticsEventType, number>,
    );
    for (const row of counts) {
      totals[row.eventType] = row.count;
    }

    return {
      windowDays: safeWindow,
      totals,
      conversion: {
        addToCartToCheckout: this.safeRate(totals.begin_checkout, totals.add_to_cart),
        checkoutToPaymentInit: this.safeRate(totals.payment_initiated, totals.begin_checkout),
        paymentInitToPurchaseSuccess: this.safeRate(totals.purchase_success, totals.payment_initiated),
      },
      daily,
    };
  }

  private safeRate(numerator: number, denominator: number): number {
    if (denominator <= 0) {
      return 0;
    }
    return Number(((numerator / denominator) * 100).toFixed(2));
  }

  mapChannelGroup(utmSource?: string | null, utmMedium?: string | null): ChannelGroup {
    const source = (utmSource ?? "").toLowerCase();
    const medium = (utmMedium ?? "").toLowerCase();
    if (["instagram", "facebook", "tiktok"].includes(source)) {
      return medium.includes("retarget") ? ChannelGroup.retargeting : ChannelGroup.paid_social;
    }
    if (["google", "yandex"].includes(source)) {
      return medium.includes("organic") ? ChannelGroup.organic_search : ChannelGroup.paid_search;
    }
    if (source.includes("kaspi") || source.includes("wildberries") || source.includes("ozon")) {
      return ChannelGroup.marketplace;
    }
    if (medium.includes("offline")) {
      return ChannelGroup.offline;
    }
    if (medium.includes("referral")) {
      return ChannelGroup.referral;
    }
    if (source === "direct" || medium === "none" || source === "") {
      return ChannelGroup.direct;
    }
    return ChannelGroup.unknown;
  }
}
