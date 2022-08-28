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
The product's stack is Meteorjs at the beginning, I and most of my team members love meteorjs(even now). As time wen on, React came out, then graphql and apollo, need to mention(again?) that the apollo team is same team who created meteorjs.

Once the meteorjs support React, non of us was willing to use Blaze template anymore. One day we found it is time to convert all Blaze to React, later, we got started to use graphql instead Meteorjs DDP method. Eventually, we were all think about why not phase out Meteorjs and move to apollo + express + react?

Actually, we had thought to keep meteor as the bedrock of the mono-repository project, because the build tool chain of Meteorjs is so good, but the problem is that Meteorjs does not working well with apollo v3 subscriptionit(conflicts with DDP subscription and lead to crash).

## Steps

### Convert Blaze template to react
This step is in conjunction with converting all Meteorjs methods to graphql api, luckily we have a clear edge between client code and server code, so while a lot of code changes got our hands dirty, the goal is explicit.

I saw a large Meteorjs project with mixed client-server code and I can't imagine how the same refactoring would work in this case.

### Flow Router to react-router
The new version of react router api will require many changes when convert flow router to. So I wrote a wrapper [react-route-named-route](https://github.com/imhazige/react-router-named-route). Which will make a smallest changes when convert flow router to react router.

### Convert all meteor method to graphql api
This is a general target, most problems we encountered was that we need found alternative to the third party library which based on Meteorjs, I will discuss them later.

### Cron to [bulljs](https://github.com/OptimalBits/bull)
Formally we use cron package of Meteorjs, and now we use Bulljs instead, the drawback is that it depends on Redis, but not a big problem. Of course, this result in lots of refactoring. 

### Accounts
Meteorjs package `accounts-base`, `accounts-password` is the core of the system, which was the most concerned part when we refactor.

The good news is that Meteorjs is open source (the reason we chose it), we read the source code of both packages and implemented the same flow (including email, forgotten password, etc.). No changes will be made to the "Users" collection.

### Meteor Mongo
In this step we implement a class based on mongo driver to have the same inteface as Meteorjs collection, but need check all the invokation and make sure being changed to asynchronism. 

### New project structure without Meteorjs
At the before steps, we were able to do the refactor with meteor running. But now, we have to remove Meteorjs all Meteor keyword need to check and refactor to new stack.

This was also the most time-consuming and hard part.

We have to make it easy to merge the develop branch which is keep on developing for online product. So there should be not big project folder structure change.

#### Mono-reposotory
We have look for some mono-reposotory framework, including `Nextjs`, `Remix`, `Nx`, None of them does good support to a existing project. You know now, how powerful that Meteorjs's build tool is. It is very tolerent to differnt stack(react,vue, frontend), different syntax(commonjs,ES6,typescript)...

#### Yarn Workspace and webpack
So we had to do it by ourself. 

We uses yarn workspace, the root folder is the same one of old project. 

- Setup a `API` project underneath the root folder. Setup express and apollo v3 server.
- Setup a `WEB` project underneath the root folder. Via the `create-react-app and eject`.

Need mentioned here is that we had tried `Vite`, it almost fit until we encountered the problem that some code use `require` and some code using `import`. `Vite` can not handle that.

We have to use webpack on both `API` and `WEB` project. The magic is webpack `alias`, point `/imports` to the `imports` folder underneath the project root. In this way, the import statement `/imports/xxxx` at everywhere in the code will not need to be changed, and we can always easily merge from `develop` branch which was still on Meteorjs stack.

The alias trick also helped us being able to run the application at the very ealier stage before all refactoring done. In the webpack config, resolve `meteor/xxx` package to code that we re-implemented without Meteorjs. 

### Meteor subscription to Apollo v3 Subscription
This step is easy because at this point we are already based on expressjs.

### Make all the unit test working
We have about 500+ test on the server side. Now with new stack, all test are done much faster than the old stack, which is nice to see.

### Updating build/deploy CI
This step also took us a lot of time.

## Conclusion
Meteorjs is still an amazing full stack framework. Switching to the new stack depends on the existing code, in our case it wasn't a very complicated process, but it still took us months and there were a lot of issues blocked and resolved.



