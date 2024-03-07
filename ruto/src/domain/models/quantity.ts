import { Failure } from "@shared/helpers/failure";
import { Either, Left, Right } from "@shared/helpers/either";

type QuantityProps = {
  value: number;
};

export class Quantity {
  private readonly props: QuantityProps;

  private constructor(props: QuantityProps) {
    this.props = props;
  }

  public static create(props: QuantityProps): Either<Failure, Quantity> {
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

  public get value(): number {
    return this.props.value;
  }
}
