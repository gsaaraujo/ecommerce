import { Entity } from "@shared/helpers/entity";
import { Failure } from "@shared/helpers/failure";
import { UUID } from "@shared/domain/models/uuid";
import { Either, Left, Right } from "@shared/helpers/either";

import { Money } from "@domain/models/money";
import { Quantity } from "@domain/models/quantity";

type CartItemProps = {
  productId: UUID;
  unitPrice: Money;
  quantity: Quantity;
};

export class CartItem extends Entity<CartItemProps> {
  public static create(props: CartItemProps): Either<Failure, CartItem> {
    if (props.quantity.value < 1) {
      const failure = new Failure("CART_ITEM_QUANTITY_CANNOT_BE_LESS_THAN_ONE");
      return Left.create(failure);
    }

    const cartItem = new CartItem(props);
    return Right.create(cartItem);
  }

  public static reconstitute(id: UUID, props: CartItemProps): CartItem {
    return new CartItem(props, id);
  }

  public increaseQuantity(quantity: Quantity): Either<Failure, void> {
    const sum = this.props.quantity.value + quantity.value;

    const quantityOrFailure = Quantity.create({ value: sum });

    if (quantityOrFailure.isLeft()) {
      return Left.create(quantityOrFailure.value);
    }

    this.props.quantity = quantityOrFailure.value;
    return Right.create(undefined);
  }

  public decreaseQuantity(quantity: Quantity): Either<Failure, void> {
    const difference = this.props.quantity.value - quantity.value;

    if (difference < 1) {
      const failure = new Failure("CART_ITEM_QUANTITY_CANNOT_BE_LESS_THAN_ONE");
      return Left.create(failure);
    }

    const quantityOrFailure = Quantity.create({ value: difference });

    if (quantityOrFailure.isLeft()) {
      return Left.create(quantityOrFailure.value);
    }

    this.props.quantity = quantityOrFailure.value;
    return Right.create(undefined);
  }

  public totalPrice(): Either<Failure, Money> {
    return Money.create({ value: this.props.unitPrice.value * this.props.quantity.value });
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
