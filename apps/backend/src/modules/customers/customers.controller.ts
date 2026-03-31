import { Controller, ForbiddenException, Get, Param, Req, UseGuards } from "@nestjs/common";
import { Request } from "express";
import { CustomersService } from "./customers.service";
import { JwtAuthGuard } from "../auth/guards/jwt-auth.guard";
import { RolesGuard } from "../auth/guards/roles.guard";
import { Roles } from "../auth/decorators/roles.decorator";
import { JwtPayload } from "../auth/domain/jwt-payload.interface";

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
  @Roles("customer", "b2b_customer")
  async me(@Req() req: RequestWithUser): Promise<Awaited<ReturnType<CustomersService["getById"]>>> {
    if (!req.user.customerId) {
      throw new ForbiddenException("Customer profile is not linked");
    }
    return this.customersService.getById(req.user.customerId);
  }

  @Get(":customerId")
  @Roles("owner", "manager", "support")
  getById(@Param("customerId") customerId: string): ReturnType<CustomersService["getById"]> {
    return this.customersService.getById(customerId);
  }
}
