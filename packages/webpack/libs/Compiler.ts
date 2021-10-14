import { AsyncSeriesHook, SyncBailHook, SyncHook } from 'tapable';
import { ModuleGraph, WebpackConfig } from '../types';
import buildModuleGraph from './buildModuleGraph';
import { outputBundle } from './outputBundle';
import parseConfig from './parseConfig';

// TODO: 插件测试
const hooks = Object.freeze({
  entryOption: new SyncBailHook<[string], boolean>(['entry']),
  run: new AsyncSeriesHook<unknown>(['run']),
  compile: new SyncHook(['compile']),
  afterCompile: new AsyncSeriesHook(['afterCompile']),
  done: new AsyncSeriesHook(['done']),
});

export default class Compiler {
  webpackConfig: WebpackConfig;
  execRootPath: string;
  hooks: typeof hooks;
  moduleGraph: ModuleGraph;

  constructor() {
    this.hooks = hooks;
    this.execRootPath = process.cwd();
    this.webpackConfig = this._parseConfig();
    this.moduleGraph = {};
  }

  _buildModuleGraph = buildModuleGraph;
  _outputBundle = outputBundle;
  _parseConfig = parseConfig;

  // TODO: simple common error handler
  async run() {
    this.hooks.run.callAsync('', (e) => e);
    this.moduleGraph = this._buildModuleGraph();
    this._outputBundle();
    this.hooks.done.callAsync('', (e) => e);
  }
}
