import { ModuleGraph } from '../types';

export const WebpackRequire = 'require';

interface FuncGenParams {
  formatParams?: string;
  actualParams?: string;
  code?: string | string[];
  name?: string;
}

interface TemplateGenParams {
  moduleGraph: ModuleGraph;
  entry: string;
}

export default class Template {
  templateParams: TemplateGenParams;
  useArrowFunc = false;
  code: string;

  constructor(params: TemplateGenParams) {
    this.templateParams = params;
    this.code = this.genSimpleBundle();
  }

  genFunction = (value: FuncGenParams) => {
    const { name = '', formatParams = '' } = value;
    let code = value.code || '';
    if (Array.isArray(code)) {
      code = code.reduce(
        (genedCode, snippet) => genedCode + snippet + '\n',
        ''
      );
    }
    return !this.useArrowFunc
      ? `function ${name}(${formatParams}) { \n${code}\n }`
      : `${name ? `const ${name} = ` : ''}(${formatParams}) => { \n${code}\n }`;
  };

  genFunctionIIEF = (value: FuncGenParams) => {
    const { actualParams = '', ...restValue } = value;
    return `;(${this.genFunction(restValue)})(${actualParams})`;
  };

  genRequire(entry: string) {
    return `${WebpackRequire}('${entry}')`;
  }

  genSimpleBundle() {
    const { moduleGraph, entry } = this.templateParams;
    return this.genFunctionIIEF({
      formatParams: 'moduleGraph',
      actualParams: JSON.stringify(moduleGraph),
      code: [
        this.genFunction({
          formatParams: 'moduleId',
          name: WebpackRequire,
          code: [
            'var exports = {}',
            this.genFunctionIIEF({
              formatParams: 'exports, code',
              code: 'eval(code)',
              actualParams: 'exports, moduleGraph[moduleId].code',
            }),
            'return exports',
          ],
        }),
        this.genRequire(entry),
      ],
    });
  }

  /**
   * complete
   */
  genRequireFunction() {
    const generateFunction = this.genFunction;
    return generateFunction({
      name: WebpackRequire,
      formatParams: 'moduleId',
      code: `var module = (__webpack_module_cache__[moduleId] = {
        exports: {},
      });
      __webpack_modules__[moduleId](module, module.exports, __webpack_require__);
      return module.exports;`,
    });
  }
}
