---
published: true
layout: post
comments: true
date: '2019-03-09 20:00 +08:00'
type: post
title: '整合多个git提交为一个'
categories:
  - git
tags:
  - git
---

一般写代码，往往很多人有个习惯就是有了小改动就提交 push，以免代码丢失。但这样容易产生太多的提交，对于代码合并者是个头疼的事。

所以，如果要合并多个提交为一个怎么做？

这个操作的术语叫 squash(压扁)。

可以用`git rebase -i` 但是容易出现问题，且较繁琐，sourcetree 的界面操作的也是这一种，仍然不方便。

还可以用`reset`,比较简便:

```shell

git reset HEAD~5
git add .
git commit -am "some new commit message"
git push --force
```

这种方式只能从当前提交合并之前的 n(示例中为 5)个提交。
