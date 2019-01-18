---
published: false
layout: post
comments: true
date: '2019-01-18 20:00 +08:00'
type: post
title: 'HTTP/2 Websocket 和 gRPC'
categories:
  - web
tags:
  - http2
  - websocket
---

## HTTP/2 是什么

[这篇文章](https://www.infoq.com/articles/websocket-and-http2-coexist)讲的比较详细:

- 它是 google 提出的开源协议，旨在提高网络传输效率

- 它是二进制协议

- 它采用多路复用解决 HTTP 1.1 的 head-of-line blocking (HOL Blocking)问题(较慢的请求阻塞其它请求的问题)

- 它通过压缩 http 头提高效率

- 它支持全双工，因此可以使用 Server Push 推送到客户端

  

## 与 websocket 的比较

|                           | **HTTP/2**                      | **WebSocket**                        |
| ------------------------- | ------------------------------- | ------------------------------------ |
| **Headers** 头            | Compressed (HPACK) 请求头部压缩 | None 无                              |
| **Binary** 二进制         | Yes                             | Binary or Textual 二进制或文本都支持 |
| **Multiplexing** 多路复用 | Yes                             | Yes                                  |
| **Prioritization** 优先化 | Yes                             | No                                   |
| **Compression** 压缩      | Yes                             | Yes                                  |
| **Direction** 方向        | Client/Server + Server Push     | Bidirectional 双向                   |
| **Full-duplex** 全双工    | Yes                             | Yes                                  |



## 实际实现状态

[HTTP2](https://caniuse.com/#search=http2) vs [Websocket](https://caniuse.com/#search=websocket)
显而易见，http2 在浏览器服务器上限制颇多，而 websocket 基本普及

[Will WebSocket survive HTTP/2?](https://www.infoq.com/articles/websocket-and-http2-coexist)

[Does HTTP/2 make websockets obsolete?](https://stackoverflow.com/questions/28582935/does-http-2-make-websockets-obsolete)
第二名答案几点：
Implementations of HTTP/2 show that multiple browser tabs/windows share a single HTTP/2 connection, meaning that push will never know which tab / window it belongs to, eliminating the use of push as a replacement for Websockets.

proxy problem?

[Creating a Node gRPC Service Using Mali](https://auth0.com/blog/creating-a-node-grpc-service-using-mali/)