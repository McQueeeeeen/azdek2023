import { Injectable, OnModuleDestroy } from "@nestjs/common";
import Redis from "ioredis";
import { ConfigService } from "@nestjs/config";

@Injectable()
export class RedisService implements OnModuleDestroy {
  private readonly client: Redis | null;

  constructor(configService: ConfigService) {
    const redisUrl = configService.get<string>("REDIS_URL");
    if (!redisUrl) {
      this.client = null;
      return;
    }
    this.client = new Redis(redisUrl, {
      maxRetriesPerRequest: 1,
    });
  }

  getClient(): Redis | null {
    return this.client;
  }

  async ping(): Promise<string> {
    if (!this.client) {
      return "PONG (in-memory mode)";
    }
    return this.client.ping();
  }

  async onModuleDestroy(): Promise<void> {
    if (this.client) {
      await this.client.quit();
    }
  }
}

