---
layout: post
comments: true
title: 'Some Thoughts After Used JMeter'
date: 2018-02-06 10:00 +08:00
type: post
published: true
status: publish
categories:
  - 'web'
tags:
  - 'jmeter'
  - 'loadtest'
---
These days I have do some [benchmark test for Java and Node.js](https://github.com/imhazige/benchmark-test-java-php-nodejs) by using JMeter, some problem made me spend much time try to resolve.

### The most important one is have not a way to run some one-time pre-task before thread group start. 
When request api need a token, I don't want to request the token every time, so I want the create token request execute only one time before the thread group. But after go through the document and try, I can not found a way make it work.
First I think the [Once Only Controller](https://jmeter.apache.org/usermanual/component_reference.html#Once_Only_Controller) will work, but it atcually run once under each thread, not a threadgroup. It means if there are many loop, it will run once, but if you have many threads, it will run many times. -- what's the target of this controller, I really can't  get it. If I understand correclty, to do load test, we mostly will use threads, not loop,[(see here)](http://www.jmeter-archive.org/Loop-Count-vs-Number-of-Threads-td3272154.html).
So I have to think in other way. I tried [If Controller](https://jmeter.apache.org/usermanual/component_reference.html#If_Controller), I try use a variable to check if need run the login task. after run the task, set the variable to true. but I found the variable is local to every thread, can not be shared among threads. So I have to try property. Now the problem is that the expression of if controller alway return false, It really drive me nut, I can not figure out what's wrong. I give up by let the login run every time.

### Another problem is the lack of good example of how to do test by jemeter on the internet
The document of the Jemeter is good, but when I faced problem, I can not get much useful information from searching on the internet. I did think that JMeter should be popular, and many people will use it, but now I don't think so.

Anyway, I will continue developing my [benchmark test project across many language and framwork](https://github.com/imhazige/benchmark-test-java-php-nodejs) and hope people interested get involved in to enhance and test it.

#### Refs:
[the jmeter plan xml](https://github.com/imhazige/benchmark-test-java-php-nodejs/blob/master/test/jmeter-plan.jmx)
