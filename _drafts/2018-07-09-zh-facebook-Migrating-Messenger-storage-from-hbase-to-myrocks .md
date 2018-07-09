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

据facebook介绍，转换的出发点当然是为了提升性能:
- mysql复制拓扑结构更适合facebook的数据中心环境
- 使得能够在减少物理复制个数的情况下同时提高可用性(availability)和容灾恢复(disaster recovery)。

Messenger这么大的吞吐量(1 billion accounts，十亿用户)的项目从NOSQL(hbase)又回到了SQL(mysql),这个视角的原因，文中并没有提到。

## [myrocks 优化写性能和存储空间的mysql引擎](MyRocks: A space- and write-optimized MySQL database)
其实myrocks读写都优化了,只是写优化更明显。

- 将pagesize从8kb（innodb）减少为5kb
- 使用LSM算法优化写
- 减少索引，元数据的存储空间，总体减少更多的存储空间

## 无宕机时间的迁移策略
这个过程还有个亮点是无宕机的完全迁移，简言之是初期同时写入旧的数据库hbase,和新的数据库myrocks.

![statemachine-new-code.png]({{site.baseurl}}/assets/img/statemachine-new-code.png)

经过多方验证后保证所有数据已完全切换到myrocks后，再将hbase下线，用户完全感受不到这个过程。

