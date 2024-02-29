import { Failure } from "@shared/helpers/failure";
import { UUID } from "@shared/domain/models/uuid";
import { Either, Left, Right } from "@shared/helpers/either";

import { Cart } from "@domain/models/cart/cart";
import { CartRepository } from "@domain/models/cart/cart-repository";

type Input = {
  customerId: string;
  productId: string;
  unitPrice: number;
  quantity: number;
};

type Output = void;

export class AddProductToCart {
  private readonly cartRepository: CartRepository;

  public constructor(cartRepository: CartRepository) {
    this.cartRepository = cartRepository;
  }

  async execute(input: Input): Promise<Either<Failure, Output>> {
    const customerId: Either<Failure, UUID> = UUID.create({ value: input.customerId });

    if (customerId.isLeft()) {
      return Left.create(customerId.value);
    }

    const cart: Cart | null = await this.cartRepository.findOneByCustomerId(customerId.value.value);

    if (!cart) {
      const newCart: Either<Failure, Cart> = Cart.create({ customerId: customerId.value });

      if (newCart.isLeft()) {
        return Left.create(newCart.value);
      }

      newCart.value.addItem(input.productId, input.unitPrice, input.quantity);
      await this.cartRepository.create(newCart.value);
      return Right.create(undefined);
    }

    cart.addItem(input.productId, input.unitPrice, input.quantity);
    await this.cartRepository.update(cart);
    return Right.create(undefined);
  }
}
