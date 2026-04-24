import { Module } from "@nestjs/common";
import { DoctorController } from "./doctor.controller";
import { DoctorService } from "./doctor.service";
import { AuthModule } from "../auth/auth.module";

/**
 * Doctor Module — модуль самодиагностики системы.
 *
 * Регистрирует:
 * - DoctorService (boot-time + runtime checks)
 * - DoctorController (admin-only endpoints)
 *
 * Зависимости:
 * - PrismaService, RedisService (через SharedModule @Global)
 * - AuthModule (для JWT Guard + Roles Guard)
 */
@Module({
  imports: [AuthModule],
  controllers: [DoctorController],
  providers: [DoctorService],
  exports: [DoctorService],
})
export class DoctorModule {}
