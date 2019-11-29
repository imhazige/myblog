---
published: true
layout: post
comments: true
date: '2019-11-29 00:00 +08:00'
type: post
title: 'package-lock.json 与 npm-shrinkwrap的区别'
categories:
  - nodejs
tags:
  - npm
---
## 区别
- package-lock.json 不会发布到npm
- npm-shrinkwrap.json会发布到npm
- package-lock.json只对顶层依赖有效
- npm-shrinkwrap.json会对所有层级子依赖有效
- 因此npm-shrinkwrap.json会严格按照指定的版本下载依赖，导致同一个库由于多个不同的包传递依赖不同的版本，而形成多个版本同时存在的情况（当然这个不会有问题）
- package-lock.json则只需要兼容即可，同一个库大部分只有一个版本。

## 结论
一般使用package-lock.json是提倡的，无论是发布包到npm还是实际执行的代码（配合`npm ci`而不是`npm install`）。

如果你要严格界定版本与你开发时完全一致，则应该使用`npm-shrinkwrap.json`。

> ## 参见
> [What is the difference between npm-shrinkwrap.json and package-lock.json?](https://stackoverflow.com/questions/44258235/what-is-the-difference-between-npm-shrinkwrap-json-and-package-lock-json)