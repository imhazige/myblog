---
published: true
layout: post
comments: true
date: '2019-02-21 20:00 +08:00'
type: post
title: 'AWS GCE 和 Azure -- 一个技术合伙人的比较'
categories:
  - distributed
  - cloud
  - devops
tags:
  - AWS
  - GCE
  - Azure
---

在一个创业公司里，技术合伙人可能身兼多重角色，既是码农，又是架构, 既是开发经理，也是运维，还可能是财务。🤦‍♂️

在过去的半年里，我们开发了一款 web 应用，在多个云平台上发布过，AWS,Google 云，阿里云。总的来说，AWS 的体验最好。

## 价格

详细的比较需要方方面面综合考虑，[这篇文章](https://www.rightscale.com/blog/cloud-cost-analysis/comparing-cloud-instance-pricing-aws-vs-azure-vs-google-vs-ibm) 做了一些详细的比较。

以我们的经验，AWS 是最好的，它的 spot instance 是便宜且实用，实际能提供长期稳定的服务。

而 google 的 preemptible instance 貌似与 spot instance 类似，实则不可比。其要每隔 24 小时重启一次重新计数，那么如果需要达到与 AWS spot instance 相同的效果，还要配合自动重启以及 instance group 策略。对于需要长连接（例如 websocket）的应用则行不通。

Azure 是其中最贵的，可从使用 Mongo Atlas 的经验来看，相同的 Mongo Atlas 集群配置，Azure 是 AWS 和 Google 的两倍。

## 易用

易用性 AWS 最高是很容易理解的，它最先面向应用，其他后起之秀仍有很多路需要追赶。

举个最简单的例子，创建主机后要 ssh 登录。AWS 默认就在你创建时为你提供了这个选项，创建实例后直接可 ssh 登录。

而 google 则有点别扭，因为它有自己的生态系统和工具链,gcloud 命令行工具,api。相反要打开 ssh 登录还要许多额外的步骤。我们从将程序发布从 AWS 转到阿里云或者相反的情况，都很方便，直接运用相同的工具，而要从 google Cloud 转到 AWS,则需要多花点时间。

## 服务支持

我们使用的是 AWS 免费支持计划，目前没碰到什么问题，他们的回复都还令人满意。另外 AWS 的文档值得称赞。

GCE 的文档则像是机器人写的，文档倒是齐全，但是一个问题的文档会让你不断地跳转，只到你忘了最初的问题是什么。我非常不喜欢这样的文档，啰嗦效率低。

Azure 的支持则很“有趣”。你很难想象就为了注册绑定信用卡，我连续三天发邮件给客服都没解决问题。他们的客服虽同在亚洲（北京），但是往往是第二天才有回复，而且解决不了问题。最终我们放弃尝试 Azure。想起很早的一个笑话“一个直升机飞行员迷路了，把飞机靠到微软大厦前问到：您好，我迷路了，请问这是哪里？回答：您好，这里是微软。” -- 微软依旧是 "Old Microsoft"?

## 稳定

我们的经验是，AWS 最稳定。

AWS,GCE,阿里云服务器我们都部署测试过，连接最稳定可靠的的是 AWS,阿里云爱抽风，google 服务器国内访问莫名其妙的速度慢，爱掉线，这可能是特殊原因。

## 结论

AWS 是最好的选择，唯一的问题是，区域还是少了点，例如，预计 2018 年上线的香港区，到现在 2019 也没有音讯。
