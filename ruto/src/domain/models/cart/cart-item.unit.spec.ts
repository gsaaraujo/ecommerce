import { describe, expect, it } from "vitest";

import { Failure } from "@shared/helpers/failure";
import { UUID } from "@shared/domain/models/uuid";

import { Money } from "@domain/models/money";
import { Quantity } from "@domain/models/quantity";
import { CartItem } from "@domain/models/cart/cart-item";

describe("cart-item", () => {
  it("should create and reconstitute cartItem", () => {
    const cartItem = CartItem.reconstitute(UUID.reconstitute({ value: "c8d29b35-b5d7-4e3c-8688-42c66efb6c72" }), {
      productId: UUID.reconstitute({ value: "c8d29b35-b5d7-4e3c-8688-42c66efb6c72" }),
      unitPrice: Money.reconstitute({ value: 245 }),
      quantity: Quantity.reconstitute({ value: 10 }),
    });

    const sut = CartItem.create({
      productId: UUID.create({ value: "c8d29b35-b5d7-4e3c-8688-42c66efb6c72" }).value as UUID,
      unitPrice: Money.create({ value: 245 }).value as Money,
      quantity: Quantity.create({ value: 10 }).value as Quantity,
    }).value as CartItem;

    expect(sut.productId).toStrictEqual(cartItem.id);
    expect(sut.unitPrice).toStrictEqual(cartItem.unitPrice);
    expect(sut.quantity).toStrictEqual(cartItem.quantity);
  });

  it("should increase quantity", () => {
    const sut = CartItem.create({
      productId: UUID.create({ value: "c8d29b35-b5d7-4e3c-8688-42c66efb6c72" }).value as UUID,
      unitPrice: Money.create({ value: 245 }).value as Money,
      quantity: Quantity.create({ value: 10 }).value as Quantity,
    }).value as CartItem;

    sut.increaseQuantity(Quantity.create({ value: 4 }).value as Quantity);

    expect(sut.quantity.value).toBe(14);
  });

  it("should decrease quantity", () => {
    const sut = CartItem.create({
      productId: UUID.create({ value: "c8d29b35-b5d7-4e3c-8688-42c66efb6c72" }).value as UUID,
      unitPrice: Money.create({ value: 245 }).value as Money,
      quantity: Quantity.create({ value: 10 }).value as Quantity,
    }).value as CartItem;

    sut.decreaseQuantity(Quantity.create({ value: 2 }).value as Quantity);

    expect(sut.quantity.value).toBe(8);
  });

  it("should return the total price", () => {
    const cartItem = CartItem.create({
      productId: UUID.create({ value: "c8d29b35-b5d7-4e3c-8688-42c66efb6c72" }).value as UUID,
      unitPrice: Money.create({ value: 35.99 }).value as Money,
      quantity: Quantity.create({ value: 10 }).value as Quantity,
    }).value as CartItem;

    cartItem.increaseQuantity(Quantity.create({ value: 16 }).value as Quantity);
    cartItem.decreaseQuantity(Quantity.create({ value: 14 }).value as Quantity);

    const sut = cartItem.totalPrice().value as Money;

    expect(sut.value).toBe(431.88);
  });

  it("should fail if quantity is less than one", () => {
    const failure = new Failure("CART_ITEM_QUANTITY_CANNOT_BE_LESS_THAN_ONE");
    const sut = CartItem.create({
      productId: UUID.create({ value: "c8d29b35-b5d7-4e3c-8688-42c66efb6c72" }).value as UUID,
      unitPrice: Money.create({ value: 245 }).value as Money,
      quantity: Quantity.create({ value: 0 }).value as Quantity,
    });

    expect(sut.value).toStrictEqual(failure);
  });

  it("should fail if the quantity to be decreased is greater than or equal to the current quantity", () => {
    const failure = new Failure("CART_ITEM_QUANTITY_CANNOT_BE_LESS_THAN_ONE");
    const cartItem1 = CartItem.create({
      productId: UUID.create({ value: "c8d29b35-b5d7-4e3c-8688-42c66efb6c72" }).value as UUID,
      unitPrice: Money.create({ value: 245 }).value as Money,
      quantity: Quantity.create({ value: 4 }).value as Quantity,
    }).value as CartItem;
    const cartItem2 = CartItem.create({
      productId: UUID.create({ value: "c8d29b35-b5d7-4e3c-8688-42c66efb6c72" }).value as UUID,
      unitPrice: Money.create({ value: 245 }).value as Money,
      quantity: Quantity.create({ value: 2 }).value as Quantity,
    }).value as CartItem;

    const sut1 = cartItem1.decreaseQuantity(Quantity.create({ value: 4 }).value as Quantity);
    const sut2 = cartItem2.decreaseQuantity(Quantity.create({ value: 8 }).value as Quantity);

    expect(sut1.value).toStrictEqual(failure);
    expect(sut2.value).toStrictEqual(failure);
  });
});
