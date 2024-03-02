import { beforeEach, describe, expect, it } from "vitest";

import { AddProductToCart } from "@application/usecases/add-product-to-cart";

import { FakeCartRepository } from "@infra/repositories/cart/fake-cart-repository";
import { FakeCustomerGateway } from "@infra/gateways/customer/fake-customer-gateway";
import { Failure } from "@shared/helpers/failure";

describe("add-product-to-cart", () => {
  let addProductToCart: AddProductToCart;
  let fakeCartRepository: FakeCartRepository;
  let fakeCustomerGateway: FakeCustomerGateway;

  beforeEach(() => {
    fakeCartRepository = new FakeCartRepository();
    fakeCustomerGateway = new FakeCustomerGateway();
    addProductToCart = new AddProductToCart(fakeCartRepository, fakeCustomerGateway);
  });

  it("should add a product to the cart", async () => {
    fakeCartRepository.fakeCarts = [];
    fakeCustomerGateway.fakeCustomers.push({
      id: "fa22a39b-14e3-49d9-8afb-431838a157e1",
    });

    const sut = await addProductToCart.execute({
      productId: "bcb3c61e-ecc5-4c4b-8dca-2a71c6cbcccb",
      customerId: "fa22a39b-14e3-49d9-8afb-431838a157e1",
      quantity: 1,
      unitPrice: 25.5,
    });

    expect(sut.isRight()).toBeTruthy();
    expect(fakeCartRepository.fakeCarts).toHaveLength(1);
    expect(fakeCartRepository.fakeCarts[0].items).toHaveLength(1);
  });

  it("should add a product to the cart multiple times", async () => {
    fakeCartRepository.fakeCarts = [];
    fakeCustomerGateway.fakeCustomers.push({
      id: "fa22a39b-14e3-49d9-8afb-431838a157e1",
    });

    const sut1 = await addProductToCart.execute({
      productId: "bcb3c61e-ecc5-4c4b-8dca-2a71c6cbcccb",
      customerId: "fa22a39b-14e3-49d9-8afb-431838a157e1",
      quantity: 1,
      unitPrice: 25.5,
    });

    const sut2 = await addProductToCart.execute({
      productId: "98de99d5-617d-484c-bc8d-5aebe5b6d0ec",
      customerId: "fa22a39b-14e3-49d9-8afb-431838a157e1",
      quantity: 1,
      unitPrice: 25.5,
    });

    const sut3 = await addProductToCart.execute({
      productId: "b6f31585-3a7f-417f-9daf-fc8999675a2a",
      customerId: "fa22a39b-14e3-49d9-8afb-431838a157e1",
      quantity: 1,
      unitPrice: 25.5,
    });

    expect(sut1.isRight()).toBeTruthy();
    expect(sut2.isRight()).toBeTruthy();
    expect(sut3.isRight()).toBeTruthy();
    expect(fakeCartRepository.fakeCarts).toHaveLength(1);
    expect(fakeCartRepository.fakeCarts[0].items).toHaveLength(3);
  });

  it("should fail if customer is not found", async () => {
    fakeCustomerGateway.fakeCustomers = [];
    const output = new Failure("CUSTOMER_NOT_FOUND");

    const sut = await addProductToCart.execute({
      productId: "bcb3c61e-ecc5-4c4b-8dca-2a71c6cbcccb",
      customerId: "fa22a39b-14e3-49d9-8afb-431838a157e1",
      quantity: 1,
      unitPrice: 25.5,
    });

    expect(sut.isLeft()).toBeTruthy();
    expect(sut.value).toStrictEqual(output);
  });
});
