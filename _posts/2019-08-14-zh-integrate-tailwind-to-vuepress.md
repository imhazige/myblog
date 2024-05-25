---
published: true
layout: post
comments: true
date: '2019-08-14 00:00 +08:00'
type: post
title: 'Vuepress中整合tailwindcss'
categories:
  - nodejs
tags:
  - vue
---

本文讲述的的 vuepress 为 1.x 版本。

## 先决条件

确认配置好 [vuepress](https://vuepress.vuejs.org/)

## 安装 [tailwindcss](https://tailwindcss.com/docs/installation)

`yarn add tailwindcss`

## 配置 vuepress 整合 tailwindcss

`npx tailwind init tailwind.config.js`

`.vuepress/config.js` 中配置

```javascript
module.exports = {
  title: 'blog.ureshika.com',
  description: ' ',
  postcss: {
    plugins: [
      require('tailwindcss')('./tailwind.config.js'),
      require('autoprefixer')
    ]
  }
};
```

## 使用 tailwindcss

vue 组件中引入

```html
<style>
  @tailwind base;
  @tailwind components;
  @tailwind utilities;
</style>

<template>
  <div class="max-w-sm mx-auto flex p-6 bg-white rounded-lg shadow-xl">
    <div class="myClsass">jskadsa</div>
    <div class="flex-shrink-0">
      <img class="h-12 w-12" src="/img/logo.svg" alt="ChitChat Logo" />
    </div>
    <div class="ml-6 pt-1">
      <h4 class="text-xl text-gray-900 leading-tight">ChitChat</h4>
      <p class="text-base text-gray-600 leading-normal">
        You have a new message!
      </p>
    </div>
  </div>
</template>
```
