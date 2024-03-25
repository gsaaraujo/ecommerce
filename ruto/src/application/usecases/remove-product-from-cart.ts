import { Failure } from "@shared/helpers/failure";
import { Either, Left, Right } from "@shared/helpers/either";

import { Cart } from "@domain/models/cart/cart";
import { UUID } from "@shared/domain/models/uuid";
import { CartRepository } from "@domain/models/cart/cart-repository";
import { CustomerGateway } from "@application/gateways/customer-gateway";

type Input = {
  customerId: string;
  productId: string;
};

type Output = void;

export class RemoveProductFromCart {
  private readonly cartRepository: CartRepository;
  private readonly customerGateway: CustomerGateway;

  public constructor(cartRepository: CartRepository, customerGateway: CustomerGateway) {
    this.cartRepository = cartRepository;
    this.customerGateway = customerGateway;
  }

  async execute(input: Input): Promise<Either<Failure, Output>> {
    const customerExists = await this.customerGateway.exists(input.customerId);

    if (!customerExists) {
      const failure = new Failure("CUSTOMER_NOT_FOUND");
      return Left.create(failure);
    }

    const cart: Cart | null = await this.cartRepository.findOneByCustomerId(input.customerId);

    if (cart === null) {
      const failure = new Failure("CART_NOT_FOUND");
      return Left.create(failure);
    }

    const productId = UUID.create({ value: input.productId });

    if (productId.isLeft()) {
      const failure = new Failure("INVALID_UUID");
      return Left.create(failure);
    }

    const removeOrFail = cart.removeItem(productId.getValue());

    if (removeOrFail.isLeft()) {
      const failure = removeOrFail.getValue();
      return Left.create(failure);
    }

    await this.cartRepository.update(cart);
    return Right.create(undefined);
  }
}
