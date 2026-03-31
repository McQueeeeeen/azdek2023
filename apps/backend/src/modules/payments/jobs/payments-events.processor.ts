import { Processor, WorkerHost } from "@nestjs/bullmq";
import { Job } from "bullmq";
import { Logger } from "@nestjs/common";

@Processor("payments-events")
export class PaymentsEventsProcessor extends WorkerHost {
  private readonly logger = new Logger(PaymentsEventsProcessor.name);

  async process(job: Job): Promise<void> {
    this.logger.log(`Processed payment job ${job.name} (${job.id})`);
  }
}

