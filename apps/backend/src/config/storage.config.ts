import { registerAs } from "@nestjs/config";

export const storageConfig = registerAs("storage", () => ({
  supabaseUrl: process.env.SUPABASE_URL ?? "",
  supabaseAnonKey: process.env.SUPABASE_ANON_KEY ?? "",
  supabaseServiceRoleKey: process.env.SUPABASE_SERVICE_ROLE_KEY ?? "",
  bucket: process.env.SUPABASE_STORAGE_BUCKET ?? "product-media",
}));

