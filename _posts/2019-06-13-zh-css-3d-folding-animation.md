---
published: false
layout: post
comments: true
date: '2019-06-13 00:00 +08:00'
type: post
title: '讲解css3折叠动画的实现'
categories:
  - frontend
  - css
tags:
  - animation
---

[这里](https://www.joshwcomeau.com/posts/folding-the-dom/)有高手实现了 css3 折叠动画,他是用 react 写的。

我用 html 实现的可以[在线查看](https://imhazige.github.io/html-examples/css-animation-folding/index.html)。

主要思路是：
由两个 div 分别显示图片的上下两部分，用背景样式显示图片。

上下两部分拼接成完整的图片，下半部使用 css 动画实现折叠。

折叠特效主要用到了以下几个特性:

- [transform rotateX](https://developer.mozilla.org/en-US/docs/Web/CSS/transform) 沿 x 轴滚动
- [perspective](https://developer.mozilla.org/en-US/docs/Web/CSS/perspective) 透视，3d 视角的效果
- [transform-origin](https://developer.mozilla.org/en-US/docs/Web/CSS/transform-origin)滚动的原点
- [transform-style:preserve-3d](https://developer.mozilla.org/en-US/docs/Web/CSS/transform-style)背部封皮的实现
- [backface-visibility](https://developer.mozilla.org/en-US/docs/Web/CSS/backface-visibility)当元素的正面面向用户时，其背面是否可见，用于背部封皮的实现
