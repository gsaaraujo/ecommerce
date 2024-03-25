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
    const MINIMUM_QUANTITY = 1;
    if (props.quantity.getValue() < MINIMUM_QUANTITY) {
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
    const sum = this.props.quantity.getValue() + quantity.getValue();
    const quantityOrFailure = Quantity.create({ value: sum });

    if (quantityOrFailure.isLeft()) {
      return Left.create(quantityOrFailure.getValue());
    }

    this.props.quantity = quantityOrFailure.getValue();
    return Right.create(undefined);
  }

  public decreaseQuantity(quantity: Quantity): Either<Failure, void> {
    const difference = this.props.quantity.getValue() - quantity.getValue();

    const MINIMUM_QUANTITY = 1;
    if (difference < MINIMUM_QUANTITY) {
      const failure = new Failure("CART_ITEM_QUANTITY_CANNOT_BE_LESS_THAN_ONE");
      return Left.create(failure);
    }

    const quantityOrFailure = Quantity.create({ value: difference });

    if (quantityOrFailure.isLeft()) {
      return Left.create(quantityOrFailure.getValue());
    }

    this.props.quantity = quantityOrFailure.getValue();
    return Right.create(undefined);
  }

  public getTotalPrice(): Either<Failure, Money> {
    return Money.create({ value: this.props.unitPrice.getValue() * this.props.quantity.getValue() });
  }

  public getProductId(): UUID {
    return this.props.productId;
  }

  public getUnitPrice(): Money {
    return this.props.unitPrice;
  }

  public getQuantity(): Quantity {
    return this.props.quantity;
  }
}
