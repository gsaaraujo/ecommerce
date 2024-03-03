import { Entity } from "@shared/helpers/entity";
import { Failure } from "@shared/helpers/failure";
import { UUID } from "@shared/domain/models/uuid";
import { Either, Right } from "@shared/helpers/either";

import { Money } from "@domain/models/money";
import { Quantity } from "@domain/models/quantity";

type CartItemProps = {
  productId: UUID;
  unitPrice: Money;
  quantity: Quantity;
};

export class CartItem extends Entity<CartItemProps> {
  public static create(props: CartItemProps): Either<Failure, CartItem> {
    const cartItem = new CartItem(props);
    return Right.create(cartItem);
  }

  public static reconstitute(id: UUID, props: CartItemProps): CartItem {
    return new CartItem(props, id);
  }

  public increaseQuantity(quantity: Quantity): void {
    this.props.quantity = quantity;
  }

  get productId(): UUID {
    return this.props.productId;
  }

  get unitPrice(): Money {
    return this.props.unitPrice;
  }

  get quantity(): Quantity {
    return this.props.quantity;
  }
}
