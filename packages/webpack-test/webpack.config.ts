import ClearCommentsPlugin from "./plugins/ClearCommentsPlugin";
import GenerateFileListPlugin from "./plugins/GenerateFileListPlugin";
// import TerserPlugin from 'terser-webpack-plugin';
import OutputAllLifeCyclePlugin from "./plugins/OutputAllLifeCyclePlugins";
import Webpack from "webpack";
import path from "path";
import HTMLPlugin from "html-webpack-plugin";

const config: Webpack.Configuration = {
  mode: "development",
  entry: "./src/index.js",
  output: {
    path: path.resolve(__dirname, "dist"),
    filename: "webpack.bundle.js",
  },
  resolveLoader: {
    modules: ["node_modules", "loaders"],
    extensions: [".ts", ".js"],
  },
  module: {
    rules: [
      // {
      //   test: /\.js$/,
      //   exclude: /node_modules/,
      //   loader: 'clear-loader',
      //   options: { comments: true, console: false },
      //   // use: { loader: 'clear-comments-loader', options: { clear: true } },
      // },
    ],
  },
  plugins: [
    new OutputAllLifeCyclePlugin({ disableLog: true }),
    new ClearCommentsPlugin({ rule: /\.js$/ }),
    new GenerateFileListPlugin(),
    new Webpack.DefinePlugin({
      ahh: "1",
    }),
    new HTMLPlugin({
      template: "./public/template.html",
    }),
  ],

  // devServer: {
  //   static: {
  //     directory: path.join(__dirname, 'public/template.html'),
  //   },
  //   port: 9000,
  // },

  stats: "errors-only",
  // optimization: {
  //   // minimize: true,
  //   // minimizer: [
  //   //   new TerserPlugin({
  //   //     extractComments: true,
  //   //   }),
  //   // ],
  // },
};

export default config;
