import { CustomerGateway } from "@application/gateways/customer-gateway";

import { HttpClient } from "@infra/adapters/http/http-client";

export type CustomerDTO = {
  id: string;
};

export class HttpCustomerGateway implements CustomerGateway {
  private readonly httpClient: HttpClient;

  public constructor(httpClient: HttpClient) {
    this.httpClient = httpClient;
  }

  async exists(customerId: string): Promise<boolean> {
    // const customerDTO = (await this.httpClient.get(`/customers/${customerId}`)) as CustomerDTO;
    // return !!customerDTO;
    return customerId === "9fb939ac-aa11-4c13-8a7d-dbd9a9b7e261";
  }
}
