import { AuthTokenGenerator } from "@application/models/auth-token-generator";

export class FakeAuthTokenGenerator implements AuthTokenGenerator {
  async generateToken(secretKey: string, expiresInMinutes: number, payload?: object): Promise<string> {
    return secretKey + expiresInMinutes;
  }
}
