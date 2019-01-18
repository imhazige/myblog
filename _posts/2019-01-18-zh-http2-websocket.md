---
published: true
layout: post
comments: true
date: '2019-01-18 20:00 +08:00'
type: post
title: 'HTTP/2 和 Websocket'
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

|                           | **HTTP/2**                                                                              | **WebSocket**                        |
| ------------------------- | --------------------------------------------------------------------------------------- | ------------------------------------ |
| **Headers** 头            | Compressed (HPACK) 请求头部压缩                                                         | None 无                              |
| **Binary** 二进制         | Yes                                                                                     | Binary or Textual 二进制或文本都支持 |
| **Multiplexing** 多路复用 | Yes                                                                                     | Yes                                  |
| **Prioritization** 优先化 | Yes                                                                                     | No                                   |
| **Compression** 压缩      | Yes                                                                                     | Yes                                  |
| **Direction** 方向        | Client/Server + Server Push (*Server Push只能浏览器消化，不支持API,也就是代码无法使用*) | Bidirectional 双向                   |
| **Full-duplex** 全双工    | Yes                                                                                     | Yes                                  |



## 问题
- HTTP/2 Server Push 不能被代码使用，所以还得配合SSE(Server sent event)，无论从coder还是运维的角度来看，这混搭增加了复杂度。
- IE对http2以及SSE都支持的不好
- HTTP/2 连接不确定性会永远保持连接，而websocket有onclose事件，对代码友好
  > HTTP/2 Servers are encouraged to maintain open connections for as long as possible but are permitted to terminate idle connections if necessary. When either endpoint chooses to close the transport-layer TCP connection, the terminating endpoint SHOULD first send a GOAWAY (Section 6.8) frame so that both endpoints can reliably determine whether previously sent frames have been processed and gracefully complete or terminate any necessary remaining tasks.
- 多个tab页windows页可能共用一个HTTP/2连接，你无法知道Server Push来自哪一个
- 由于多路复用，以前基于HTTP 1.1的网站提速技巧Domain sharding（由于浏览器限制同一域名最多连接数）将不再起作用。

## 实际实现状态

[HTTP2](https://caniuse.com/#search=http2) vs [Websocket](https://caniuse.com/#search=websocket)
显而易见，http2 在浏览器服务器上限制颇多，而 websocket 基本普及。

再来看看[SSE](https://caniuse.com/#search=server%20side%20event), 支持程度仍然不如websocket。

## 结论：

HTTP/2 完全无法不能替代websocket，各有各的适用场景。我个人偏好，做app还是偏向于websocket，参看我的另外一博文[介绍Meteor]({% post_url 2018-07-24-zh-meteor-introduction %}).