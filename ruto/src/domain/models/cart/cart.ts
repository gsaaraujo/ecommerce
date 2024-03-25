import { Entity } from "@shared/helpers/entity";
import { UUID } from "@shared/domain/models/uuid";
import { Failure } from "@shared/helpers/failure";
import { Either, Left, Right } from "@shared/helpers/either";

import { Money } from "@domain/models/money";
import { Quantity } from "@domain/models/quantity";
import { CartItem } from "@domain/models/cart/cart-item";

type CartProps = {
  customerId: UUID;
  items: CartItem[];
};

export class Cart extends Entity<CartProps> {
  public static create(props: Omit<CartProps, "items">): Either<Failure, Cart> {
    const cart = new Cart({ ...props, items: [] });
    return Right.create(cart);
  }

  public static reconstitute(id: UUID, props: CartProps): Cart {
    return new Cart(props, id);
  }

  public addItem(productId: UUID, unitPrice: Money, quantity: Quantity): Either<Failure, void> {
    const itemFound = this.props.items.find((item) => item.getProductId().isEquals(productId));

    if (itemFound) {
      itemFound.increaseQuantity(quantity);
      return Right.create(undefined);
    }

    const cartItem = CartItem.create({ productId, unitPrice, quantity });
    if (cartItem.isLeft()) return Left.create(cartItem.getValue());

    this.props.items.push(cartItem.getValue());
    return Right.create(undefined);
  }

  public removeItem(productId: UUID): Either<Failure, void> {
    if (this.props.items.length === 0) {
      const failure = new Failure("CART_IS_EMPTY");
      return Left.create(failure);
    }

    const itemIndex = this.props.items.findIndex((item) => item.getProductId().isEquals(productId));

    if (itemIndex === -1) {
      const failure = new Failure("PRODUCT_NOT_FOUND_IN_CART");
      return Left.create(failure);
    }

    const items: CartItem[] = this.props.items.filter((item) => !item.getProductId().isEquals(productId));
    this.props.items = items;
    return Right.create(undefined);
  }

  public getTotalQuantity(): Either<Failure, Quantity> {
    const quantitySum = this.props.items.reduce((acc, item) => acc + item.getQuantity().getValue(), 0);
    const quantity = Quantity.create({ value: quantitySum });
    if (quantity.isLeft()) return Left.create(quantity.getValue());
    return Right.create(quantity.getValue());
  }

  public getTotalPrice(): Either<Failure, Money> {
    let sum = 0;

    for (const item of this.props.items) {
      const totalItemPrice = item.getTotalPrice();
      if (totalItemPrice.isLeft()) return Left.create(totalItemPrice.getValue());
      sum += totalItemPrice.getValue().getValue();
    }

    const money = Money.create({ value: sum });
    if (money.isLeft()) return Left.create(money.getValue());
    return Right.create(money.getValue());
  }

  public getCustomerId(): UUID {
    return this.props.customerId;
  }

  public getItems(): CartItem[] {
    return this.props.items;
  }
}
