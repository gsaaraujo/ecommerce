import { beforeEach, describe, expect, it } from "vitest";

import { Failure } from "@shared/helpers/failure";

import { SignUpWithEmailAndPassword } from "@application/usecases/sign-up-with-email-and-password";

import { FakeCustomerGateway } from "@infra/gateways/customer/fake-customer-gateway";
import { FakePasswordHasher } from "@infra/models/password-hasher/fake-password-hasher";

describe("sign-up-with-email-and-password", () => {
  let signUpWithEmailAndPassword: SignUpWithEmailAndPassword;
  let fakeCustomerGateway: FakeCustomerGateway;
  let fakePasswordHasher: FakePasswordHasher;

  beforeEach(() => {
    fakeCustomerGateway = new FakeCustomerGateway();
    fakePasswordHasher = new FakePasswordHasher();
    signUpWithEmailAndPassword = new SignUpWithEmailAndPassword(fakeCustomerGateway, fakePasswordHasher);
  });

  it("should sign up", async () => {
    fakeCustomerGateway.fakeCustomers = [];

    const sut = await signUpWithEmailAndPassword.execute({
      name: "Edward Elric",
      email: "edward.elric@gmail.com",
      password: "123456",
    });

    expect(sut.value).toBeUndefined();
    expect(fakeCustomerGateway.fakeCustomers).toHaveLength(1);
  });

  it("should fail if already exists a customer with this email", async () => {
    fakeCustomerGateway.fakeCustomers.push({
      id: "556d7062-8065-4e92-8adf-358f893932af",
      name: "Edward Elric",
      email: "edward.elric@gmail.com",
      password: "d56e76b13a0b4d4d9935ea3d",
    });

    const sut = await signUpWithEmailAndPassword.execute({
      name: "Edward Elric",
      email: "edward.elric@gmail.com",
      password: "123456",
    });

    expect(sut.value).toStrictEqual(new Failure("A_CUSTOMER_ALREADY_EXISTS_WITH_THIS_EMAIL"));
  });

  it("should fail if email is a invalid email address", async () => {
    const sut = await signUpWithEmailAndPassword.execute({
      name: "Edward Elric",
      email: "g@com",
      password: "123456",
    });

    expect(sut.value).toStrictEqual(new Failure("CUSTOMER_EMAIL_CANNOT_BE_INVALID"));
  });

  it("should fail if password is less than 6 characters long", async () => {
    const sut = await signUpWithEmailAndPassword.execute({
      name: "Edward Elric",
      email: "edward.elric@gmail.com",
      password: "123",
    });

    expect(sut.value).toStrictEqual(new Failure("CUSTOMER_PASSWORD_CANNOT_BE_LESS_THAN_6_CHARACTERS"));
  });

  it("should fail if password is less than 2 characters long", async () => {
    const sut = await signUpWithEmailAndPassword.execute({
      name: "E",
      email: "edward.elric@gmail.com",
      password: "123456",
    });

    expect(sut.value).toStrictEqual(new Failure("CUSTOMER_NAME_CANNOT_BE_LESS_THAN_2_CHARACTERS"));
  });
});
