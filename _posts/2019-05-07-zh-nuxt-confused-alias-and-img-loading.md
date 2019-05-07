---
published: true
layout: post
comments: true
date: '2019-05-07 20:00 +08:00'
type: post
title: 'Nuxt资源文件夹，别名，图片url和css'
categories:
  - javascript
  - frontend
tags:
  - vue
---

### 资源文件夹

Nuxt 有两种资源文件夹`assets`和`static`。

它们的区别文档上已经说得很清楚:

> 如果你的静态资源文件需要 Webpack 做构建编译处理，可以放到 assets 目录，否则可以放到 static 目录中去。

具体表现就是:

> （图片或字体）的尺寸小于 1K 的时候，它将会被转换成 Base-64 data URL 来内联引用；否则它将被拷贝至指定的子目录（在 .nuxt 目录下），并被重命名（加上 7 位的哈希码作为版本标识）以实现更好的缓存策略。

而 static 里面的资源不会做这些处理。

所以引用的方式也不同：

```html
<!-- 引用 static 目录下的图片 -->
<img src="/my-image.png" />

<!-- 引用 assets 目录下经过 webpack 构建处理后的图片 -->
<img src="~/assets/my-image-2.png" />
```

## 别名

Nuxt 有两种默认别名写法`~`和`@`。

我个人推荐`@`，因为在 2.0 后`~`可能会出问题:

> 请注意: 从 Nuxt 2.0 开始，~/alias 将无法在 CSS 文件中正确解析。你必须在 url CSS 引用中使用~assets（没有斜杠）或@别名，即 background:url("~assets/banner.svg")

## sass/css 引用图片的路径

在 scss 或 css 中最好不要使用别名路径，而应该遵循 css 规范，路径相对于 css 本身。因为别名往往在 scss,css 中不起作用。

如果你打算将图片放到 assets 中，那么你最好在 scss 和 css 中使用相对路径引用图片。

## 动态 src 的写法

正确的写法：

```javascript
<img :src="require('@/assets/img/myimg' + n + '.jpg')">
```

上面的例子里，因为图片是放到了 assets 里面且又使用了别名，所以要让 webpack 知道，就要使用 `require`。

错误的写法(没有 require)：

```javascript
<img :src="'@/assets/img/myimg' + n + '.jpg'">
```

错误的写法(src 没有冒号)：

```javascript
<img src="require('@/assets/img/myimg' + n + '.jpg')">
```

这一点来说，确实不如 React 的纯 javascript 来的直观。
