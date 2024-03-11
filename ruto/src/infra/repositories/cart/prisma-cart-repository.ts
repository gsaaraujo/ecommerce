import { PrismaClient } from "@prisma/client";

import { UUID } from "@shared/domain/models/uuid";

import { Money } from "@domain/models/money";
import { Cart } from "@domain/models/cart/cart";
import { Quantity } from "@domain/models/quantity";
import { CartItem } from "@domain/models/cart/cart-item";
import { CartRepository } from "@domain/models/cart/cart-repository";

export class PrismaCartRepository implements CartRepository {
  private readonly prismaClient: PrismaClient;

  public constructor(prismaClient: PrismaClient) {
    this.prismaClient = prismaClient;
  }

  async create(cart: Cart): Promise<void> {
    await this.prismaClient.cart.create({
      data: {
        id: cart.id.value,
        customerId: cart.customerId.value,
        cartItems: {
          createMany: {
            data: cart.items.map((item) => ({
              id: item.id.value,
              price: item.unitPrice.value,
              productId: item.productId.value,
              quantity: item.quantity.value,
            })),
          },
        },
      },
    });
  }

  async findOneByCustomerId(customerId: string): Promise<Cart | null> {
    const cartOrm = await this.prismaClient.cart.findUnique({
      where: { customerId },
      include: { cartItems: true },
    });

    if (!cartOrm) return null;

    return Cart.reconstitute(UUID.reconstitute({ value: cartOrm.id }), {
      customerId: UUID.reconstitute({ value: cartOrm.customerId }),
      items: cartOrm.cartItems.map<CartItem>((cartItem) =>
        CartItem.reconstitute(UUID.reconstitute({ value: cartItem.id }), {
          productId: UUID.reconstitute({ value: cartItem.productId }),
          quantity: Quantity.reconstitute({ value: cartItem.quantity }),
          unitPrice: Money.reconstitute({ value: cartItem.quantity }),
        }),
      ),
    });
  }

  async update(cart: Cart): Promise<void> {
    await this.prismaClient.cart.update({
      where: { id: cart.id.value },
      data: {
        id: cart.id.value,
        customerId: cart.customerId.value,
        cartItems: {
          createMany: {
            data: cart.items.map((item) => ({
              id: item.id.value,
              cartId: cart.id.value,
              price: item.unitPrice.value,
              productId: item.productId.value,
              quantity: item.quantity.value,
            })),
          },
        },
      },
    });
  }
}
