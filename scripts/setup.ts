import { exec } from 'child_process';
import fse from 'fs-extra';
import path from 'path';

const name = 'node_modules';
const packagesPath = path.resolve(process.cwd(), 'packages');

const nodeModulesDirs = [path.resolve(process.cwd(), name)];
const packages = fse.readdirSync(packagesPath);

packages.forEach((pck) => {
  const nodeModulesPath = path.resolve(packagesPath, pck, name);
  fse.existsSync(nodeModulesPath) && nodeModulesDirs.push(nodeModulesPath);
});

nodeModulesDirs.forEach(async (dir) => {
  await fse.emptyDir(dir);
  fse.rmdir(dir);
});

exec('yarn');
