import { Prisma } from "@prisma/client";

export type CartRecord = Prisma.CartGetPayload<{
  include: {
    items: {
      include: {
        productVariant: {
          include: {
            product: true;
          };
        };
      };
    };
  };
}>;

export type CartItemRecord = Prisma.CartItemGetPayload<{}>;

export type VariantRecord = Prisma.ProductVariantGetPayload<{
  include: { product: true };
}>;

export interface CartRepository {
  findCartById(cartId: string): Promise<CartRecord | null>;
  findActiveVariantById(variantId: string): Promise<VariantRecord | null>;
  createCart(): Promise<{ id: string }>;
  upsertCartItem(input: { cartId: string; productVariantId: string; quantity: number; unitPrice: number }): Promise<void>;
  findCartItemById(itemId: string): Promise<CartItemRecord | null>;
  updateCartItem(input: { itemId: string; quantity: number; lineTotal: number }): Promise<void>;
  deleteCartItem(itemId: string): Promise<void>;
  findCartItems(cartId: string): Promise<CartItemRecord[]>;
  updateCartTotals(input: {
    cartId: string;
    subtotalAmount: number;
    discountAmount: number;
    deliveryAmount: number;
    totalAmount: number;
  }): Promise<void>;
}

export const CART_REPOSITORY = Symbol("CART_REPOSITORY");

