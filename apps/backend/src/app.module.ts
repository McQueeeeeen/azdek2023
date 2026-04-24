import { Logger, MiddlewareConsumer, Module, NestModule } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { APP_GUARD } from "@nestjs/core";
import { ThrottlerGuard, ThrottlerModule } from "@nestjs/throttler";
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
import { DoctorModule } from "./modules/doctor/doctor.module";


@Module({
  imports: [
    AppConfigModule,
    SharedModule,
    // ── Rate limiting: 100 requests per 60 seconds per IP ──
    ThrottlerModule.forRoot([{
      ttl: 60000,
      limit: 100,
    }]),
    {
      module: QueueModule,
      imports: [],
      providers: [],
      exports: [],
    },
    AuthModule,
    NotificationsModule,
    AnalyticsModule,
    B2BModule,
    HealthModule,
    DoctorModule,
    CatalogModule,
    CartModule,
    CustomersModule,
    OrdersModule,
    PaymentsModule,
    ShipmentsModule,
    AdminModule,
    CheckoutModule,
  ],
  providers: [
    // ── Global rate limit guard: applies to ALL endpoints ──
    {
      provide: APP_GUARD,
      useClass: ThrottlerGuard,
    },
  ],
})
export class AppModule implements NestModule {
  private readonly logger = new Logger(AppModule.name);

  constructor(config: ConfigService) {
    const hasRedis = config.get<string>("REDIS_URL");
    if (!hasRedis) {
      this.logger.warn("Redis not configured. Queue processing disabled. Using synchronous processing.");
    }
  }

  configure(consumer: MiddlewareConsumer): void {
    consumer.apply(RequestLoggerMiddleware).forRoutes("*");
  }
}
