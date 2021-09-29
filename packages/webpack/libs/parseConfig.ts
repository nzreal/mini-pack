import { WebpackConfig } from '../types';
import fse from 'fs-extra';
import path from 'path';

const defaultConfigName = 'webpack.config';
// 可接收的文件后缀
const ConfigFileAddon = ['js', 'ts', 'json'];

//
const webpackConfig = {};

// TODO: 参数补充 随缘
// 处理命令行参数
function optionProcessor(
  configKey: string,
  packingConfig: Record<string, any>
) {
  switch (configKey) {
    // 有很多 不一一写了
    case '--config':
      break;
    case '-p':
      return (params: string[]) => {
        Object.assign(packingConfig, { mode: params[0] });
      };
    default: {
      throw new Error(`${configKey} is an invalid config option`);
    }
  }
}

function configAssigner(config: Record<string, any>) {
  Object.assign(webpackConfig, config.__esModule ? config.default : config);
}

// 格式化 命令行输入
function getFormatInputArgs() {
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

// 解析 webpack.config
export default function parseConfig() {
  try {
    const parsedOptions = getFormatInputArgs();

    const configOption = parsedOptions.filter(
      (option) => option[0] === '--config'
    )[0];

    // 读取 webpack.config 配置
    if (!configOption[0]) {
      // 没有指定配置时 从默认路径读取
      ConfigFileAddon.forEach((addon) => {
        const configPath = path.resolve(
          process.cwd(),
          `${defaultConfigName}.${addon}`
        );

        if (!fse.existsSync(configPath)) {
          return;
        }

        const config = require(configPath);
        if (config) {
          configAssigner(config);
        }
      });
    } else if (configOption[0] && configOption[1] && configOption.length <= 2) {
      // 指定
      const configPath = path.resolve(process.cwd(), parsedOptions[0][1]);
      const config = require(configPath);
      if (config) {
        configAssigner(config);
      }
    } else {
      throw new Error('--config param is invalid');
    }

    // 读取配置后处理其余输入
    parsedOptions.forEach((parsedOption) => {
      const [option, ...params] = parsedOption;
      optionProcessor(option, webpackConfig)?.(params);
    });

    return webpackConfig as WebpackConfig;
  } catch (e) {
    console.error('parse config error: ', e);
    process.exit(1);
  }
}
