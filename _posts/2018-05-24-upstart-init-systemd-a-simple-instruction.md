---
published: true
layout: post
comments: true
date: '2018-05-28 20:00 +08:00'
type: post
title: upstart init.d systemd - a simple instruction
categories:
  - linux
  - devops
tags:
  - ubuntu
---
## [systemd](https://www.freedesktop.org/software/systemd/man/systemd.service.html)
- systemd is now supported by most linux system, and is the recommended way contrast to old upstart and init
- the systemd config file is under /lib/systemd/system
- env vars only able to be set in ExecStart or ExecStartPre, best way is to set in the script
- WorkingDirectory can not use double quote, seems to be a bug?
- if you app run like `java -jar`, should use `Type=simple` instead of `Type=forking`, otherwise it will case a timeout  

### Make a service auto-start
after move the config under the folder /lib/systemd/system
```shell
#auto-start
sudo systemctl enable servicename.service

#reload
sudo systemctl daemon-reload
```

### Run/Stop Service  
```shell
#start
sudo systemctl start servicename.service

#stop
sudo systemctl stop servicename.service
```

### View log
```shell
#view status, little log
systemctl status servicename.service 

#view the last 50 lines
systemctl status service-name -n50  

#view all the log
systemctl --no-pager -l status servicename.service 

#view all the log
journalctl -u service-name.service 

```

### Example  
```shell
Myexample
[Unit]
Description=Example
[Service]
Type=simple #for java, should not be forking
#note the bash should specify its full path
ExecStart=/bin/bash /home/ubuntu/myapp.sh
[Install]
WantedBy=multi-user.target
```

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

### Run/Stop Service  
```shell
#start
sudo start servicename

#stop
sudo stop servicename
```

### Example  
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
