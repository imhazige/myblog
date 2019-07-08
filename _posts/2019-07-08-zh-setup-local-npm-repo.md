---
published: true
layout: post
comments: true
date: '2019-07-08 00:00 +08:00'
type: post
title: '使用verdaccio发布本地npm包'
categories:
  - nodejs
tags:
  - npm
---

如果想将自己的 npm 包共享给多个项目，然而又不想公开此包，就不能发布到免费的 npm repository。可使用[verdaccio](https://verdaccio.org/en)来假设本地私有仓库，就不需要使用付费的 npm 私有仓库了。

### 安装

`npm install -g verdaccio`，如果权限不够则需要加 `sudo`

### 运行

`verdaccio`
此时会显示配置文件以及服务器地址。

```bash
 warn --- config file  - ~/.config/verdaccio/config.yaml
 warn --- Plugin successfully loaded: verdaccio-htpasswd
 warn --- Plugin successfully loaded: verdaccio-audit
 warn --- http address - http://localhost:4873/ - verdaccio/4.0.4
```

可见默认地址是`http://localhost:4873/`,默认配置文件是`~/.config/verdaccio/config.yaml`

### 修改配置允许匿名发布

这里示例简便起见，本地允许所有包匿名发布下载

```yaml
packages:
  '**':
    access: $anonymous
    publish: $anonymous
    proxy: npmjs
```
