import { z } from "zod";
import { Body, Post, Inject, Controller, HttpStatus, HttpException } from "@nestjs/common";

import { Created } from "@infra/models/http/created";
import { Conflict } from "@infra/models/http/conflict";
import { BadRequest } from "@infra/models/http/bad-request";

import { SignUpWithEmailAndPassword } from "@application/usecases/sign-up-with-email-and-password";

type Input = {
  name: string;
  email: string;
  password: string;
};

@Controller()
export class SignUpWithEmailAndPasswordController {
  private readonly signUpWithEmailAndPassword: SignUpWithEmailAndPassword;

  public constructor(
    @Inject("SignUpWithEmailAndPassword")
    signUpWithEmailAndPassword: SignUpWithEmailAndPassword,
  ) {
    this.signUpWithEmailAndPassword = signUpWithEmailAndPassword;
  }

  @Post("auth/sign-up-with-email-and-password")
  async execute(@Body() input: Input): Promise<any> {
    const schema = z.object({
      name: z.string({ required_error: "name is required", invalid_type_error: "name must be string" }).trim(),
      email: z.string({ required_error: "email is required", invalid_type_error: "email must be string" }).trim(),
      password: z
        .string({ required_error: "password is required", invalid_type_error: "password must be string" })
        .trim(),
    });

    const body = schema.safeParse(input);

    if (!body.success) {
      throw new HttpException(
        new BadRequest({
          message: body.error.errors.map((error) => error.message).join(", "),
          path: "/auth/sign-up-with-email-and-password",
          timestamp: new Date().toISOString(),
        }),
        HttpStatus.BAD_REQUEST,
      );
    }

    const signUpWithEmailAndPassword = await this.signUpWithEmailAndPassword.execute({
      name: input.name,
      email: input.email,
      password: input.password,
    });

    if (signUpWithEmailAndPassword.isRight()) {
      return new Created({});
    }

    switch (signUpWithEmailAndPassword.value.message) {
      case "A_CUSTOMER_ALREADY_EXISTS_WITH_THIS_EMAIL":
        throw new HttpException(
          new Conflict({
            message: `A customer with the email '${input.email}' already exists in our records`,
            suggestion: "Please use a different email address to sign up",
            path: "/auth/sign-up-with-email-and-password",
            timestamp: new Date().toISOString(),
          }),
          HttpStatus.CONFLICT,
        );
      case "CUSTOMER_EMAIL_CANNOT_BE_INVALID":
        throw new HttpException(
          new BadRequest({
            message: `"${input.email}" is not a valid email address`,
            suggestion: "Please use a valid email address to sign up",
            path: "/auth/sign-up-with-email-and-password",
            timestamp: new Date().toISOString(),
          }),
          HttpStatus.CONFLICT,
        );
      case "CUSTOMER_PASSWORD_CANNOT_BE_LESS_THAN_6_CHARACTERS":
        throw new HttpException(
          new BadRequest({
            message: `"${input.password}" is not a valid password`,
            suggestion: "Please use a password with at least 6 characters to sign up",
            path: "/auth/sign-up-with-email-and-password",
            timestamp: new Date().toISOString(),
          }),
          HttpStatus.CONFLICT,
        );
      case "CUSTOMER_NAME_CANNOT_BE_LESS_THAN_2_CHARACTERS":
        throw new HttpException(
          new BadRequest({
            message: `"${input.name}" is not a valid name`,
            suggestion: "Please use a name with at least 2 characters to sign up",
            path: "/auth/sign-up-with-email-and-password",
            timestamp: new Date().toISOString(),
          }),
          HttpStatus.CONFLICT,
        );
    }
  }
}
