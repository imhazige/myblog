---
published: true
layout: post
comments: true
date: '2019-02-20 20:00 +08:00'
type: post
title: 'AWS GCE and Azure - some comparison from a tech partners'
categories:
  - distributed
  - cloud
  - devops
tags:
  - AWS
  - GCE
  - Azure
---

In a startup, a tech partners have many roles, coder, manager, devops engineer, architect, even accountant!

We were building our web app in the past half years, deployed it to the cloud. We have tried AWS, Azure, Google cloud engine, and Aliyun. simply to say, AWS is the best, and our app nodes are mostly run on it.

## Price

I don't want to do detail comprison at here, [this article](https://www.rightscale.com/blog/cloud-cost-analysis/comparing-cloud-instance-pricing-aws-vs-azure-vs-google-vs-ibm) have some conclusion.

As our experience, AWS is the best choice, its spot instance is valuable and cheap. Google's preemptible instance is not same as AWS spot instance, it will restart winthin a day, and you need pay more effort to make it work like AWS spot intance. Azure is expensive, there are a easy way to judge, if you want to buy a mongo atlas cluster, they provide solutions on AWS,GCE and Azure, you will find Azure is **double** price than the other two.

## Easy to Use

AWS is the easiest platform to use as I think. A simple example, use ssh to login to a instance, AWS will provide the ssh key by default, so after you create a instance, you can ssh to it immediatly.

And GCE is strange, because it have its own tool chain, the gcloud tool, or a web ssh tool. Google want you to use its own ecosystem. I have spend hours to set up the first new instance that able to ssh on GCE. This make me know that GCE is different than other paltform, it hard to move from others to GCE or leave GCE if we depend on it.

Aliyun is easy to use too, though less powerful than AWS.

## Support

We use free support plan of AWS, we have not much problem, we are sufficient with their support and document. Its document is the best among these platforms.

GCE's document is like some thing written by robot. Yes, they have lots of detailed documents, but one article never want to make you clear how to do it quickly after you jump from one link to another and from another to another another, boring.

Azure's support is the worst, how can you believe I spend 3 days to register a account but have problem to bind my credit card? I send many emails to their support, though they responsed, but anyway, finally - still can not register a account. hmm... Microsft is still the old Microsoft?

## Stable

AWS is also the best, than GCE, than Aliyun.

The connection to AWS server is stable, the uplaod and download speed is fast and steady.

While GCE server, behaved not good.

## Conclusion

So far, in my opinion, AWS is the best choice to us, the only problem is they need provide more region like Hongkong, it is already 2019, AWS, what's the status of Hongkong region?
