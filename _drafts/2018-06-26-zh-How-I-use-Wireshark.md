---
published: false
layout: post
comments: true
date: '2018-06-26 20:00 +08:00'
type: post
categories:
  - web
tags:
  - wireshark
title: wireshark使用
---
> 本文内容主要来自[How I use Wireshark](https://jvns.ca/blog/2018/06/19/what-i-use-wireshark-for/?utm_medium=email&utm_term=fav)

[wireshark](https://www.wireshark.org/)是闻名已久的[开源](https://code.wireshark.org/review/gitweb?p=wireshark.git;a=summary)网络协议分析工具（抓包工具）。本文简单介绍wireshark的常用“食用”方法。

## 安装wireshark
Mac: `sudo apt install wireshark`
Windows: 推荐使用[scoop方式]({% post_url 2018-06-22-introduce-scoop %})
`scoop install wireshark`
命令行`wireshark`打开wireshark。

## 使用wireshark分析pcap包
#### 首先在linux服务器上用`tcpdump`生成一个pcap 
```shell
sudo tcpdump port 443 -w output.pcap
```
#### 下载到本地
```shell
scp host:~/output.pcap .
```

#### 使用wireshark打开
```shell
wireshark output.pcap
```







