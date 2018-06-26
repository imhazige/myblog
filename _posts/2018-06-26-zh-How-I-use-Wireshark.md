---
published: true
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

### 分析生成好的pcap
#### 首先在linux服务器上用`tcpdump`生成一个pcap 
```shell
sudo tcpdump port 443 -w output.pcap
```
#### 下载到本地
```shell
scp host:~/output.pcap .
```
#### 或者直接ssh到远程服务器抓包（scoop安装方式才有）
capture/options菜单,可看到ssh remote capture,选择此项可设置ssh登陆远程主机来抓包.

#### 使用wireshark打开pcap文件
```shell
wireshark output.pcap
```

#### 查看一个连接
对于一个TCP包，可以通过右键“Conversation filter” -> “TCP”过滤出同一个连接的其他包
![](https://jvns.ca/images/wireshark_filter.png)
![](https://jvns.ca/images/wireshark_tcp.png)

#### Decode as提示wiresharp解析为协议
右键一个包，decode as可提示wireshark将此包解析为指定的协议

#### 请求头详情视图
![](https://jvns.ca/images/wireshark_packet_details_list.png)

#### 字节码详情试图
![](https://jvns.ca/images/wireshark_packet_details.png)

### [分析查询](https://www.wireshark.org/docs/wsug_html_chunked/ChWorkDisplayFilterSection.html)
最重要的还是查询功能
举例
- `frame contains "mozilla"` – search for the string “mozilla” anywhere in the packet
- `tcp.port == 443` – tcp port is 443
- `dns.resp.len > 0` – all DNS responses
- `ip.addr == 52.7.23.87` – source or dest IP address is 52.7.23.87

#### 统计时常
菜单 ‘Statistics’ > ‘Conversations’
如下图  
![](https://jvns.ca/images/wireshark_statistics.png)
点击duration列则依据duration排序

## PS: 
依据原文暂且只写这些，感觉也没写什么东西。

 










