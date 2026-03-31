import { MiddlewareConsumer, Module, NestModule } from "@nestjs/common";
import { CatalogModule } from "./modules/catalog/catalog.module";
import { CartModule } from "./modules/cart/cart.module";
import { OrdersModule } from "./modules/orders/orders.module";
import { PaymentsModule } from "./modules/payments/payments.module";
import { CheckoutModule } from "./modules/checkout/checkout.module";
import { SharedModule } from "./shared/shared.module";
import { HealthModule } from "./modules/health/health.module";
import { RequestLoggerMiddleware } from "./shared/infrastructure/request-logger.middleware";
import { AppConfigModule } from "./config/config.module";
import { ShipmentsModule } from "./modules/shipments/shipments.module";
import { CustomersModule } from "./modules/customers/customers.module";
import { AdminModule } from "./modules/admin/admin.module";
import { QueueModule } from "./infrastructure/queue/queue.module";
import { AuthModule } from "./modules/auth/auth.module";
import { NotificationsModule } from "./modules/notifications/notifications.module";
import { B2BModule } from "./modules/b2b/b2b.module";
import { AnalyticsModule } from "./modules/analytics/analytics.module";

@Module({
  imports: [
    AppConfigModule,
    SharedModule,
    QueueModule,
    AuthModule,
    NotificationsModule,
    AnalyticsModule,
    B2BModule,
    HealthModule,
    CatalogModule,
    CartModule,
    CustomersModule,
    OrdersModule,
    PaymentsModule,
    ShipmentsModule,
    AdminModule,
    CheckoutModule,
  ],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer): void {
    consumer.apply(RequestLoggerMiddleware).forRoutes("*");
  }
}
