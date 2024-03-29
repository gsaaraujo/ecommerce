import { UUID } from "@shared/domain/models/uuid";

import { Money } from "@domain/models/money";
import { Cart } from "@domain/models/cart/cart";
import { Quantity } from "@domain/models/quantity";
import { CartItem } from "@domain/models/cart/cart-item";
import { CartRepository } from "@domain/models/cart/cart-repository";

export type FakeCartDTO = {
  id: string;
  customerId: string;
  items: FakeCartItemDTO[];
};

export type FakeCartItemDTO = {
  id: string;
  productId: string;
  quantity: number;
};

export class FakeCartRepository implements CartRepository {
  public fakeCarts: FakeCartDTO[] = [];

  async create(cart: Cart): Promise<void> {
    this.fakeCarts.push({
      id: cart.getId().getValue(),
      customerId: cart.getCustomerId().getValue(),
      items: cart.getItems().map((item) => ({
        id: item.getId().getValue(),
        productId: item.getProductId().getValue(),
        quantity: item.getQuantity().getValue(),
      })),
    });
  }

  async findOneByCustomerId(customerId: string): Promise<Cart | null> {
    const cart: FakeCartDTO | undefined = this.fakeCarts.find((cart) => cart.customerId === customerId);

    if (!cart) return null;

    return Cart.reconstitute(UUID.reconstitute({ value: cart.id }), {
      customerId: UUID.reconstitute({ value: cart.customerId }),
      items: cart.items.map((item) =>
        CartItem.reconstitute(UUID.reconstitute({ value: item.id }), {
          productId: UUID.reconstitute({ value: item.productId }),
          unitPrice: Money.reconstitute({ value: 25.5 }),
          quantity: Quantity.reconstitute({ value: item.quantity }),
        }),
      ),
    });
  }

  async update(cart: Cart): Promise<void> {
    const index: number = this.fakeCarts.findIndex(
      (fakeCart) => fakeCart.customerId === cart.getCustomerId().getValue(),
    );

    this.fakeCarts[index] = {
      id: cart.getId().getValue(),
      customerId: cart.getCustomerId().getValue(),
      items: cart.getItems().map((item) => ({
        id: item.getId().getValue(),
        productId: item.getProductId().getValue(),
        quantity: item.getQuantity().getValue(),
      })),
    };
  }
}
