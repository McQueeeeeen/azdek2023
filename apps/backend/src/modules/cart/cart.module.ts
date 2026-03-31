import { Module } from "@nestjs/common";
import { CartController } from "./cart.controller";
import { CartService } from "./cart.service";
import { CART_REPOSITORY } from "../../application/cart/repositories/cart.repository";
import { CartPrismaRepository } from "../../infrastructure/database/prisma/repositories/cart-prisma.repository";
import { AnalyticsModule } from "../analytics/analytics.module";

@Module({
  imports: [AnalyticsModule],
  controllers: [CartController],
  providers: [
    CartService,
    {
      provide: CART_REPOSITORY,
      useClass: CartPrismaRepository,
    },
  ],
  exports: [CartService],
})
export class CartModule {}
