import { WebpackConfig } from '../types';
import fse from 'fs-extra';
import path from 'path';
import errorHandler from '../utils/errorHandler';

const runRootPath = process.cwd();
const DefaultConfigName = 'webpack.config';
// 可接收的文件后缀
const AcceptedExtensions = ['js', 'ts', 'json'];

/**
 * 解析 config
 */
export default function parseConfig(config?: WebpackConfig) {
  try {
    const parsedOptions = getOptionsFromCLI();

    const [, configFile] =
      parsedOptions.filter(([tag]) => tag === '--config')[0] || [];

    // 读取 webpack.config 配置文件
    if (!config) {
      config = readConfigFile(configFile);
    }

    // 处理命令行输入
    parsedOptions.forEach((parsedOption) => {
      const [option, ...params] = parsedOption;
      optionProcessorFactory(config as WebpackConfig, option)?.(params);
    });

    return config;
  } catch (e) {
    errorHandler(`parse error ${e}`);
  }
}

// TODO: 参数补充 随缘
// 处理命令行参数
function optionProcessorFactory(config: WebpackConfig, configKey: string) {
  switch (configKey) {
    // 有很多 不一一写了
    case '--config':
      break;
    case '-p':
      return (params: string[]) => {
        Object.assign(config, { mode: params[0] });
      };
    default:
      errorHandler(
        'Parse CLI error',
        `${configKey} is an invalid config option`
      );
  }
}

/**
 * @name readWebpackConfig
 * @description 读取 webpack config 文件
 */
function readConfigFile(configFile: string): WebpackConfig {
  let configPath;

  if (!configFile) {
    // 没有从命令行指定配置时 从默认路径读取
    configPath = AcceptedExtensions.filter((ext) => {
      const tmpPath = path.resolve(runRootPath, `${DefaultConfigName}.${ext}`);
      return fse.existsSync(tmpPath);
    })[0];
  } else if (configFile) {
    // 指定
    const tmpPath = path.resolve(runRootPath, configFile);

    if (!fse.existsSync(tmpPath)) {
      errorHandler(
        `config file '${configFile}'' doesn't exist in root dir path '${runRootPath}'`
      );
    }
    configPath = tmpPath;
  } else {
    errorHandler('--config param is invalid');
  }

  const file = require(configPath as string);

  return file.__esModule ? file.default : file;
}

/**
 * 将 ['-p', 'none', '-config', 'config.js', '-w', '--multi', '1', '2']
 *
 * 格式化为
 *
 * [
 *  ['-p', 'none'],
 *  ['-config', 'config.js'],
 *  ['-w'],
 *  ['--multi', '1', '2']
 * ]
 */
function getOptionsFromCLI() {
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
