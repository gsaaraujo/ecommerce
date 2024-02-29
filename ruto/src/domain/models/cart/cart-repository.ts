import { Cart } from "@domain/models/cart/cart";

export interface CartRepository {
  create(cart: Cart): Promise<void>;
  findOneByCustomerId(customerId: string): Promise<Cart | null>;
  update(cart: Cart): Promise<void>;
}
