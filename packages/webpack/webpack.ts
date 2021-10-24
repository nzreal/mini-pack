import Compiler from './libs/Compiler';
import parseConfig from './libs/parseConfig';
import { WebpackConfig } from './types';
import errorHandler from './utils/errorHandler';

const run = (config?: WebpackConfig) => {
  try {
    const compiler = new Compiler({});
    config = parseConfig(config) as WebpackConfig;
    // apply default config
    compiler.config = config;
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
