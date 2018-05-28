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
upstart is designed to replace init, but then  
upstart is replaced by systemd from ubuntu 16

- place servicename.conf under /etc/init/ which is system job.
- place servicename.conf under $HOME/.init/ which is user job.
- console log is written to /var/log/upstart/servicename.log
- [it support log rotating](http://manpages.ubuntu.com/manpages/xenial/man8/logrotate.8.html) 

example:
```shell
author "kazge.com"
description "start and stop example for Ubuntu (upstart)"
version "1.0"

start on started networking
stop on runlevel [!2345]

setuid ubuntu
setgid ubuntu

# set env
env APPUSER="ubuntu"
env APPDIR="/usr/bin"

respawn

script
	cd $APPDIR	#use env
    #set env via shell script
	JAVA_OPTS="\
	-Dcom.sun.management.jmxremote.port=8089 \
	-Dcom.sun.management.jmxremote.rmi.port=8089 \
	-Djava.rmi.server.hostname=localhost \
	-Dcom.sun.management.jmxremote.authenticate=false \
	-Dcom.sun.management.jmxremote.ssl=false \
	"
	exec /usr/bin/java $JAVA_OPTS -jar jetty-runner.jar \
	    --classes "." \
	    --host 0.0.0.0  --port 8080 \
	   app.war
end script

```

## Refs  

[The Story Behind ‘init’ and ‘systemd’: Why ‘init’ Needed to be Replaced with ‘systemd’ in Linux](https://www.tecmint.com/systemd-replaces-init-in-linux/)
