import * as jose from "jose";

import { AuthTokenGenerator } from "@application/models/auth-token-generator";

export class JoseAuthTokenGenerator implements AuthTokenGenerator {
  async generateToken(secretKey: string, expiresInMinutes: number, payload?: object): Promise<string> {
    const secret = new TextEncoder().encode(secretKey);
    return new jose.SignJWT({ ...payload })
      .setProtectedHeader({ alg: "HS256", typ: "JWT" })
      .setIssuedAt()
      .setExpirationTime(`${expiresInMinutes} minutes`)
      .sign(secret);
  }
}
