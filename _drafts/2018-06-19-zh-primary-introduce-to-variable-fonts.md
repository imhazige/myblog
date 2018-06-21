---
published: false
layout: post
comments: true
date: '2018-06-19 20:00 +08:00'
title: 动态字体简介
type: post
categories:
  - front-end
tags:
  - fonts
---
> 本文内容主要来自[How to start with variable fonts on the web](https://www.zeichenschatz.net/typografie/how-to-start-with-variable-fonts-on-the-web.html)

## 可变字体是什么？
可变字体就是将原来多个单独的字体文件用一个字体文描述出来，并且达到相对较小的文件大小。
![](https://zeichenschatz.net/uploads/2018/05/static-font-files-vs-variable-font-files.png)


## 可变字体能做什么？
一图顶万言
![](https://zeichenschatz.net/uploads/2018/05/variable-fonts-weight-width-slant-axis-morphing.gif)

## 它是怎么做到的？
可变字体用大纲(outline)描述一个字符，一个大纲可用多个点组成，然后可以定义多种样式在浏览器里动态的渲染或是篡改（interpolation）。
![](https://zeichenschatz.net/uploads/2018/04/variable-fonts-interpolation.gif)
渲染可通过多种不同的轴（axes）来进行。
例如字粗（weight）轴
![](https://zeichenschatz.net/uploads/2018/05/variable-fonts-named-instances-along-weight-axis.png)

