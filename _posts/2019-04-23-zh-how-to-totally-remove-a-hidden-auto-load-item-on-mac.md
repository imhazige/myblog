---
published: true
layout: post
comments: true
date: '2019-04-23 20:00 +08:00'
type: post
title: '完全删除Mac上的隐藏的自动启动项'
categories:
  - Mac
tags:
  - bash
---

今天在我的 Mac 上下载了某个国外的 Anyxxx 软件，软件官网下载，安装后试了一下就删除了。但是不久弹出一个广告弹框，就是这个软件弹的，心里想，糟糕，碰到个流氓软件了。

果不其然，Login Items 里找不到，运行`launchctl list >> abc.txt`在文本里查找，找到了这一项。

然后在 Activity Monitor 里面点击详情，就可看到是哪个文件夹。将这个文件夹删除，再在 Activity Monitor 中将这个服务退出。

重启 Mac 试一下，服务里已没这个软件，也没有弹窗。搞定！
