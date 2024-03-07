import { describe, expect, it } from "vitest";

import { UUID } from "@shared/domain/models/uuid";
import { Failure } from "@shared/helpers/failure";

import { Money } from "@domain/models/money";
import { Cart } from "@domain/models/cart/cart";
import { Quantity } from "@domain/models/quantity";

describe("cart", () => {
  it("should create and reconstitute cart", () => {
    const cart = Cart.reconstitute(UUID.reconstitute({ value: "6c2216a7-2d53-4650-88a5-b965a61afbfd" }), {
      customerId: UUID.reconstitute({ value: "752719ec-b74c-4db3-99db-dbb30301a2ef" }),
      items: [],
    });

    const sut = Cart.create({
      customerId: UUID.create({ value: "752719ec-b74c-4db3-99db-dbb30301a2ef" }).value as UUID,
    });

    expect((sut.value as Cart).customerId).toStrictEqual(cart.customerId);
    expect((sut.value as Cart).items).toStrictEqual(cart.items);
  });

  it("should add different products to the cart", () => {
    const cart = Cart.create({
      customerId: UUID.create({ value: "752719ec-b74c-4db3-99db-dbb30301a2ef" }).value as UUID,
    }).value as Cart;

    cart.addItem(
      UUID.create({ value: "fcacb9ed-a69d-4737-8d9f-0a3b5c210fa8" }).value as UUID,
      Money.create({ value: 24.99 }).value as Money,
      Quantity.create({ value: 8 }).value as Quantity,
    );
    cart.addItem(
      UUID.create({ value: "0c94905b-c4a6-4226-bfdb-2aa7d274ad42" }).value as UUID,
      Money.create({ value: 32.5 }).value as Money,
      Quantity.create({ value: 4 }).value as Quantity,
    );
    cart.addItem(
      UUID.create({ value: "c6ba359e-aca7-4214-abba-54dec70fcf75" }).value as UUID,
      Money.create({ value: 16.5 }).value as Money,
      Quantity.create({ value: 12 }).value as Quantity,
    );

    expect(cart.items).toHaveLength(3);
    expect((cart.totalPrice().value as Money).value).toBe(527.92);
    expect((cart.totalQuantity().value as Quantity).value).toBe(24);
  });

  it("should add the same product to the cart", () => {
    const cart = Cart.create({
      customerId: UUID.create({ value: "752719ec-b74c-4db3-99db-dbb30301a2ef" }).value as UUID,
    }).value as Cart;

    cart.addItem(
      UUID.create({ value: "fcacb9ed-a69d-4737-8d9f-0a3b5c210fa8" }).value as UUID,
      Money.create({ value: 24.99 }).value as Money,
      Quantity.create({ value: 8 }).value as Quantity,
    );
    cart.addItem(
      UUID.create({ value: "fcacb9ed-a69d-4737-8d9f-0a3b5c210fa8" }).value as UUID,
      Money.create({ value: 24.99 }).value as Money,
      Quantity.create({ value: 4 }).value as Quantity,
    );
    cart.addItem(
      UUID.create({ value: "fcacb9ed-a69d-4737-8d9f-0a3b5c210fa8" }).value as UUID,
      Money.create({ value: 24.99 }).value as Money,
      Quantity.create({ value: 12 }).value as Quantity,
    );

    expect(cart.items).toHaveLength(1);
    expect((cart.totalPrice().value as Money).value).toBe(599.76);
    expect((cart.totalQuantity().value as Quantity).value).toBe(24);
  });

  it("should add products to the cart", () => {
    const cart = Cart.create({
      customerId: UUID.create({ value: "752719ec-b74c-4db3-99db-dbb30301a2ef" }).value as UUID,
    }).value as Cart;

    cart.addItem(
      UUID.create({ value: "fcacb9ed-a69d-4737-8d9f-0a3b5c210fa8" }).value as UUID,
      Money.create({ value: 24.99 }).value as Money,
      Quantity.create({ value: 8 }).value as Quantity,
    );
    cart.addItem(
      UUID.create({ value: "4678937e-ab66-415f-8644-aa3b8ff7ed2f" }).value as UUID,
      Money.create({ value: 36.5 }).value as Money,
      Quantity.create({ value: 7 }).value as Quantity,
    );
    cart.addItem(
      UUID.create({ value: "fcacb9ed-a69d-4737-8d9f-0a3b5c210fa8" }).value as UUID,
      Money.create({ value: 24.99 }).value as Money,
      Quantity.create({ value: 12 }).value as Quantity,
    );
    cart.addItem(
      UUID.create({ value: "132a292a-32da-41bb-b92b-bf87642d07f0" }).value as UUID,
      Money.create({ value: 12 }).value as Money,
      Quantity.create({ value: 6 }).value as Quantity,
    );
    cart.addItem(
      UUID.create({ value: "fcacb9ed-a69d-4737-8d9f-0a3b5c210fa8" }).value as UUID,
      Money.create({ value: 24.99 }).value as Money,
      Quantity.create({ value: 2 }).value as Quantity,
    );

    expect(cart.items).toHaveLength(3);
    expect((cart.totalPrice().value as Money).value).toBe(877.28);
    expect((cart.totalQuantity().value as Quantity).value).toBe(35);
  });

  it("should add different products and remove them all from the cart", () => {
    const cart = Cart.create({
      customerId: UUID.create({ value: "752719ec-b74c-4db3-99db-dbb30301a2ef" }).value as UUID,
    }).value as Cart;

    cart.addItem(
      UUID.create({ value: "fcacb9ed-a69d-4737-8d9f-0a3b5c210fa8" }).value as UUID,
      Money.create({ value: 24.99 }).value as Money,
      Quantity.create({ value: 8 }).value as Quantity,
    );
    cart.addItem(
      UUID.create({ value: "0c94905b-c4a6-4226-bfdb-2aa7d274ad42" }).value as UUID,
      Money.create({ value: 32.5 }).value as Money,
      Quantity.create({ value: 4 }).value as Quantity,
    );
    cart.addItem(
      UUID.create({ value: "c6ba359e-aca7-4214-abba-54dec70fcf75" }).value as UUID,
      Money.create({ value: 16.5 }).value as Money,
      Quantity.create({ value: 12 }).value as Quantity,
    );
    cart.removeItem(UUID.create({ value: "fcacb9ed-a69d-4737-8d9f-0a3b5c210fa8" }).value as UUID);
    cart.removeItem(UUID.create({ value: "0c94905b-c4a6-4226-bfdb-2aa7d274ad42" }).value as UUID);
    cart.removeItem(UUID.create({ value: "c6ba359e-aca7-4214-abba-54dec70fcf75" }).value as UUID);

    expect(cart.items).toHaveLength(0);
    expect((cart.totalPrice().value as Money).value).toBe(0);
    expect((cart.totalQuantity().value as Quantity).value).toBe(0);
  });

  it("should add same products and remove them all from the cart", () => {
    const cart = Cart.create({
      customerId: UUID.create({ value: "752719ec-b74c-4db3-99db-dbb30301a2ef" }).value as UUID,
    }).value as Cart;

    cart.addItem(
      UUID.create({ value: "fcacb9ed-a69d-4737-8d9f-0a3b5c210fa8" }).value as UUID,
      Money.create({ value: 24.99 }).value as Money,
      Quantity.create({ value: 8 }).value as Quantity,
    );
    cart.addItem(
      UUID.create({ value: "fcacb9ed-a69d-4737-8d9f-0a3b5c210fa8" }).value as UUID,
      Money.create({ value: 24.99 }).value as Money,
      Quantity.create({ value: 8 }).value as Quantity,
    );
    cart.addItem(
      UUID.create({ value: "fcacb9ed-a69d-4737-8d9f-0a3b5c210fa8" }).value as UUID,
      Money.create({ value: 24.99 }).value as Money,
      Quantity.create({ value: 8 }).value as Quantity,
    );

    cart.removeItem(UUID.create({ value: "fcacb9ed-a69d-4737-8d9f-0a3b5c210fa8" }).value as UUID);

    expect(cart.items).toHaveLength(0);
    expect((cart.totalPrice().value as Money).value).toBe(0);
    expect((cart.totalQuantity().value as Quantity).value).toBe(0);
  });

  it("should add and remove some products from the cart", () => {
    const cart = Cart.create({
      customerId: UUID.create({ value: "752719ec-b74c-4db3-99db-dbb30301a2ef" }).value as UUID,
    }).value as Cart;

    cart.addItem(
      UUID.create({ value: "fcacb9ed-a69d-4737-8d9f-0a3b5c210fa8" }).value as UUID,
      Money.create({ value: 24.99 }).value as Money,
      Quantity.create({ value: 8 }).value as Quantity,
    );
    cart.addItem(
      UUID.create({ value: "fcacb9ed-a69d-4737-8d9f-0a3b5c210fa8" }).value as UUID,
      Money.create({ value: 24.99 }).value as Money,
      Quantity.create({ value: 8 }).value as Quantity,
    );
    cart.addItem(
      UUID.create({ value: "0c94905b-c4a6-4226-bfdb-2aa7d274ad42" }).value as UUID,
      Money.create({ value: 32.5 }).value as Money,
      Quantity.create({ value: 4 }).value as Quantity,
    );
    cart.addItem(
      UUID.create({ value: "132a292a-32da-41bb-b92b-bf87642d07f0" }).value as UUID,
      Money.create({ value: 12 }).value as Money,
      Quantity.create({ value: 6 }).value as Quantity,
    );
    cart.removeItem(UUID.create({ value: "fcacb9ed-a69d-4737-8d9f-0a3b5c210fa8" }).value as UUID);

    expect(cart.items).toHaveLength(2);
    expect((cart.totalPrice().value as Money).value).toBe(202);
    expect((cart.totalQuantity().value as Quantity).value).toBe(10);
  });

  it("should fail to remove a product that is not in the cart", () => {
    const failure = new Failure("PRODUCT_NOT_FOUND_IN_CART");
    const cart = Cart.create({
      customerId: UUID.create({ value: "752719ec-b74c-4db3-99db-dbb30301a2ef" }).value as UUID,
    }).value as Cart;

    cart.addItem(
      UUID.create({ value: "fcacb9ed-a69d-4737-8d9f-0a3b5c210fa8" }).value as UUID,
      Money.create({ value: 24.99 }).value as Money,
      Quantity.create({ value: 8 }).value as Quantity,
    );
    const sut = cart.removeItem(UUID.create({ value: "bb2a7b3b-c0ba-4785-a8b9-4cbf5647fca5" }).value as UUID);

    expect(sut.value).toStrictEqual(failure);
    expect(cart.items).toHaveLength(1);
    expect((cart.totalPrice().value as Money).value).toBe(199.92);
    expect((cart.totalQuantity().value as Quantity).value).toBe(8);
  });
});
