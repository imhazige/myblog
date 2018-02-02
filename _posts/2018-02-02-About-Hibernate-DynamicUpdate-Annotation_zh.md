---
layout: post
comments: true
title: "关于Hibernate的DynamicUpdate注解"
date: 2018-02-02 10:00 +00:00
type: post
published: true
status: publish
categories:
- java
- database
tags:
- hibernate
- spring
- JPA
---

使用ORM时，保存一个对象一般想如果字段是NULL时，就不应该包含在sql里面。

之前自己写ORM框架时，也是利用null来判断是否需要更新。最近使用了MyBatis-plus,也是这样处理的。但是Hibernate却是更新全部，它有个DynamicUpdate注解，乍一看似乎是解决这个问题的，然而事实却不是。

依据官方文档，DynamicUpdate是判断有没有修改字段，有则包含在update中。怎么判断修改是需要参照的，这样一般会和缓存或之前取出的bean比较，因此并不是按照简单地NULL来判断的。

一般情况下，并不需要DynamicUpdate，这样可以利用Hibernate的缓存和批处理的优化。但如果有索引，则更新是比较昂贵的。一般情况下，应该以数据库性能优先，这种情况可以使用DynamicUpdate.



