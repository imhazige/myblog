---
published: true
layout: post
comments: true
date: '2019-03-26 20:00 +08:00'
type: post
title: 'Debian 归档Wheezy,Jessie版本'
categories:
  - devops
tags:
  - docker
  - debian
---

2019 年 3 月 debian [发表声明](https://lists.debian.org/debian-devel-announce/2019/03/msg00006.html)宣布系统的分支 Wheezy,Jessie 将归档，这导致其资源链接由原来的 deb.debian.org 转到 archive.debian.org, 最终结果是，许多依赖 debian:wheezy 或 debian:jessie 的 docker 镜像不能构建。
常见的异常是:
`Err http://deb.debian.org jessie-updates/main amd64 Packages`

`Failed to fetch http://deb.debian.org/debian/dists/jessie-updates/main/binary-amd64/Packages 404 Not Found`

各位 Docker 镜像作者需要赶快采取应对措施。

参见这个[issue](https://github.com/docker-library/official-images/issues/3551).
