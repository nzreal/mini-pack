# Mini Pack

**a simple webpack and demo**

## 快速开始

#### 用 mini-pack 为 demo 项目打包

```shell
yarn build-demo
```

#### 用 webpack 为 webpack-test 项目打包

```shell
yarn build-test
```

## 功能

- 读取配置文件
- 单入口文件构建依赖图打包输出 bundle
- 支持简易插件系统

## 项目目录

```markdown
- packages
  - demo // demo
  - webpack // mini-pack
  - webpack-test // 实际 webpack 对照组
```

## TODO TREE

- Loader 系统
- Plugin 系统 - WIP
  - [ ] mini-pack 实现 loader 系统
- 实现 dev server
- webpack 实践
  - [x] webpack 插件编写实践
  - [x] loader 编写实践
- 代码结构优化
  - [ ] test 单测编写 & 插件系统测试
