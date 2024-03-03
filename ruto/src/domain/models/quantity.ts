import { Failure } from "@shared/helpers/failure";
import { Either, Right } from "@shared/helpers/either";

type QuantityProps = {
  value: number;
};

export class Quantity {
  private readonly props: QuantityProps;

  private constructor(props: QuantityProps) {
    this.props = props;
  }

  public static create(props: QuantityProps): Either<Failure, Quantity> {
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
