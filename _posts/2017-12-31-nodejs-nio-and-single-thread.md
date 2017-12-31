---
layout: post
comments: true
title: 'Nodejs Asynchronous IO and Single Thread '
date: 2017-12-31 10:00 +08:00
type: post
published: true
status: publish
categories:
- 'nodejs'
tags:
- 'AIO'
---
<link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/font-awesome/4.7.0/css/font-awesome.min.css">

Nodejs is popular in recent years, people say it have good performance of high concurrency. Also people say its single thread event loop will make it have problem when a operation block the event loop thread.

I was confused sometimes, if I want to choose java,php,nodjs to implement a service, what should I concern if I prefer nodejs?

After read this terrific disccussion, I understand 

Refs:
[How the single threaded non blocking IO model works in Node.js](https://stackoverflow.com/questions/14795145/how-the-single-threaded-non-blocking-io-model-works-in-node-js)
























