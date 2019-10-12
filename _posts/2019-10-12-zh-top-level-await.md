---
published: true
layout: post
comments: true
date: '2019-10-12 00:00 +08:00'
type: post
title: '细看javascript顶层await'
categories:
  - javascript
  - nodejs
tags:
  - await
  - 异步
---
## 为什么需要top-level await
### 原来的方式
```javascript
await Promise.resolve(console.log('🎉')); //语法报错

//那只好这样解决了
(async function() {
  await Promise.resolve(console.log('🎉'));
  // → 🎉
}());
```

### 有了top-level await 支持以后
```javascript
// 放在module最外部
await Promise.resolve(console.log('🎉')); //可以了，好开心
```

## 加载顺序
说起来比较复杂，其实效果和之前的如下写法差不多
```javascript
(async function() {
  await Promise.resolve(console.log('🎉'));
  //本模块其它代码 ...
}());
```
并不会阻塞其它模块加载

## 参考
https://v8.dev/features/top-level-await