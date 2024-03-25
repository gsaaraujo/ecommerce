import { beforeEach, describe, expect, it } from "vitest";

import { Failure } from "@shared/helpers/failure";

import { RemoveProductFromCart } from "@application/usecases/remove-product-from-cart";

import { FakeCartRepository } from "@infra/repositories/cart/fake-cart-repository";
import { FakeCustomerGateway } from "@infra/gateways/customer/fake-customer-gateway";

describe("remove-product-from-cart", () => {
  let removeProductFromCart: RemoveProductFromCart;
  let fakeCartRepository: FakeCartRepository;
  let fakeCustomerGateway: FakeCustomerGateway;

  beforeEach(() => {
    fakeCartRepository = new FakeCartRepository();
    fakeCustomerGateway = new FakeCustomerGateway();
    removeProductFromCart = new RemoveProductFromCart(fakeCartRepository, fakeCustomerGateway);
  });

  it("should succeed and remove a product from cart", async () => {
    fakeCustomerGateway.fakeCustomers.push({
      id: "d6d3d634-e6e8-41ae-89a7-2e62781be02b",
    });
    fakeCartRepository.fakeCarts.push({
      id: "f7092bde-84b2-4ae8-8f84-0554ef55faee",
      customerId: "d6d3d634-e6e8-41ae-89a7-2e62781be02b",
      items: [
        {
          id: "0408e650-834a-41cf-8515-5bb6d7681633",
          productId: "e934495d-68bd-4d69-917b-04b14bd95965",
          quantity: 2,
        },
      ],
    });

    const sut = await removeProductFromCart.execute({
      customerId: "d6d3d634-e6e8-41ae-89a7-2e62781be02b",
      productId: "e934495d-68bd-4d69-917b-04b14bd95965",
    });

    expect(sut.isRight()).toBeTruthy();
    expect(fakeCartRepository.fakeCarts[0].items).toHaveLength(0);
  });

  it("should fail if customer is not found", async () => {
    fakeCustomerGateway.fakeCustomers = [];
    const output = new Failure("CUSTOMER_NOT_FOUND");

    const sut = await removeProductFromCart.execute({
      customerId: "d6d3d634-e6e8-41ae-89a7-2e62781be02b",
      productId: "e934495d-68bd-4d69-917b-04b14bd95965",
    });

    expect(sut.isLeft()).toBeTruthy();
    expect(sut.getValue()).toStrictEqual(output);
  });

  it("should fail if cart is not found", async () => {
    fakeCustomerGateway.fakeCustomers.push({
      id: "d6d3d634-e6e8-41ae-89a7-2e62781be02b",
    });
    const output = new Failure("CART_NOT_FOUND");

    const sut = await removeProductFromCart.execute({
      customerId: "d6d3d634-e6e8-41ae-89a7-2e62781be02b",
      productId: "e934495d-68bd-4d69-917b-04b14bd95965",
    });

    expect(sut.isLeft()).toBeTruthy();
    expect(sut.getValue()).toStrictEqual(output);
  });

  it("should fail if cart is empty", async () => {
    fakeCustomerGateway.fakeCustomers.push({
      id: "d6d3d634-e6e8-41ae-89a7-2e62781be02b",
    });
    fakeCartRepository.fakeCarts.push({
      id: "f7092bde-84b2-4ae8-8f84-0554ef55faee",
      customerId: "d6d3d634-e6e8-41ae-89a7-2e62781be02b",
      items: [],
    });

    const output = new Failure("CART_IS_EMPTY");

    const sut = await removeProductFromCart.execute({
      customerId: "d6d3d634-e6e8-41ae-89a7-2e62781be02b",
      productId: "e934495d-68bd-4d69-917b-04b14bd95965",
    });

    expect(sut.isLeft()).toBeTruthy();
    expect(sut.getValue()).toStrictEqual(output);
  });

  it("should fail if cart does not have the product", async () => {
    fakeCustomerGateway.fakeCustomers.push({
      id: "d6d3d634-e6e8-41ae-89a7-2e62781be02b",
    });
    fakeCartRepository.fakeCarts.push({
      id: "f7092bde-84b2-4ae8-8f84-0554ef55faee",
      customerId: "d6d3d634-e6e8-41ae-89a7-2e62781be02b",
      items: [
        {
          id: "0408e650-834a-41cf-8515-5bb6d7681633",
          productId: "e934495d-68bd-4d69-917b-04b14bd95965",
          quantity: 2,
        },
      ],
    });

    const output = new Failure("PRODUCT_NOT_FOUND_IN_CART");

    const sut = await removeProductFromCart.execute({
      customerId: "d6d3d634-e6e8-41ae-89a7-2e62781be02b",
      productId: "60c0af27-a407-4bf5-afaa-43532622e7d2",
    });

    expect(sut.isLeft()).toBeTruthy();
    expect(sut.getValue()).toStrictEqual(output);
  });
});
