---
published: true
layout: post
comments: true
date: '2018-06-04 20:00 +08:00'
type: post
categories:
  - hardware
  - AI
tags:
  - reactjs
title: 'GPU,CPU,APU的区别'
---
## 疑问
而今GPU被用来挖矿，用来机器学习，到底GPU和CPU是什么区别？既然GPU这么有用，为什么不直接上GPU？

## GPU和CPU
CPU只有几个核心（core）而GPU却有百个以上的核心,自然，GPU的计算能力可以是CPU的百倍。但是众所周知的木桶理论也适用于计算机整体能力，GPU最快，但是如果配套的其他组件部分跟不上（需要很多很多的money），那速度也依然不行。批量生产的个人电脑综合考虑，还是要用CPU与GPU配合。
当前的主流操作系统已经支持GPU加速计算，例如Apple支持的[OpenCL](https://www.khronos.org/opencl/)，[Microsoft的DirectCompute](https://blogs.msdn.microsoft.com/chuckw/2010/07/14/directcompute/)。

## APU
对于图形显示要求较高的电视游戏主机，APU集合了CPU和GPU的功能，这样不仅经济的提高了性能，也节省了空间，不过，其缺点就是不适合更广泛的用途，例如用于个人电脑是不经济的，效能也很低。


### Refs
[What’s the Difference Between a CPU and a GPU?](https://blogs.nvidia.com/blog/2009/12/16/whats-the-difference-between-a-cpu-and-a-gpu/)

[CPU VS GPU – What is the Difference & How do you Avoid Bottlenecking](https://www.progamerreview.com/cpu-vs-gpu/)
