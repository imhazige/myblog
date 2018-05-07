---
published: false
layout: post
comments: true
date: '2018-05-07 20:00 +08:00'
type: post
categories:
  - front-end
tags:
  - css
  - layout
title: flex和grid布局
---
## 首先Grid布局和Flex布局不是互斥的
- Grid布局适合复杂的布局，例如可以用来设计整个页面的布局，可用来设计不合常规的创意布局。
- Flex布局适合于对齐内容。
- Grid布局适用于2d布局--行和列。
- Flex适合同一个方向的布局。
能用Flex的简单处，没必要使用Grid。全部使用Flex也达不到好的效果，混合使用才是顺其自然的方式。

## [Grid布局](https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_Grid_Layout)

### [浏览器支持情况](https://caniuse.com/#feat=css-grid)
大部分都支持，除了IE。

### 例子

<p data-height="265" data-theme-id="0" data-slug-hash="oEXRmV" data-default-tab="css,result" data-user="una" data-embed-version="2" data-pen-title="Grid To Flex -- Example 2" class="codepen">See the Pen <a href="https://codepen.io/una/pen/oEXRmV/">Grid To Flex -- Example 2</a> by Una Kravets (<a href="https://codepen.io/una">@una</a>) on <a href="https://codepen.io">CodePen</a>.</p>
<script async src="https://static.codepen.io/assets/embed/ei.js"></script>

### [基本术语概念](https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_Grid_Layout/Basic_Concepts_of_Grid_Layout)
![grid_intro_lines.png]({{site.baseurl}}/assets/grid_intro_lines.png)

 - Grid Container(容器) — 应用样式```css display:grid ```的元素，其子元素将使用grid布局.
 - Grid Item(子项) — Grid Container的子元素.
 - Grid Line(线) — 组成表格结构的竖或横的线，可用从1开始的数字或名称标识。以上图为例，由7根竖线和5根横线。
 - Grid Track(轨道) — 两平行线之间的空间，例如上图有6个竖轨道，5个横轨道。
 - Grid Cell（单元格） — 四条相邻线包围中间的空间，是放置元素的基本单位。
 - Grid Area（区域） — 任意四条线包裹的区域，可包含多个单元格。

### 基本用法
#### [grid-template-columns](https://developer.mozilla.org/en-US/docs/Web/CSS/grid-template-columns)
##### 定义列的线名
```css
grid-template-columns: [linename1] 100px [linename2 linename3];
```
上例中定义了三条线名linename1，linename2，linename3，第一列在linename1和linename2之间，宽度为100PX.
##### 定义列的宽度
```css
grid-template-columns: 1fr 60px;
```
上例定义了两列，第一列1fraction(部分),第二列60px
###### fr单位
fr是专门用于grid的长度单位，表示可用部分的一个部分。上例中，第二列60px从表格宽度中去掉后剩下的用于划分部分，由于只有一个部分，则全部给第一列。
而这个例子
```css
grid-template-columns: 1fr 2fr 1fr;
```
则将表格分成4个部分，第1，3列各占1个宽度，第二列占2个宽度。

## [Flex布局](https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_Flexible_Box_Layout)