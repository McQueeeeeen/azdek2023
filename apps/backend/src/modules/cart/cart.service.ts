import { Inject, Injectable, NotFoundException } from "@nestjs/common";
import { AddCartItemDto } from "./dto/add-cart-item.dto";
import { CART_REPOSITORY, CartRepository } from "../../application/cart/repositories/cart.repository";
import { AnalyticsService } from "../analytics/analytics.service";
import { AnalyticsEventType } from "@prisma/client";

@Injectable()
export class CartService {
  constructor(
    @Inject(CART_REPOSITORY) private readonly repository: CartRepository,
    private readonly analyticsService: AnalyticsService,
  ) {}

  async getCart(cartId: string) {
    const cart = await this.repository.findCartById(cartId);
    if (!cart) {
      throw new NotFoundException("Cart not found");
    }
    return cart;
  }

  async addItem(dto: AddCartItemDto) {
    const variant = await this.repository.findActiveVariantById(dto.productVariantId);
    if (!variant) {
      throw new NotFoundException("Product variant not found");
    }

    let cartId = dto.cartId;
    if (!cartId) {
      const createdCart = await this.repository.createCart();
      cartId = createdCart.id;
    }

    await this.repository.upsertCartItem({
      cartId,
      productVariantId: dto.productVariantId,
      quantity: dto.quantity,
      unitPrice: Number(variant.price),
    });

    await this.recalculate(cartId);
    await this.analyticsService.trackInternalEvent({
      eventType: AnalyticsEventType.add_to_cart,
      cartId,
      productId: variant.product.id,
      metadata: {
        productVariantId: dto.productVariantId,
        quantity: dto.quantity,
      },
    });
    return this.getCart(cartId);
  }

  async updateItem(cartId: string, itemId: string, quantity: number) {
    const item = await this.repository.findCartItemById(itemId);
    if (!item || item.cartId !== cartId) {
      throw new NotFoundException("Cart item not found");
    }

    await this.repository.updateCartItem({
      itemId,
      quantity,
      lineTotal: Number(item.unitPrice) * quantity,
    });

    await this.recalculate(cartId);
    return this.getCart(cartId);
  }

  async removeItem(cartId: string, itemId: string) {
    const item = await this.repository.findCartItemById(itemId);
    if (!item || item.cartId !== cartId) {
      throw new NotFoundException("Cart item not found");
    }
    await this.repository.deleteCartItem(itemId);
    await this.recalculate(cartId);
    return this.getCart(cartId);
  }

  private async recalculate(cartId: string): Promise<void> {
    const items = await this.repository.findCartItems(cartId);
    const subtotal = items.reduce((sum, item) => sum + Number(item.lineTotal), 0);
    const discount = 0;
    const delivery = subtotal >= 15000 ? 0 : 2000;
    const total = subtotal - discount + delivery;

    await this.repository.updateCartTotals({
      cartId,
      subtotalAmount: subtotal,
      discountAmount: discount,
      deliveryAmount: delivery,
      totalAmount: total,
    });
  }
}
