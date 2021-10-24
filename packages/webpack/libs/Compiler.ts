import { AsyncSeriesHook, SyncBailHook, SyncHook } from 'tapable';
import { ModuleGraph, WebpackConfig } from '../types';
import errorHandler from '../utils/errorHandler';
import buildModuleGraph from './buildModuleGraph';
import { outputBundle } from './outputBundle';

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface CompilerProps {
  // config: WebpackConfig;
}

// TODO: 插件测试
const hooks = Object.freeze({
  afterPlugins: new SyncHook<[Compiler]>(['compiler']),
  entryOption: new SyncBailHook<[string, Compiler], boolean>([
    'entry',
    'compiler',
  ]),
  run: new AsyncSeriesHook<[Compiler]>(['compiler']),
  compile: new SyncHook(['compile']),
  afterCompile: new AsyncSeriesHook(['afterCompile']),
  done: new AsyncSeriesHook(['done']),
});

export default class Compiler {
  config: WebpackConfig;
  execRootPath: string;
  hooks: typeof hooks;
  moduleGraph: ModuleGraph;

  constructor({}: CompilerProps) {
    this.hooks = hooks;
    this.execRootPath = process.cwd();
    this.config = {} as WebpackConfig;
    this.moduleGraph = {};
  }

  _buildModuleGraph = buildModuleGraph;
  _outputBundle = outputBundle;

  async run() {
    this.hooks.run.callAsync(this, errorHandler);
    this.moduleGraph = this._buildModuleGraph();
    this._outputBundle();
    this.hooks.done.callAsync(this, errorHandler);
  }
}
