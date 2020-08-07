---
published: true
layout: post
comments: true
date: "2020-08-07 00:00 +08:00"
type: post
title: "【摘】开发者需要知道的Unicode"
categories:
  - javascript
tags:
  - unicode
---
> 摘译自Dmitri Pavlutin的文章[What every JavaScript developer should know about Unicode](https://dmitripavlutin.com/what-every-javascript-developer-should-know-about-unicode/)
- javascript 对待 string 为编码序列而不是字符
- 大部分 string 方法不是 Unicode-aware，包括 indexOf,slice
- [...str] 或者 Array.from(str) 可以正确确认 length

```javascript
const smile = "😀";

smile.length; // => 2
```

```javascript
const smile = "\uD83D\uDE00";

smile === "😀"; // => true
smile.length; // => 2
```

```javascript
const message = "Hello!";
const smile = "😀";

[...message].length; // => 6
[...smile].length; // => 1
```

- 字符处理推荐 [punycode](https://github.com/bestiejs/punycode.js/)
- 正则处理推荐 [generate](https://github.com/mathiasbynens/regenerate)
