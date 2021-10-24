import * as babel from '@babel/core';
import * as t from '@babel/types';

import { ModuleGraph, ModuleInfo } from '../types';

import Compiler from './Compiler';
import fse from 'fs-extra';
import { parse } from '@babel/parser';
import path from 'path';
import { default as traverse } from '@babel/traverse';

/**
 * buildModuleGraph
 * @param entry 入口文件
 * @returns {ModuleGraph} 模块依赖图
 * @description 从入口文件构建模块依赖图
 */
export default function buildModuleGraph(this: Compiler) {
  this.hooks.compile.call('');

  const { entry } = this.config;

  const moduleGraph: ModuleGraph = {};

  const { name: pkgName } = parsePkg(this.execRootPath);

  const dependedModules = getDependedModulesByEntry(entry, this.execRootPath);

  dependedModules.forEach(({ moduleId, code, deps }) => {
    moduleGraph[moduleId] = {
      deps,
      code: addonSourceUrlInDevtool(code, moduleId, pkgName),
    };
  });

  this.hooks.afterCompile.callAsync('', (e) => e);

  return moduleGraph;
}

function parsePkg(rootPath: string) {
  try {
    const pkgInfo = JSON.parse(
      fse.readFileSync(path.resolve(rootPath, 'package.json'), {
        encoding: 'utf-8',
      })
    );
    return pkgInfo;
  } catch (e) {
    // error handler
  }
}

// 源码应该是 plugin
function addonSourceUrlInDevtool(
  code: string,
  filename: string,
  pkgName: string
) {
  return `${code}\n\n\n//# sourceURL=webpack://${pkgName}/${filename}`;
}

// 从入口模块获取所有依赖模块的数组
function getDependedModulesByEntry(entry: string, rootPath: string) {
  const entryModuleInfo = getModuleInfo(entry, rootPath);
  const parsedModules = [entryModuleInfo];

  function parseDependedModuleInfo(deps: string[]) {
    deps.forEach((depId) => {
      const dependedModuleInfo = getModuleInfo(depId, rootPath);
      parsedModules.push(dependedModuleInfo);
      parseDependedModuleInfo(dependedModuleInfo.deps);
    });
  }

  parseDependedModuleInfo(entryModuleInfo.deps);

  return parsedModules;
}

function getModuleInfo(module: string, rootPath: string): ModuleInfo {
  const moduleAbsPath = path.resolve(rootPath, module);
  const moduleCode = fse.readFileSync(moduleAbsPath, {
    encoding: 'utf-8',
  });

  const ast = parse(moduleCode, { sourceType: 'module' });

  // TODO: 执行 loader
  // 依赖收集
  const deps: string[] = [];

  traverse(ast, {
    ImportDeclaration(nodePath) {
      const { node } = nodePath;
      // 用文件路径 relative 当前执行脚本路径 获得 unique path 作为模块 Id depModuleId
      const dirname = path.dirname(moduleAbsPath);
      const absPath = path.join(dirname, node.source.value);
      const depModuleId = './' + path.relative(rootPath, absPath);

      nodePath.replaceWith(
        t.importDeclaration(node.specifiers, t.stringLiteral(depModuleId))
      );
      deps.push(depModuleId);
      nodePath.skip();
    },
  });

  const { code = '' } =
    babel.transformFromAstSync(ast, undefined, {
      presets: ['@babel/preset-env'],
    }) || {};

  const moduleInfo = {
    moduleId: module,
    deps,
    code: code as string,
  };

  return moduleInfo;
}
