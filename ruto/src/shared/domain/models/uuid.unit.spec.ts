import { describe, expect, it } from "vitest";

import { UUID } from "@shared/domain/models/uuid";
import { Failure } from "@shared/helpers/failure";

describe("uuid", () => {
  it("should create uuid", () => {
    const uuid = UUID.reconstitute({ value: "e6b6ac3a-b519-4779-8d6f-a76b5d7f142f" });

    const sut = UUID.create({ value: "e6b6ac3a-b519-4779-8d6f-a76b5d7f142f" });

    expect(sut.isRight()).toBeTruthy();
    expect(sut.value).toStrictEqual(uuid);
  });

  it("should fail if uuid is invalid", () => {
    const failure = new Failure("INVALID_UID");

    const sut = UUID.create({ value: "123abc" });

    expect(sut.isLeft()).toBeTruthy();
    expect(sut.value).toStrictEqual(failure);
  });
});
