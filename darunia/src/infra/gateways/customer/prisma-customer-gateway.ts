import { PrismaClient } from "@prisma/client";

import { CustomerDTO, CustomerGateway } from "@application/gateways/customer-gateway";

export class PrismaCustomerGateway implements CustomerGateway {
  private readonly prismaClient: PrismaClient;

  public constructor(prismaClient: PrismaClient) {
    this.prismaClient = prismaClient;
  }

  async create(customer: CustomerDTO): Promise<void> {
    await this.prismaClient.customer.create({
      data: {
        id: customer.id,
        email: customer.email,
        name: customer.name,
        password: customer.password,
      },
    });
  }

  async existsByEmail(email: string): Promise<boolean> {
    const customer = await this.prismaClient.customer.findUnique({
      where: { email },
    });

    return !!customer;
  }
}
