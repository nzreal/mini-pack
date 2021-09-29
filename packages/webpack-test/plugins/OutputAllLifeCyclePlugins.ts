import { Compiler } from 'webpack';

const PluginName = 'OutputAllLifeCyclePlugins';

export default class OutputAllLifeCyclePlugins {
  apply(compiler: Compiler) {
    const hooks = compiler.hooks;
    const keys = Object.keys(hooks) as Array<keyof typeof hooks>;

    keys.forEach((key) => {
      hooks[key]?.tap(PluginName, (() => {
        console.log(key);
      }) as any);
    });
  }
}

/**
 * environment
 * afterEnvironment
 * entryOption
 * afterPlugins
 * afterResolvers
 * initialize
 * beforeRun
 * infrastructureLog
 * infrastructureLog
 * run
 * normalModuleFactory
 * contextModuleFactory
 * beforeCompile
 * compile
 * thisCompilation
 * compilation
 * make
 * finishMake
 * afterCompile
 * shouldEmit
 * emit
 * afterEmit
 * done
 * shutdown
 * infrastructureLog
 * afterDone
 */
