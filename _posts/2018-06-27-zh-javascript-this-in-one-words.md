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

另外，一个类的方法如果需要override（重写），就不能用箭头函数的定义方式，因为它始终指向的是基类。

## As an object method
```javascript
var o = {
  prop: 37,
  f: function() {
    return this.prop;
  }
};

console.log(o.f()); // 37
```
依然是看调用者

## getter or setter
```javascript
function sum() {
  return this.a + this.b + this.c;
}

var o = {
  a: 1,
  b: 2,
  c: 3,
  get average() {
    return (this.a + this.b + this.c) / 3;
  }
};

Object.defineProperty(o, 'sum', {
    get: sum, enumerable: true, configurable: true});

console.log(o.average, o.sum); // 2, 6
```
依然是看调用者

## As a constructor
```javascript
/*
 * Constructors work like this:
 *
 * function MyConstructor(){
 *   // Actual function body code goes here.  
 *   // Create properties on |this| as
 *   // desired by assigning to them.  E.g.,
 *   this.fum = "nom";
 *   // et cetera...
 *
 *   // If the function has a return statement that
 *   // returns an object, that object will be the
 *   // result of the |new| expression.  Otherwise,
 *   // the result of the expression is the object
 *   // currently bound to |this|
 *   // (i.e., the common case most usually seen).
 * }
 */

function C() {
  this.a = 37;
}

var o = new C();
console.log(o.a); // 37


function C2() {
  this.a = 37;
  return {a: 38};
}

o = new C2();
console.log(o.a); // 38
```
可以看作构造器所在的类为调用者


## As a DOM event handler
```javascript
<button onclick="alert(this.tagName.toLowerCase());">
  Show this
</button>
```
可将元素当作调用者来理解

来个混淆的例子
```javascript
<button onclick="alert((function() { return this; })());">
  Show inner this
</button>
```
上例中由于匿名函数不是在事件监听的代码顶层，而是被包含在一个闭包中，可看作是全局闭包，那自然this就是window了。

