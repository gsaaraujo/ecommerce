import { CustomerGateway } from "@application/gateways/customer-gateway";

export type FakeCustomerDTO = {
  id: string;
};

export class FakeCustomerGateway implements CustomerGateway {
  public fakeCustomers: FakeCustomerDTO[] = [];

  async exists(customerId: string): Promise<boolean> {
    const customer = this.fakeCustomers.find((customer) => customer.id === customerId);
    return !!customer;
  }
}
