import { Failure } from "@shared/helpers/failure";
import { Either, Left, Right } from "@shared/helpers/either";

import { PasswordHasher } from "@application/models/password-hasher";
import { CustomerGateway } from "@application/gateways/customer-gateway";
import { AuthTokenGenerator } from "@application/models/auth-token-generator";
import { EnvironmentVariable } from "@application/models/environment-variable";

type Input = {
  name: string;
  email: string;
  password: string;
};

type Output = void;

export class SignUpWithEmailAndPassword {
  private readonly customerGateway: CustomerGateway;
  private readonly passwordHasher: PasswordHasher;

  public constructor(customerGateway: CustomerGateway, passwordHasher: PasswordHasher) {
    this.customerGateway = customerGateway;
    this.passwordHasher = passwordHasher;
  }

  async execute(input: Input): Promise<Either<Failure, Output>> {
    const emailPattern = /^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$/;

    if (!emailPattern.test(input.email)) {
      return Left.create(new Failure("CUSTOMER_EMAIL_CANNOT_BE_INVALID"));
    }

    if (input.password.length < 6) {
      return Left.create(new Failure("CUSTOMER_PASSWORD_CANNOT_BE_LESS_THAN_6_CHARACTERS"));
    }

    if (input.name.length < 2) {
      return Left.create(new Failure("CUSTOMER_NAME_CANNOT_BE_LESS_THAN_2_CHARACTERS"));
    }

    const customerAlredyExists = await this.customerGateway.existsByEmail(input.email);

    if (customerAlredyExists) {
      return Left.create(new Failure("A_CUSTOMER_ALREADY_EXISTS_WITH_THIS_EMAIL"));
    }

    const salt = Math.random().toString(36).substring(2);
    const hashedPassword = await this.passwordHasher.hashPassword(input.password);

    const customerId = crypto.randomUUID();

    await this.customerGateway.create({
      id: customerId,
      email: input.email,
      name: input.name,
      password: hashedPassword,
      salt,
    });

    return Right.create(undefined);
  }
}
