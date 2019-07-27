---
published: true
layout: post
comments: true
date: '2019-07-27 00:00 +08:00'
type: post
title: '三个有趣的javascript语法（提议）'
categories:
  - javascript
tags:
  - syntax
---

## [Optional Chaining(可选链) for JavaScript](https://github.com/tc39/proposal-optional-chaining)

```javascript
a?.b;
// 等同于
a == null ? undefined : a.b;
// 注意 == null的判断
// null == null  : true
// undefined == null :true
// 0 == null :false
// '' == null :false
```

## [Nullish Coalescing(空值合并) for JavaScript](https://github.com/tc39/proposal-nullish-coalescing)

```javascript
a ?? 'haha';
// 仅当a为null或undefined时返回'haha',否则返回a的值
```

## [Pipeline(管道)](https://github.com/tc39/proposal-pipeline-operator)

```javascript
//左边输出作为右边第一个输入
function doubleSay(str) {
  return str + ', ' + str;
}
function capitalize(str) {
  return str[0].toUpperCase() + str.substring(1);
}
function exclaim(str) {
  return str + '!';
}
let result = exclaim(capitalize(doubleSay('hello')));
result; //=> "Hello, hello!"
// 等同于
let result = 'hello' |> doubleSay |> capitalize |> exclaim;

result; //=> "Hello, hello!"
```

## [Partial Application(偏函数)](https://github.com/tc39/proposal-partial-application)

```javascript
const addOne = add.bind(null, 1);
addOne(2); // 3

// 等同于
const addOne = add(1, ?);
addOne(2); // 3
```

这个和管道配合比较方便

```javascript
let newScore = player.score
  |> add(7, ?)
  |> clamp(0, 100, ?);
```

## 这些语法目前都是提议阶段
