---
published: true
layout: post
comments: true
date: "2022-05-22 00:00 +08:00"
type: post
title: "Steps of moving the stacks of an oneline product from Meteorjs to Express and Apollo"
categories:
  - nodejs
tags:
  - fullstack
  - meteorjs
  - graphql
---
How to move the stacks from Meteorjs to Express and Apollo? 

We was doing this and after monthes of refactoring and testing, finally we made it, it is a time-consuming and arduous process.

## Context
The product's stack is Meteorjs at the beginning, I and most of my team members love meteorjs(even now). As time wen on, React came out, then graphql and apollo, need to mention(again?) that the apollo team is same team create meteorjs.

Once the meteorjs support react, non of us was willing to use blaze template anymore. One day we found it is time to convert all blaze to react, later, we got started to use graphql instead meteor DDP method. Eventually, we were all think about why not phase out meteorjs and move to apollo + express + react?

Actually, we had thought to keep meteor as the bedrock of the mono-repository project, because the build tool chain of Meteorjs is so good, but the problem is that meteorjs does not working well with apollo v3 subscriptionit(conflict with DDP subscription and lead to crash).

## Steps

### Convert Blaze template to react
This step is in conjunction with converting all Meteorjs methods to graphql api, luckily we have a clear edge between client code and server code, so while a lot of code changes got our hands dirty, the goal is explicit.

I saw a large Meteorjs project with mixed client-server code and I can't imagine how the same refactoring would work in this case.

### Flow Router to react-router
The new version of react router api will require many changes when convert flow router to. So I wrote a wrapper [react-route-named-route](https://github.com/imhazige/react-router-named-route). Which will make a smallest changes when convert flow router to react router.

### Convert all meteor method to graphql api

### Cron to [bulljs](https://github.com/OptimalBits/bull)
Formally we use cron package of meteor, now switch to bulljs, the drawback is that it is depend on redis, but not a big problem. Of course, this result in lots of refactoring. 

### Accounts
Meteorjs package `accounts-base`, `accounts-password` is the core of the system, this is the most important part we were foucus on when doing the refactoring.

The good news is that meteorjs is open source(the reason why we choosed it), we read the source code of the two package and implement the same flow(inlcude email, forget password, etc). No changes will apply to the `users` collection.

## Meteor Mongo