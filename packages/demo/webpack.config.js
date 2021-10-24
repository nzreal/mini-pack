import path from 'path';
import TestPlugin from './plugins/TestPlugin';

export default {
  mode: 'production',
  entry: './src/index.js',
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'bundle.js',
  },
  plugins: [new TestPlugin()],
};
