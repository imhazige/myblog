---
published: false
layout: post
comments: true
date: '2018-07-24 20:00 +08:00'
type: post
title: meteor介绍
categories:
  - nodejs
tags:
  - meteor
  - fullstack
---
## [Meteor](https://github.com/meteor/meteor)(流星)是什么
> Meteor is a full-stack JavaScript platform for developing modern web and mobile applications. Meteor includes a key set of technologies for building connected-client reactive applications, a build tool, and a curated set of packages from the Node.js and general JavaScript community.

Meteor是一个full-stack javascript平台，可用于开发web和移动应用。其最大特点是其（通过websocket）保持客户端连接的“实时”框架。数据库（mogodb）的改变可“实时”展示到界面中。

以下列出优缺点更直观的了解meteor

## 优点
### 实时
#### [读取](https://guide.meteor.com/data-loading.html)数据DDP
数据实时读取使用[DDP(distributed data protocal)](https://github.com/meteor/meteor/blob/master/packages/ddp/DDP.md)，一般是websocket实现的的pub/sub方式。

例如不停的请求第三方api来达到实时效果[官方示例](https://guide.meteor.com/data-loading.html#loading-from-rest)
```javascript
const POLL_INTERVAL = 5000;

Meteor.publish('polled-publication', function() {
  const publishedKeys = {};

  const poll = () => {
    // Let's assume the data comes back as an array of JSON documents, with an _id field, for simplicity
    const data = HTTP.get(REST_URL, REST_OPTIONS);

    data.forEach((doc) => {
      if (publishedKeys[doc._id]) {
        this.changed(COLLECTION_NAME, doc._id, doc);
      } else {
        publishedKeys[doc._id] = true;
        this.added(COLLECTION_NAME, doc._id, doc);
      }
    });
  };

  poll();
  this.ready();

  const interval = Meteor.setInterval(poll, POLL_INTERVAL);

  this.onStop(() => {
    Meteor.clearInterval(interval);
  });
});
```
上例使用的是Meteor自带的DDP API的changed,added方法来实现数据publish
参见[使用底层api自定义publication(Custom publications with the low level API)](https://guide.meteor.com/data-loading.html#custom-publication)
```javascript
Meteor.publish('custom-publication', function() {
  // We can add documents one at a time
  this.added('collection-name', 'id', {field: 'values'});

  // We can call ready to indicate to the client that the initial document sent has been sent
  this.ready();

  // We may respond to some 3rd party event and want to send notifications
  Meteor.setTimeout(() => {
    // If we want to modify a document that we've already added
    this.changed('collection-name', 'id', {field: 'new-value'});

    // Or if we don't want the client to see it any more
    this.removed('collection-name', 'id');
  });

  // It's very important to clean up things in the subscription's onStop handler
  this.onStop(() => {
    // Perhaps kill the connection with the 3rd party server
  });
});
```
首先需要明确，不管服务端数据源是否来自mongodb,[客户端都有一个内存mongodb](https://guide.meteor.com/collections.html#client-collections),客户端都是针对这个mongodb来查询操作。
[详见这里](https://guide.meteor.com/data-loading.html#fetching)

再来看看默认的基于服务端Mogodb数据实现:
使用的是[MongoDB’s Oplog](https://github.com/meteor/docs/blob/version-NEXT/long-form/oplog-observe-driver.md),对mogo数据库的修改得以立即广播到读取指针(cursor).


#### 修改数据使用[method](https://guide.meteor.com/methods.html)
method类似RPC,
method有一些特点
Run validation code by itself without running the Method body.
Easily override the Method for testing.
Easily call the Method with a custom user ID, especially in tests (as recommended by the Discover Meteor two-tiered methods pattern).
Refer to the Method via JS module rather than a magic string.
Get the Method simulation return value to get IDs of inserted documents.
Avoid calling the server-side Method if the client-side validation failed, so we don’t waste server resources.

##### [不提倡从method获得数据](https://guide.meteor.com/methods.html#loading-data)
一般应该是从DDP获得数据，method只负责修改，不应该从method的返回获得数据。因为虽然method是能够返回数据的，
但这种情况下，你还得手动维护客户端mongodb的数据一致性。
```javascript
// In client-side code, declare a local collection
// by passing `null` as the argument
ScoreAverages = new Mongo.Collection(null);
```
```javascript
import { calculateAverages } from '../api/games/methods.js';

function updateAverages() {
  // Clean out result cache
  ScoreAverages.remove({});

  // Call a Method that does an expensive computation
  calculateAverages.call((err, res) => {
    res.forEach((item) => {
      ScoreAverages.insert(item);
    });
  });
}
```

#### [Method相对于REST API的好处](https://guide.meteor.com/methods.html#methods-vs-rest)
##### 基于[Fibers](https://github.com/laverdet/node-fibers),编写类似于同步方式的代码，但是不是阻塞(blocking)的
使用fibers将method(请求估计也是websocket，由于每个method都有id，将调用和返回通过id关联，将websocket异步的包装成同步的)封装成同步的形式，这样既保持了websocket的便利，也使得编码逻辑直观。
Fiber不是个新概念，它不同于thread，并不能起到thread的作用，个人理解，更像nodejs里面await/sync的一种实现。

##### 请求和返回都是有序的
对于ajax请求，请求和返回不能保证有序，可能后请求的先得到返回。meteor保证了每个客户端的每个请求都是有序的，前一个调用成功后才进行下一个。不过对于特殊的情况，也可以改变这个机制而使得执行无序。例如[this.unblock()](https://docs.meteor.com/api/methods.html#DDPCommon-MethodInvocation-unblock)。


### 
### userId?
https://guide.meteor.com/data-loading.html
Note that the publication will re-run if the user logs out (or back in again), which means that the published set of private lists will change as the active user changes.
### 商业支持，论团支持,文档详细
meteor虽然开源，[但背后有专门的商业公司支持](https://www.meteor.io/),目前来看，项目活跃程度
### 支持npm，可以整合其他框架，例如expressjs
Meteor之前是仅通过[Atmosphere](https://atmospherejs.com/)来扩展，后来开始直接支持npm，这样一来，其他nodejs框架可以直接整合，例如meteor没有官方支持的restapi方式，可通过整合express来实现，这样meteor完全融合到了nodejs生态中。
[整合express的示例](https://github.com/imhazige/benchmark-test-java-php-nodejs/blob/master/nodejs/meteor/imports/server/api.js)：
```javascript
import { Meteor } from 'meteor/meteor';
import express from 'express';

import bodyParser from 'body-parser';

export function setupApi() {
  const app = express();

  app.use(bodyParser.json()); // for parsing application/json
  app.use(bodyParser.urlencoded({ extended: true })); // for parsing application/x-www-form-urlencoded

  var t1 = require('./t1');
  var t2 = require('./t2');

  app.use('/t1', t1);
  app.use('/t2', t2);

  WebApp.connectHandlers.use(app);
}
```
其中用到的是[meteor webapp api](https://docs.meteor.com/packages/webapp.html)

atmospherejs示例
`meteor add qualia:reval`
会在.meteor/pacakge中增加对应信息，且代码中不需要显示import
npm方式
`meteor npm i exressjs`
会在pacakge.json中添加信息
不要尝试npm i xx直接添加，因为meteor工具自带绑定版本的node和npmj

### [web前端官方支持react,Angular](https://guide.meteor.com/ui-ux.html#view-layers)
对于meteor自带的[Blaze](https://guide.meteor.com/blaze.html),由于其提供了许多便利的特性，[一般建议与React,Angular合用](https://guide.meteor.com/react.html#using-with-blaze)

### [移动端支持](https://guide.meteor.com/ui-ux.html#mobile)
#### 使用[Cordova](https://cordova.apache.org/),
#### 使用DDP方式调用meteor服务端

## 缺点
### 仍算比较冷门，中文支持较少
### 与普通的nodejs开发方式不太相同，学习曲线稍陡
### 默认绑定了mogodb
这可以说是个优点，如果你本来就用mongo,然而大部分情况我会认为是个缺点，虽然可以使用其他数据库整合，但mogodb是必须的，你可以不用它，但是这样会丢失DDP很多特性,且必须通过[MONGO_URL](https://guide.meteor.com/deployment.html#custom-deployment)配置启动。
### 移动端绑定框架