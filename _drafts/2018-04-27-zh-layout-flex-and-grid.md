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

### [概念](https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_Grid_Layout/Basic_Concepts_of_Grid_Layout)
 - Grid Container — The element on which display: grid is applied. It's the direct parent of all the grid items.
 - Grid Item — The children (direct descendants) of the grid container.
 - Grid Line — The dividing lines that make up the structure of the grid. They can be either vertical (column grid lines) or horizontal (row grid lines) and reside on either side of a row or column. We can refer to them by number, or by name.In the above grid, there are 7 vertical lines and 5 horizontal lines. Lines are given numbers starting from 1. Vertical lines are shown from left to right, but this depends on the writing direction. Lines can optionally be given names, which helps with referencing them in CSS.
 - Grid Track — Is the space between two Grid Lines. So in the above example, there are 6 vertical tracks and 5 horizontal tracks. Lines are useful to indicate where content starts and stops, but tracks are the ones where content fits.
 - Grid Cell — Is the space between two adjacent row and two adjacent column grid lines. It is the smallest/single unit of the grid that is available for us to place an item into. In other words, a Grid Cell is the space between 4 Grid Lines. Conceptually it is just like a table cell. In the figure above, only one cell has been highlighted, but there are 24 cells in the grid.
 - Grid Area — The total space surrounded by four grid lines. A grid area may contain any number of grid cells.


## [Flex布局](https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_Flexible_Box_Layout)
