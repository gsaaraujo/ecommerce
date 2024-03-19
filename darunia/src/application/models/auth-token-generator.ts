export interface AuthTokenGenerator {
  generateToken(secretKey: string, expiresInMinutes: number, payload?: object): Promise<string>;
}
