---
published: true
layout: post
comments: true
date: "2021-09-22 00:00 +08:00"
type: post
title: "命令式与声明式编程比较"
categories:
  - react
tags:
  - ui
  - Imperative
  - Declarative
---
> 摘自[Imperative vs Declarative Programming](https://ui.dev/imperative-vs-declarative-programming/)

“我就在沃尔玛旁边。我怎么从这里到你家？”

命令式回复：出停车场北口左转。沿 I-15 North 行驶，直至到达第 12 街出口。从出口右转，就像你要去宜家一样。直行并在第一个红绿灯处右转。继续通过下一个灯，然后左转。我的房子是#298。

声明性回复：我的地址是 298 West Immutable Alley, Eden, Utah 84310

声明式：SQL、HTML 

> reactjs的设计目标是声明式，但是也可以使用成命令式

声明式编程是“使用符合开发人员心智模型而非机器操作模型的语言进行编程的行为。

看看您是否可以在代码运行时对其进行跟踪。正则表达式是 100% 声明性的，因为在执行模式时它是不可追踪的。（编者：这难道是说声明式编程不好调试?）

在计算机科学中，声明式编程是一种编程范式，它表达计算的逻辑而不描述其控制流.

函数式编程是声明式编程的子集

#### 命令式示例:
```javascript
function double(arr) {
   let results = [];
   for (let i = 0; i < arr.length; i++) {
    results.push(arr[i] * 2);
   }
   return results;
}

function add(arr) {
   let result = 0;
   for (let i = 0; i < arr.length; i++) {
    result += arr[i];
   }
   return result;
}

$("#btn").click(function () {
   $(this).toggleClass("highlight");
   $(this).text() === "Add Highlight"
     ? $(this).text("Remove Highlight")
     : $(this).text("Add Highlight");
});
```

#### 声明式:
```javascript
function double(arr) {
   return arr.map((item) => item * 2);
}

function add(arr) {
   return arr.reduce((prev, current) => prev + current, 0);
}

<Btn
   onToggleHighlight={this.handleToggleHighlight}
   highlight={this.state.highlight}>
    {this.state.buttonText}
</Btn>
```