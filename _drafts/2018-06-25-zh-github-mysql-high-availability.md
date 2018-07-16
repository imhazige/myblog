---
published: false
layout: post
comments: true
date: '2018-06-25 20:00 +08:00'
type: post
categories:
  - database
tags:
  - mysql
  - cluster
title: github怎样实施mysql高可用性(HA)
---
> 本文内容主要来自[MySQL High Availability at GitHub](https://githubengineering.com/mysql-high-availability-at-github/); [Orchestrator at GitHub](https://githubengineering.com/orchestrator-github/)



## 简单概括
- 怎么做到最小downtime?
- 单一master怎样同步到备份数据库，log？


## Refs
[Github工程师为MySQL高可用性采用了新架构](http://www.infoq.com/cn/news/2018/07/github-mysql-high-availability)
