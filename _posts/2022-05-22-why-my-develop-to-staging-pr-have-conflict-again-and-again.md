---
published: true
layout: post
comments: true
date: "2021-12-21 00:00 +08:00"
type: post
title: "Why my develop to staging pr have conflicts again and again"
categories:
  - devops
tags:
  - git
---
I have a git personal project, it have master, staging, develop branches. Everytime, I create new branch based on develop, implements features or bug fix, commits frequently as I want. 


When create PR to develop, I squash the PR to make the commits clean, works good. (Have a cup of coffee).

After testing, it is time to cut to staging, ok, create a PR from develop to staging, but, there are conflicts! It happen again...

What's wrong, I remember it always have this problem, sometimes I even tried delete staging and recreate based on develop from scratch, but after a while, it happen again, PR from develop to staging have conflicts.

Finally I found the cause, it is simple but you are easy to overlook, each time I create PR from develop to staging, I use `squash`, this makes the staging actually different than develop, so next time it will have conflicts when create PR from develop.

## Conclusion
You can use squash when create PR to a branch B your current branch A is based on(branch B). But you should not suqash when you create PR to branch C from branch B as branch B is not based on branch C.