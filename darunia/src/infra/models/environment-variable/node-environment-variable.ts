import { EnvironmentVariable } from "@application/models/environment-variable";

export class NodeEnvironmentVariable implements EnvironmentVariable {
  async getVariableValue(key: string): Promise<string> {
    return process.env[key] ?? "";
  }
}
