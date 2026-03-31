import { Module } from "@nestjs/common";
import { OrdersController } from "./orders.controller";
import { OrdersService } from "./orders.service";
import { ORDERS_REPOSITORY } from "../../application/orders/repositories/orders.repository";
import { OrdersPrismaRepository } from "../../infrastructure/database/prisma/repositories/orders-prisma.repository";

@Module({
  controllers: [OrdersController],
  providers: [
    OrdersService,
    {
      provide: ORDERS_REPOSITORY,
      useClass: OrdersPrismaRepository,
    },
  ],
  exports: [OrdersService],
})
export class OrdersModule {}
