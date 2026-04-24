import { INestApplication, Logger, ValidationPipe } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { NestFactory } from "@nestjs/core";
import helmet from "helmet";
import { AppModule } from "./app.module";
import { DomainExceptionFilter } from "./common/filters/domain-exception.filter";

/**
 * Determines the CORS origin policy based on environment and configuration.
 *
 * DEV:  allow configured origins, or everything if nothing configured.
 * PROD: only allow explicitly configured non-localhost origins.
 *       If only localhost origins are present in production, this is a
 *       misconfiguration — we reject all cross-origin requests and log
 *       a CRITICAL warning instead of silently allowing everything.
 */
function resolveCorsOrigin(
  allowedOrigins: string[],
  isProduction: boolean,
  logger: Logger,
): boolean | string[] {
  if (!isProduction) {
    // Dev: allow configured origins, or everything if none set.
    return allowedOrigins.length > 0 ? allowedOrigins : true;
  }

  // Production: check for misconfiguration.
  const onlyLocalhostConfigured =
    allowedOrigins.length > 0 &&
    allowedOrigins.every(
      (origin) => origin.includes("localhost") || origin.includes("127.0.0.1"),
    );

  if (onlyLocalhostConfigured || allowedOrigins.length === 0) {
    logger.error(
      "🔴 CRITICAL: FRONTEND_ORIGIN contains only localhost or is empty in production. " +
        "Cross-origin requests will be REJECTED. " +
        "Set FRONTEND_ORIGIN to your real domain(s), e.g.: https://azdek.kz,https://www.azdek.kz",
      "CorsPolicy",
    );
    // Return an empty array → no origins allowed → all CORS requests rejected.
    return [];
  }

  logger.log(
    `✅ CORS: production origins [${allowedOrigins.join(", ")}]`,
    "CorsPolicy",
  );
  return allowedOrigins;
}

export async function createApp(): Promise<{ app: INestApplication; port: number }> {
  const app = await NestFactory.create(AppModule, { rawBody: true });
  const config = app.get(ConfigService);
  const logger = new Logger("Bootstrap");

  const frontendOrigin = config.get<string>(
    "FRONTEND_ORIGIN",
    "http://localhost:3000,http://127.0.0.1:3000",
  );
  const allowedOrigins = frontendOrigin
    .split(",")
    .map((origin) => origin.trim())
    .filter(Boolean);
  const isProduction =
    config.get<string>("NODE_ENV", "development") === "production";

  app.setGlobalPrefix("v1");

  // ── CORS ──
  const corsOrigin = resolveCorsOrigin(allowedOrigins, isProduction, logger);
  app.enableCors({
    origin: corsOrigin,
    credentials: true,
    methods: ["GET", "POST", "PATCH", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
    maxAge: 86400, // preflight cache: 24h
  });

  // ── Security headers (helmet) ──
  // Sets X-Content-Type-Options, X-Frame-Options, Strict-Transport-Security, etc.
  // crossOriginResourcePolicy disabled to allow cross-origin API calls from frontend.
  app.use(
    helmet({
      crossOriginResourcePolicy: false,
      contentSecurityPolicy: isProduction ? undefined : false,
    }),
  );

  // ── Validation ──
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
      forbidNonWhitelisted: true,
    }),
  );

  // ── Exception filters ──
  app.useGlobalFilters(new DomainExceptionFilter());

  // ── Port ──
  const runtimePort = process.env.PORT ? Number(process.env.PORT) : undefined;
  const port =
    runtimePort && Number.isFinite(runtimePort)
      ? runtimePort
      : config.get<number>("BACKEND_PORT", 4000);

  logger.log(
    `🚀 App configured [env=${isProduction ? "production" : "development"}, port=${port}]`,
    "Bootstrap",
  );

  return { app, port };
}
