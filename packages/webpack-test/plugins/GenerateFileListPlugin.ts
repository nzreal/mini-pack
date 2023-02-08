import { Module, WebpackPluginInstance } from 'webpack';
import { Compilation, Compiler, sources } from 'webpack';

interface GenerateFileListPluginOptions {
  showFilesBeforeProcessed?: boolean;
  showBundledFiles?: boolean;
}

const PluginName = 'GenerateFileListPlugin';

const DefaultOptions: Required<GenerateFileListPluginOptions> = {
  showFilesBeforeProcessed: true,
  showBundledFiles: true
}

/**
 * GenerateFileListPlugin
 * @description 输出打包产物 md 文件
 */
export default class GenerateFileListPlugin implements WebpackPluginInstance {
  options: GenerateFileListPluginOptions;

  constructor(options?: GenerateFileListPluginOptions) {
    this.options = Object.assign({}, DefaultOptions, options);
  }

  apply(compiler: Compiler) {
    const { showBundledFiles, showFilesBeforeProcessed } = this.options

    /**
     * 本次编译阶段，进行处理文件，此时文件还未被编译打包
     */
    // compiler.hooks.thisCompilation.tap(PluginName, (compilation) => {
    //   compilation.hooks.processAssets.tap(
    //     {
    //       name: PluginName,
    //       stage: Compilation.PROCESS_ASSETS_STAGE_ADDITIONS,
    //     },
    //     () => {
    //     }
    //   );
    // });

    /**
     * emit 阶段进行输出文件，此时已打包完毕
     */
    compiler.hooks.emit.tap(PluginName, compilation => {
      let fileList: string = '# File List\n';

      if (showFilesBeforeProcessed) {
        fileList += '## Files before bundled:\n'
        // 遍历 modules 获取文件名 id
        compilation.modules.forEach(module => {
          // TODO: 参数优化？
          if (module.rawRequest) {
            fileList += `- ${module.rawRequest}\n`
          }
        })
      }

      if (showBundledFiles) {
        fileList += (showFilesBeforeProcessed ? '\n' : '') + '## Building bundled output:\n';

        const comAssets = compilation.getAssets()

        // 遍历所有编译过的资源文件，
        // 对于每个文件名称，都添加一行内容。
        comAssets.forEach(asset => {
          fileList += `- ${asset.name}\n`
        })
      }

      compilation.emitAsset('fileList.md', new sources.RawSource(fileList))
    })
  }
}
