import { Failure } from "@shared/helpers/failure";
import { ValueObject } from "@shared/helpers/value-object";
import { Either, Left, Right } from "@shared/helpers/either";

type QuantityProps = {
  value: number;
};

export class Quantity extends ValueObject<QuantityProps> {
  public static create(props: QuantityProps): Either<Failure, Quantity> {
    if (typeof props.value !== "number") {
      const failure = new Failure("QUANTITY_MUST_BE_NUMBER");
      return Left.create(failure);
    }

    if (!Number.isInteger(props.value)) {
      const failure = new Failure("QUANTITY_CANNOT_BE_DECIMAL");
      return Left.create(failure);
    }

    if (props.value < 0) {
      const failure = new Failure("QUANTITY_CANNOT_BE_NEGATIVE");
      return Left.create(failure);
    }

    const money = new Quantity(props);
    return Right.create(money);
  }

  public static reconstitute(props: QuantityProps): Quantity {
    return new Quantity(props);
  }

  public getValue(): number {
    return this.props.value;
  }
}
