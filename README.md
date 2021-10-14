# Mini-pack

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

## 功能（已实现）

- 读取配置文件
- 单入口文件构建依赖图打包输出 bundle

## 项目目录

```
- packages
  - demo // demo
  - webpack // mini-pack
  - webpack-test // 实际 webpack 对照组
```

## TODO

- [ ] mini-pack 实现 loader 系统
- [ ] 实现 dev server
- [x] webpack 插件编写实践
- [ ] 代码结构优化
- [ ] test 单测编写 & 插件系统测试
