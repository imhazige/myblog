---
published: false
layout: post
comments: true
date: '2018-07-17 20:00 +08:00'
type: post
categories:
  - linux
tags:
  - ubuntu
---
最近因为要测试一个软件的开发环境，尝试了ubuntu-18 desktop，写下来感受。

## 总体感觉
ubuntu desktop刚出来时老早就用过，那时候并没有现在这样好安装，早期版本连网络还要自己配置半天。这次使用Ubuntu-18，安装很顺利，但是使用起来还是觉得不便利。

### 必要的软件
- 微信 网页版可用 ✔
- QQ 网页版不可用 ❌
- 输入法 自带使用不错 ✔
- office 自带开源LibreOffice可用，腾讯文档网页版可用 ✔
- onenote 这个自己用，需要上网技巧，很慢，这个是比较头疼的地方❌
- 词典 有道支持 👍 ✔
- 迅雷 没有 ❌
- 邮件客户端 thunderbird ✔
- chrome 需要安装，国内头疼 没有自带的firefox好用 ✔
- IDE 这个是强项,vscode测试表现良好 ✔
- 代理 ssh -D <proxyport> -f -C -q -N <user>@<serverip>  -i  <key> 可用，但是没有重连功能，不太方便 ❌

纵观上面几点，感觉不爽的原因，不是系统本身造成的，国内的环境造成的🤦‍♂️, 举个例子，qq我本身用的不多，但是工作中需要，这到罢了，webqq也行，但是腾讯要关闭webqq，现在的webqq根本用不了。看看slack，却是支持linux的，说什么好。至于网络那就更不提了。  
否则的话，其作为开发环境，绝对比windows要强。

## 安装双系统
使用easyBCD可达到硬盘安装的目的，比较便利,参见[win10下装ubuntu双系统（免U盘）](https://www.jianshu.com/p/417c1001a559)


