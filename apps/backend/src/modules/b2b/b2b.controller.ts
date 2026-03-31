import { Body, Controller, ForbiddenException, Get, Post, Req, UseGuards } from "@nestjs/common";
import { Request } from "express";
import { B2BService } from "./b2b.service";
import { CreateB2BApplicationDto } from "./dto/create-b2b-application.dto";
import { JwtAuthGuard } from "../auth/guards/jwt-auth.guard";
import { RolesGuard } from "../auth/guards/roles.guard";
import { Roles } from "../auth/decorators/roles.decorator";
import { JwtPayload } from "../auth/domain/jwt-payload.interface";

@Controller("b2b")
export class B2BController {
  constructor(private readonly b2bService: B2BService) {}

  @Post("applications")
  createApplication(@Body() dto: CreateB2BApplicationDto): ReturnType<B2BService["createApplication"]> {
    return this.b2bService.createApplication(dto);
  }

  @Get("account/me")
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles("b2b_customer")
  myAccount(@Req() req: Request & { user: JwtPayload }): ReturnType<B2BService["getAccount"]> {
    if (!req.user.customerId) {
      throw new ForbiddenException("B2B customer is not linked");
    }
    return this.b2bService.getAccount(req.user.customerId);
  }
}
