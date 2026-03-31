import { Body, Controller, Delete, Get, Param, Patch, Post } from "@nestjs/common";
import { CartService } from "./cart.service";
import { AddCartItemDto } from "./dto/add-cart-item.dto";
import { UpdateCartItemDto } from "./dto/update-cart-item.dto";

interface CartResponse {
  id: string;
  currency: string;
  subtotalAmount: number;
  discountAmount: number;
  deliveryAmount: number;
  totalAmount: number;
  items: Array<{
    id: string;
    quantity: number;
    unitPrice: number;
    lineTotal: number;
    productVariant: {
      id: string;
      sku: string;
      title: string;
      product: {
        id: string;
        slug: string;
        name: string;
      };
    };
  }>;
}

@Controller("cart")
export class CartController {
  constructor(private readonly cartService: CartService) {}

  @Get(":cartId")
  async getCart(@Param("cartId") cartId: string): Promise<CartResponse> {
    const cart = await this.cartService.getCart(cartId);
    return this.mapCart(cart);
  }

  @Post("items")
  async addItem(@Body() dto: AddCartItemDto): Promise<CartResponse> {
    const cart = await this.cartService.addItem(dto);
    return this.mapCart(cart);
  }

  @Patch("items/:cartId/:itemId")
  updateItem(
    @Param("cartId") cartId: string,
    @Param("itemId") itemId: string,
    @Body() dto: UpdateCartItemDto,
  ): Promise<CartResponse> {
    return this.cartService.updateItem(cartId, itemId, dto.quantity).then((cart) => this.mapCart(cart));
  }

  @Delete("items/:cartId/:itemId")
  removeItem(
    @Param("cartId") cartId: string,
    @Param("itemId") itemId: string,
  ): Promise<CartResponse> {
    return this.cartService.removeItem(cartId, itemId).then((cart) => this.mapCart(cart));
  }

  private mapCart(cart: Awaited<ReturnType<CartService["getCart"]>>): CartResponse {
    return {
      id: cart.id,
      currency: cart.currency,
      subtotalAmount: Number(cart.subtotalAmount),
      discountAmount: Number(cart.discountAmount),
      deliveryAmount: Number(cart.deliveryAmount),
      totalAmount: Number(cart.totalAmount),
      items: cart.items.map((item) => ({
        id: item.id,
        quantity: item.quantity,
        unitPrice: Number(item.unitPrice),
        lineTotal: Number(item.lineTotal),
        productVariant: {
          id: item.productVariant.id,
          sku: item.productVariant.sku,
          title: item.productVariant.title,
          product: {
            id: item.productVariant.product.id,
            slug: item.productVariant.product.slug,
            name: item.productVariant.product.name,
          },
        },
      })),
    };
  }
}
