---
layout: post
comments: true
title: "Destructuring assignment and $.extend without jquery"
date: 2018-03-17 20:00 +08:00
type: post
published: true
status: publish
categories:
- 'front-end'
- 'Javascript'
tags:
- 'ES6'
---
We are familiar with the jquery function, $.extrend. Now with [Destructuring assignment](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Destructuring_assignment), we can do it like this:

```javascript
const foo = { fizzBuzz: true };

//later override previous one
const bar1 = { fizzBuzz:false,...foo};
const bar2 = { ...foo,fizzBuzz:false};

console.log(bar1.fizzBuzz); // "true"
console.log(bar2.fizzBuzz); // "false"
```

This feature is not a standard of ES6 yet(Initial definition), you can see the browser support at the same page.

Here is another example:
```javascript
//Destructuring assignment
let a = 1;
let b = {a}; //{a} is not a valid json, but here it actually do a Destructuring assignment
console.log(b);
console.log({a});// destructuring directly
```

so, as we are familiar with code like:
```javascript
function xxx(){

}

module.exports = {xxx};
```
Actually it is a Destructuring assignment.
