---
published: true
layout: post
comments: true
date: "2020-02-02 00:00 +08:00"
type: post
title: "[摘译]十几年postgres使用者对其痛恨十大问题"
categories:
  - database
  - devops
tags:
  - postgres
---

摘译自[10 Things I Hate About PostgreSQL](https://medium.com/@rbranson/10-things-i-hate-about-postgresql-20dbab8c2791)

首先，作者从 2003 年开始就在产品线上使用 postgre, 他表示这十大问题都可以使用云数据库来解决，其实都是与运维相关。他仍然推荐使用 postgre。

## [事务 ID 实现导致使用磁盘空间过大，需要定期清理](https://blog.sentry.io/2015/07/23/transaction-id-wraparound-in-postgres)

## Failover 可能导致数据丢失

## 低效的备份复制导致崩溃

## multi-version concurrency control (MVCC) 导致垃圾回收造成的磁盘空间占用，需要定期清理

## 每个连接使用进程导致不易扩展

## 主健索引占用硬盘空间过多

## 主版本升级更新可能需要长时间停机

## 集群复制配置很繁琐

## 教条式的拒绝支持 No-Planner-Hints(查询计划提示)

## 没有 Block 压缩
