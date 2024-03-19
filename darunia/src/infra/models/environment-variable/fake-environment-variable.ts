import { EnvironmentVariable } from "@application/models/environment-variable";

export class FakeEnvironmentVariable implements EnvironmentVariable {
  async getVariableValue(key: string): Promise<string> {
    return key;
  }
}
