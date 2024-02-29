import { Failure } from "@shared/helpers/failure";
import { Either, Right } from "@shared/helpers/either";

type MoneyProps = {
  value: number;
};

export class Money {
  private readonly props: MoneyProps;

  private constructor(props: MoneyProps) {
    this.props = props;
  }

  public static create(props: MoneyProps): Either<Failure, Money> {
    const money = new Money(props);
    return Right.create(money);
  }

  public static reconstitute(props: MoneyProps): Money {
    return new Money(props);
  }

  public get value(): number {
    return this.props.value;
  }
}
