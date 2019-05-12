---
published: true
layout: post
comments: true
date: '2019-05-11 20:00 +08:00'
type: post
title: '你所不知道的关于React DevTools的5个秘技'
categories:
  - frontend
tags:
  - React
---

本文主要内容来自 [5 things you didn’t know about React DevTools](https://blog.logrocket.com/5-things-you-didnt-know-about-react-devtools-2c6e0ef22529)

![](https://github.com/facebook/react-devtools/raw/master/images/devtools-full.gif)
[React DevTools](https://github.com/facebook/react-devtools)以 chrome,firefox 插件形式提供 React 的开发辅助功能。

## Profiler

![](https://cdn-images-1.medium.com/max/2400/1*wjikSFSJzAowZaMkzSCSBQ.png)

## 更换主题

![](https://cdn-images-1.medium.com/max/1200/0*TA-gu64zH5OIaWVU)

## 在控制台中与 React 对象 互动

选中一个元素后，打开控制台，输入\$r 即是选中元素的实例。

![](https://cdn-images-1.medium.com/max/1600/0*e7dmaExkRf3Q_X5J)

## [调试生产环境状态下的 react](https://gist.github.com/bvaughn/25e6233aeb1b4f0cdb8d8366e54a3977)

实际还是在本地调试 production 状态下 编译的 react。

## 使用 babel 插件[babel-plugin-transform-react-jsx-source](https://github.com/babel/babel/tree/master/packages/babel-plugin-transform-react-jsx-source)更容易的看懂源码

## 使用秘密的 React API

- [useDebugValue](https://reactjs.org/docs/hooks-reference.html#usedebugvalue)

```javascript
function useFriendStatus(friendID) {
  const [isOnline, setIsOnline] = useState(null);

  // ...

  // Show a label in DevTools next to this Hook
  // e.g. "FriendStatus: Online"
  useDebugValue(isOnline ? 'Online' : 'Offline');

  return isOnline;
}
```

- 在事件中放置 label 来分析性能问题(当前还未发布)
