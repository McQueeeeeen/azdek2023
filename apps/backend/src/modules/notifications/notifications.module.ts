import { Module } from "@nestjs/common";
import { QueueModule } from "../../infrastructure/queue/queue.module";
import { NotificationsProcessor } from "./notifications.processor";
import { NotificationsService } from "./notifications.service";

const notificationWorkerProviders = process.env.QUEUE_WORKERS_ENABLED === "true" ? [NotificationsProcessor] : [];

@Module({
  imports: [QueueModule],
  providers: [NotificationsService, ...notificationWorkerProviders],
  exports: [NotificationsService],
})
export class NotificationsModule {}
