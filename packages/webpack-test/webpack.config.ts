import path from 'path';
import Webpack from 'webpack';
import TerserPlugin from 'terser-webpack-plugin';
import ClearCommentPlugin from './plugins/OutputAllLifeCyclePlugins';

const config: Webpack.Configuration = {
  mode: 'production',
  entry: './src/index.js',
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'webpack.bundle.[hash:6].js',
  },
  plugins: [new ClearCommentPlugin()],
  optimization: {
    // minimize: true,
    // minimizer: [
    //   new TerserPlugin({
    //     extractComments: true,
    //   }),
    // ],
  },
};

export default config;
