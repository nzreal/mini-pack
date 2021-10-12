import { Compiler, sources } from 'webpack';
import { transformFromAstSync, traverse } from '@babel/core';
import { parse } from '@babel/parser';
import * as t from '@babel/types';

const PluginName = 'ClearCommentsPlugin';

interface PluginOptions {
  rule?: RegExp;
}

/**
 * @name ClearCommentsPlugin
 * @description 清空输出文件中的注释
 */
export default class ClearCommentsPlugin {
  options: Required<PluginOptions>;

  constructor(options: PluginOptions = {}) {
    const defaultOptions: Partial<PluginOptions> = {
      rule: /\S\.\S$/,
    };
    this.options = Object.assign(
      {},
      defaultOptions,
      options
    ) as Required<PluginOptions>;
  }

  apply(compiler: Compiler) {
    compiler.hooks.compilation.tap(PluginName, (compilation) => {
      compilation.hooks.processAssets.tap(
        {
          name: PluginName,
          stage: compiler.webpack.Compilation.PROCESS_ASSETS_STAGE_PRE_PROCESS,
        },
        (assets) => {
          const { rule } = this.options;
          for (const name in assets) {
            // match rule
            if (Object.hasOwnProperty.call(assets, name) && name.match(rule)) {
              const asset = compilation.getAsset(name); // 通过asset名称获取到asset

              if (!asset) break;

              const contents = asset.source.source() as string; // 获取到asset的内容

              let resultCode = '';

              // js 文件走 babel 移除
              if (name.endsWith('.js')) {
                const ast = parse(contents, { sourceType: 'module' });

                traverse(ast, {
                  Program(path) {
                    path.traverse({
                      enter({ node }) {
                        t.removeComments(node);
                      },
                    });
                  },
                });

                const { code } = transformFromAstSync(ast, undefined) || {};

                resultCode = code || '';
                // 其余文件走正则替换
              } else {
                resultCode = contents
                  .replace(/\/\/.*/g, '')
                  .replace(/\/\*.*?\*\//g, '');
              }

              // 更新asset的内容
              compilation.updateAsset(name, new sources.RawSource(resultCode));
            }
          }
        }
      );
    });
  }
}
