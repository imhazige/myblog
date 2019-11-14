---
published: true
layout: post
comments: true
date: '2019-11-14 00:00 +08:00'
type: post
title: 'Discord使用React Native在ios上的调优过程'
categories:
  - front-end
tags:
  - react
  - reactnative
---
> 本文摘译自[How Discord achieves native iOS performance with React Native](https://blog.discordapp.com/how-discord-achieves-native-ios-performance-with-react-native-390c84dcd502) 作者 Miguel Gaeta

Discord IOS APP是2015年的代码，当时运行得很好，4年过去了，渐渐性能有些问题。

## 整理Flux Store
当时redux还没出来，自己实现的flux store。
通过日志只记录>10ms的操作，发现问题了。

### - 减少重绘
使用Chrome profiler分析，发现有个顶层组件监听了频繁改动的user store,导致频繁重绘。

去掉这个顶层的监听，改为更底层的子组件，达到减少重绘的目的

### - 正则表达式
消息的处理耗时较多，但是桌面版(v8)测试却并没有像手机模拟器([JSC](https://webkit.org/))那样慢，最终还是通过日志分析发现是正则表达式的问题。正则表达式在手机上耗cpu，且他们的代码里将正则放到了循环中……

另一个问题是对消息中的表情emoj检测，使用正则检测耗性能，改为使用[这篇文章的方法](https://medium.com/reactnative/emojis-in-javascript-f693d0eb79fb),性能提升90%,`重点!`

## 整理React组件结构
在手机上应该使用[react-profiler](https://reactjs.org/blog/2018/09/10/introducing-the-react-profiler.html)调试性能。你在chrome的v8调试器上是看不出来什么的.

### - Dimension API局部渲染
得益于新的[RN dimensions api](https://facebook.github.io/react-native/docs/dimensions.html),可以做到局部渲染，减少数据加载数量。

### - pure component的问题
[purecomponent](https://reactjs.org/docs/react-api.html#reactpurecomponent)用的不恰当，也依然会造成频繁重绘。动态的style也会造成重绘，这里应该经量减少动态style。

### - List组件的问题
RN自带的List不能适应大数据量的场景，使用[Perf Monitor](https://facebook.github.io/react-native/docs/debugging#performance-monitor)可以监控react组件加载情况。于是首先找到[react-native-large-list](https://github.com/bolan9999/react-native-largelist)，后来发现性能更好的[recyclerlistview](https://github.com/Flipkart/recyclerlistview)但是其有些bug,例如首次加载空白，跳转到奇怪的位置等，且与[Animated](https://facebook.github.io/react-native/docs/animated)有冲突。最终discord将原来web的自定义组件list改一下(div改为View,Scroller改为ScrollerView),基本上就可用了。名之为FAstList(尚未开源)。

## 主线程调优

### UIKit的bug导致图片缓存还不如直接读取
多方验证UIKit从内存读取图片缓存还不如直接从硬盘获取，最后自己实现LocalAssetImageLoader，直接从硬盘读取。

### 继续通过逐步减少组件渲染定位问题
发现是有个一直后台运行的动画一直在吃CPU

## 感知性能调优
此时FPS已经达到60,仍然感觉到慢。

### 滑动侧边栏的优化
从体验上认为侧边栏确实反应较慢，决定改善。
[React Native JS Responder system](https://facebook.github.io/react-native/docs/gesture-responder-system)大多数情况下表现良好，然而这里却表现不佳，找到[react-native-gesture-handler](https://github.com/kmagiera/react-native-gesture-handler),辅助[react-native-reanimated](https://github.com/kmagiera/react-native-reanimated)和[<PanGestureHandler>](https://kmagiera.github.io/react-native-gesture-handler/docs/handler-pan.html)

## 运用[随机访问模块（RAM Bundles）](https://facebook.github.io/react-native/docs/performance#ram-bundles-inline-requires)
大量采用动态加载，但对于lodash这样的基本依赖则主动加载。
这一步骤对iphone6起效显著，平均加载时间减少了3600毫秒。对IPhoneXS减少了700毫秒。