import { Body, Controller, Get, Param, Patch, Post, UseGuards } from "@nestjs/common";
import { JwtAuthGuard } from "../auth/guards/jwt-auth.guard";
import { RolesGuard } from "../auth/guards/roles.guard";
import { Roles } from "../auth/decorators/roles.decorator";
import { AdminOperationsService } from "./admin-operations.service";
import { CreatePromoDto } from "./dto/create-promo.dto";
import { UpdatePromoDto } from "./dto/update-promo.dto";

@Controller("admin/promos")
@UseGuards(JwtAuthGuard, RolesGuard)
export class AdminPromosController {
  constructor(private readonly adminOps: AdminOperationsService) {}

  @Get()
  @Roles("owner", "manager", "support")
  list(): ReturnType<AdminOperationsService["listPromos"]> {
    return this.adminOps.listPromos();
  }

  @Post()
  @Roles("owner", "manager")
  create(@Body() dto: CreatePromoDto): ReturnType<AdminOperationsService["createPromo"]> {
    return this.adminOps.createPromo({
      code: dto.code,
      discountType: dto.discountType,
      amount: dto.amount,
      startsAt: dto.startsAt ? new Date(dto.startsAt) : undefined,
      expiresAt: dto.expiresAt ? new Date(dto.expiresAt) : undefined,
      usageLimit: dto.usageLimit,
    });
  }

  @Patch(":promoId")
  @Roles("owner", "manager")
  update(
    @Param("promoId") promoId: string,
    @Body() dto: UpdatePromoDto,
  ): ReturnType<AdminOperationsService["updatePromo"]> {
    return this.adminOps.updatePromo(promoId, {
      isActive: dto.isActive,
      startsAt: dto.startsAt === undefined ? undefined : dto.startsAt === null ? null : new Date(dto.startsAt),
      expiresAt: dto.expiresAt === undefined ? undefined : dto.expiresAt === null ? null : new Date(dto.expiresAt),
      usageLimit: dto.usageLimit,
    });
  }
}

