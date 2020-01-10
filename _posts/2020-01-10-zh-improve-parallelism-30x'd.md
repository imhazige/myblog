---
published: true
layout: post
comments: true
date: '2020-01-10 00:00 +08:00'
type: post
title: '提升node 并发30倍'
categories:
  - nodejs
tags:
  - parallelism
---
本文摘译自[How we 30x'd our Node parallelism](https://blog.plaid.com/how-we-parallelized-our-node-service-by-30x/)
- 做的是银行业务
- 原来是4,000 个node container节点(这里应该是指机器而不是nodejs worker)，每个处理一个请求gRpc,因此最大并发4000
- 通过此改善每季度节约30万美元
- 改善的前提是收集详细的metric监控调试信息
- 前面用负载均衡
- 现在是每个节点增加并发(nio)
- 因此需要加大nodejs内存`--max-old-space-size=6144`
- 使用[no-floating-promises](https://palantir.github.io/tslint/rules/no-floating-promises/)验证
- 问题一:[AWS S3 client reduces maxSockets from Infinity to 50](https://docs.aws.amazon.com/sdk-for-javascript/v2/developer-guide/node-configuring-maxsockets.html)
- 问题二:JSON序列化,不要使用bfj包，改用JSONStream。
- 问题三:GC,使用[gc-stats](https://www.npmjs.com/package/gc-stats)监控，使用`--max-semi-space-size=1024`减少GC频率。
- 问题四:CPU,使用[FlameGraph](https://github.com/brendangregg/FlameGraph)分析。发现日志占用15%,解决办法此文没有详述(正则表达式等)。
- 最终每个节点可以并发处理30个请求 。