import { Body, Controller, Get, Param, Patch, Req, UseGuards } from "@nestjs/common";
import { Request } from "express";
import { JwtAuthGuard } from "../auth/guards/jwt-auth.guard";
import { RolesGuard } from "../auth/guards/roles.guard";
import { Roles } from "../auth/decorators/roles.decorator";
import { AdminOperationsService } from "./admin-operations.service";
import { ReviewB2BApplicationDto } from "../b2b/dto/review-b2b-application.dto";
import { JwtPayload } from "../auth/domain/jwt-payload.interface";

type RequestWithUser = Request & { user: JwtPayload };

@Controller("admin/b2b")
@UseGuards(JwtAuthGuard, RolesGuard)
export class AdminB2BController {
  constructor(private readonly adminOps: AdminOperationsService) {}

  @Get("applications")
  @Roles("owner", "manager", "support")
  listApplications(): ReturnType<AdminOperationsService["listB2BApplications"]> {
    return this.adminOps.listB2BApplications();
  }

  @Patch("applications/:applicationId")
  @Roles("owner", "manager", "support")
  reviewApplication(
    @Param("applicationId") applicationId: string,
    @Body() dto: ReviewB2BApplicationDto,
    @Req() req: RequestWithUser,
  ): ReturnType<AdminOperationsService["reviewB2BApplication"]> {
    return this.adminOps.reviewB2BApplication(applicationId, dto, req.user.sub);
  }
}

