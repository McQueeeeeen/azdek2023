import { Module } from "@nestjs/common";
import { JwtModule } from "@nestjs/jwt";
import { PassportModule } from "@nestjs/passport";
import { ConfigService } from "@nestjs/config";
import { AuthController } from "./auth.controller";
import { AuthService } from "./auth.service";
import { JwtStrategy } from "./strategies/jwt.strategy";
import { AUTH_REPOSITORY } from "../../application/auth/repositories/auth.repository";
import { AuthPrismaRepository } from "../../infrastructure/database/prisma/repositories/auth-prisma.repository";
import { RolesGuard } from "./guards/roles.guard";

@Module({
  imports: [
    PassportModule.register({ defaultStrategy: "jwt" }),
    JwtModule.registerAsync({
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        secret: configService.get<string>("JWT_ACCESS_SECRET"),
      }),
    }),
  ],
  controllers: [AuthController],
  providers: [
    AuthService,
    JwtStrategy,
    RolesGuard,
    {
      provide: AUTH_REPOSITORY,
      useClass: AuthPrismaRepository,
    },
  ],
  exports: [AuthService, RolesGuard, PassportModule, JwtModule],
})
export class AuthModule {}

