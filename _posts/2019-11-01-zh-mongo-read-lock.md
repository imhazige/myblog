---
published: true
layout: post
comments: true
date: '2019-11-01 00:00 +08:00'
type: post
title: 'mongo里怎么实现读锁'
categories:
  - database
tags:
  - transaction
  - mongodb
---
在sql数据库里，`SELECT ... FOR UPDATE`为记录主动加锁。

在mongo里面要达到类似的效果可以这样做：
```javascript
var doc = db.foo.findOneAndUpdate({ _id: 1 },    
      { $set: { myLock: { appName: "myApp", pseudoRandom: ObjectId() } } })
``` 
### 解释：
- myLock是专门为实现锁定义的与业务逻辑无关的字段，就像乐观锁里的version。
- pseudoRandom: ObjectId()是为了达到唯一随机效果，引起更新，这样才能获得锁。
- 因为在mongodb里如果写入的值与原来的值一样的话，实际上是优化了，没有任何改变，也就不会获得锁。

## 参见 
[How To SELECT ... FOR UPDATE inside MongoDB Transactions](https://www.mongodb.com/blog/post/how-to-select--for-update-inside-mongodb-transactions)

