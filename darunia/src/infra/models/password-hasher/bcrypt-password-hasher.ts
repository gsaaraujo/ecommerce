import bcrypt from "bcrypt";

import { PasswordHasher } from "@application/models/password-hasher";

export class BcryptPasswordHasher implements PasswordHasher {
  async hashPassword(password: string): Promise<string> {
    return bcrypt.hash(password, 10);
  }
}
