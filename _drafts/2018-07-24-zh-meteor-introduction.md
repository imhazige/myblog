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
### 实时展示--实现机制，websocket，mogo?
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




#### 修改数据使用[method](https://guide.meteor.com/methods.html)
修改数据则使用[Method](https://guide.meteor.com/methods.html)

### 请求队列?

### 
### userId?
https://guide.meteor.com/data-loading.html
Note that the publication will re-run if the user logs out (or back in again), which means that the published set of private lists will change as the active user changes.
### 商业支持，论团支持,文档详细
### 支持npm，可以整合其他框架，例如expressjs
Meteor之前是仅通过[Atmosphere](https://atmospherejs.com/)来扩展，后来开始直接支持npm，这样一来，其他nodejs框架可以直接整合，例如meteor没有官方支持的restapi方式，可通过整合express来实现，这样meteor完全融合到了nodejs生态中。
[整合express的示例](https://github.com/imhazige/benchmark-test-java-php-nodejs/blob/master/nodejs/meteor/imports/server/api.js)：
```nodejs
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

### Fiber方式


## 缺点
### 仍算比较冷门，中文支持较少
### 与普通的nodejs开发方式不太相同，学习曲线稍陡
### 默认绑定了mogodb
这可以说是个优点，如果你本来就用mongo,然而大部分情况我会认为是个缺点，虽然可以使用其他数据库整合，但mogodb是必须的，你可以不用它，但是必须通过[MONGO_URL](https://guide.meteor.com/deployment.html#custom-deployment)配置启动。
### 移动端绑定框架