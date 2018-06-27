---
published: false
layout: post
comments: true
date: '2018-06-27 20:00 +08:00'
type: post
title: 一句话讲明白javascript的this
categories:
  - javascript
  - front-end
tags:
  - html5
---
今天看了这篇文章[What is “this” in JavaScript?](https://blog.bitsrc.io/what-is-this-in-javascript-3b03480514a7)，颇受启发，觉得总结得非常好，一句话可以概括：this指针依赖于谁来调用。

下面两句话
小明喜欢DC漫画;
小明喜欢漫威漫画。

概括为一句小明喜欢DC漫画，`他`也喜欢漫威漫画。这个他就类似javascript中的this指代，要依据上下文来判断。

回到这一句this指针依赖于谁来调用(这个方法，函数，构造器)。再来查看[官方定义](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/this)，全都是围绕这个解释的。


## Global context
```javascript
// In web browsers, the window object is also the global object:
console.log(this === window); // true

a = 37;
console.log(window.a); // 37

this.b = "MDN";
console.log(window.b)  // "MDN"
console.log(b)         // "MDN"
```
可以看作是window是调用者，没毛病。

## Function context
```javascript
function f1() {
  return this;
}

// In a browser:
f1() === window; // true 

// In Node:
f1() === global; // true
```
window调用的



```javascript
// An object can be passed as the first argument to call or apply and this will be bound to it.
var obj = {a: 'Custom'};

// This property is set on the global object
var a = 'Global';

function whatsThis() {
  return this.a;  // The value of this is dependent on how the function is called
}

whatsThis();          // 'Global'
whatsThis.call(obj);  // 'Custom'
whatsThis.apply(obj); // 'Custom'
```
直接指明调用者


```javascript
function f() {
  return this.a;
}

var g = f.bind({a: 'azerty'});
console.log(g()); // azerty

var h = g.bind({a: 'yoo'}); // bind only works once!
console.log(h()); // azerty

var o = {a: 37, f: f, g: g, h: h};
console.log(o.f(),o.f(), o.g(), o.h()); // 37,37, azerty, azerty
```
bind就是为了绑定this到指定的对象

## 箭头函数(Arrow functions)
```javascript
var globalObject = this;
var foo = (() => this);
console.log(foo() === globalObject); // true
```
箭头函数的this指的是定义这个箭头函数时的上下文的this,call, bind,  apply指定this的方式对箭头函数无效。


