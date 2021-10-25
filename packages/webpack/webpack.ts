import Compiler from './libs/Compiler';
import { WebpackConfig } from './types';
import combineWebpackConfig from './libs/combineWebpackConfig';
import errorHandler from './utils/errorHandler';

const run = (config?: WebpackConfig) => {
  try {
    // TODO: maybe separate compiler
    const compiler = new Compiler({});
    config = combineWebpackConfig(config) as WebpackConfig;
    // TODO: apply default config
    compiler.config = config;
    // register plugins
    if (Array.isArray(config.plugins)) {
      for (const plugin of config.plugins) {
        if (typeof plugin === 'function') {
          plugin.call(compiler, compiler);
        } else {
          plugin.apply(compiler);
        }
      }
    }
    compiler.hooks.afterPlugins.call(compiler);
    compiler.hooks.entryOption.call(config?.entry, compiler);
    compiler.run();
  } catch (e) {
    errorHandler('Build error', e, true);
  }
};

run();
