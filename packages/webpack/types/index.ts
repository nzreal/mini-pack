export type ModuleGraph = Record<string, Omit<ModuleInfo, 'moduleId'>>;

export interface ModuleInfo {
  deps: string[];
  moduleId: string;
  code?: string | null;
}

export type Output = {
  path: string;
  filename: string;
};

export interface WebpackConfig {
  entry: string;
  output: Output;
}
