import { PasswordHasher } from "@application/models/password-hasher";

export class FakePasswordHasher implements PasswordHasher {
  async hashPassword(plainPassword: string): Promise<string> {
    return plainPassword;
  }
}
