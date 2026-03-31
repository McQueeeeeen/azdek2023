import { Injectable } from "@nestjs/common";
import { AnalyticsEventType, Prisma } from "@prisma/client";
import {
  AnalyticsRepository,
  CreateAnalyticsEventInput,
  FunnelDailyPoint,
} from "../../../../application/analytics/repositories/analytics.repository";
import { PrismaService } from "../../../../shared/infrastructure/prisma.service";

@Injectable()
export class AnalyticsPrismaRepository implements AnalyticsRepository {
  constructor(private readonly prisma: PrismaService) {}

  async createEvent(input: CreateAnalyticsEventInput): Promise<{ id: string; idempotent: boolean }> {
    const existing = await this.prisma.analyticsEvent.findUnique({
      where: { idempotencyKey: input.idempotencyKey },
      select: { id: true },
    });
    if (existing) {
      return { id: existing.id, idempotent: true };
    }

    try {
      const created = await this.prisma.analyticsEvent.create({
        data: {
          idempotencyKey: input.idempotencyKey,
          eventType: input.eventType,
          sessionId: input.sessionId,
          customerId: input.customerId,
          orderId: input.orderId,
          cartId: input.cartId,
          productId: input.productId,
          utmSource: input.utmSource,
          utmMedium: input.utmMedium,
          utmCampaign: input.utmCampaign,
          channelGroup: input.channelGroup,
          occurredAt: input.occurredAt,
          metadata: input.metadata,
        },
        select: { id: true },
      });
      return { id: created.id, idempotent: false };
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === "P2002") {
        const duplicate = await this.prisma.analyticsEvent.findUnique({
          where: { idempotencyKey: input.idempotencyKey },
          select: { id: true },
        });
        if (duplicate) {
          return { id: duplicate.id, idempotent: true };
        }
      }
      throw error;
    }
  }

  async countEventsByTypeSince(since: Date): Promise<Array<{ eventType: AnalyticsEventType; count: number }>> {
    const rows = await this.prisma.analyticsEvent.groupBy({
      by: ["eventType"],
      where: { createdAt: { gte: since } },
      _count: { _all: true },
    });

    return rows.map((row) => ({
      eventType: row.eventType,
      count: row._count._all,
    }));
  }

  async getDailyFunnelPointsSince(since: Date): Promise<FunnelDailyPoint[]> {
    const rows = await this.prisma.$queryRaw<
      Array<{ day: Date; eventType: AnalyticsEventType; count: bigint | number }>
    >(Prisma.sql`
      SELECT
        DATE_TRUNC('day', "createdAt") AS "day",
        "eventType",
        COUNT(*) AS "count"
      FROM "AnalyticsEvent"
      WHERE "createdAt" >= ${since}
      GROUP BY 1, 2
      ORDER BY 1 ASC
    `);

    return rows.map((row) => ({
      day: row.day.toISOString().slice(0, 10),
      eventType: row.eventType,
      count: typeof row.count === "bigint" ? Number(row.count) : row.count,
    }));
  }
}
