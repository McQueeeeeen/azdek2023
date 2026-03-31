import { Module } from "@nestjs/common";
import { ANALYTICS_REPOSITORY } from "../../application/analytics/repositories/analytics.repository";
import { AnalyticsPrismaRepository } from "../../infrastructure/database/prisma/repositories/analytics-prisma.repository";
import { AnalyticsController } from "./analytics.controller";
import { AnalyticsService } from "./analytics.service";

@Module({
  controllers: [AnalyticsController],
  providers: [
    AnalyticsService,
    {
      provide: ANALYTICS_REPOSITORY,
      useClass: AnalyticsPrismaRepository,
    },
  ],
  exports: [AnalyticsService],
})
export class AnalyticsModule {}
