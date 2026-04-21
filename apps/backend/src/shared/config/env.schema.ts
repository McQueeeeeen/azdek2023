import { z } from "zod";

export const envSchema = z.object({
  NODE_ENV: z.enum(["development", "test", "production"]).default("development"),
  BACKEND_PORT: z.coerce.number().int().positive().default(4000),
  FRONTEND_ORIGIN: z.string().default("http://localhost:3000,http://127.0.0.1:3000"),
  DATABASE_URL: z.string().min(1),
  REDIS_URL: z.string().min(1).optional(),
  LOG_LEVEL: z.enum(["error", "warn", "log", "debug", "verbose"]).default("log"),
  SUPABASE_URL: z.string().url(),
  SUPABASE_ANON_KEY: z.string().min(1),
  SUPABASE_SERVICE_ROLE_KEY: z.string().min(1),
  SUPABASE_STORAGE_BUCKET: z.string().min(1).default("product-media"),
  PAYMENT_WEBHOOK_SECRET_MOCK_KZ: z.string().min(1),
  QUEUE_WORKERS_ENABLED: z
    .string()
    .optional()
    .transform((value) => value === "true"),
  JWT_ACCESS_SECRET: z.string().min(16),
  JWT_ACCESS_TTL: z.string().min(1).default("15m"),
  JWT_REFRESH_SECRET: z.string().min(16),
  JWT_REFRESH_TTL: z.string().min(1).default("30d"),
  AUTH_BOOTSTRAP_KEY: z.string().min(8).default("azdek-bootstrap-key"),
});

export type AppEnv = z.infer<typeof envSchema>;

export function validateEnv(config: Record<string, unknown>): AppEnv {
  return envSchema.parse(config);
}
