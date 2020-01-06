---
published: true
layout: post
comments: true
date: '2020-01-06 00:00 +08:00'
type: post
title: 'resolve problem of chrome new tab always redirect to bing.com'
categories:
  - chrome
tags:
  - homepage
  - searchengine
---
Today I decide to remove the annoying redirection to bing.com when I open a new tab in chrome.

My default search engine is bing.com, but I don't think I want always go to bing.com when I open a new tab. I'd like to hide my bookmark bar, then when I need open a new bookmark page, just open a new tab, the bookmarkbar should show in the new blank tab. 

But now when I use bing.com as search engine, this is not work. I suspect bing.com search engine is the problem. the default bing search url in chrome have some more params than `q`, I think that's the trick, so I set the url to `https://www.bing.com/search?q=%s`. Then open a new tab, no redirect anymore! Cheers!