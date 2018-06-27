---
published: true
layout: post
comments: true
date: '2018-06-27 20:00 +08:00'
type: post
title: 如何用最少的代码填充一个javascript数组
categories:
  - javascript
  - front-end
tags:
  - html5
---
> 本文内容主要来自[Here’s Why Mapping a Constructed Array in JavaScript Doesn’t Work](https://itnext.io/heres-why-mapping-a-constructed-array-doesn-t-work-in-javascript-f1195138615a)


使用javascript快速填充数组，哪种方法代码最少？

## 直接方式
```javascript
const arr = [];
for (let i = 0; i < 100; i++) {
  arr[i] = i;
}
```
四行代码

## map方式
```javascript
const arr = Array(100).map((_, i) => i);
console.log(arr[0] === undefined);  // true
```
貌似只要一行，不过结果不对
因为[map](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/map)是遍历数组所有元素Array(100)并没有初始化任何元素

解决办法是使用[array spread](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Spread_syntax)

```javascript
const arr = [...Array(100)].map((_, i) => i);
```
spread操作导致数组初始化100个undefined数据
```json
{
  0: undefined,
  1: undefined,
  2: undefined,
  ...
  99: undefined,
  length: 100
}
```
