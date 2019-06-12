---
published: true
layout: post
comments: true
date: '2019-06-11 00:00 +08:00'
type: post
title: '跳舞吧排序'
categories:
  - algorithm
tags:
  - sort
---

排序算法
A Sort of All Sorting Algorithms https://levelup.gitconnected.com/a-sort-of-all-sorting-algorithms-506cbc76d47
Why do we need so many sorting algorithms? [duplicate]
https://imgur.com/gallery/voutF
WHEN IS THE BEST SORTING ALGORITHM THE BEST?
https://attackonalgorithms.wordpress.com/2018/07/11/what-is-the-best-sorting-algorithm/
视频
https://space.bilibili.com/34739903/?spm_id_from=333.788.b_7265636f5f6c697374.3

说起算法，离不开排序。提起算法，就有点脑壳疼……

为了不头疼，还是得趣味一下下……

## 事件复杂度分析指标 Big O

事件复杂度分析(TCA)指标 O,英文称作 Big O。
这里不多说，我觉得[如何理解算法时间复杂度的表示法，例如 O(n²)、O(n)、O(1)、O(nlogn) 等？ - 司马懿的回答 - 知乎 ](https://www.zhihu.com/question/21387264/answer/422323594)较好理解。

这里放张表直接查阅：
![](https://pic4.zhimg.com/80/v2-a1387c0df75b3bc0fc81285efd0fed70_hd.jpg)

## 图解排序

### [插入排序 Insert Sort](https://baike.baidu.com/item/%E6%8F%92%E5%85%A5%E6%8E%92%E5%BA%8F)
最优 O(N) 最差 O(N²)

![](/assets/sort-insert.gif)


来跳个舞：
<iframe src="//player.bilibili.com/player.html?aid=17004913&cid=27796390&page=1" style="width:100%;height:30rem" 
scrolling="no" border="0" frameborder="no" framespacing="0" allowfullscreen="true"> </iframe>

### [选择排序 Selection Sort](https://baike.baidu.com/item/%E9%80%89%E6%8B%A9%E6%8E%92%E5%BA%8F)
最优 O(N²) 最差 O(N²)

![](/assets/sort-selection.gif)

来跳个舞：
<iframe src="//player.bilibili.com/player.html?aid=17004884&cid=27796358&page=1" 
style="width:100%;height:30rem" 
scrolling="no" border="0" frameborder="no" framespacing="0" allowfullscreen="true"> </iframe>

### [归并排序 Merge Sort](https://baike.baidu.com/item/%E5%BD%92%E5%B9%B6%E6%8E%92%E5%BA%8F)
稳定 O(N log N)

![](/assets/sort-merge.gif)

来跳个舞：
<iframe src="//player.bilibili.com/player.html?aid=17004931&cid=27796417&page=1" 
style="width:100%;height:30rem"
scrolling="no" border="0" frameborder="no" framespacing="0" allowfullscreen="true"> </iframe>

### [堆排序 Heap Sort](https://baike.baidu.com/item/%E5%A0%86%E6%8E%92%E5%BA%8F)

<iframe src="https://giphy.com/embed/14iTOxmpkjAa08" 
style="width:100%;height:30rem"
 frameBorder="0" class="giphy-embed" allowFullScreen></iframe>
<p><a href="https://giphy.com/gifs/tech-computer-science-14iTOxmpkjAa08">via GIPHY</a></p>

### [快速排序 Quick Sort](https://baike.baidu.com/item/%E5%BF%AB%E9%80%9F%E6%8E%92%E5%BA%8F%E7%AE%97%E6%B3%95/369842)
最优 O(N log N) 最差 O(N²)
![](/assets/sort-quick.gif)
来跳个舞：
<iframe src="//player.bilibili.com/player.html?aid=17004952&cid=27796443&page=1" scrolling="no" 
style="width:100%;height:30rem" 
border="0" frameborder="no" framespacing="0" allowfullscreen="true"> </iframe>

### [冒泡排序 Bubble Sort](https://baike.baidu.com/item/%E5%86%92%E6%B3%A1%E6%8E%92%E5%BA%8F/4602306)
最优 O(N) 最差 O(N²)
![](/assets/sort-bubble.gif)
来跳个舞：
<iframe src="//player.bilibili.com/player.html?aid=17004846&cid=27796315&page=1" scrolling="no" 
style="width:100%;height:30rem" 
border="0" frameborder="no" framespacing="0" allowfullscreen="true"> </iframe>

### [希尔排序](https://baike.baidu.com/item/希尔排序)
最优 O(N log N) 最差 O((log n)n^2)
![](/assets/sort-shell.gif)

来跳个舞：
<iframe src="//player.bilibili.com/player.html?aid=17004970&cid=27796470&page=1" scrolling="no" 
style="width:100%;height:30rem" 
border="0" frameborder="no" framespacing="0" allowfullscreen="true"> </iframe>


还有很多子类型……

## 为什么要这么多排序?
![](/assets/sort-list.png)

### 最快的算法是什么
