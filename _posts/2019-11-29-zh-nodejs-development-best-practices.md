---
published: true
layout: post
comments: true
date: '2019-11-29 00:00 +08:00'
type: post
title: 'nodejs开发最佳实践'
categories:
  - nodejs
tags:
  - practices
---

## 使用npm init初始化项目
`npm init --yes`，一定要指明node版本
```json
"engines": {
  "node": "12.13.x"
}
```

## 使用`.npmrc`
一般`npm install foobar --save --save-exact`这样才是正确的安装依赖的方式，但是现在npm默认npm install和`npm install --save`一样的表现。
实际是通过这样的步骤来开启的：
```bash
npm config set save=true
npm config set save-exact=true
cat ~/.npmrc
```

## 文件全部用小些
因为UNIX是区分大小写的，因此`require`也是区分大小写的

## 使用多核资源
node默认只用一个cpu core，最多差不多1.5G内存。

可使用[多核cluster库](https://github.com/LearnBoost/cluster),它不需要关心配置多核的个数，支持插件，使用简单，对代码逻辑侵入较少。

对于node12增加了线程的支持，推荐使用配合[comlink](https://github.com/GoogleChromeLabs/comlink)。

## [避免内存回收](https://github.com/nodejs/node/issues/3370)
Nodejs默认是1.5G,懒GC，因此如果你的server明显小于1.5RAM时（例如heroku dyno），则应该指明`--max_old_space_size=`到server实际RAM大小。否则的话，node会一直到1.5G时才GC，而实际上在超出实际RAM时就卡住了，也不GC,程序也不相应。
指明--max_old_space_size后会在超出指定值时kill进程，这样至少对于heroku这样的自扩展架构，会产生新的dyno继续运行（同样适用于集群）。
