---
published: true
layout: post
comments: true
date: '2019-03-05 20:00 +08:00'
type: post
title: 'Set LAN Static IP on Ubuntu 18'
categories:
  - linux
tags:
  - ubuntu
---

## Commands step by step

edit setting file
`sudo nano /etc/netplan/50-cloud-init.yaml`

```yaml
network:
  ethernets:
    enp0s3:
      addresses: [192.168.1.10/24]
      gateway4: 192.168.1.1
      dhcp4: no
  version: 2
```

note you should change the ip `192.168.1.10` to the static ip value you want to apply.

apply change
`sudo netplan apply`

restart machine
`sudo shutdown -r now`

Done.
