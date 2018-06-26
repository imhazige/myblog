---
published: false
layout: post
comments: true
date: '2018-06-26 20:00 +08:00'
type: post
categories:
  - javascript
  - front-end
tags:
  - html5
title: 在浏览器中使用Javascript 模块(module)
---
> 本文内容主要来自[Using JavaScript modules on the web](https://developers.google.com/web/fundamentals/primers/modules)

## 浏览器支持
现在大部分主流浏览器都支持Javascript模块了，[看这里](https://caniuse.com/#feat=es6-module)

```html
<script type="module" src="main.mjs"></script>
<script nomodule src="fallback.js"></script>
```
其中type=module表示是javascript模块，下面的一行nomodule会被支持module的浏览器忽略，而被不支持module的浏览器解析。
ES6模块在nodejs中不是新鲜事，而在浏览器里开始支持，意味着浏览器支持ES6的特性，也许不需要将ES6代码转成pollyfill代码，减少了多余的脚本库，性能提升。

## 浏览器中模块脚本和普通脚本的区别
### 普通脚本加载了几次就会执行几次,而模块只会执行一次
```javascript
<script src="classic.js"></script>
<script src="classic.js"></script>
<!-- classic.js 执行多次. -->

<script type="module" src="module.mjs"></script>
<script type="module" src="module.mjs"></script>
<script type="module">import './module.mjs';</script>
<!-- module.mjs 执行一次. -->
```
### 普通脚本不需要CORS返回头，而模块脚本需要
模块脚本以及其依赖加载都是跨源(CORS)请求，而普通脚本不是

### 普通内嵌脚本的async属性是无效的，而模块内嵌脚本的async是有效的
因为普通内嵌脚本默认都是同步一条条加载执行。详见[async属性](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/script)





