export type Either<L, R> = Left<L, R> | Right<L, R>;

export class Left<L, R> {
  public constructor(public readonly value: L) {}

  isLeft(): this is Left<L, R> {
    return true;
  }

  isRight(): this is Right<L, R> {
    return false;
  }

  static create = <L, R>(l: L): Either<L, R> => {
    return new Left<L, R>(l);
  };
}

export class Right<L, R> {
  public constructor(public readonly value: R) {}

  isLeft(): this is Left<L, R> {
    return false;
  }

  isRight(): this is Right<L, R> {
    return true;
  }

  static create = <L, R>(r: R): Either<L, R> => {
    return new Right<L, R>(r);
  };
}
