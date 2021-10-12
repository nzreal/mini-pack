import { LoaderDefinitionFunction } from 'webpack';
import { parse, ParserOptions } from '@babel/parser';
import { default as traverse, TraverseOptions } from '@babel/traverse';
import { transformFromAstSync } from '@babel/core';
import * as t from '@babel/types';

interface ClearLoaderOptions {
  console?: boolean;
  comments?: boolean;
  sourceType?: ParserOptions['sourceType'];
}

function injectTraverseOptions(
  target: Record<string, TraverseOptions>,
  traverseOptions: TraverseOptions
) {
  return Object.assign(target, traverseOptions);
}

// 清除代码注释
const clearLoader: LoaderDefinitionFunction = function (source) {
  let result = source;

  const options: ClearLoaderOptions = Object.assign(
    {
      console: true,
      comments: true,
      sourceType: 'module',
    },
    this.getOptions() as ClearLoaderOptions
  );

  const traverseOptions = {};

  if (options.console) {
    injectTraverseOptions(traverseOptions, {
      CallExpression(path) {
        if (t.isMemberExpression(path.node.callee)) {
          const { object, property } = path.node.callee;
          if (
            t.isIdentifier(object) &&
            object.name === 'console' &&
            t.isIdentifier(property) &&
            property.name in console
          ) {
            path.remove();
            path.skip();
          }
        }
      },
      // MemberExpression(path) {
      //   const { object, property } = path.node;
      //   if (
      //     t.isIdentifier(object) &&
      //     object.name === 'console' &&
      //     t.isIdentifier(property) &&
      //     property.name in console
      //   ) {
      //     path.remove();
      //     path.skip();
      //   }
      // },
    });
  }
  if (options.comments) {
    injectTraverseOptions(traverseOptions, {
      Program(path) {
        path.traverse({
          enter({ node }) {
            t.removeComments(node);
          },
        });
      },
    });
  }

  if (Object.keys(options).length) {
    const ast = parse(source, { sourceType: options.sourceType });
    traverse(ast, traverseOptions);
    result = transformFromAstSync(ast, undefined)?.code || '';
  }
  // loader必须要有输出，否则Webpack构建报错
  return result;
};

export default clearLoader;
