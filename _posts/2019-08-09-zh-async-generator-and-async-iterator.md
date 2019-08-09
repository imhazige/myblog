---
published: true
layout: post
comments: true
date: '2019-08-09 00:00 +08:00'
type: post
title: '异步生成器和异步迭代器的使用场景'
categories:
  - nodejs
tags:
  - ES2018
---

## 异步迭代器（Async Iterators）

ES2018 提出了异步迭代器（Async Iterators），Node 10 已经支持，可以使用 for of 循环迭代。

### 普通的[迭代器](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Iterators_and_Generators)写法

```javascript
const nums = [1, 2, 3];

let index = 0;
const iterator = {
  next: () => {
    if (index >= nums.length) {
      return { done: true };
    }
    const value = nums[index++];
    //返回必须包含value(此次迭代值)，done(是否迭代完)
    return { value, done: false };
  }
};
//定义iterable以便for of使用
const iterable = {
  //需要使用Symbol.iterator定义迭代子
  [Symbol.iterator]: () => iterator
};
// for of调用iterable
for (const v of iterable) {
  console.log(v); // Prints "1", "2", "3"
}
```

### 异步迭代器

```javascript
const nums = [1, 2, 3];

let index = 0;
const asyncIterator = {
  next: () => {
    if (index >= nums.length) {
      //不同的是返回promise
      return Promise.resolve({ done: true });
    }
    const value = nums[index++];
    //不同的是返回promise
    return Promise.resolve({ value, done: false });
  }
};

const asyncIterable = {
  //注意是Symbol.asyncIterator
  [Symbol.asyncIterator]: () => asyncIterator
};

// for of调用iterable,需要await
for await (const value of asyncIterable) {
    console.log(value);
}
```

## 异步构造器

https://github.com/tc39/proposal-async-iteration#async-generator-functions
