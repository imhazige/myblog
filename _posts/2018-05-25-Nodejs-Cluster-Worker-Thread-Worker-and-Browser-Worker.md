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
---
## Node.js Thread Worker
Recently nodejs have [add initial thread support](https://github.com/nodejs/node/pull/20876).
It says:

> The super-high-level description of the implementation here is that**Workers can share and transfer memory, but not JS objects (they have to be cloned for transferring)**, and not yet handles like network sockets.

> Workers are conceptually very similar to child_process and cluster.
Some of the key differences are:

> Communication between Workers is different: Unlike child_process IPC, **we don’t use JSON**, but rather do the same thing that postMessage() does in browsers.
This isn’t necessarily faster, although it can be and there might be more room for optimization. (Keep in mind how long JSON has been around and how much work has therefore been put into making it fast.)
The serialized data doesn’t actually need to leave the process, so overall there’s less overhead in communication involved.
**Memory in the form of typed arrays can be transferred or shared between Workers and/or the main thread, which enables really fast communication for specific use cases.**
Handles, like network sockets, can not be transferred or shared (yet).
There are some limitations on the usable API within workers, since parts of it (e.g. process.chdir()) affect per-process state, loading native addons, etc.
**Each workers have its own event loop**, but some of the resources are shared between workers (e.g. the libuv thread pool for file system work)

## [Node.js Cluster Worker](https://nodejs.org/api/cluster.html)
> A single instance of Node.js runs in a single thread. To take advantage of **multi-core systems**, the user will sometimes want to launch a cluster of Node.js processes to handle the load. it is process, not thread, so it  need CPU support multi-core.

It uses IPC(Inter-process communication) which is not as efficient as multithread which share memory in the same process. not to speak of creating a new process will take more system resource than create a new thread in a process.

## [the Worker in browser](https://developer.mozilla.org/en-US/docs/Web/API/Web_Workers_API/Using_web_workers)
> Web Workers is a simple means for web content to run scripts in background threads. 

> Workers run in another global context that is different from the current window. Thus, using the window shortcut to get the current global scope (instead of self) within a Worker will return an error.

> You can run whatever code you like inside the worker thread, with some exceptions. For example, you can't directly manipulate the DOM from inside a worker

This is because of the pinciple of "only one thread -- the main thread -- can operate UI", it is another long story, we have see the same practice in java swing.


## PS:
So I just wondering, if nodejs became multithreading, with its inherent nio feature, how powerful and shiny it will be, as I have see so many company have moving from Java to embrace nodejs already, what them will be? -- We will see.

## Refs
[If nodejs is multithreaded why should i use cluster module to utilize multicore cpu?](https://stackoverflow.com/questions/11919907/if-nodejs-is-multithreaded-why-should-i-use-cluster-module-to-utilize-multicore)

[Multithreading, Multiprocessing and the NodeJS event loop](https://medium.com/@stevennatera/multithreading-multiprocessing-and-the-nodejs-event-loop-5b2929bd450b)

[Nodejs Asynchronous IO and Single Thread](/nodejs/2017/12/31/nodejs-asynchronous-io-and-single-thread/)


