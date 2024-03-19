export interface PasswordHasher {
  hashPassword(plainPassword: string): Promise<string>;
}
