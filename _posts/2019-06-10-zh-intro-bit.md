---
published: true
layout: post
comments: true
date: '2019-06-10 20:00 +08:00'
type: post
title: '组件管理工具-bit介绍'
categories:
  - javascript
  - frontend
tags:
  - bit
---

[bit](https://bit.dev/)是开源的专注于解决前端组件可重用可维护问题的 nodejs 工具。

这里组件(component)可以是任何可重用的 nodejs 代码片段,然而更多的指的是可以重用的前端组件。[例子们](https://bit.dev/components)

bit 通过提供命令行工具来添加管理共享组件。

## 添加组件

例如你有一个项目，在 src/components/dropdownList 目录下有你想共享的组件。那么可以通过`bit add rc/components/dropdownList`来添加此组件，bit 会分析代码来构建依赖生成此组件的 package.json。更多`add`命令选项可查找[这里](https://docs.bit.dev/docs/cli-add.html)。

类似 git,bit 可以 tag 你的组件，具有版本维护的一系列功能。

## 使用组件

可以使用 npm 命令来使用 bit 组件
`npm install @bit/<account-name>.<collection-name>.add`

## 与 npm 流程的区别?

我觉得 bit 更细粒化。

## [定价](https://bit.dev/pricing)

个人版免费,最多 3 个私有集合，无限制的共有集合。

> 详细参见[官方文档](https://docs.bit.dev/tutorial/node-tutorial.html)
