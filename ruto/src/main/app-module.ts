import { Axios } from "axios";
import { Module } from "@nestjs/common";
import { PrismaClient } from "@prisma/client";

import { AddProductToCart } from "@application/usecases/add-product-to-cart";

import { AxiosHttpClient } from "@infra/adapters/http/axios-http-client";
import { HttpCustomerGateway } from "@infra/gateways/customer/http-customer-gateway";
import { PrismaCartRepository } from "@infra/repositories/cart/prisma-cart-repository";
import { AddProductToCartController } from "@infra/controllers/add-product-to-cart-controller";

@Module({
  imports: [],
  controllers: [AddProductToCartController],
  providers: [
    {
      provide: "PrismaClient",
      useValue: new PrismaClient(),
    },
    {
      provide: "Axios",
      useValue: new Axios(),
    },
    {
      provide: "AxiosHttpClient",
      inject: ["Axios"],
      useFactory: (axios) => new AxiosHttpClient(axios),
    },
    {
      provide: "PrismaCartRepository",
      inject: ["PrismaClient"],
      useFactory: (prismaClient) => new PrismaCartRepository(prismaClient),
    },
    {
      provide: "HttpCustomerGateway",
      inject: ["AxiosHttpClient"],
      useFactory: (axiosHttpClient) => new HttpCustomerGateway(axiosHttpClient),
    },
    {
      provide: "AddProductToCart",
      inject: ["PrismaCartRepository", "HttpCustomerGateway"],
      useFactory: (prismaCartRepository, httpCustomerGateway) => {
        return new AddProductToCart(prismaCartRepository, httpCustomerGateway);
      },
    },
  ],
})
export class AppModule {}
