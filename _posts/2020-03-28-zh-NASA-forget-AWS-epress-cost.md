---
published: true
layout: post
comments: true
date: "2020-02-02 00:00 +08:00"
type: post
title: "幽默-NASA导入247 Petabytes(拍)到AWS,却忘记了计算AWS的出口费用"
categories:
  - devops
tags:
  - aws
---

![](https://regmedia.co.uk/2016/08/16/nasalogo.jpg?x=442&y=293&crop=1)
[这篇文章](https://www.theregister.co.uk/2020/03/19/nasa_cloud_data_migration_mess/)讽刺的语言让我哈哈大笑，NASA 和亚马逊两个都中枪。

NASA 预计 2025 年前导入 215 PB（1PB = 1024TB）到 AWS，结果忘记了恶心的 AWS 出口费用。
初略算一下按每 GB18.25 美元算，大概要 `215*1024*1024*18.25=4114350080` 美元，大约 41 亿美元，这还只是说每个数据只下载一次，大家可以想象一下 NASA 的表情……

AWS 这个 egress 是最坑的，估计好多人都中过招。
