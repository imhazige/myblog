---
published: true
layout: post
comments: true
date: '2019-07-12 00:00 +08:00'
type: post
title: '到底什么是Deno?'
categories:
  - javascript
  - nodejs
tags:
  - deno
---

[Deno](https://deno.land/)， 按其官网说明为“使用 V8, Rust, and Tokio 构建的 javascript/typescript 安全的运行时。”

它到底与 Nodejs 有何不同？连名字都是 node 的重新拼接，为什么又要开发这样一个东东？

这篇文章[What’s Deno, and how is it different from Node.js?](https://blog.logrocket.com/what-is-deno/) 这样解释：

## Deno 的安全

- 不能访问文件系统
- 不能访问网络
- 不能执行其它脚本
- 不能访问环境变量

## Deno 的模块

可以直接引入 url 模块，达到去中心化的目的（没有 npm）。当然也可以引入本地脚本。对于网络模块，会有个本地缓存文件夹。

## 目标是可以在浏览器中运行

然而这些又可以通过参数来允许例如`deno run --allow-write write-hello.ts`
这些参数包括:

- `--allow-write`
- `--allow-net`
- `--allow-env`
- `--allow-run`

这样的解释让我跟感觉迷惑，不执行脚本是不能执行其他的脚本吗？

不能访问网络那连数据库也访问不了了？不过[mysql 插件](https://github.com/manyuanrong/deno_mysql)都出来了，应该是可以的，只不过很让人迷惑 deno 的目标是什么？

后来我看了[Deno 如何偿还 Node.js 的十大技术债？](https://www.infoq.cn/article/SiVQVIwANd_1SXkBwlFL)才弄明白：

Deno 的目标是安全、简洁、<mark>单一</mark>可执行文件

> Deno 的设计目标是安全、模块简洁、**单一可执行文件**（简化封装）等，目前已完成的特色之一，就是可以透过 URL 来汇入各种模块，**另外预设安全性，要存取实体资源或网络时都需要授权，用户的代码只能在安全的沙箱中执行**。为什么他最熟悉的 Go 做不到？因为“动态语言仍有其必要。“他强调，尤其要建立一个适当好用的 I/O 处理流程（pipeline）时，动态脚本语言是不可或缺的工具。

> 但是，这一次，他不想重走 Node.js 的老路，将整个 Web 服务器放进框架，<mark>Ryan Dahl 决定打造出一支自给自足功能完整的 runtime 程序，容易带着走，而不是有着一套复杂目录和结构的框架。</mark>

> 而且，打包成 runtime 形式，就可以部署到各种环境中，Ryan Dahl 举例，如果在无服务器服务上部署了 Deno，就可**指定一个网址**，就能启动这个<mark>无服务器服务</mark>的调用，而不用上传一段代码到无服务器服务平台上执行，也可以部署到边缘运算设备中，来完成小型的数据处理工作。

> Deno 未来将瞄准小型机器学习的推理需求
> 不同于 Nvidia 的 CUDA 可以用来调度多颗 GPU 资源进行复杂的机器学习训练工作，Ryan Dahl 解释，<mark>Deno 想要提供的是简单够用的机器学习能力</mark>，可以用来满足只有单颗 GPU，而且是小型或是只需要推理的计算需求，支持 WebGL 已经够用了。

这样我算明白了，总结一下：

- Deno 想要是一种轻巧的可做科学计算的 javascript 运行时。
- Deno 想要像 python 那样，随便放到哪里都可以方便的运行，不需要臃肿的依赖，一个文件就可以运行。
- 要保证安全。
