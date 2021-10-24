import Compiler from '../libs/Compiler';

export type ModuleGraph = Record<string, Omit<ModuleInfo, 'moduleId'>>;

export interface ModuleInfo {
  deps: string[];
  moduleId: string;
  code: string;
}

export type Output = {
  path: string;
  filename: string;
};

export interface WebpackPlugin {
  apply: (compiler: Compiler) => void;
}
export interface WebpackConfig {
  entry: string;
  output: Output;
  plugins?: WebpackPlugin[];
}

export interface ESModule<T> {
  __esModule: boolean;
  default: T;
}
