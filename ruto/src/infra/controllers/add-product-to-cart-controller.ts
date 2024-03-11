import { z } from "zod";
import { Body, Post, Inject, Controller, HttpStatus, HttpException } from "@nestjs/common";

import { AddProductToCart } from "@application/usecases/add-product-to-cart";

import { Created } from "@infra/models/http/created";
import { NotFound } from "@infra/models/http/not-found";
import { BadRequest } from "@infra/models/http/bad-request";

type Input = {
  customerId: string;
  productId: string;
  quantity: number;
  unitPrice: number;
};

@Controller()
export class AddProductToCartController {
  private readonly addProductToCart: AddProductToCart;

  public constructor(
    @Inject("AddProductToCart")
    addProductToCart: AddProductToCart,
  ) {
    this.addProductToCart = addProductToCart;
  }

  @Post("carts/add-product")
  async execute(@Body() input: Input): Promise<any> {
    const schema = z.object({
      customerId: z
        .string({ required_error: "customerId is required", invalid_type_error: "customerId must be string" })
        .trim()
        .uuid({ message: "customerId must be uuid" }),
      productId: z
        .string({ required_error: "productId is required", invalid_type_error: "productId must be string" })
        .trim()
        .uuid({ message: "productId must be uuid" }),
      quantity: z.number({ required_error: "quantity is required", invalid_type_error: "quantity must be number" }),
      unitPrice: z.number({
        required_error: "unitPrice is required",
        invalid_type_error: "unitPrice must be number",
      }),
    });

    const body = schema.safeParse(input);

    if (!body.success) {
      throw new HttpException(
        new BadRequest({
          message: body.error.errors.map((error) => error.message).join(", "),
          path: "/carts/add-product",
          timestamp: new Date().toISOString(),
        }),
        HttpStatus.BAD_REQUEST,
      );
    }

    const addProductToCart = await this.addProductToCart.execute({
      customerId: input.customerId,
      productId: input.productId,
      quantity: input.quantity,
      unitPrice: input.unitPrice,
    });

    if (addProductToCart.isRight()) {
      return new Created({});
    }

    switch (addProductToCart.value.message) {
      case "CUSTOMER_NOT_FOUND":
        throw new HttpException(
          new NotFound({
            message: `The customer with the ID '${input.customerId}' does not exist in our records`,
            suggestion: "Please check if the customer ID is correct",
            path: "/carts/add-product",
            timestamp: new Date().toISOString(),
          }),
          HttpStatus.NOT_FOUND,
        );
    }
  }
}
