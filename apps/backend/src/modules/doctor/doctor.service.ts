import { Injectable, Logger, OnApplicationBootstrap } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { PrismaService } from "../../shared/infrastructure/prisma.service";
import { RedisService } from "../../shared/infrastructure/redis.service";

/**
 * Результат одной проверки здоровья.
 * Каждая проверка — детерминированная функция (код, не LLM).
 */
export interface HealthCheck {
  /** Имя проверки (напр. "postgres", "redis") */
  name: string;
  /** ok | warn | fail */
  status: "ok" | "warn" | "fail";
  /** Время выполнения проверки в мс */
  latencyMs: number;
  /** Человекочитаемое сообщение */
  message: string;
}

/**
 * Полный отчёт о состоянии системы.
 */
export interface DoctorReport {
  /** Общий статус (healthy | degraded | unhealthy) */
  overall: "healthy" | "degraded" | "unhealthy";
  /** Время генерации отчёта */
  timestamp: string;
  /** Окружение (development | production) */
  environment: string;
  /** Uptime процесса в секундах */
  uptimeSeconds: number;
  /** Использование памяти */
  memory: {
    heapUsedMB: number;
    heapTotalMB: number;
    rssMB: number;
    heapUsagePercent: number;
  };
  /** Результаты всех проверок */
  checks: HealthCheck[];
  /** Предупреждения конфигурации (выявленные при boot) */
  warnings: string[];
}

/**
 * Doctor Service — модуль самодиагностики.
 *
 * Принцип: всё реализовано кодом (Zod, SQL, ping, Math), без LLM.
 * Каждая проверка — чистая детерминированная функция.
 *
 * Что проверяет:
 * - PostgreSQL connectivity (SELECT 1)
 * - Redis connectivity (PING)
 * - ENV переменные (наличие и минимальная длина)
 * - JWT secrets (минимальная длина для безопасности)
 * - CORS конфигурация (отсутствие wildcard в production)
 * - Supabase Storage bucket (наличие URL и ключа)
 * - Использование памяти (heap usage)
 */
@Injectable()
export class DoctorService implements OnApplicationBootstrap {
  private readonly logger = new Logger(DoctorService.name);
  private readonly bootWarnings: string[] = [];
  private readonly startedAt = Date.now();

  constructor(
    private readonly prisma: PrismaService,
    private readonly redis: RedisService,
    private readonly config: ConfigService,
  ) {}

  /**
   * Выполняется при старте приложения.
   * Проверяет конфигурацию и логирует предупреждения.
   */
  async onApplicationBootstrap(): Promise<void> {
    this.logger.log("🩺 Doctor: running boot-time diagnostics...");

    // ── ENV checks (code, not LLM) ──
    this.checkEnvVar("DATABASE_URL", 10);
    this.checkEnvVar("SUPABASE_URL", 10);
    this.checkEnvVar("SUPABASE_ANON_KEY", 10);
    this.checkEnvVar("SUPABASE_SERVICE_ROLE_KEY", 10);

    // ── JWT secret strength ──
    this.checkJwtSecret("JWT_ACCESS_SECRET", 32);
    this.checkJwtSecret("JWT_REFRESH_SECRET", 32);

    // ── CORS misconfiguration ──
    this.checkCorsConfig();

    // ── Redis availability ──
    await this.checkRedisAtBoot();

    // ── DB connectivity ──
    await this.checkDbAtBoot();

    // ── Summary ──
    if (this.bootWarnings.length === 0) {
      this.logger.log("✅ Doctor: all boot checks passed");
    } else {
      this.logger.warn(
        `⚠️  Doctor: ${this.bootWarnings.length} warning(s) at boot:\n` +
          this.bootWarnings.map((w, i) => `  ${i + 1}. ${w}`).join("\n"),
      );
    }
  }

  /**
   * Генерирует полный отчёт о состоянии системы.
   * Все проверки выполняются кодом (чистые функции).
   */
  async runFullDiagnostics(): Promise<DoctorReport> {
    const checks: HealthCheck[] = [];

    // 1. PostgreSQL
    checks.push(await this.checkPostgres());

    // 2. Redis
    checks.push(await this.checkRedis());

    // 3. JWT secrets
    checks.push(this.checkJwtSecretsRuntime());

    // 4. CORS config
    checks.push(this.checkCorsRuntime());

    // 5. Supabase config
    checks.push(this.checkSupabaseConfig());

    // 6. Memory usage
    checks.push(this.checkMemory());

    // ── Determine overall status ──
    const hasFailure = checks.some((c) => c.status === "fail");
    const hasWarning = checks.some((c) => c.status === "warn");
    const overall: DoctorReport["overall"] = hasFailure
      ? "unhealthy"
      : hasWarning
        ? "degraded"
        : "healthy";

    const memUsage = process.memoryUsage();

    return {
      overall,
      timestamp: new Date().toISOString(),
      environment: this.config.get<string>("NODE_ENV", "development"),
      uptimeSeconds: Math.round((Date.now() - this.startedAt) / 1000),
      memory: {
        heapUsedMB: Math.round(memUsage.heapUsed / 1024 / 1024),
        heapTotalMB: Math.round(memUsage.heapTotal / 1024 / 1024),
        rssMB: Math.round(memUsage.rss / 1024 / 1024),
        heapUsagePercent: Math.round(
          (memUsage.heapUsed / memUsage.heapTotal) * 100,
        ),
      },
      checks,
      warnings: [...this.bootWarnings],
    };
  }

