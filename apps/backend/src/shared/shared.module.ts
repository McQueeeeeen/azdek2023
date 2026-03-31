import { Global, Module } from "@nestjs/common";
import { PrismaService } from "./infrastructure/prisma.service";
import { RedisService } from "./infrastructure/redis.service";
import { SupabaseStorageService } from "../infrastructure/storage/supabase-storage.service";

@Global()
@Module({
  providers: [PrismaService, RedisService, SupabaseStorageService],
  exports: [PrismaService, RedisService, SupabaseStorageService],
})
export class SharedModule {}
