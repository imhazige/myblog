---
published: false
layout: post
comments: true
date: '2018-05-28 20:00 +08:00'
type: post
categories:
  - front-end
  - javascript
tags:
  - reactjs
title: React Context API和Redux
---
从[16.3](https://reactjs.org/blog/2018/03/29/react-v-16-3.html)开始，React终于有了官方版[Context API](https://reactjs.org/docs/context.html)，这个API貌似很简单，但是影响却很大，网上有评论说Redux已Game Over，Redux作者也不得不承认Reac需要Redux的程度减少了许多，不过Redux的有些使用者认为，Redux已经成为一个生态系统，可用于其他很多场景。(这个看过的帖子一时找不到)

Context API确实很简单，一个Provider,一个Consumer,用于**跨组件层级的数据共享**，当然千万不要把它当作偷懒不想传props的滥用方法。

在React中使用Context来替换Redux是毋庸置疑的:
- 是React本身自带的
- 比Redux不知简单直观到哪里去了

Vue自带的[状态管理](https://vuejs.org/v2/guide/state-management.html)比Redux+React要方便，现在React的Context API出来，感觉React又更简单些。


#Refs
[Replacing Redux with the new React context API](https://medium.freecodecamp.org/replacing-redux-with-the-new-react-context-api-8f5d01a00e8c)
