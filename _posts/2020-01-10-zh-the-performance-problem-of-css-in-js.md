---
published: true
layout: post
comments: true
date: '2020-01-10 00:00 +08:00'
type: post
title: 'css in js的性能问题'
categories:
  - frontend
tags:
  - css
  - cssinjs
---
`css in js`最主要的特点就是动态，由javascript控制。这是其区别于css,sass等其他方案的立足点。
动态也解决了浏览器兼容的问题。

但是动态也带来了性能问题，一般情况下，性能问题并不明显，但对于表格，就比较明显。

为解决此问题，产生了[linaria](https://github.com/callstack/linaria)这样的zero-runtime框架。及最终生成的是静态css，那么其动态性也就丢失了。

[styled-components](https://github.com/styled-components/styled-components)和[linaria](https://github.com/callstack/linaria)的作者是好朋友，双方[共同讨论了这个问题](https://github.com/styled-components/styled-components/issues/2377)，其实如果想要兼顾，可以两个同时使用。

或者(css/sass) + `css in js`也是一种选择。

