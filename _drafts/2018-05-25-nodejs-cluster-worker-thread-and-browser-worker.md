---
published: false
layout: post
comments: true
date: '2018-05-25 20:00 +08:00'
type: post
categories:
  - front-end
  - javascript
  - nodejs
tags:
  - multi-thread
title: 'Nodejs Cluster Worker, Thread Worker and Browser Worker'
---
## Node.js thread support - worker
Recently nodejs have [add initial thread support](https://github.com/nodejs/node/pull/20876).

## [Node.js cluster,worker](https://nodejs.org/api/cluster.html)
> A single instance of Node.js runs in a single thread. To take advantage of **multi-core systems**, the user will sometimes want to launch a cluster of Node.js processes to handle the load. it is process, not thread, so it  need CPU support multi-core.

It uses IPC(Inter-process communication) which is not as efficient as multithread which share memory in the same process. not to speak of creating a new process will take more system resource than create a new thread in a process.

## [the Worker in browser](https://developer.mozilla.org/en-US/docs/Web/API/Web_Workers_API/Using_web_workers)

PS:
So I just wondering, if nodejs became multithreading, with its inherent nio feature, how powerful and shiny it will be, as I have see so many company have moving from Java to embrace nodejs already, what's the future of Java? We will see.

## Refs
[If nodejs is multithreaded why should i use cluster module to utilize multicore cpu?](https://stackoverflow.com/questions/11919907/if-nodejs-is-multithreaded-why-should-i-use-cluster-module-to-utilize-multicore)

[Multithreading, Multiprocessing and the NodeJS event loop](https://medium.com/@stevennatera/multithreading-multiprocessing-and-the-nodejs-event-loop-5b2929bd450b)

[Nodejs Asynchronous IO and Single Thread](/nodejs/2017/12/31/nodejs-asynchronous-io-and-single-thread/)


