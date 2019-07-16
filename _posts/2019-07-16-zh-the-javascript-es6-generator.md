---
published: true
layout: post
comments: true
date: '2019-07-16 00:00 +08:00'
type: post
title: 'javascript递归,tco和trampoline'
categories:
  - javascript
  - nodejs
tags:
  - trampoline
  - tco
---

### Javascript 的递归问题

对于经典递归问题-求 n 的阶乘，实现如下：

```javascript
function fact(n) {
  if (n == 0) return 1;
  return n * fact(n - 1);
}
console.log(fact(100000));
```

在 nodejs 里运行，其结果是--报错 `Maximum call stack size exceeded`。栈溢出了！

真是弱爆了，这样就不行了。然而实际上，往往需要解决递归带来的这种问题。怎么办？

### Tail Call Optimization（TOC 尾调用优化）

尾调用优化是指编译器将尾递归优化为循环（后面 Trampoline 会讲到）。

#### 什么是尾递归？

尾递归，简而言之，是最后一个操作一定是调用自己的递归。

```javascript
function fact(n, acc) {
  if (n == 0) return acc;
  //最后一个操作是调用自身
  return fact(n - 1, acc * n);
}
```

#### TOC 的问题

这样就解决了问题吗？—— 没有！
因为 TOC 实现的问题。

TOC 是 [ES6 的一部分](http://www.ecma-international.org/ecma-262/6.0/#sec-tail-position-calls)，[但是完全没实现](https://node.green/#ES2015-optimisation-proper-tail-calls--tail-call-optimisation-)

> 从[这里](https://stackoverflow.com/questions/23260390/node-js-tail-call-optimization-possible-or-not)看，node8 之前是支持 TOC 的，要通过(--harmony node > 6.6.0 , --harmony_tailcalls node < 6.6.0 )，但是 node8 反而不支持了。

### Trampoline

既然 TOC 不靠谱，最好还是靠自己动手。理论上，递归都可以转换为循环，术语 Trampoline(原意蹦床) 就是以这样的思路来解决问题。让人高兴的是，javascript 的语言特性完全支持此实现。

其解决方法是递归函数返回要么是个值，要么是个函数，避免实际执行代码不断增加调用栈。这样，持续调用递归函数的话，会不断的得到函数，调用它，代码是一个循环结构而不是递归结构直至获得值。

```javascript
function trampoline(fn) {
  return function(...args) {
    let result = fn(...args);

    //循环结构
    while (result) {
      if (typeof result === 'function') {
        //调用递归函数，如果返回的事函数，下次继续执行
        result = result();
      } else {
        //如果是值则结束并返回
        break;
      }
    }

    return result;
  };
}

// 使用
// 递归函数
function fact3(n, acc = 1) {
  // 返回要么是值要么是函数
  return n > 0 ? () => fact3(n - 1, n * acc) : acc;
}

//
const funcTramp = trampoline(fact3);
//执行成功，可调试看到调用栈固定<20
const result = funcTramp(100000);
```

#### 改进

Trampoline 的最终目的是将递归转为循环，改成循环的诀窍是，代码不马上执行，而是返回函数。那么 promise 也可以达到相同的目的。

```javascript
export function trampoline(fn) {
  //加async,返回的是promise
  return async function(...args) {
    let result = fn(...args);

    while (result) {
      if (typeof result.then === 'function') {
        // 如果递归函数返回的是promise,则执行promise
        result = await result;
      } else if (typeof result === 'function') {
        result = result();
      } else {
        break;
      }
    }

    return result;
  };
}

async function fact4(n, acc = 1) {
  // 返回async函数(promise)或者值
  return n > 0 ? async () => await fact4(n - 1, n * acc) : acc;
}

//调用
const funcTramp2 = trampoline(fact4);
const result2 = await funcTramp2(number);
//promise适用于websocket重连等场景。
```

完整代码示例参见 [github](https://github.com/imhazige/node-examples#recursion-solution---trampoline)
