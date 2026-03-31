import { InjectQueue } from "@nestjs/bullmq";
import { Injectable, Logger } from "@nestjs/common";
import { Queue } from "bullmq";

export type NotificationEventType =
  | "order_created"
  | "payment_succeeded"
  | "order_shipped"
  | "b2b_application_received"
  | "b2b_reviewed"
  | "abandoned_cart_reminder";

export interface NotificationJobPayload {
  type: NotificationEventType;
  toEmail: string;
  subject: string;
  template: string;
  data: Record<string, unknown>;
}

@Injectable()
export class NotificationsService {
  private readonly logger = new Logger(NotificationsService.name);

  constructor(@InjectQueue("notifications") private readonly notificationsQueue: Queue) {}

  async enqueueEmail(payload: NotificationJobPayload): Promise<void> {
    try {
      await this.notificationsQueue.add("send-email", payload, {
        attempts: 5,
        backoff: {
          type: "exponential",
          delay: 2000,
        },
        removeOnComplete: 100,
        removeOnFail: 500,
      });
    } catch (error) {
      this.logger.error(`Failed to enqueue notification type=${payload.type}`, error as Error);
    }
  }
}
