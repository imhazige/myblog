---
published: true
layout: post
comments: true
date: '2018-04-27 20:00 +08:00'
type: post
status: publish
categories:
  - front-end
tags:
  - css
title: '使用Display:contents'
---


[Display:contents](https://developer.mozilla.org/en-US/docs/Web/CSS/display) 目前还处于css3试验阶段，不过大部分PC和移动端浏览器已经支持了（除了IE）。

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
2: 使用ul 上使用 display:contents

采用第二种方式有什么好处？
保持了文档结构，你开始使用ul肯定是有原因的，flatter markup动作太大，而只使用一个样式解决问题达到了直观最简单就是最正确的目的。

Refs:
[More accessible markup with display: contents](https://hiddedevries.nl/en/blog/2018-04-21-more-accessible-markup-with-display-contents)
