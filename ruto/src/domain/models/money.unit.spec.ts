import { describe, expect, it } from "vitest";

import { Money } from "@domain/models/money";
import { Failure } from "@shared/helpers/failure";

describe("money", () => {
  it("should create and reconstitute money (1)", () => {
    const money = Money.reconstitute({ value: 44.5 });

    const sut = Money.create({ value: 44.5 });

    expect(sut.value).toStrictEqual(money);
  });

  it("should create and reconstitute money (2)", () => {
    const money = Money.reconstitute({ value: 174.93 });

    const sut = Money.create({ value: 174.92999999999998 });

    expect(sut.value).toStrictEqual(money);
  });

  it("should create and reconstitute money (3)", () => {
    const money = Money.reconstitute({ value: 0.32 });

    const sut = Money.create({ value: 0.32111111 });

    expect(sut.value).toStrictEqual(money);
  });

  it("should fail if money is negative", () => {
    const failure = new Failure("MONEY_CANNOT_BE_NEGATIVE");

    const sut = Money.create({ value: -1 });

    expect(sut.value).toStrictEqual(failure);
  });
});