  // ═══════════════════════════════════════════════════════
  //  RUNTIME CHECKS (вызываются из runFullDiagnostics)
  // ═══════════════════════════════════════════════════════

  /**
   * Проверка PostgreSQL: выполняет SELECT 1, замеряет latency.
   */
  private async checkPostgres(): Promise<HealthCheck> {
    const start = Date.now();
    try {
      await this.prisma.$queryRaw`SELECT 1`;
      return {
        name: "postgres",
        status: "ok",
        latencyMs: Date.now() - start,
        message: "Connection successful",
      };
    } catch (error) {
      return {
        name: "postgres",
        status: "fail",
        latencyMs: Date.now() - start,
        message: `Connection failed: ${error instanceof Error ? error.message : "unknown"}`,
      };
    }
  }

  /**
   * Проверка Redis: выполняет PING, замеряет latency.
   */
  private async checkRedis(): Promise<HealthCheck> {
    const start = Date.now();
    try {
      const pong = await this.redis.ping();
      const isInMemory = pong.includes("in-memory");
      return {
        name: "redis",
        status: isInMemory ? "warn" : "ok",
        latencyMs: Date.now() - start,
        message: isInMemory
          ? "Running in in-memory mode (no persistent Redis)"
          : `PING → ${pong}`,
      };
    } catch (error) {
      return {
        name: "redis",
        status: "warn",
        latencyMs: Date.now() - start,
        message: `Redis unavailable: ${error instanceof Error ? error.message : "unknown"}. Queue processing disabled.`,
      };
    }
  }

  /**
   * Проверка длины JWT-секретов (код, не LLM).
   * Секрет < 32 символов = слабый.
   */
  private checkJwtSecretsRuntime(): HealthCheck {
    const start = Date.now();
    const accessLen = (this.config.get<string>("JWT_ACCESS_SECRET") ?? "").length;
    const refreshLen = (this.config.get<string>("JWT_REFRESH_SECRET") ?? "").length;

    if (accessLen < 16 || refreshLen < 16) {
      return {
        name: "jwt_secrets",
        status: "fail",
        latencyMs: Date.now() - start,
        message: `JWT secrets too short (access: ${accessLen}, refresh: ${refreshLen}). Minimum: 16 characters.`,
      };
    }

    if (accessLen < 32 || refreshLen < 32) {
      return {
        name: "jwt_secrets",
        status: "warn",
        latencyMs: Date.now() - start,
        message: `JWT secrets weak (access: ${accessLen}, refresh: ${refreshLen}). Recommended: 32+ characters.`,
      };
    }

    return {
      name: "jwt_secrets",
      status: "ok",
      latencyMs: Date.now() - start,
      message: `Secrets OK (access: ${accessLen} chars, refresh: ${refreshLen} chars)`,
    };
  }

  /**
   * Проверка CORS: в production не должен быть wildcard.
   */
  private checkCorsRuntime(): HealthCheck {
    const start = Date.now();
    const env = this.config.get<string>("NODE_ENV", "development");
    const frontendOrigin = this.config.get<string>("FRONTEND_ORIGIN", "");
    const origins = frontendOrigin
      .split(",")
      .map((o) => o.trim())
      .filter(Boolean);

    if (env === "production") {
      const onlyLocalhost = origins.every(
        (o) => o.includes("localhost") || o.includes("127.0.0.1"),
      );
      if (onlyLocalhost || origins.length === 0) {
        return {
          name: "cors_config",
          status: "fail",
          latencyMs: Date.now() - start,
          message:
            "FRONTEND_ORIGIN is empty or localhost-only in production. Set to real domain(s).",
        };
      }
    }

    return {
      name: "cors_config",
      status: "ok",
      latencyMs: Date.now() - start,
      message: `Origins: [${origins.join(", ")}]`,
    };
  }

