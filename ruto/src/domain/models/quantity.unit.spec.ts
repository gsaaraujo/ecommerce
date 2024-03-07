import { describe, expect, it } from "vitest";

import { Failure } from "@shared/helpers/failure";

import { Quantity } from "@domain/models/quantity";

describe("quantity", () => {
  it("should create and reconstitute quantity", () => {
    const quantity = Quantity.reconstitute({ value: 10 });

    const sut = Quantity.create({ value: 10 });

    expect(sut.value).toStrictEqual(quantity);
  });

  it("should fail if quantity is negative", () => {
    const failure = new Failure("QUANTITY_CANNOT_BE_NEGATIVE");

    const sut = Quantity.create({ value: -1 });

    expect(sut.value).toStrictEqual(failure);
  });

  it("should fail if quantity is decimal", () => {
    const failure = new Failure("QUANTITY_CANNOT_BE_DECIMAL");

    const sut = Quantity.create({ value: 0.5 });

    expect(sut.value).toStrictEqual(failure);
  });
});
