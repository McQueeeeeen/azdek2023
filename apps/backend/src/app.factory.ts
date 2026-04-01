import { INestApplication, ValidationPipe } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module";
import { DomainExceptionFilter } from "./common/filters/domain-exception.filter";

export async function createApp(): Promise<{ app: INestApplication; port: number }> {
  const app = await NestFactory.create(AppModule, { rawBody: true });
  const config = app.get(ConfigService);
  const frontendOrigin = config.get<string>("FRONTEND_ORIGIN", "http://localhost:3000,http://127.0.0.1:3000");
  const allowedOrigins = frontendOrigin
    .split(",")
    .map((origin) => origin.trim())
    .filter(Boolean);
  const isProduction = config.get<string>("NODE_ENV", "development") === "production";
  const onlyLocalhostConfigured =
    allowedOrigins.length > 0 &&
    allowedOrigins.every((origin) => origin.includes("localhost") || origin.includes("127.0.0.1"));

  app.setGlobalPrefix("v1");
  app.enableCors({
    // Production safety net: if only localhost is configured, do not block real frontend domains.
    origin: isProduction && onlyLocalhostConfigured ? true : allowedOrigins.length > 0 ? allowedOrigins : true,
    credentials: true,
  });
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
      forbidNonWhitelisted: true,
    }),
  );
  app.useGlobalFilters(new DomainExceptionFilter());

  const runtimePort = process.env.PORT ? Number(process.env.PORT) : undefined;
  const port = runtimePort && Number.isFinite(runtimePort) ? runtimePort : config.get<number>("BACKEND_PORT", 4000);
  return { app, port };
}
