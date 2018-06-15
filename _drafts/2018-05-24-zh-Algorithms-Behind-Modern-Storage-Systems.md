---
published: false
layout: post
comments: true
date: '2018-05-24 20:00 +08:00'
type: post
title: 现代存储系统背后的算法--B树和LSM树的不同应用
categories:
  - database
tags:
  - algorithms
---
>本文主要内容来自[Algorithms Behind Modern Storage Systems Different uses for read-optimized B-trees and write-optimized LSM-trees](https://queue.acm.org/detail.cfm?id=3220266) 以及 [Data Structures Course Lecture Notes](https://webdocs.cs.ualberta.ca/~holte/T26/top.html)
## [binary tree](http://cslibrary.stanford.edu/110/BinaryTrees.html)(二叉树)
![](http://cslibrary.stanford.edu/110/binarytree.gif)
二叉树有一个根节点（root node）,其左边（left child）同样是一个子二叉树（subtrees），右边(right child)也是一个子二叉树。左边或右边可以是空，或者两边都是空。

### binary search tree BST（查找二叉树，有序二叉树）
每个节点N的左边子节点都小于或等于(<=)节点N,每个节点N的右边子节点都大于(>)节点N.
在查找二叉树中没有任何子节点的节点称为叶子节点(leaf node),相对的，其他节点则为内部节点(internal node).

### Degenerate tree, or linear tree（退化树,线性树）
![](https://webdocs.cs.ualberta.ca/~holte/T26/Lecture9Fig8.gif)
情况最不利于查找的树

### [Height of the tree(树的高度)](https://en.wikipedia.org/wiki/Tree_%28data_structure%29)
一个节点的高度指的是其最远叶子节点到这个节点的路径经过的边。
那么一个树的高度指的是根结点的高度。
附带说一下，一般Depth指的是节点到根节点的路径经过的边，但有时说depth就是指的height。

### [Balanced Trees(平衡二叉树)](https://webdocs.cs.ualberta.ca/~holte/T26/balanced-trees.html)
#### perfectly height-balanced tree (完美平衡二叉树) 
**每个节点**的左子树和右子树的高度保持一致则是完美平衡二叉树
![](https://webdocs.cs.ualberta.ca/~holte/T26/Lecture9Fig9.gif)
#### height-balanced tree(平衡二叉树)
**每个节点**的左右子节点的height差不超过1的称为平衡二叉树，其包括了完美二叉树
![](https://webdocs.cs.ualberta.ca/~holte/T26/Lecture9Fig10.gif)

### [AVL trees，Height-Balanced Binary Search Trees（AVL树，平衡二叉搜索树）](https://webdocs.cs.ualberta.ca/~holte/T26/avl-trees.html)
AVL命名来自其俄国发明者Adelson-Velskii and Landis。
平衡二叉树的特性加上搜索树的特性就是AVL树。
可以证明`Height < 1.5logN`,AVL树的
AVL树可以保证搜索，查找，删除的效率为 `O(logN)`

### 旋转（rotation）-不平衡(imbalance)到再平衡(re-balance)
一个完美AVL树
![](https://webdocs.cs.ualberta.ca/~holte/T26/Lecture9Fig18.gif)
insert 1
![](https://webdocs.cs.ualberta.ca/~holte/T26/Lecture9Fig19.gif)
insert 0 -- imbalance
![](https://webdocs.cs.ualberta.ca/~holte/T26/Lecture9Fig20.gif)
rotation
![](https://webdocs.cs.ualberta.ca/~holte/T26/Lecture9Fig21.gif)
re-balance
![](https://webdocs.cs.ualberta.ca/~holte/T26/Lecture9Fig22.gif)

## [B-Tree](https://webdocs.cs.ualberta.ca/~holte/T26/b-trees.html)
B-Tree名字来自发明者Boyer,其当时工作于波音.

### [M-way Search Trees](https://webdocs.cs.ualberta.ca/~holte/T26/m-way-trees.html)
M-way Search Trees就是子树大于2个的二叉搜索树，M表示子节点分支个数，例如，二叉树的M就是2.
![](https://webdocs.cs.ualberta.ca/~holte/T26/Lecture10Fig1.gif)
其特点是对于实际应用来说，其M相当大，常常对应硬盘中的每一个块。

### B-trees: Perfectly Height-balanced M-way search trees
B-Trees就是一个M-way Search Trees，又有其新特点：
1：它是完美平衡树
2：除了根节点，所有节点的**值**个数`>M/2`且`<=M-1`,根节点**值**个数为`>=1`且`<=M-1`个。
例子：
![](https://webdocs.cs.ualberta.ca/~holte/T26/Lecture10Fig2.gif)

#### B-trees插入值的例子
1：插入前
![](https://webdocs.cs.ualberta.ca/~holte/T26/Lecture10Fig4.gif)
2：插入17后
![](https://webdocs.cs.ualberta.ca/~holte/T26/Lecture10Fig5.gif)
3：再插入5
![](https://webdocs.cs.ualberta.ca/~holte/T26/Lecture10Fig6.gif)
从中可以看出，与二叉搜索树不同的是，每次增加节点可能导致的是父节点的值的增加或分裂，不会导致不平衡而需要再平衡。

由此不难看出Binary Trees和B-Trees的区别，就像数组和链表的关系，数组增删一个元素会导致整个数组重构，而链表则只需要修改某个节点的指针。数组更适合内存中存储较小的内容，链表适合应用在硬盘中实现存储较大的内容。
#### 

## LSM-Trees
