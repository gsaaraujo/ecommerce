import { Entity } from "@shared/helpers/entity";
import { UUID } from "@shared/domain/models/uuid";
import { Failure } from "@shared/helpers/failure";
import { Either, Left, Right } from "@shared/helpers/either";

import { Money } from "@domain/models/money";
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

  public static reconstitute(props: CartProps): Cart {
    return new Cart(props);
  }

  public addItem(productId: string, unitPrice: number, quantity: number): Either<Failure, void> {
    const newProductId = UUID.create({ value: productId });
    if (newProductId.isLeft()) return Left.create(newProductId.value);

    const itemFound = this.props.items.find((item) => item.productId.isEquals(item.id));

    if (itemFound) {
      itemFound.increaseQuantity(quantity);
      return Right.create(undefined);
    }

    const newUnitPrice = Money.create({ value: unitPrice });

    if (newUnitPrice.isLeft()) return Left.create(newUnitPrice.value);

    const cartItem = CartItem.create({
      productId: newProductId.value,
      unitPrice: newUnitPrice.value,
      quantity,
    });

    if (cartItem.isLeft()) return Left.create(cartItem.value);

    this.props.items.push(cartItem.value);
    return Right.create(undefined);
  }

  public removeItem(itemId: UUID): void {
    const items: CartItem[] = this.props.items.filter((item) => item.id.value !== itemId.value);
    this.props.items = items;
  }

  public totalQuantity(): number {
    return this.props.items.reduce((acc, item) => acc + item.quantity, 0);
  }

  public totalPrice(): number {
    return this.props.items.reduce((acc, item) => acc + item.unitPrice.value * item.quantity, 0);
  }

  public get customerId(): UUID {
    return this.props.customerId;
  }

  public get items(): CartItem[] {
    return this.props.items;
  }
}
