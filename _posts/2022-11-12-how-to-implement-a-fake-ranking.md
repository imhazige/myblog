---
published: false
layout: post
comments: true
date: "2022-11-12 00:00 +08:00"
type: post
title: "How to implement a fake ranking"
categories:
  - nodejs
tags:
  - algrithm
---
I had did a game that need to make some fake player to play with only one human player.

And there was an interesting problem, those players need to do ranking after each round, the change of the ranking of each player should be seemed to be real, which mean one player should not go from ranking first to ranking last with one round, something like that.

## Implementation
So I defined a function
```javascript

function fakeRanking();
```
randomShuffle


https://vscode.dev/github.com/imhazige/cl-choto_game-fake-ranking/blob/da5f0016eb0940dbe9e61c01c38219347d88c1ab/imports/games/server/service.js#L51