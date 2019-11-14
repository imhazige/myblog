---
published: true
layout: post
comments: true
date: '2019-11-14 00:00 +08:00'
type: post
title: '微软Windows团队和Office团队都倾向于Ract Native而不是他们自己的Xamarin'
categories:
  - front-end
tags:
  - react
  - reactnative
---
> 本文摘译自[Microsoft looks to React Native as a way to tackle the cross-platform development puzzle](https://www.theregister.co.uk/2019/11/07/microsoft_react_native/) 作者 Tim Anderson

微软内部Windows和Office团队采用Reactive Native for Windows已不是新闻了。最近即将发布的[Surface Duo](https://www.theregister.co.uk/2019/10/02/microsoft_surface_phone/)会不会也将接受React Native生态，微软给出的答案是“希望是”，瞧，这到底是不是暗示？

![](https://regmedia.co.uk/2019/11/07/memory.jpg?x=648&y=342&infer_y=1)
从上图可看，React Native for Windows性能与UWP c#和UWP c++相差不了多少，而Electron的性能则差远了。微软内部选择React native的原因也是由于他们使用的是c++版本性能优于Xamarine。

目前React Native for Windows编译的是c#然而后面将会改为c++,届时性能又将提升。

目前微软官方的React Native for Windows主要是基于UWP，不能运行于win7，对于win7，可使用社区的WPF版本。



