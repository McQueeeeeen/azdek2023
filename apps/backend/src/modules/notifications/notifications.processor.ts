import { Processor, WorkerHost } from "@nestjs/bullmq";
import { Logger } from "@nestjs/common";
import { Job } from "bullmq";
import { NotificationJobPayload } from "./notifications.service";

@Processor("notifications")
export class NotificationsProcessor extends WorkerHost {
  private readonly logger = new Logger(NotificationsProcessor.name);

  async process(job: Job<NotificationJobPayload>): Promise<void> {
    if (job.name !== "send-email") {
      return;
    }

    const payload = job.data;
    this.logger.log(
      `Email notification queued: type=${payload.type} to=${payload.toEmail} subject=${payload.subject}`,
    );
  }
}

