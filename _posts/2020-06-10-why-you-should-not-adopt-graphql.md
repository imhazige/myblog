---
published: true
layout: post
comments: true
date: "2020-06-10 00:00 +08:00"
type: post
title: "Why-You-Should-Not-Adopt-GraphQL"
categories:
  - fullstack
tags:
  - graphql
---

First let's have a glance of GraphQL

## Tools and framework

### [Apollo GraphQL](https://www.apollographql.com/)

Now most nodejs GraphQL tool/framework is based on Apollo.

### [prisma](https://github.com/prisma/prisma)

Prisma is likely to replace the ORM layer with GraphQL as a data access layer. It is a good idea, prisma1 need running as a individual service, while prisma2 improves a lot, it is able to be emded in a nodejs app.

## GraphQL Does Not Reduce the Code Size at All

It may reduce the code of the front-end, but the code just move to backend.

### What Code Need Wwrite?

If without any tool:

- Schema: All params as Input type
- Schema: All Output type, could not reuse input type, because this is the GraphQL - strong typing
- Schema:Query/Mutation/Subscription(it like we go back to old c)
- Resolver

Contrast to RESTful API, the schema will increase lots of code and if you are familiar with the weak typing like json, it will drive you nuts.

Now, most tool provide the `code first` feature, for example [nestjs](https://nestjs.com/), the typescript type is able to create the schema automatically. The code need write:

- typescript strong typing, params, DTO, and you could resue the Model
- resolver

So it is almost same as RESTful API implementation.

## Upload Problem

GraphQL upload actually do two steps, first is a form post to upload the file stream, then the next step is GraphQL api, it does not support upload progress. So..., many solution is using restapi to handle upload aside with GraphQL, what a ridiculous state...

## GEO search problem

While it is very easy to do GEO search in a RESTful api, to implement in GraphQL will be a bit complex.

## Most Mature and New Api is RESTful

## RESTApi Expanding

RestApi also can fetch more with one query, a good example is [expanding](https://stripe.com/docs/api/expanding_objects) of stripe api.

## RestApi is So Mature, Easier to Find Good Developer to Build a Team

## Conclusion

I have see many projects using GraphQL, they works, but some seems to be in a mess. Some project considered using GraphQL but finally choose GraphQL for the risk reason.

As what GraphQL can doing is absolutly be able to be implemented by RESTful API, I recommend keep on RESTful.
