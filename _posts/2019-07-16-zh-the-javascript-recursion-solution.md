---
published: true
layout: post
comments: true
date: '2019-07-16 00:00 +08:00'
type: post
title: 'javascript ES6 generator与协程coroutine,fiber'
categories:
  - javascript
  - nodejs
tags:
  - generator
---

## [ES6 Generator](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/function*)

语法示例：

```javascript
function* generator(i) {
  //第一次调用返回
  yield i;
  // 下一次调用返回
  yield i + 10;
}

var gen = generator(10);

console.log(gen.next().value);
// 输出: 10

console.log(gen.next().value);
// 输出: 20
```

语法看起来很酷，但是要这个干什么？这个后面会讲到。

## Coroutine(协程) 和 fiber

### 协程不是多线程

协程不是多线程，依然是单线程通过上下文切换调度，使得多个任务可以由一个线程更有效率的完成。这也恰恰是 nodejs event-loop 本身具有的特性。

### generator 可以认为是 javascript 的协程

然而 javascript 的事件语法形成的这种特性使用起来还是太麻烦，最令人诟病的是嵌套的事件回调，让开发者看酸了眼睛！那么 generator 就提供了另外一种方式生成类似协程的方式。

### [fiber](https://github.com/laverdet/node-fibers) 和 协程的机理是差不多的

从[这里](https://stackoverflow.com/questions/42983095/coroutine-vs-fiber-difference-clarification)和[这里](http://www.open-std.org/jtc1/sc22/wg21/docs/papers/2014/n4024.pdf)可以知道都是相同的机理，使用上下文切换的同一线程调度，多任务使用的还是同一 CPU 线程 资源。

更多的[关于 fiber 的讨论](https://stackoverflow.com/questions/796217/what-is-the-difference-between-a-thread-and-a-fiber)。

## Generator 的作用

### 实现 async/await

目前为止，这是 generator 使用最普遍的方式。当 async/await 还是 ES2017 的特性未实现时，就可以用 fiber,co,和 ES6 的 generator 来达到 async/await 的效果。

参照[这里](https://www.promisejs.org/generators/)

```javascript
function async(makeGenerator) {
  return function() {
    var generator = makeGenerator.apply(this, arguments);

    function handle(result) {
      // result => { done: [Boolean], value: [Object] }
      if (result.done) return Promise.resolve(result.value);

      return Promise.resolve(result.value).then(
        function(res) {
          return handle(generator.next(res));
        },
        function(err) {
          return handle(generator.throw(err));
        }
      );
    }

    try {
      return handle(generator.next());
    } catch (ex) {
      return Promise.reject(ex);
    }
  };
}

const asyncfunc = async(funvtion*(){
  // 逻辑一
  yield return new Promise((reject,resolve)=>{
    //代码 ...
  });

// 逻辑二
  yield return new Promise((reject,resolve)=>{
    //代码 ...
  });
});
asyncfunc();
```

如上所示，使用起来还是繁琐，因此，最终大家还是倾向于直接使用 `async/await`

### 延迟执行

参照[这里](https://strongloop.com/strongblog/how-to-generators-node-js-yield-use-cases/)

```javascript
var fibIter = fibGen(20);
var next = fibIter.next();
console.log(next.value);

setTimeout(function() {
  var next = fibIter.next();
  console.log(next.value);
}, 2000);
```

或者

```javascript
function* foo() {
  yield 1;
  yield 2;
  yield 3;
  yield 4;
  yield 4 + 1; //只有在获取第五个元素时才会计算
  return 6;
}
for (let v of foo()) {
  console.log(v);
}
// 1 2 3 4 5
```

不过这两个例子好牵强……

### 无限集合

```javascript
function* fibGen() {
  var current = 0,
    next = 1,
    swap;
  while (true) {
    (swap = current), (current = next);
    next = swap + next;
    yield current;
  }
}
```

## 总结

generator 最大的用处还是实现 async/await,然而依然不如直接使用 async/await 直观。总的来说，使用 generator 的场景并不多见。
