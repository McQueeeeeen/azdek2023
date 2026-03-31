import { Body, Controller, Param, Patch, UseGuards } from "@nestjs/common";
import { JwtAuthGuard } from "../auth/guards/jwt-auth.guard";
import { RolesGuard } from "../auth/guards/roles.guard";
import { Roles } from "../auth/decorators/roles.decorator";
import { AdminOperationsService } from "./admin-operations.service";
import { UpdateInventoryDto } from "./dto/update-inventory.dto";

@Controller("admin/inventory")
@UseGuards(JwtAuthGuard, RolesGuard)
export class AdminInventoryController {
  constructor(private readonly adminOps: AdminOperationsService) {}

  @Patch("variants/:variantId")
  @Roles("owner", "manager", "warehouse")
  updateVariantStock(
    @Param("variantId") variantId: string,
    @Body() dto: UpdateInventoryDto,
  ): ReturnType<AdminOperationsService["updateInventory"]> {
    return this.adminOps.updateInventory(variantId, dto);
  }
}

