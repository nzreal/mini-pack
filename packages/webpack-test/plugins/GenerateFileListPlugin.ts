import { Compilation, Compiler, sources } from 'webpack';

const PluginName = 'GenerateFileListPlugin';

/**
 * GenerateFileListPlugin
 * @description 输出打包产物 md 文件
 */
export default class GenerateFileListPlugin {
  // TODO: 添加打包前文件列表
  apply(compiler: Compiler) {
    compiler.hooks.thisCompilation.tap(PluginName, (compilation) => {
      compilation.hooks.processAssets.tap(
        {
          name: PluginName,
          stage: Compilation.PROCESS_ASSETS_STAGE_ADDITIONS,
          // additionalAssets: () => {},
        },
        (comAssets) => {
          // console.log('comAssets: ', comAssets);
          // comAssets;
          let fileList = 'Building output:\n\n';

          // 遍历所有编译过的资源文件，
          // 对于每个文件名称，都添加一行内容。
          for (const filename in comAssets) {
            fileList += '- ' + filename + '\n';
          }

          Object.assign(comAssets, {
            'fileList.md': new sources.RawSource(fileList),
          });
        }
      );
    });
  }
}
