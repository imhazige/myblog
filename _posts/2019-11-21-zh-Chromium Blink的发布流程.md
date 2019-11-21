---
published: true
layout: post
comments: true
date: '2019-11-21 00:00 +08:00'
type: post
title: 'Chromium Blink的发布流程'
categories:
  - methodology
tags:
  - chromium
---
> 主要内容来自[Intent to Explain: Demystifying the Blink Shipping Process](https://blog.chromium.org/2019/11/intent-to-explain-demystifying-blink.html)

Blink 是[Chromium](https://www.chromium.org/)的渲染引擎，由Webkit(Safari使用)而来.

基于Chromium的浏览器有：Samsung Internet, Opera, Brave, Vivaldi, 还有 Microsoft Edge.

由于Chromium是巨大的开源项目（2000多工程师，约55个组织），众多厂商参与其中，在特性设计阶段，需要众多其它浏览器厂商review以及[测试](https://wpt.fyi/results/?label=experimental&label=master&aligned)，保证他们也能实现相同的特性。

众多组织，开发者，甚至google chome的处理问题的优先级各不相同，首要的任务就是理清这些需求，[MDN survey](https://hacks.mozilla.org/2019/07/mdn-web-developer-designer-survey/)是个很好的例子来帮助达到这一目的。

然后是如下步骤

- Step 1 - Initial research 初步研究
- Step 2 - Design & Prototype 设计与实现原型
- Step 3 - Experiment & iterate 实验和迭代
- Step 4 - ship it! 交付

[API owners](https://www.chromium.org/blink#TOC-API-Owners)这个角色由值得信任的工程师担当，负责权衡发布特性的兼容性和互操作性。决定是否可以发布等，这个过程为“intent to ship”。




