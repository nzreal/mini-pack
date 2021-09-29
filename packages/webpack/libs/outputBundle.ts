import { ModuleGraph, Output } from '../types';

import Template from './Template';
import fse from 'fs-extra';
import path from 'path';

export function outputBundle(
  entry: string,
  output: Output,
  moduleGraph: ModuleGraph
) {
  const bundledFile = new Template({ entry, moduleGraph }).code;

  !fse.existsSync(output.path) && fse.mkdirSync(output.path);
  fse.writeFileSync(path.resolve(output.path, output.filename), bundledFile);
}
