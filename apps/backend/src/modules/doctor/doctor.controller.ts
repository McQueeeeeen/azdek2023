import { Controller, Get, UseGuards } from "@nestjs/common";
import { DoctorService, DoctorReport } from "./doctor.service";
import { JwtAuthGuard } from "../auth/guards/jwt-auth.guard";
import { RolesGuard } from "../auth/guards/roles.guard";
import { Roles } from "../auth/decorators/roles.decorator";

/**
 * Doctor Controller — admin-only endpoint для самодиагностики.
 *
 * GET /v1/doctor/health  → полный отчёт (только admin/owner)
 * GET /v1/doctor/ping    → быстрый ping (без авторизации)
 *
 * Принцип: endpoint возвращает структурированный JSON,
 * все проверки — чистые функции (код), не LLM.
 */
@Controller("doctor")
export class DoctorController {
  constructor(private readonly doctor: DoctorService) {}

  /**
   * Быстрый ping — для мониторинга (без авторизации).
   * Возвращает только статус, без деталей.
   */
  @Get("ping")
  ping(): { status: string; timestamp: string } {
    return {
      status: "alive",
      timestamp: new Date().toISOString(),
    };
  }

  /**
   * Полный отчёт о здоровье — только для admin/owner.
   * Включает все проверки: DB, Redis, JWT, CORS, Supabase, Memory.
   */
  @Get("health")
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles("owner", "manager")
  async health(): Promise<DoctorReport> {
    return this.doctor.runFullDiagnostics();
  }
}
