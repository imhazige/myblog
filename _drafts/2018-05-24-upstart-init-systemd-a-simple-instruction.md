---
published: false
layout: post
comments: true
date: '2018-05-24 20:00 +08:00'
type: post
title: upstart init.d systemd - a simple instruction
categories:
  - linux
  - devops
tags:
  - ubuntu
---
## [systemd](https://www.freedesktop.org/software/systemd/man/systemd.service.html)

## [init](http://www.tldp.org/LDP/intro-linux/html/sect_04_02.html)
Reference:
- [Chapter 13. The SUSE LINUX Boot Concept / 13.4. Init Scripts](https://www.novell.com/documentation/suse91/suselinux-adminguide/html/ch13s04.html)

## [upstart](## upstart)
Upstart is replaced by systemd from ubuntu 16

- place servicename.conf under /etc/init/ which is system job.
- place servicename.conf under $HOME/.init/ which is user job.
- console log is written to /var/log/upstart/servicename.log


## Refs  

[The Story Behind ‘init’ and ‘systemd’: Why ‘init’ Needed to be Replaced with ‘systemd’ in Linux](https://www.tecmint.com/systemd-replaces-init-in-linux/)
