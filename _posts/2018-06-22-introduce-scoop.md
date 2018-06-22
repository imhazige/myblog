---
published: true
layout: post
comments: true
date: '2018-06-22 20:00 +08:00'
title: scoop介绍-windows下的apt-get
type: post
categories:
  - windows
tags:
  - shell
  - powershell
---
## scoop是什么
[Scoop](https://scoop.sh/)是windows下的命令行工具安装管理工具，类似ubuntu的apt-get,或者mac上的homebrew.

使用scoop可以通过命令行安装在unix上颇受欢迎的工具，例如
```shell
scoop install curl
```
这对开发者非常便利。
由于工具都是默认安装在用户文件夹，所以不存在管理员权限要求的问题。

## 安装scoop

### 安装前提
需要颇为powershell3以上，那么还在用windows7的就不用想了。

### 怎样查看pwoershell版本?
```shell
powershell $psversiontable.psversion
```
其中的Major就是主版本号，要大于3

### 安装
```shell
powershell
iex (new-object net.webclient).downloadstring('https://get.scoop.sh')
```

## 那些工具可以通过scoop安装
见[这里](https://github.com/lukesampson/scoop/tree/master/bucket)
但不限于这上面的
例如electron需要的windows-build-tools
```shell
sudo npm uninstall --global windows-build-tools
sudo npm install --global windows-build-tools
```
