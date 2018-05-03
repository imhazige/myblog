---
published: true
layout: post
comments: true
title: Page Transitions Animation
date: '2018-04-27 20:00 +08:00'
type: post
categories:
  - front-end
tags:
  - css
---

[Transition](https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_Transitions/Using_CSS_transitions) 提供了对动画速度进行控制的属性，可与transform配合可以创建动画特效。

我在[这里](https://page-transitions.com/)看到很酷的页面跳转动画，原来它是[Nuxt](https://nuxtjs.org/api/pages-transition/)提供的特效。

我好奇transtion能不能本身就提供跨页面的特效呢，就做了个实验：[CodePen Demo](https://codepen.io/imhazige/project/editor/DyLdnB)

结果显示跨页是不行的。跨页面transition还需要两个页面整体设计，配合javascript来实现。
