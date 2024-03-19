import { Module } from "@nestjs/common";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { PrismaClient } from "@prisma/client";

import { SignUpWithEmailAndPassword } from "@application/usecases/sign-up-with-email-and-password";

import { PrismaCustomerGateway } from "@infra/gateways/customer/prisma-customer-gateway";
import { BcryptPasswordHasher } from "@infra/models/password-hasher/bcrypt-password-hasher";
import { JoseAuthTokenGenerator } from "@infra/models/auth-token-generator/jose-auth-token-generator";
import { NodeEnvironmentVariable } from "@infra/models/environment-variable/node-environment-variable";
import { SignUpWithEmailAndPasswordController } from "@infra/controllers/sign-up-with-email-and-password-controller";

@Module({
  imports: [ConfigModule.forRoot(), ConfigModule],
  controllers: [SignUpWithEmailAndPasswordController],
  providers: [
    {
      provide: "PrismaClient",
      useClass: PrismaClient,
    },
    {
      provide: "NodeEnvironmentVariable",
      useClass: NodeEnvironmentVariable,
    },
    {
      provide: "JoseAuthTokenGenerator",
      useClass: JoseAuthTokenGenerator,
    },
    {
      provide: "BcryptPasswordHasher",
      useClass: BcryptPasswordHasher,
    },
    {
      provide: "PrismaCustomerGateway",
      inject: ["PrismaClient"],
      useFactory: (prismaClient) => new PrismaCustomerGateway(prismaClient),
    },

    {
      provide: "SignUpWithEmailAndPassword",
      inject: ["PrismaCustomerGateway", "BcryptPasswordHasher"],
      useFactory: (prismaCartRepository, bcryptPasswordHasher) => {
        return new SignUpWithEmailAndPassword(prismaCartRepository, bcryptPasswordHasher);
      },
    },
  ],
})
export class AppModule {}
