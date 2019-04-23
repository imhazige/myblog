---
published: true
layout: post
comments: true
date: '2019-04-23 20:00 +08:00'
type: post
title: 'How to Totally Remove a Hidden Auto-load item on Mac'
categories:
  - Mac
tags:
  - bash
---

Today I have tried a Mac software "Anyxxxx", I downloaded it, installed, then removed it by moving the app file into Trash and emptied the Trash after tested.

But after a while, the app poped up a notification which made me knowing that it was still there.

I checked the Login items, no such a app.

By run command `launchctl list >> abc.txt`, I finally found the Anyxxx app.

Here the `launchctl list` will show all the launched services, but it did not show where the service locate.

I then open the Activity Monitor app, type Anyxxx, will filter the service with the name. I found it, click the detail, will see its location.

Then after I remove the Anyxxx's App file, I am able to quite the service the App created in the Activity Monitor.

The next step is to restart My Mac, but it is not necessary, I just want to check if the Anyxxx App removed and will not launch automatically again. I am happy the AnyXXX app disappear in the Activiry Monitor and no notifications show again.
