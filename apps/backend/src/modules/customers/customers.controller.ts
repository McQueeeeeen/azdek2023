import { Body, Controller, ForbiddenException, Get, Param, Patch, Req, UseGuards } from "@nestjs/common";
import { Request } from "express";
import { CustomersService } from "./customers.service";
import { JwtAuthGuard } from "../auth/guards/jwt-auth.guard";
import { RolesGuard } from "../auth/guards/roles.guard";
import { Roles } from "../auth/decorators/roles.decorator";
import { JwtPayload } from "../auth/domain/jwt-payload.interface";
import { UpdateCustomerProfileDto } from "./dto/update-customer-profile.dto";

type RequestWithUser = Request & { user: JwtPayload };

@Controller("customers")
@UseGuards(JwtAuthGuard, RolesGuard)
export class CustomersController {
  constructor(private readonly customersService: CustomersService) {}

  @Get()
  @Roles("owner", "manager", "support")
  list(): ReturnType<CustomersService["list"]> {
    return this.customersService.list();
  }

  @Get("me")
  @Roles("customer", "b2b_customer", "owner", "manager", "support")
  async me(@Req() req: RequestWithUser): Promise<Awaited<ReturnType<CustomersService["getById"]>>> {
    if (!req.user.customerId) {
      throw new ForbiddenException("Customer profile is not linked");
    }
    return this.customersService.getById(req.user.customerId);
  }

  @Patch("me")
  @Roles("customer", "b2b_customer", "owner", "manager", "support")
  updateMe(
    @Req() req: RequestWithUser,
    @Body() dto: UpdateCustomerProfileDto,
  ): ReturnType<CustomersService["upsertProfileByUser"]> {
    return this.customersService.upsertProfileByUser(req.user.sub, dto);
  }

  @Get(":customerId")
  @Roles("owner", "manager", "support")
  getById(@Param("customerId") customerId: string): ReturnType<CustomersService["getById"]> {
    return this.customersService.getById(customerId);
  }
}
