import { Injectable } from "@nestjs/common";
import { CartRepository } from "../../../../application/cart/repositories/cart.repository";
import { PrismaService } from "../../../../shared/infrastructure/prisma.service";

@Injectable()
export class CartPrismaRepository implements CartRepository {
  constructor(private readonly prisma: PrismaService) {}

  findCartById(cartId: string) {
    return this.prisma.cart.findUnique({
      where: { id: cartId },
      include: {
        items: {
          include: {
            productVariant: {
              include: {
                product: true,
              },
            },
          },
        },
      },
    });
  }

  findActiveVariantById(variantId: string) {
    return this.prisma.productVariant.findFirst({
      where: { id: variantId, isActive: true, product: { isActive: true } },
      include: { product: true },
    });
  }

  createCart() {
    return this.prisma.cart.create({ data: {} });
  }

  async upsertCartItem(input: { cartId: string; productVariantId: string; quantity: number; unitPrice: number }) {
    await this.prisma.cartItem.upsert({
      where: {
        cartId_productVariantId: {
          cartId: input.cartId,
          productVariantId: input.productVariantId,
        },
      },
      create: {
        cartId: input.cartId,
        productVariantId: input.productVariantId,
        quantity: input.quantity,
        unitPrice: input.unitPrice,
        lineTotal: input.unitPrice * input.quantity,
      },
      update: {
        quantity: { increment: input.quantity },
        lineTotal: { increment: input.unitPrice * input.quantity },
      },
    });
  }

  findCartItemById(itemId: string) {
    return this.prisma.cartItem.findUnique({ where: { id: itemId } });
  }

  async updateCartItem(input: { itemId: string; quantity: number; lineTotal: number }) {
    await this.prisma.cartItem.update({
      where: { id: input.itemId },
      data: {
        quantity: input.quantity,
        lineTotal: input.lineTotal,
      },
    });
  }

  async deleteCartItem(itemId: string) {
    await this.prisma.cartItem.delete({ where: { id: itemId } });
  }

  findCartItems(cartId: string) {
    return this.prisma.cartItem.findMany({ where: { cartId } });
  }

  async updateCartTotals(input: {
    cartId: string;
    subtotalAmount: number;
    discountAmount: number;
    deliveryAmount: number;
    totalAmount: number;
  }) {
    await this.prisma.cart.update({
      where: { id: input.cartId },
      data: {
        subtotalAmount: input.subtotalAmount,
        discountAmount: input.discountAmount,
        deliveryAmount: input.deliveryAmount,
        totalAmount: input.totalAmount,
      },
    });
  }
}
