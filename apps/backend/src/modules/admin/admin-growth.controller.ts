import { Body, Controller, Get, Param, Patch, Post, UseGuards } from "@nestjs/common";
import { JwtAuthGuard } from "../auth/guards/jwt-auth.guard";
import { RolesGuard } from "../auth/guards/roles.guard";
import { Roles } from "../auth/decorators/roles.decorator";
import { AdminOperationsService } from "./admin-operations.service";
import {
  CreateExperimentDto,
  DecideExperimentDto,
  UpsertChannelSpendDto,
  UpsertOrderCostDto,
  UpsertWeeklyReviewDto,
} from "./dto/growth.dto";
import { Prisma } from "@prisma/client";

@Controller("admin/growth")
@UseGuards(JwtAuthGuard, RolesGuard)
export class AdminGrowthController {
  constructor(private readonly adminOps: AdminOperationsService) {}

  @Post("marts/refresh")
  @Roles("owner", "manager")
  refreshMarts(): ReturnType<AdminOperationsService["refreshGrowthMarts"]> {
    return this.adminOps.refreshGrowthMarts();
  }

  @Post("channels/spend")
  @Roles("owner", "manager")
  upsertChannelSpend(
    @Body() dto: UpsertChannelSpendDto,
  ): ReturnType<AdminOperationsService["upsertChannelSpend"]> {
    return this.adminOps.upsertChannelSpend({
      day: dto.day,
      source: dto.source,
      medium: dto.medium,
      campaign: dto.campaign,
      channelGroup: dto.channelGroup as never,
      spendAmount: dto.spendAmount,
    });
  }

  @Post("orders/:orderId/costs")
  @Roles("owner", "manager")
  upsertOrderCost(
    @Param("orderId") orderId: string,
    @Body() dto: UpsertOrderCostDto,
  ): ReturnType<AdminOperationsService["upsertOrderCost"]> {
    return this.adminOps.upsertOrderCost(orderId, dto);
  }

  @Get("experiments")
  @Roles("owner", "manager", "support")
  listExperiments(): ReturnType<AdminOperationsService["listExperiments"]> {
    return this.adminOps.listExperiments();
  }

  @Post("experiments")
  @Roles("owner", "manager")
  createExperiment(@Body() dto: CreateExperimentDto): ReturnType<AdminOperationsService["createExperiment"]> {
    return this.adminOps.createExperiment(dto);
  }

  @Patch("experiments/:experimentId")
  @Roles("owner", "manager")
  decideExperiment(
    @Param("experimentId") experimentId: string,
    @Body() dto: DecideExperimentDto,
  ): ReturnType<AdminOperationsService["decideExperiment"]> {
    return this.adminOps.decideExperiment({
      experimentId,
      ...dto,
    });
  }

  @Get("weekly-reviews")
  @Roles("owner", "manager", "support")
  listWeeklyReviews(): ReturnType<AdminOperationsService["listWeeklyReviews"]> {
    return this.adminOps.listWeeklyReviews();
  }

  @Post("weekly-reviews")
  @Roles("owner", "manager")
  upsertWeeklyReview(@Body() dto: UpsertWeeklyReviewDto): ReturnType<AdminOperationsService["upsertWeeklyReview"]> {
    return this.adminOps.upsertWeeklyReview({
      weekStart: dto.weekStart,
      facts: dto.facts as Prisma.InputJsonValue,
      wins: dto.wins,
      losses: dto.losses,
      decisions: dto.decisions,
      nextActions: dto.nextActions,
      owner: dto.owner,
      deadline: dto.deadline,
      expectedImpact: dto.expectedImpact,
    });
  }
}
