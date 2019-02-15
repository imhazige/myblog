---
published: false
layout: post
comments: true
date: '2019-02-15 20:00 +08:00'
type: post
title: '查看git历史的几种方法'
categories:
  - git
tags:
  - git
---

## 使用 git 命令行 [git log](https://www.git-scm.com/docs/git-log)

`git log --follow -p <filename>`

`--follow`参数表示跟踪文件名修改  
`-p`参数表示显示每个提交的不同

这种方式没有界面，适合在没有 GUI 的 linux 系统上使用

## 使用 [gitk](https://git-scm.com/docs/gitk)

`gitk <filename>`

有界面的比较工具
![](https://upload-images.jianshu.io/upload_images/618971-e1bde85ebf81c8ca.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1000/format/webp)

## 使用 [git-history](https://github.com/pomber/git-history)

`npx git-file-history <filename>`

对于 nodejs 用户,可使用这个工具
![](https://githistory.xyz/static/media/demo.165514d4.gif)

## 使用 [sourcetree](https://www.sourcetreeapp.com/)

需要智能上网

![](https://images2015.cnblogs.com/blog/569926/201701/569926-20170109094350088-888526871.png)
选中文件，右键选择菜单 log select
