---
published: false
layout: post
comments: true
date: '2018-04-27 20:00 +08:00'
type: post
status: publish
categories: "\_- Web front-end"
tags:
  - css
title: '使用Display:content'
---


[Display:content](https://developer.mozilla.org/en-US/docs/Web/CSS/display) 目前还处于css3试验阶段，不过大部分PC和移动端浏览器已经支持了（除了IE）。

其作用是去掉了盒子模型，而展示的是子项的盒子。也可以说，相当于将子项“提级”到相当于本元素同一级别。

举个例子：
```html
<div style="display:grid;">
  <div>1</div>
  <div>2</div>
  <div>3</div>
  <ul>
    <li>4</li>
    <li>5</li>
  </ul>
</div>
```
顶层元素想要实现grid布局，ul里面的li也想加入grid布局，两种方法
1：将li转为div，去掉ul,这叫flatter markup
2: 使用ul 上使用 display:content

Refs:
[More accessible markup with display: contents](https://hiddedevries.nl/en/blog/2018-04-21-more-accessible-markup-with-display-contents)