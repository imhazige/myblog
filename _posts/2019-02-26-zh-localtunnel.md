---
published: true
layout: post
comments: true
date: '2019-02-26 20:00 +08:00'
type: post
title: '使用localtunnel测试本地应用'
categories:
  - web
tags:
  - localtunnel
---

有时候开发 web 应用需要与第三方 api 交互，需要暴露本机的 http api 供外网可以访问。

[ngrok](https://ngrok.com/)提供免费的服务，但是固定 url 的则要收费。

现在出现了[localtunnel](https://github.com/localtunnel/localtunnel),提供免费的固定子域名。

## 使用方法

需要 node

`npm install -g localtunnel`

`lt --port 8000 --subdomain aabbccddd`
则会生成 url https://aabbccddd.localtunnel.me 指向本机 8000 端口,`--subdomain`是指定子域名，在没有被占用的情况下就会按照此参数生成子域名。这一点比 ngrok 要好，但是速度目前测试来看比 ngrok 要慢一点.

你也可以自己搭建 [localtunnel 服务器](https://github.com/localtunnel/server)。