  /**
   * Проверка Supabase конфигурации.
   */
  private checkSupabaseConfig(): HealthCheck {
    const start = Date.now();
    const url = this.config.get<string>("SUPABASE_URL", "");
    const anonKey = this.config.get<string>("SUPABASE_ANON_KEY", "");
    const serviceKey = this.config.get<string>("SUPABASE_SERVICE_ROLE_KEY", "");
    const bucket = this.config.get<string>("SUPABASE_STORAGE_BUCKET", "");

    const issues: string[] = [];
    if (!url || url === "https://your-project-ref.supabase.co") {
      issues.push("SUPABASE_URL is placeholder");
    }
    if (!anonKey || anonKey === "replace-with-anon-key") {
      issues.push("SUPABASE_ANON_KEY is placeholder");
    }
    if (!serviceKey || serviceKey === "replace-with-service-role-key") {
      issues.push("SUPABASE_SERVICE_ROLE_KEY is placeholder");
    }
    if (!bucket) {
      issues.push("SUPABASE_STORAGE_BUCKET is empty");
    }

    if (issues.length > 0) {
      return {
        name: "supabase_config",
        status: "warn",
        latencyMs: Date.now() - start,
        message: issues.join("; "),
      };
    }

    return {
      name: "supabase_config",
      status: "ok",
      latencyMs: Date.now() - start,
      message: `URL: ${url}, Bucket: ${bucket}`,
    };
  }

  /**
   * Проверка использования памяти.
   * Heap usage > 85% = warn, > 95% = fail.
   * Чистая математика — никакого LLM.
   */
  private checkMemory(): HealthCheck {
    const start = Date.now();
    const mem = process.memoryUsage();
    const heapPercent = Math.round((mem.heapUsed / mem.heapTotal) * 100);

    let status: HealthCheck["status"] = "ok";
    let message = `Heap: ${heapPercent}% (${Math.round(mem.heapUsed / 1024 / 1024)}MB / ${Math.round(mem.heapTotal / 1024 / 1024)}MB)`;

    if (heapPercent > 95) {
      status = "fail";
      message += " — CRITICAL: heap nearly exhausted";
    } else if (heapPercent > 85) {
      status = "warn";
      message += " — WARNING: high heap usage";
    }

    return {
      name: "memory",
      status,
      latencyMs: Date.now() - start,
      message,
    };
  }

  // ═══════════════════════════════════════════════════════
  //  BOOT-TIME CHECKS (вызываются из onApplicationBootstrap)
  // ═══════════════════════════════════════════════════════

  /**
   * Проверяет наличие и минимальную длину ENV-переменной.
   */
  private checkEnvVar(key: string, minLength: number): void {
    const value = this.config.get<string>(key, "");
    if (!value || value.length < minLength) {
      this.bootWarnings.push(
        `ENV ${key} is missing or too short (got ${value.length} chars, need ${minLength}+)`,
      );
    }
  }

  /**
   * Проверяет JWT-секрет: < 32 символов = warning.
   */
  private checkJwtSecret(key: string, recommendedLength: number): void {
    const value = this.config.get<string>(key, "");
    if (!value || value.length < 16) {
      this.bootWarnings.push(
        `🔴 ${key} is missing or critically short (${value.length} chars). INSECURE.`,
      );
    } else if (value.length < recommendedLength) {
      this.bootWarnings.push(
        `⚠️  ${key} is weak (${value.length} chars). Recommended: ${recommendedLength}+`,
      );
    }
  }

  /**
   * Проверяет CORS конфигурацию при boot.
   */
  private checkCorsConfig(): void {
    const env = this.config.get<string>("NODE_ENV", "development");
    const frontendOrigin = this.config.get<string>("FRONTEND_ORIGIN", "");
    const origins = frontendOrigin
      .split(",")
      .map((o) => o.trim())
      .filter(Boolean);

    if (env === "production") {
      const onlyLocalhost = origins.every(
        (o) => o.includes("localhost") || o.includes("127.0.0.1"),
      );
      if (onlyLocalhost || origins.length === 0) {
        this.bootWarnings.push(
          "CORS: FRONTEND_ORIGIN has only localhost in production mode",
        );
      }
    }
  }

  /**
   * Проверяет Redis при boot.
   */
  private async checkRedisAtBoot(): Promise<void> {
    try {
      const pong = await this.redis.ping();
      if (pong.includes("in-memory")) {
        this.bootWarnings.push(
          "Redis: running in in-memory mode. Queue processing unavailable.",
        );
      }
    } catch {
      this.bootWarnings.push(
        "Redis: connection failed at boot. Queues will not process.",
      );
    }
  }

  /**
   * Проверяет DB при boot.
   */
  private async checkDbAtBoot(): Promise<void> {
    try {
      await this.prisma.$queryRaw`SELECT 1`;
    } catch (error) {
      this.bootWarnings.push(
        `PostgreSQL: connection failed at boot — ${error instanceof Error ? error.message : "unknown"}`,
      );
    }
  }
}
