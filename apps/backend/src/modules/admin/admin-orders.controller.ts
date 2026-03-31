import { Body, Controller, Get, Param, Patch, Post, Query, Req, UseGuards } from "@nestjs/common";
import { Request } from "express";
import { JwtAuthGuard } from "../auth/guards/jwt-auth.guard";
import { RolesGuard } from "../auth/guards/roles.guard";
import { Roles } from "../auth/decorators/roles.decorator";
import { JwtPayload } from "../auth/domain/jwt-payload.interface";
import { AdminOperationsService } from "./admin-operations.service";
import { AddTrackingDto, UpdateOrderPaymentStatusDto, UpdateOrderStatusDto } from "./dto/update-order-status.dto";

type RequestWithUser = Request & { user: JwtPayload };

@Controller("admin/orders")
@UseGuards(JwtAuthGuard, RolesGuard)
export class AdminOrdersController {
  constructor(private readonly adminOps: AdminOperationsService) {}

  @Get()
  @Roles("owner", "manager", "support")
  list(): ReturnType<AdminOperationsService["listOrders"]> {
    return this.adminOps.listOrders();
  }

  @Get("analytics/funnel")
  @Roles("owner", "manager", "support")
  orderFunnel(
    @Query("windowDays") windowDays?: string,
  ): ReturnType<AdminOperationsService["orderAnalytics"]> {
    const parsedWindow = windowDays ? Number(windowDays) : undefined;
    return this.adminOps.orderAnalytics(parsedWindow);
  }

  @Post("retention/abandoned-carts/run")
  @Roles("owner", "manager")
  runAbandonedCarts(
    @Query("hours") hours?: string,
  ): ReturnType<AdminOperationsService["runAbandonedCartRetention"]> {
    const parsedHours = hours ? Number(hours) : undefined;
    return this.adminOps.runAbandonedCartRetention(parsedHours);
  }

  @Patch(":orderId/status")
  @Roles("owner", "manager", "support")
  updateStatus(
    @Param("orderId") orderId: string,
    @Body() dto: UpdateOrderStatusDto,
    @Req() req: RequestWithUser,
  ): ReturnType<AdminOperationsService["updateOrderStatus"]> {
    return this.adminOps.updateOrderStatus({
      orderId,
      status: dto.status,
      reason: dto.reason,
      actorId: req.user.sub,
    });
  }

  @Patch(":orderId/payment-status")
  @Roles("owner", "manager", "support")
  updatePaymentStatus(
    @Param("orderId") orderId: string,
    @Body() dto: UpdateOrderPaymentStatusDto,
  ): ReturnType<AdminOperationsService["markOrderPaymentStatus"]> {
    return this.adminOps.markOrderPaymentStatus(orderId, dto.status);
  }

  @Patch(":orderId/tracking")
  @Roles("owner", "manager", "warehouse")
  addTracking(
    @Param("orderId") orderId: string,
    @Body() dto: AddTrackingDto,
    @Req() req: RequestWithUser,
  ): ReturnType<AdminOperationsService["addTracking"]> {
    return this.adminOps.addTracking({
      orderId,
      trackingNumber: dto.trackingNumber,
      carrier: dto.carrier,
      actorId: req.user.sub,
    });
  }

  @Post(":orderId/payment-link")
  @Roles("owner", "manager", "support")
  sendPaymentLink(@Param("orderId") orderId: string): ReturnType<AdminOperationsService["sendPaymentLink"]> {
    return this.adminOps.sendPaymentLink(orderId);
  }

  @Get(":orderId/payment-diagnostics")
  @Roles("owner", "manager", "support")
  paymentDiagnostics(
    @Param("orderId") orderId: string,
  ): ReturnType<AdminOperationsService["paymentDiagnosticsByOrder"]> {
    return this.adminOps.paymentDiagnosticsByOrder(orderId);
  }
}
