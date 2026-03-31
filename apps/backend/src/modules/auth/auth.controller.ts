import { Body, Controller, Get, Post, Req, UseGuards } from "@nestjs/common";
import { Request } from "express";
import { AuthService } from "./auth.service";
import { JwtPayload } from "./domain/jwt-payload.interface";
import { LoginDto } from "./dto/login.dto";
import { JwtAuthGuard } from "./guards/jwt-auth.guard";
import { RegisterCustomerDto } from "./dto/register-customer.dto";
import { RefreshTokenDto } from "./dto/refresh-token.dto";

type RequestWithUser = Request & { user: JwtPayload };

@Controller("auth")
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post("register/customer")
  registerCustomer(@Body() dto: RegisterCustomerDto): Promise<Awaited<ReturnType<AuthService["registerCustomer"]>>> {
    return this.authService.registerCustomer(dto);
  }

  @Post("login")
  login(@Body() dto: LoginDto): Promise<Awaited<ReturnType<AuthService["login"]>>> {
    return this.authService.login(dto);
  }

  @Post("refresh")
  refresh(@Body() dto: RefreshTokenDto): Promise<Awaited<ReturnType<AuthService["refresh"]>>> {
    return this.authService.refresh(dto);
  }

  @Post("logout")
  @UseGuards(JwtAuthGuard)
  logout(@Req() req: RequestWithUser): Promise<Awaited<ReturnType<AuthService["logout"]>>> {
    return this.authService.logout(req.user.sub);
  }

  @Get("me")
  @UseGuards(JwtAuthGuard)
  me(@Req() req: RequestWithUser): Promise<Awaited<ReturnType<AuthService["me"]>>> {
    return this.authService.me(req.user.sub);
  }
}
