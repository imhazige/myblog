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
#### 普通脚本加载了几次就会执行几次,而模块只会执行一次
```javascript
<script src="classic.js"></script>
<script src="classic.js"></script>
<!-- classic.js 执行多次. -->

<script type="module" src="module.mjs"></script>
<script type="module" src="module.mjs"></script>
<script type="module">import './module.mjs';</script>
<!-- module.mjs 执行一次. -->
```
#### 普通脚本不需要CORS返回头，而模块脚本需要
模块脚本以及其依赖加载都是跨源(CORS)请求，而普通脚本不是

#### 普通内嵌脚本的async属性是无效的，而模块内嵌脚本的async是有效的
因为普通内嵌脚本默认都是同步一条条加载执行。详见[async属性](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/script)

#### 浏览器中模块脚本文件扩展名可以不是.mjs,但是[nodejs目前实验版本只支持.mjs的模块脚本](https://nodejs.org/api/esm.html)

#### 模块脚本默认是延迟加载(defer)
![](https://res.cloudinary.com/cpress/image/upload/w_1280,e_sharpen:60/htbubqjomlv7ov4muket.jpg)

#### bare import暂不支持
[bare import](https://html.spec.whatwg.org/multipage/webappapis.html#resolve-a-module-specifier)
不带相对路径或绝对路径的import,例如
```javascript
import {shout} from 'jquery';
```

#### 普通脚本不支持export,import语法,而模块脚本可以

#### 模块脚本默认是[strict模式](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Strict_mode)  

#### 普通脚本的变量作用于默认是全局的,而模块脚本顶级作用域是本模块
```javascript
//普通脚本
var i = 0; //windows.i = 0;
```

#### 模块脚本支持动态import

## 性能建议

### 继续使用bundling(打包工具)
webpack,rollup等工具能对代码整体分析优化打包结构

### 使用模块预加载
```html
<link rel="modulepreload" href="lib.mjs">
<link rel="modulepreload" href="main.mjs">
<script type="module" src="main.mjs"></script>
<script nomodule src="fallback.js"></script>
```






