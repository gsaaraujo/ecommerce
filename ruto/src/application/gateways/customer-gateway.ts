export interface CustomerGateway {
  exists(customerId: string): Promise<boolean>;
}
