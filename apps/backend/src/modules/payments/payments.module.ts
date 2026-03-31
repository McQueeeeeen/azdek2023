import { Module } from "@nestjs/common";
import { PaymentsController } from "./payments.controller";
import { PaymentsService } from "./payments.service";
import { OrdersModule } from "../orders/orders.module";
import { QueueModule } from "../../infrastructure/queue/queue.module";
import { PaymentsEventsProcessor } from "./jobs/payments-events.processor";
import { PAYMENTS_REPOSITORY } from "../../application/payments/repositories/payments.repository";
import { PaymentsPrismaRepository } from "../../infrastructure/database/prisma/repositories/payments-prisma.repository";
import { NotificationsModule } from "../notifications/notifications.module";
import { AnalyticsModule } from "../analytics/analytics.module";

const paymentsWorkerProviders = process.env.QUEUE_WORKERS_ENABLED === "true" ? [PaymentsEventsProcessor] : [];

@Module({
  imports: [OrdersModule, QueueModule, NotificationsModule, AnalyticsModule],
  controllers: [PaymentsController],
  providers: [
    PaymentsService,
    ...paymentsWorkerProviders,
    {
      provide: PAYMENTS_REPOSITORY,
      useClass: PaymentsPrismaRepository,
    },
  ],
  exports: [PaymentsService],
})
export class PaymentsModule {}
