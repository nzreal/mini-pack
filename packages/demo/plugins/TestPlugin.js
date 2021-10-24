export default class TestPlugin {
  apply(compiler) {
    compiler.hooks.run.tap('TestPlugin', () => {
      console.log('test plugin');
    });
  }
}
