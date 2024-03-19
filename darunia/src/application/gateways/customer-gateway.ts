export type CustomerDTO = {
  id: string;
  name: string;
  email: string;
  password: string;
  salt: string;
};

export interface CustomerGateway {
  create(customer: CustomerDTO): Promise<void>;
  existsByEmail(email: string): Promise<boolean>;
}
