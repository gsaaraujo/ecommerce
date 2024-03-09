import { Failure } from "@shared/helpers/failure";
import { Either, Left, Right } from "@shared/helpers/either";

type MoneyProps = {
  value: number;
};

export class Money {
  private readonly props: MoneyProps;

  private constructor(props: MoneyProps) {
    this.props = props;
  }

  public static create(props: MoneyProps): Either<Failure, Money> {
    if (typeof props.value !== "number") {
      const failure = new Failure("MONEY_MUST_BE_NUMBER");
      return Left.create(failure);
    }

    if (props.value < 0) {
      const failure = new Failure("MONEY_CANNOT_BE_NEGATIVE");
      return Left.create(failure);
    }

    const money = new Money({ value: Number(props.value.toFixed(2)) });
    return Right.create(money);
  }

  public static reconstitute(props: MoneyProps): Money {
    return new Money(props);
  }

  public get value(): number {
    return this.props.value;
  }
}
