---
published: true
layout: post
comments: true
date: "2020-02-20 00:00 +08:00"
type: post
title: "nodejs作者Ryan Dahl访谈2021摘要"
categories:
  - nodejs
tags:
  - deno
---
[原文](https://evrone.com/ryan-dahl-interview) 
- “降低复杂性总是有益的”
- JavaScript从来不是我最喜欢的语言-它只是最常见的语言-因此，它是表达许多想法的有用方法。
- TypeScript允许人们使用JavaScript构建更大，更健壮的系统，我想这是我日常工作的首选语言。 
- 使用Deno，我们试图消除将TypeScript代码转换为JavaScript所固有的许多复杂性，希望这将使更多的人能够使用它。
- 我认为最终TypeScript（或类似的东西）将作为JavaScript标准的一部分被提出，但这需要时间。
- 我与之共事的每个人都使用vscode，他们喜欢它。可能大多数人都应该使用它。
- 对于软件基础结构来说，基于文本并可以通过简单工具进行访问非常重要。`在Java世界中，他们犯了将IDE过多地与该语言的工作流联系在一起的错误，从而造成一种情况，即实际上人们被迫使用IDE对Java进行编程。`通过自己使用简单的工具，可以确保我开发的软件不会不必要地依赖IDE。
- 不要将新颖性误认为是实验性的。`Deno绝对是实用的，它建立在服务器端JS已有多年经验的基础上。`我和我的同事们致力于构建实用的动态语言运行时。我们围绕依赖项管理和安全性所做的设计选择非常保守。
- 我们可以很容易地引入另一个类似于NPM的集中式系统，`但是选择了基于Web标准URL的链接系统。(实际上我们认为这样更安全)`
- 我更喜欢自己以2倍的速度观看youtube上的演讲。
- 我希望Deno不依赖任何集中式代码数据库。
- 对于某些领域，还有更多可用的Python库，特别是在科学计算中。根据新程序员试图做什么，Python可能合适。`但是，总的来说，我认为JavaScript是一种更好的入门语言。`
- OS线程无法很好地扩展到高并发应用程序。如果您有许多并发连接，请不要使用Ruby。
- Node / Deno是JavaScript的最佳选择，但是在没有其他可能偏向JS的其他要求的情况下，Go最终是高并发系统的更好选择。
- 动态（或“脚本”）语言很有用。程序员要解决的问题通常不受CPU限制。`问题更多的是工程时间限制。能够快速开发和部署更为重要。`
- 在动态语言中，JavaScript（纯JavaScript或带类型的JavaScript）是最受欢迎的，也是迄今为止最快的。`相信在将来，我们所追求的唯一动态语言将是这种奇怪的，从Web浏览器中衍生出来的进化语言。`
- 动态语言有其局限性，并不适合所有问题领域。如果您正在对数据库进行编程，则最好使用一种使您对计算机具有最大控制权的语言（例如Rust或C ++）进行编写。
- `如果您正在编写高并发性API服务器，那么很难想象有比Go更好的选择。`
- `降低复杂性总是有益的。程序员必须与之交互的语言，VM，框架和概念越少越好。`

- xs真正喜欢的第三方Deno生态系统项目:

    [A React Framework](https://alephjs.org/)

    [Web framework (like express)](https://deno.land/x/oak@v6.5.0)

    [web-based GUIs for desktop applications](https://deno.land/x/webview@0.5.5)

    [puppeteer (same as in Node)](https://deno.land/x/puppeteer@5.5.1)

    [visualize module graphs](https://deno-visualizer.danopia.net/)

    [A minimal but flexible static site generator](https://github.com/mdubourg001/ssgo)
- 我们正在构建Hyper Web服务器的绑定，它将提供HTTP / 2，并且可能比当前Web服务器快得多。
- 我们正在构建“ deno lsp”，该语言提供了语言服务器协议，以便VSCode（和其他IDE）可以直接与Deno对话以获取语法突出显示，类型检查，格式设置等-期望下一次的编辑体验会大大改善几个月。
- 我们正在努力通过尽可能多的Web平台测试-因此，随着时间的推移，Deno变得与Web更加兼容。查看 [Q1路线图](https://github.com/denoland/deno/issues/8824) 以了解更多详细信息。
