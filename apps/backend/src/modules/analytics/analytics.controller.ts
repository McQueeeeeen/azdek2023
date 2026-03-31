import { Body, Controller, Get, Post, Query, UseGuards } from "@nestjs/common";
import { AnalyticsService } from "./analytics.service";
import { TrackEventDto } from "./dto/track-event.dto";
import { JwtAuthGuard } from "../auth/guards/jwt-auth.guard";
import { RolesGuard } from "../auth/guards/roles.guard";
import { Roles } from "../auth/decorators/roles.decorator";

@Controller("analytics")
export class AnalyticsController {
  constructor(private readonly analyticsService: AnalyticsService) {}

  @Post("events")
  track(@Body() dto: TrackEventDto): Promise<{ id: string; idempotent: boolean }> {
    return this.analyticsService.trackEvent(dto);
  }

  @Get("dashboard/orders")
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles("owner", "manager", "support")
  funnel(
    @Query("windowDays") windowDays?: string,
  ): ReturnType<AnalyticsService["getFunnelSummary"]> {
    const parsed = windowDays ? Number(windowDays) : 30;
    return this.analyticsService.getFunnelSummary(parsed);
  }
}
