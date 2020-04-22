---
published: true
layout: post
comments: true
date: "2020-04-22 00:00 +08:00"
type: post
title: "GraphQL现状"
categories:
  - nodejs
  - graphql
tags:
  - graphql
---

GraphQL 要说火，却又不是很火，要说不火，却又不是很不火，这样的状态怎么形容呢？

至少在国内，并没有火起来。我个人的感觉，GraphQL 能解决的问题，RESTful API 绝对能解决，而相反 RESTful API 能解决的问题，GraphQL 不一定能解决。这个在文章后面会讲。
至少在国内，并没有火起来。我个人的感觉，GraphQL 能解决的问题，RESTful API 绝对能解决，而相反 RESTful API 绝对能解决问题，GraphQL 不一定能解决，这个在文章后面会讲。

## GraphQL 生态

GraphQL 生态现在比较丰富，然而却天生的和 javascript/nodejs 较为亲近。目前运用最广泛的是 [Apollo GraphQL](https://www.apollographql.com/), 其服务端生态都是 nodejs。

其实，我认为 GraphQL 更像是全栈/大前端的范畴，是连接前端和后端多形态数据的那一层。

## 要写哪些代码

GraphQL 一大优点就是前端调用统一的模式，要处理的只是 GraphQL，就像只需要 sql 和数据库打交道一样。然而，对于 api 开发来说，则并没有这个便利。

要建立一个 GraphQL api 端点，在没有框架的支持下，需要

- Schema:定义参数类型，每个参数需要指明 input 类型
- Schema:定义所有的输出类型，输入类型和输出类型不能共用，因为 GraphQL 强调的就是强类型，为的是减少出错
- Schema:定义查询（Query）/修改（Mutation）/订阅（subscription）
- 定义 Resolver

同 RESTful API 相比，其繁琐的主要是定义 Schema 里众多的类型，对于习惯了 json 弱类型的开发人员来说，工作量显然增大不少。

现如今大部分工具都具有 `code first` 的特性，例如 [nestjs](https://nestjs.com/) 里 typescript 的类型直接自动生成 schema。需要实现的代码变为：

- 定义 typescript 强类型，可共用于参数和输出(DTO),而且这一步往往是和数据库 Model 一起做了
- 定义 Resolver

这样就和大家熟悉的 RESTful API 的工作量差不多了。

## 工具和框架

### [Apollo GraphQL](https://www.apollographql.com/)

Apollo GraphQL 是目前使用最广泛的工具，几乎所有 nodejs 服务端框架的 GraphQL 特性都是基于 Apollo Server。

### [prisma](https://github.com/prisma/prisma)

prisma 将 GraphQL 的概念使用到了数据访问上，从数据模型设计到访问关系数据库，替换了 ORM 这一层。程序访问数据库直接使用抽象的 GraphQL 来实现。prisma1 需要作为单独的服务运行，而 prisma2 则可以直接整合到 nodejs 代码中使用。

需要指出的是，prisma 对空间地理位置查询支持得不好。

## GraphQL 使用的一些问题

### 文件上传

GraphQL 目前都是两次请求实现，第一次是 form 上传文件流,第二次才是 graphql，目前没发现支持进度条的 GraphQL 上传组件。说来说去，大部分解决方案还是使用 RESTful 来处理上传，同一个项目要 graphql 和 RESTful 共存，岂不是很尴尬？

## RESTApi Expanding

这里想说一句，GraphQL 被人称道的图式查询，RESTful 也可以很好的实现，著名的例子就是 stripe api 的 [expanding](https://stripe.com/docs/api/expanding_objects) 特性。

## 结论

国外确实很火，但也并不是所有应用都适用，目前并没有见许多 重量级 API 服务改用 GraphQL。

国内火不起来。

对于老项目，伤筋动骨，对于新项目，GraphQL 适和图类结构（例如社交）项目，依然范围较小，然而已经有很成熟的 RESTful，使用 GraphQL 需要很大的动机。
