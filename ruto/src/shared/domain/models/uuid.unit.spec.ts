import { describe, expect, it } from "vitest";

import { UUID } from "@shared/domain/models/uuid";
import { Failure } from "@shared/helpers/failure";

describe("uuid", () => {
  it("should create uuid", () => {
    const uuid = UUID.reconstitute({ value: "e6b6ac3a-b519-4779-8d6f-a76b5d7f142f" });

    const sut = UUID.create({ value: "e6b6ac3a-b519-4779-8d6f-a76b5d7f142f" });

    expect(sut.value).toStrictEqual(uuid);
  });

  it("should fail if uuid is invalid", () => {
    const failure = new Failure("INVALID_UUID");

    const sut1 = UUID.create({ value: "123abc" });
    const sut2 = UUID.create({ value: "e6b6ac3a-b519-4779-8d6f-a76b5d7f142f " });
    const sut3 = UUID.create({ value: " e6b6ac3a-b519-4779-8d6f-a76b5d7f142f" });
    const sut4 = UUID.create({ value: " e6b6ac3a-b519-4779-8d6f-a76b5d7f142f " });
    const sut5 = UUID.create({ value: 1 as any });
    const sut6 = UUID.create({ value: "" as any });
    const sut7 = UUID.create({ value: " " as any });

    expect(sut1.value).toStrictEqual(failure);
    expect(sut2.value).toStrictEqual(failure);
    expect(sut3.value).toStrictEqual(failure);
    expect(sut4.value).toStrictEqual(failure);
    expect(sut5.value).toStrictEqual(failure);
    expect(sut6.value).toStrictEqual(failure);
    expect(sut7.value).toStrictEqual(failure);
  });
});
