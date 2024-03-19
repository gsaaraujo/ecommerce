import { CustomerDTO, CustomerGateway } from "@application/gateways/customer-gateway";

export type FakeCustomerDTO = {
  id: string;
  name: string;
  email: string;
  password: string;
};

export class FakeCustomerGateway implements CustomerGateway {
  public fakeCustomers: FakeCustomerDTO[] = [];

  async create(customer: CustomerDTO): Promise<void> {
    this.fakeCustomers.push(customer);
  }

  async existsByEmail(email: string): Promise<boolean> {
    return this.fakeCustomers.some((customer) => customer.email === email);
  }
}
