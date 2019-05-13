---
publish: true
title: '运维upsplash的开销'
cover: ''
showCover: true
date: '2019-05-12'
category: 'devops'
url: 'https://medium.com/unsplash/what-does-unsplash-cost-in-2019-f499620a14d0'
author: 'Luke Chesser'
translator: ''
priority: 1
tags:
  - cost
---

> 本文主要内容来自[What does Unsplash cost in 2019](https://medium.com/unsplash/what-does-unsplash-cost-in-2019-f499620a14d0)

## 2016 年的统计(每月)：

- Web 服务器: \$2,731.23
- 监控: \$630.00
- 数据处理: \$1,000.00
- 图片服务: \$11,170.00
- 其他: \$2,127.39

  **总计 (美元/每月): \$17,658.62**

## 2019 年的统计(每月):

- Web 服务器: \$29,763
- 监控: \$7,679
- 数据处理: \$15,223
- 图片服务: \$42,408
- 其他: \$3,580

  **总计 (美元/每月): \$98,653**

花费差不多是 2016 年的 5 倍。然而吞吐量却是 2016 年的 12 倍。

钱主要花在图片服务上。

## 更多细节:

### Web 服务器

#### heroku(\$11,878)

虽然比其他 AWS，GCE，AZURE 贵，但是发布简单。数据库也在上面。

#### Fastly(\$12,699)

分布式 CDN 缓存

#### Elastic Cloud(\$1,674)

Elasticsearch 集群

#### Stream(\$3,512)

feed 和通知服务

### 监控

Unsplash 只有 11 个人的开发团队，没有专门的运维。

#### [Loggly](https://www.loggly.com/)(\$5031)

主要花在日志上，但这是必须的

### 数据处理

数据处理(包括机器学习)是增长最快的部分，预期今后依然如此。

工具从 Google Analytics 和 Keen 替换到开源的 pipeline [Snowplow Analytics](https://snowplowanalytics.com/)

### 图片服务

只用[Imgix](https://imgix.com/)，虽然贵点，但确实好用。
