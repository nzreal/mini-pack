import { Compilation, Compiler, WebpackPluginInstance } from 'webpack';

const PluginName = 'OutputAllLifeCyclePlugins';
// 按顺序 打印所有 生命周期阶段钩子

/**
 * @name OutputAllLifeCyclePlugins
 * @description 按顺序输出所有的 webpack 生命周期
 * - environment
 * - afterEnvironment
 * - entryOption
 * - afterPlugins
 * - afterResolvers
 * - initialize
 * - beforeRun
 * - infrastructureLog
 * - infrastructureLog
 * - run
 * - normalModuleFactory
 * - contextModuleFactory
 * - beforeCompile
 * - compile
 * - thisCompilation
 * - compilation
 * - make
 * - finishMake
 * - afterCompile
 * - shouldEmit
 * - emit
 * - afterEmit
 * - done
 * - shutdown
 * - infrastructureLog
 * - afterDone
 */
export default class OutputAllLifeCyclePlugins implements WebpackPluginInstance {
  options: { disableLog: boolean };
  constructor(options: { disableLog: boolean }) {
    this.options = options;
  }
  apply(compiler: Compiler) {
    const hooks = compiler.hooks;
    const keys = Object.keys(hooks) as Array<keyof typeof hooks>;

    !this.options.disableLog &&
      keys.forEach((key) => {
        hooks[key]?.tap(PluginName, (() => {
          console.log(key);
        }) as any);
      });
  }
}
