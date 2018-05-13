---
published: true
layout: post
comments: true
date: '2018-04-27 20:00 +08:00'
type: post
status: publish
categories:
  - linux
  - DevOps
tags:
  - snap
title: Snap - 新的linux系统包管理工具
---
2016年六月的时候，“通用linux包” “[Snap](https://snapcraft.io)”项目宣布启动。**所有**linux系统（桌面版，服务器版，嵌入式）将会支持此工具。

到现在，许多linux系统已经默认包含了这个工具。例如[Ubuntu 16.04.4 LTS](http://releases.ubuntu.com/16.04/)。

这个工具做的工作，可以说是将要取代apt, yum, dnf, pkg。 

此工具可以自动更新包，安装同一个包的不同版本，使用过nvm的就会想这个很类似。

例如：
```shell
sudo snap install node --classic --channel=8
```
安装了node8， --channel 参数表示版本8 --classic表示安装的工具具有的限制（confinement）。

而如果安装了多个版本的node，则可以通过如下命令来切换
```shell
sudo snap refresh node --channel=9
```
这样通过refresh参数，将node切换到了version 9。

PS:
目前使用snap还是有些问题，例如，我安装了node 6,但是使用yarn时，其使用的却是内置的node 4,导致找这个问题找了半天，很是迷惑(node -v是6,但是yarn实际还是用的node 4)。


## Refs:
- [https://insights.ubuntu.com/2016/06/14/universal-snap-packages-launch-on-multiple-linux-distros](https://insights.ubuntu.com/2016/06/14/universal-snap-packages-launch-on-multiple-linux-distros)

- [https://nodesource.com/blog/installing-nodejs-tutorial-using-snaps-on-linux/](https://nodesource.com/blog/installing-nodejs-tutorial-using-snaps-on-linux/)
