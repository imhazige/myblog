---
published: true
layout: post
comments: true
date: '2019-06-14 00:00 +08:00'
type: post
title: 'css 3D引擎特效'
categories:
  - html
  - css
tags:
  - animation
---

这里有个精彩的纯 css 3d [场景动画特效](https://keithclark.co.uk/labs/css-fps/nojs/)。

<iframe src="https://keithclark.co.uk/labs/css-fps/nojs/"
style="width:100%;height:300px;border:none;" >
</iframe>

这里是作者的[解释](https://keithclark.co.uk/articles/creating-3d-worlds-with-html-and-css/)

其主要使用的特性是:

- [background-image](https://developer.mozilla.org/en-US/docs/Web/CSS/background-image) 多张背景图重叠，以及使用[linear-gradient](<https://developer.mozilla.org/en-US/docs/Web/CSS/background-image#linear-gradient()>)来产生光线效果

- [translate3d](https://developer.mozilla.org/en-US/docs/Web/CSS/transform-function/translate3d)3d 转换元素，在 x,y,z 三轴上变换坐标
- [background-blend-mode](https://developer.mozilla.org/en-US/docs/Web/CSS/background-blend-mode)背景图之间的协调

也可以用背景图来实现[纹理贴图效果](https://imhazige.github.io/html-examples/css-3d-texture-drum/index.html)：

<iframe src="https://imhazige.github.io/html-examples/css-3d-texture-drum/index.html"
style="width:100%;height:700px;border:none;" >
</iframe>
