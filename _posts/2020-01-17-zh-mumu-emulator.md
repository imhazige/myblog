---
published: true
layout: post
comments: true
date: '2020-01-17 00:00 +08:00'
type: post
title: 'mumu模拟器配合charles抓包开发的配置'
categories:
  - mobile
tags:
  - emulator
  - android
---
开发测试，mumu安卓模拟器比较干净，速度较快，是比较推荐的工具。然而其配合charles抓包时，会导致输入无法使用，或无法启动模拟器。   
解决方案：  
在代理中设置将mumu.nie.netease.com,10.0.2.2,*.exc.mob.com设置为不代理。