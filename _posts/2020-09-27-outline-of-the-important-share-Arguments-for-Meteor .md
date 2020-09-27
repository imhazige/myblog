---
published: true
layout: post
comments: true
date: "2020-09-27 00:00 +08:00"
type: post
title: "2020-09-27-outline-of-the-important-share-Arguments-for-Meteor"
categories:
  - nodejs
tags:
  - meteor.js
---

This article is the outline or note of the important share about meteor - ["Arguments for Meteor - Theodor Diaconu, CEO of Cult of Coders: “Redis Oplog, Grapher, and Apollo Live."](https://drive.google.com/file/d/1Tx9vO-XezO3DI2uAYalXPvhJ-Avqc4-q/view), because there are much useful experience on using meteor in production.

## [RedisOplog](https://github.com/cult-of-coders/redis-oplog)

![](https://res.cloudinary.com/kazge/image/upload/v1601185269/blog/redisoplog_lguilb.png)

This is the solution that improve mongodb oplog performance bottleneck. Simply to say, as the diagram above show, changes will goto mongodb, also noticed to Redis's high-performance pub/sub system and distributed to the clients. [More detail...](https://github.com/cult-of-coders/redis-oplog/blob/master/docs/how_it_works.md)

[It support Outside Mutations](https://github.com/cult-of-coders/redis-oplog/blob/master/docs/outside_mutations.md)

### The improve result with RedisOplog

- Hive.com
  - Avg CPU% has gone from 27% down to 16.5%
  - Peak CPU no longer spikes above 20% (previously, some methods could cause spikes to over 80% cpu pretty regularly)
  - Normalized system CPU has dropped from 12% to 2.5% at full user load
- classcraft.com
  - Number of servers / 1000 Users drop from 5 to less than 2
- classroomapp.com
  - Number of servers / 1000 Users drop from more than 6 to less than 1.5

##
