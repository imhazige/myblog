---
published: true
layout: post
comments: true
date: '2019-03-11 20:00 +08:00'
type: post
title: 'mac接入局域网交换机问题'
categories:
  - mac
tags:
  - lan
  - interchanger
---

今天使用 Mac 接入局域网,使用 Wi-Fi 没问题，使用网线连交换机接入，怎么试都不行。

用别人的网线，别人的可以，我这 Mac 就不行，不接交换机，直接连网线口，也不行。

尝试关闭 System Integrity Protection,依然不行，问题不在这。

我的 mac 开启了 Wi-Fi 共享，尝试将 Wi-Fi 共享关闭，Wi-Fi 连局域网成功，再插入交换机，然后关闭 Wi-Fi，哈哈，居然成功了。

原因尚不清楚，可能和网络共享有关，总之，解决办法就是：
关闭网络共享，使用 Wi-Fi 连接上后再用网线连，关闭 Wi-Fi 确认网线可以连通后可再去开启网络共享。
