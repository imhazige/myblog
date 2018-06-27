---
published: false
layout: post
comments: true
date: '2018-06-27 20:00 +08:00'
type: post
title: 一句话讲明白javascript的this
categories:
  - javascript
  - front-end
tags:
  - html5
---
今天看了这篇文章[What is “this” in JavaScript?](https://blog.bitsrc.io/what-is-this-in-javascript-3b03480514a7)，颇受启发，觉得总结得非常好，一句话可以概括：this指针依赖于谁来调用。

下面两句话
小明喜欢DC漫画;
小明喜欢漫威漫画。

概括为一句小明喜欢DC漫画，`他`也喜欢漫威漫画。这个他就类似javascript中的this指代，要依据上下文来判断。


