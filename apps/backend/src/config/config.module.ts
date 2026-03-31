import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { appConfig } from "./app.config";
import { dbConfig } from "./db.config";
import { redisConfig } from "./redis.config";
import { paymentConfig } from "./payment.config";
import { storageConfig } from "./storage.config";
import { validateEnv } from "../shared/config/env.schema";

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [appConfig, dbConfig, redisConfig, paymentConfig, storageConfig],
      validate: validateEnv,
    }),
  ],
})
export class AppConfigModule {}

