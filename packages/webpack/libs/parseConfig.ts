import { WebpackConfig } from '../types';
import fse from 'fs-extra';
import path from 'path';
import Compiler from './Compiler';

const DefaultConfigName = 'webpack.config';
// 可接收的文件后缀
const ConfigFileAddon = ['js', 'ts', 'json'];

const webpackConfig = {};

/**
 * 解析 config
 */
export default function parseConfig(this: Compiler) {
  try {
    const parsedOptions = getOptionsFromCmdLine();

    const [, configFile] =
      parsedOptions.filter(([tag]) => tag === '--config')[0] || [];

    // 读取 webpack.config 配置
    readWebpackConfig(configFile, this.execRootPath);

    // 读取配置后处理其余输入
    parsedOptions.forEach((parsedOption) => {
      const [option, ...params] = parsedOption;
      optionProcessorFactory(option)?.(params);
    });

    return webpackConfig as WebpackConfig;
  } catch (e) {
    console.error('parse config error: ', e);
    process.exit(1);
  }
}

// TODO: 参数补充 随缘
// 处理命令行参数
function optionProcessorFactory(configKey: string) {
  switch (configKey) {
    // 有很多 不一一写了
    case '--config':
      break;
    case '-p':
      return (params: string[]) => {
        Object.assign(webpackConfig, { mode: params[0] });
      };
    default: {
      throw new Error(`${configKey} is an invalid config option`);
    }
  }
}

function configAssigner(config: Record<string, any>) {
  Object.assign(webpackConfig, config.__esModule ? config.default : config);
}

function readWebpackConfig(configFile: string, rootPath: string) {
  if (!configFile) {
    // 没有指定配置时 从默认路径读取
    ConfigFileAddon.forEach((addon) => {
      const configPath = path.resolve(
        rootPath,
        `${DefaultConfigName}.${addon}`
      );

      if (!fse.existsSync(configPath)) {
        return;
      }

      const config = require(configPath);
      if (config) {
        configAssigner(config);
      }
    });
  } else if (configFile) {
    // 指定
    const configPath = path.resolve(rootPath, configFile);
    const config = require(configPath);
    if (config) {
      configAssigner(config);
    }
  } else {
    throw new Error('--config param is invalid');
  }
}

/**
 * 将 ['-p', 'none', '-config', 'config.js', '-w', 'multi', '1', '2']
 */
function getOptionsFromCmdLine() {
  const inputArgs = process.argv.slice(2);

  const parsedOptions: Array<string[]> = [];

  if (!inputArgs.length) {
    return parsedOptions;
  }

  let argsIdx = 0;

  while (argsIdx < inputArgs.length) {
    if (inputArgs[argsIdx].startsWith('-')) {
      const curOption = inputArgs[argsIdx++];

      parsedOptions.push([curOption]);

      while (
        argsIdx < inputArgs.length &&
        !inputArgs[argsIdx].startsWith('-')
      ) {
        const curParam = inputArgs[argsIdx++];
        parsedOptions[parsedOptions.length - 1].push(curParam);
      }
    }
  }

  return parsedOptions;
}
