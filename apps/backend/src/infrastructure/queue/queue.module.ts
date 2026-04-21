import { Module, DynamicModule } from "@nestjs/common";
import { BullModule } from "@nestjs/bullmq";
import { ConfigService } from "@nestjs/config";

@Module({})
export class QueueModule {
  static forRoot(): DynamicModule {
    return {
      module: QueueModule,
      imports: [
        BullModule.forRootAsync({
          inject: [ConfigService],
          useFactory: (config: ConfigService) => {
            const redisUrl = config.get<string>("REDIS_URL");
            if (!redisUrl) {
              return null;
            }
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
    };
  }
}
