---
published: true
layout: post
comments: true
date: '2019-05-16 20:00 +08:00'
type: post
title: 'postgraphile介绍'
categories:
  - nodejs
  - database
tags:
  - postgres
---

![](https://github.com/graphile/livesotope/raw/master/demo.gif)

[postgraphile](https://github.com/graphile/postgraphile)是基于 Postgres 的支持实时订阅和实时查询的 GraphoQL Nodejs 工具。

其订阅机制开始于刚刚发布的 [4.4.0 版本](https://github.com/graphile/postgraphile/releases/tag/v4.4.0)。基于 Postgres 的[LISTEN/NOTIFY](https://www.postgresql.org/docs/9.4/sql-notify.html)特性。

注意[live Query](https://www.graphile.org/postgraphile/live-queries/)不是订阅机制，两个不一样，建议使用订阅.

[支持 http,express,connect 整合](https://www.graphile.org/postgraphile/usage-library/)。

[可自动映射 SQL 关系到 GraphQL Schema](https://www.graphile.org/postgraphile/relations/)。

[支持基于指针的翻页](https://www.graphile.org/postgraphile/connections/)。

[支持 JWT 整合]（https://www.graphile.org/postgraphile/security/）。

自带 GraphQL 开发 UI。

使用示例：

```javascript
import { createServer } from 'http';
import postgraphile from 'postgraphile';

createServer(postgraphile());
```
