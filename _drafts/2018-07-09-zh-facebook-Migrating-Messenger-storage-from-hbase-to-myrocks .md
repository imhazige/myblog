---
published: false
layout: post
comments: true
date: '2018-07-09 20:00 +08:00'
type: post
title: facebook 将数据库从hbase切换到myrocks以提高性能
categories:
  - database
tags:
  - mysql
  - myrock
  - hbase
---
> 本文内容主要来自[Migrating Messenger storage to optimize performance](https://code.fb.com/data-infrastructure/migrating-messenger-storage-to-optimize-performance/)

最近facebook宣布已成功完全将messenger数据库从[hbase](https://github.com/apache/hbase)软切换到[myrocks](https://github.com/facebook/mysql-5.6)。这样做的结果就是提高了性能，节约了存储空间。


facebook messenger最开始使用的是[cassandra](https://github.com/apache/cassandra),后来将其开源并移交了apache基金会，后来messenger又转为使用hbase,现在又转为myrocks - 一个facebook的mysql的引擎实现。

这其中主要的特点是从普通硬盘(spinning disk)到flash硬盘,使用的是facebook的[Lightning Server SKU](https://code.fb.com/data-center-engineering/introducing-lightning-a-flexible-nvme-jbof/)服务。

据facebook介绍，转换的出发点当然是为了提升性能，mysql复制拓扑结构更适合facebook的数据中心环境。使得能够在减少物理复制个数的情况下同时提高可用性(availability)和容灾恢复(disaster recovery)。

Messenger这么大的吞吐量的项目从NOSQL(hbase)又回到了SQL(mysql),这个视角的原因，文中并没有提到。


