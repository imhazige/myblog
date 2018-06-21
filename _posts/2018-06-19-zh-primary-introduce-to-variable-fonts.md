---
published: true
layout: post
comments: true
date: '2018-06-19 20:00 +08:00'
title: 动态字体简介
type: post
categories:
  - front-end
tags:
  - fonts
---
> 本文内容主要来自[How to start with variable fonts on the web](https://www.zeichenschatz.net/typografie/how-to-start-with-variable-fonts-on-the-web.html)

## 可变字体是什么？
可变字体就是将原来多个单独的字体文件用一个字体文描述出来，并且达到相对较小的文件大小。
![](https://zeichenschatz.net/uploads/2018/05/static-font-files-vs-variable-font-files.png)


## 可变字体能做什么？
一图顶万言
![](https://zeichenschatz.net/uploads/2018/05/variable-fonts-weight-width-slant-axis-morphing.gif)

字体也可以动画了 [Demo](https://developer.microsoft.com/en-us/microsoft-edge/testdrive/demos/variable-fonts/)


## 它是怎么做到的？
可变字体用大纲(outline)描述一个字符，一个大纲可用多个点组成，然后可以定义多种样式在浏览器里动态的渲染或是篡改（interpolation）。
![](https://zeichenschatz.net/uploads/2018/04/variable-fonts-interpolation.gif)
渲染可通过多种不同的轴（axes）来进行。
例如字粗（weight）轴
![](https://zeichenschatz.net/uploads/2018/05/variable-fonts-named-instances-along-weight-axis.png)
可以多个轴同时改变，例如weight和width轴
![](https://zeichenschatz.net/uploads/2018/05/variable-fonts-venn-weight-axis-width-axis.png)

比较常见的轴包括  
wdth for width -- 字宽  
wght for weight -- 字粗  
ital for italic -- 意大利体 (这个轴很少见)  
slnt for slant -- 倾斜  
opsz for optical size -- 光学大小  

光学大小的例子
![](https://zeichenschatz.net/uploads/2018/05/variable-font-optical-size-voto-serif-variable.png)

## 在浏览器上使用
[浏览器支持](https://caniuse.com/#search=variable%20fonts)

### 拿到了一个字体怎么知道它有哪些轴？
可以使用[这个工具](https://wakamaifondue.com/)
![](https://zeichenschatz.net/uploads/2018/04/wakamaifondue-variable-fonts-integration.jpg)

### 引用字体
```css
@font-face {
  font-family: 'Venn';
  src: url('Venn.woff2') format('woff2-variations'),
       /* will be the standard and works in Safari now */
       url('Venn.woff2') format('woff2');
       /* for the other supporting browsers */
}
```

### 设置字体
```html
h1 {
 font-family: 'Decovar Alpha VF', sans-serif;
 font-variation-settings: "TRMC" 0, "SKLA" 0, "SKLB" 0, "TRME" 0;
}
```

效果
![](https://zeichenschatz.net/uploads/2018/05/variable-font-decovar-coustom-axis-morphing.gif)


## 需要指出的问题
- 如果你只需要一种字体，那就没必要用可变字体。
- 针对罗马字或斜体字，你很可能仍然需要单独的字体文件。因为罗马字太特殊了。
![](https://zeichenschatz.net/uploads/2018/05/variable-fonts-italics-with-different-letter-shapes.png)
上图可见a,g这两个字母无法用一个大纲描绘。
