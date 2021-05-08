---
published: true
layout: post
comments: true
date: "2021-05-08 00:00 +08:00"
type: post
title: "Why you should use schema when using mongodb"
categories:
  - nodejs
tags:
  - mongodb
---
## Origin
I have doing many project with mongodb for the past many years, I built one product which adopt [meteorjs](https://www.meteor.com/) from scratch.

Then get involved in development of many large code-base mongodb related project, most are meteorjs.

But the only one which have apply schema with mongodb is the product I built from scratch! for others, never...

I still remember the feel of the shock when I first look into the code of a online product many years ago - there are no schema, fields are added here and there all in the code, like grain of sand on the beach...

As at that time I already had the habit that I know I can found the most important truth from the schema - from the project I have did, I feel helpless suddenly to try to understand the code.

That's the first time, then many times, I get used to it now, `Ctrl + F` is the good tool, `LOL`.

## Why?
But definetly it is a good practice to have schema, why?

- It will be the best source of truth to know what the data be, what the business be
- It forces developer to think a little more seconds even minutes before they want to add one or many fields or implement a new feature
- It provides validation before write to the database

## Tool
- [simpl-schema](https://github.com/longshotlabs/simpl-schema) is what I was using, it pretty good.
- [typeorm](https://typeorm.io/#/) supports mongodb, as my experience, it is workable.
- Now [prisma](https://github.com/prisma/prisma) is on developing to support mongodb. with `graphql`, it is a more robust ecosystem.

