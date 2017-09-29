---
layout: post
comments: true
title: 'Tropo vs Twilio'
date: 2017-09-29 10:00 +08:00
type: post
published: true
status: publish
categories:
- 'voip'
tags:
- 'tropo'
- 'twilio'
---
At year 2009 I start using Tropo to build a voice channel of a Expert System, the system was designed with a complex rule engine, the interaction is asked to be do in a asynchronous way - the backend rule engine is able to interrupt the running call session with event. This make us having to choose Tropo, which support the asynchronous event. Of course, this product is using Java.

In the next many years, I had using Twilio to build many small projects for many clients, all were using PHP.

At year 2016, I participanted in building a cloud-based product, which including voice and sms channel too, we choose Tropo, this product is running well. 

In this article I am going to have a compare between Tropo and Twilio, and give my 2 cents.

### Event ### 
The first thing I want to say is, the event. In Tropo payload, all form will result a event, I like this pretty much, it provide a consistent way to handle the navigation, when we implement a flow tool building the call flow automatically, it is much easy to do with event.

But for Twilio, it is a bit hacky to do so, it can not distinguish timeout, noinput or nomatch.

### SSML ###
Tropo support [SSML](https://www.tropo.com/docs/webapi/advanced-speech-control/manipulating-say-ssml
), many big business treat their IVR seriously and are always prefer to tune the TTS in detail, so SSML is very important in such scenario. 

But Twilio do not support SSML.

### Debug ###
Debug Tropo is a pain to me, its log includes too many noisy, lots of information are not needed to the developer and they just printed out and all show to the developer without any filter. So if a new developer start using Tropo, she will definitely scared by the log that Tropo provided. If she have ever used Twilio before, she will have a very bad impression by the Tropo log and willing to return to Twilio. 

Twilio doing very well for debug, it mostly only print error and even provide a easy-retry way to debug the failure request.

So, I really hope Tropo can improve their debug manner.

### UI ###
I am not sure if this is a problem, I normally hate to use UI to visit Tropo because it is very very slow, to maintain the Tropo applications is a work need much patience, it need wait ten or more senconds to open a page in Tropo. So I have to use code to maintain apps via Tropo REST API.

Twilio have no such a problem.

### Develop Free ###
Tropo is develop free, even you have many apps occupied many numbers, they are still free, and it did not add any ads. in the voice if you did not set up a credit card.

Twilio did bad at this point, it give you a feel that you should set up your credit card ASAP, every time you test your voice app, you need wait seconds to hear the ads..

### Signals ### 
Tropo have such a feature - [Signals](https://www.tropo.com/docs/rest/signals), I really do not think it is necessary when I first saw it, but unfortunately I was involved into using it in the Expert System. Finally, we found that the requirement of the system that need signals is not reasonable in itself, and we also found that the signals have cocurrency bug, they spend a long time to try to resolve the problem, I assumed we were the first white mouse using it. Obviously it will be wise to not using such a complex feature.

### OpenVBX ###
I had wrote many OpenVBX plugins for clients, it is good enough for a small business, but have to depend on Twilio.

Tropo had been acquired by Cisco, Cisco have products supporting big business Call Center.

## Conclusion
Personally, I prefer Tropo to Twilio, but if it is a small project and with little fund, Twilio will be much easier and quick to build. For big project or a product, I will prefer using Tropo.












