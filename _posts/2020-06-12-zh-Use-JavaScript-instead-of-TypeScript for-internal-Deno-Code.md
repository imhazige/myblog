---
published: true
layout: post
comments: true
date: "2020-06-10 00:00 +08:00"
type: post
title: "Deno内部代码为什么使用javascript而不是typescript"
categories:
  - javascript
tags:
  - deno
---

[deno 文档显示](https://docs.google.com/document/d/1_WvwHl7BXUPmoiSeD8G83JmS8ypsTPqed4Btkqkn_-4/edit#heading=h.cx5nx247bag)，deno 内部代码并没有使用 typescript。

其原因:

- typescript 增加编译时间
- deno 项目的结构使用 typescript 增加编译性能消耗
- 编译出现一些需要特殊处理的问题，例如不能定义 Header 这样的类名
- typescript 创建声明文件 d.ts 并不高效，且很复杂繁琐

Ryan Dahl(Deno 作者)强调，deno 本身是永远会支持 typescript 的。

> typescript 作为实现一种语言的语言并不适合，毕竟它是 javascript 上的一层，不如直接使用 javascript。
