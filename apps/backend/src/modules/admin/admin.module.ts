import { Module } from "@nestjs/common";
import { AdminProductsController } from "./admin-products.controller";
import { AdminProductsService } from "./admin-products.service";
import { AuthModule } from "../auth/auth.module";
import { AdminInventoryController } from "./admin-inventory.controller";
import { AdminPromosController } from "./admin-promos.controller";
import { AdminB2BController } from "./admin-b2b.controller";
import { AdminOrdersController } from "./admin-orders.controller";
import { AdminCatalogController } from "./admin-catalog.controller";
import { AdminOperationsService } from "./admin-operations.service";
import { PaymentsModule } from "../payments/payments.module";
import { B2BModule } from "../b2b/b2b.module";
import { AnalyticsModule } from "../analytics/analytics.module";
import { NotificationsModule } from "../notifications/notifications.module";
import { AdminGrowthController } from "./admin-growth.controller";

@Module({
  imports: [AuthModule, PaymentsModule, B2BModule, AnalyticsModule, NotificationsModule],
  controllers: [
    AdminProductsController,
    AdminInventoryController,
    AdminPromosController,
    AdminB2BController,
    AdminOrdersController,
    AdminCatalogController,
    AdminGrowthController,
  ],
  providers: [AdminProductsService, AdminOperationsService],
})
export class AdminModule {}
