---
published: true
layout: post
comments: true
date: "2020-06-10 00:00 +08:00"
type: post
title: "Which admin framework should you choose?"
categories:
  - fullstack
tags:
  - react
  - admin
---

Well, let me come straight to the point - I prefer [Ant Design Pro.](https://github.com/ant-design/ant-design-pro/), I will explain.

## The Admins

There are many excellent admin framework, including

### [react-admin](https://github.com/marmelab/react-admin) 13k stars

This is a well-designed framework, it allow you provide a datasource and it is very easy to setup a Create/Update/Delete/List UI for an entity.

There are two problem I encountered:
1: The UI is bind to Material UI v1, and can not upgrade.
2: When you encounter problem, it is hard to find resource to resolve. That's means, it is not widely adopted?

### [coreui-free-react-admin-template](https://github.com/coreui/coreui-free-react-admin-template) 2.7k stars

I have not used it but of course need consider its support.

### [admin-bro](https://github.com/SoftwareBrothers/admin-bro) 1.5k stars

I have not used it but of course need consider its support.

### [pup](https://github.com/cleverbeagle/pup) 557 stars

This is based on [MeteorJs](https://www.meteor.com/) and integrated GraphQL, I love Meteor, if your tech-stack is Meteor, this is a good choice, as it have done most for you.

But Ant design pro can do the same thing as a frontend framework + Meteor as backend.

## [ant-design-pro](https://github.com/ant-design/ant-design-pro/) 25.4k

ant-design-pro is based on [ant-design](https://github.com/ant-design/ant-design) and [umi](https://github.com/umijs/umi), endorsed by [Alibaba](https://www.dogedoge.com/rd/Fw%2BG9v82CFGOW4E6nYW%2BCAsxQ%2FZ8frgJIwBbOuSoezI%3D). ant-design-pro was commercial but then open source and totally free under the license MIT.

It provide admin layout, authorize, routes , i18n, code-splitting, mock, proxy, theme, typescript out-of-the-box.

[It support VUE](https://pro.antdv.com/)

### Some issues

But I also want to mention the issue you may concern:

It use [dva](https://github.com/dvajs/dva) which based on redux-saga. It is not bad, but if you want to use async/await in the side effect, that's will be a problem, you need be careful and you'd better use generator to follow the rule.

It does not work well with [nextjs](https://www.dogedoge.com/rd/psx1x4ozyHYBBl8ZcszW8x%2B%2BCzkq4UKiP3P%2FgbjxZHM%3D), but I think we need not.

[It does not support angular yet.](https://github.com/ant-design/ant-design-pro/issues/605)

## Conclusion

I prefer `ant-design-pro` as it is the only opensource admin I can found so far that endoresed by a top company. It is very popular in China and have well-support to english-speaking developer community. This is benifit by the `Middle Platform` strategy driven by Alibaba regardless how it really be :).
