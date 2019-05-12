---
published: true
layout: post
comments: true
date: '2019-05-11 20:00 +08:00'
type: post
title: '微软在Build开发者大会上正式公布了React Native for Windows'
categories:
  - frontend
tags:
  - windows
  - react native
---

微软在 Build 开发者大会上正式公布了 React Native for Windows

React Native for Windows 开发的是原声的 Windows 应用。

直接允许开发者使用 React / web 技能直接编写 Windows 平台 UWP 应用，且是 Windows 10 支持的所有设备（包括 PC、平板、二合一、Xbox、混合现实设备等）构建应用程序，从而提升用户体验 (UX)。当然，喜欢 C＃和 XAML 的开发人员可以继续使用 Xamarin 和 Xamarin.Forms 来实现类似的高性能需求。

该项目此前是使用 C# 实现的，然而 React Native 的持续发展方向涉及 C++ 与 JS 之间更密切的交互，这很难通过单独的 C# 实现来实现。

所以当前微软正在使用 C++ 重写 React Native for Windows，以获得更好的性能，同时更好地与暴露出来的 C++ React Native 核心保持一致。微软打算提供一个具有最小破坏性更改的兼容层，该层将支持使用 C# 编写的现有应用、view 管理器和原生模块。

参见[微软即将完成将 office365 用 react-native 方式重写](https://blog.kazge.com/javascript/2018/06/16/zh-microsoft-rewritten-office365-in-react-native/)

然而此项目目前文档尚不太详细。
