import { UUID } from "@shared/domain/models/uuid";
import { Failure } from "@shared/helpers/failure";
import { Either, Left, Right } from "@shared/helpers/either";

import { Money } from "@domain/models/money";
import { Cart } from "@domain/models/cart/cart";
import { Quantity } from "@domain/models/quantity";
import { CartRepository } from "@domain/models/cart/cart-repository";

import { CustomerGateway } from "@application/gateways/customer-gateway";

type Input = {
  customerId: string;
  productId: string;
  unitPrice: number;
  quantity: number;
};

type Output = void;

export class AddProductToCart {
  private readonly cartRepository: CartRepository;
  private readonly customerGateway: CustomerGateway;

  public constructor(cartRepository: CartRepository, customerGateway: CustomerGateway) {
    this.cartRepository = cartRepository;
    this.customerGateway = customerGateway;
  }

  public async execute(input: Input): Promise<Either<Failure, Output>> {
    const customerId = UUID.create({ value: input.customerId });
    const productId = UUID.create({ value: input.productId });
    const unitPrice = Money.create({ value: input.unitPrice });
    const quantity = Quantity.create({ value: input.quantity });

    if (customerId.isLeft()) return Left.create(customerId.getValue());
    if (productId.isLeft()) return Left.create(productId.getValue());
    if (unitPrice.isLeft()) return Left.create(unitPrice.getValue());
    if (quantity.isLeft()) return Left.create(quantity.getValue());

    const customerExists = await this.customerGateway.exists(customerId.getValue().getValue());

    if (!customerExists) {
      const failure = new Failure("CUSTOMER_NOT_FOUND");
      return Left.create(failure);
    }

    const cart: Cart | null = await this.cartRepository.findOneByCustomerId(customerId.getValue().getValue());

    if (!cart) {
      const newCart: Either<Failure, Cart> = Cart.create({ customerId: customerId.getValue() });

      if (newCart.isLeft()) {
        return Left.create(newCart.getValue());
      }

      newCart.getValue().addItem(productId.getValue(), unitPrice.getValue(), quantity.getValue());
      await this.cartRepository.create(newCart.getValue());
      return Right.create(undefined);
    }

    cart.addItem(productId.getValue(), unitPrice.getValue(), quantity.getValue());
    await this.cartRepository.update(cart);
    return Right.create(undefined);
  }
}
