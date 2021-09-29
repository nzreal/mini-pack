import { WebpackConfig } from '../types';
import buildModuleGraph from './buildModuleGraph';
import { outputBundle } from './outputBundle';
import parseConfig from './parseConfig';

export default class CoreWebpack {
  webpackConfig?: WebpackConfig;

  constructor() {
    this.webpackConfig = parseConfig() || ({} as WebpackConfig);

    const { entry, output } = this.webpackConfig;
    const moduleGraph = buildModuleGraph(entry);
    outputBundle(entry, output, moduleGraph);
  }
}
