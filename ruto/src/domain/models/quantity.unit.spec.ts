/* eslint-disable @typescript-eslint/no-explicit-any */

import { describe, expect, it } from "vitest";

import { Failure } from "@shared/helpers/failure";

import { Quantity } from "@domain/models/quantity";

describe("quantity", () => {
  it("should create and reconstitute quantity", () => {
    const quantity = Quantity.reconstitute({ value: 10 });

    const sut = Quantity.create({ value: 10 });

    expect((sut.getValue() as Quantity).isEquals(quantity)).toBeTruthy();
  });

  it("should fail if quantity is negative", () => {
    const failure = new Failure("QUANTITY_CANNOT_BE_NEGATIVE");

    const sut = Quantity.create({ value: -1 });

    expect(sut.getValue()).toStrictEqual(failure);
  });

  it("should fail if quantity is decimal", () => {
    const failure = new Failure("QUANTITY_CANNOT_BE_DECIMAL");

    const sut = Quantity.create({ value: 0.5 });

    expect(sut.getValue()).toStrictEqual(failure);
  });

  it("should fail if quantity is not number", () => {
    const failure = new Failure("QUANTITY_MUST_BE_NUMBER");

    const sut = Quantity.create({ value: "0.5" as any });

    expect(sut.getValue()).toStrictEqual(failure);
  });
});
