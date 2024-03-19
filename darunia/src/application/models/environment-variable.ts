export interface EnvironmentVariable {
  getVariableValue(key: string): Promise<string>;
}
