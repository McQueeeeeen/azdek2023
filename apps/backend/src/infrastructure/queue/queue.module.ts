import { Module } from "@nestjs/common";
import { BullModule } from "@nestjs/bullmq";
import { ConfigService } from "@nestjs/config";

@Module({
  imports: [
    BullModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (config: ConfigService) => {
        const redisUrl = config.getOrThrow<string>("REDIS_URL");
        const parsed = new URL(redisUrl);
        return {
          skipVersionCheck: true,
          connection: {
            host: parsed.hostname,
            port: Number(parsed.port || "6379"),
            password: parsed.password || undefined,
          },
        };
      },
    }),
    BullModule.registerQueue({
      name: "payments-events",
      skipVersionCheck: true,
    }),
    BullModule.registerQueue({
      name: "notifications",
      skipVersionCheck: true,
    }),
  ],
  exports: [BullModule],
})
export class QueueModule {}
