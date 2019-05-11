---
published: true
layout: post
comments: true
date: '2019-05-11 20:00 +08:00'
type: post
title: 'lowjs-用于嵌入式设备的nodejs环境'
categories:
  - nodejs
tags:
  - embeded
---

[lowjs](https://www.lowjs.org)是用于嵌入式设备，单片机的 Node.js 环境，适用于便宜，低耗能的使用场景。

## [Nodejs 的实现情况](https://www.lowjs.org/documentation/nodejs-api.html)

目前 70%的接口已经实现，另外 30%仍在实现中。

如下接口则不会实现：
worker cluster ， child_process 等进程模块，lowjs 没有进程的概念。
Debugger 和 v8, 而是使用 `neonious` 调试器`。
Internalization, as not required for typical microcontroller usage

## [对第三方 npm 模块的支持](https://www.lowjs.org/documentation/npm-modules.html)

总的来说你可以安装，但是能不能用需要你自己验证，因为这一块太大了。

- 目前测试 express 可用。
- request 不支持 https。
- ws 部分支持。

## 开发方式

通过 USB 串口 与 PC 相连，使用`lowsync`来同步开发 PC 和单片机之间的程序和日志。

## WIFI 和磁盘空间

lowjs 自动控制网络，这个简便许多。
磁盘空间一般是 1M，最大可调至 12M。
