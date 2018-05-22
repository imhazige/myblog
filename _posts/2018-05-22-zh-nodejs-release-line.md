---
published: false
layout: post
comments: true
date: '2018-05-22 20:00 +08:00'
type: post
categories:
  - front-end
  - javascript
tags:
  - nodejs
title: 有趣的nodejs版本发布策略
---
> 本文内容主要来自这篇文章[Understanding How Node.js Release Lines Work](https://nodesource.com/blog/understanding-how-node-js-release-lines-work)

nodejs发布策略的目的是为了提供一个稳定的平台来创建企业应用，同时也保持快速敏捷的演化。因此它的发布策略显得有些“有趣”（迷惑）。

## 先看看术语

- Release Line：发布线,与主版本号同义，例如Node.js 6, Node.js 7, Node.js 8, Node.js 9等。
- SemVer：[Semantic Versioning](http://semver.org/)语义版本。

      语义版本我们很熟悉：
      - 主版本
      - 次版本
      - 补丁版本

- Current: 当前的版本，一般一个时期内，只有一个版本处于这个状态，详细见后。
- LTS：长期支持版Long-Term Support，使用Ubuntu的应该很熟悉。
- Active：Current的后一阶段，详细见后。
- Maintenance：Active的后一阶段。
- EOL：End of Life,结束。不再维护，不做任何修改，包括bug。

## 基数版本号和偶数版本号
node.js被认为有个怪癖，基数版本号一般不会作为LTS（长期支持版），而偶数版则会。不过你看了下图就明白了为什么要这样。
![](https://images.ctfassets.net/hspc7zpa5cvq/7o3kha5RgAGCImaw84yiEY/19957b9f448b1431e9664ed94e996d74/nodejs-lts-release-schedule_preview.png)

- 所有主版本Current阶段会持续6个月，之后的六个月就会成为下一个主版本的Current阶段。
- LTS版本（偶数版本）Current阶段之后的Active阶段会持续18个月。
- LTS版本（偶数版本）Active阶段之后的Maintenance阶段会持续12个月。
- 整个LTS周期为3年（36个月）。
- 基数版本其实就是为偶数版（LTS）做准备的。基数版没有Active阶段，Maintenance阶段也很短。

不过这上面的规律不一定是完全执行的，最终决定于开发实际决策和nodejs的依赖。例如，由于同步于OpenSSL LST 1.0.x的周期，node.js8将提前三个月结束周期。







