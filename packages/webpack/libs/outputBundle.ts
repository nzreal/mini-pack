import Compiler from './Compiler';
import Template from './Template';
import fse from 'fs-extra';
import path from 'path';

export function outputBundle(this: Compiler) {
  const { entry, output } = this.config;

  const bundledFile = new Template({
    entry,
    moduleGraph: this.moduleGraph,
  }).code;

  !fse.existsSync(output.path) && fse.mkdirSync(output.path);
  fse.writeFileSync(path.resolve(output.path, output.filename), bundledFile);
}
