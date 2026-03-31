import { Controller, Get } from "@nestjs/common";
import { PrismaService } from "../../shared/infrastructure/prisma.service";
import { RedisService } from "../../shared/infrastructure/redis.service";

@Controller()
export class HealthController {
  constructor(
    private readonly prisma: PrismaService,
    private readonly redis: RedisService,
  ) {}

  @Get("health")
  health(): { status: string } {
    return { status: "ok" };
  }

  @Get("ready")
  async ready(): Promise<{ status: string; checks: Record<string, string> }> {
    await this.prisma.$queryRaw`SELECT 1`;
    const redisStatus = await this.redis.ping();
    return {
      status: "ready",
      checks: {
        postgres: "ok",
        redis: redisStatus.toLowerCase(),
      },
    };
  }
}

