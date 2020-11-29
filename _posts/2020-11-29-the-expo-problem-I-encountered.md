---
published: true
layout: post
comments: true
date: "2020-10-25 00:00 +08:00"
type: post
title: "The Expo managed flow problem we encountered so far"
categories:
  - mobile
tags:
  - expo
---
These weeks, We did move our outdated react native mobile project to expo. We encountered many problems, some solved with some workaround, some did not. In the end, we make it works, I'd like to list them here and hope they solved by expo team. 

## The problems I encountered so far

### Upload to itune still need a mac and it easy to fail and have to use fastlane
This is a problem that expo should solved, so while `expo:build` does not require a macos, but why `expo:upload` do? This make it still have to use a specific CI tool like bitrise.

Other than that, even with a macos, `expo:upload` now is easy to encounter this problem [Upload iOs: [iTMSTransporter] -Djava.ext.dirs=……/ext is not supported. Use -classpath instead.](https://forums.expo.io/t/upload-ios-itmstransporter-djava-ext-dirs-ext-is-not-supported-use-classpath-instead/44911). So we have to go with fastlane, an annoyed experience.

### Did not support OneSignal and expo push service is require more work
Every Mobile APP need push, so Onesignal is a good choice.But expo managed flow do not support it. it have to eject to bareflow.

Expo should aware the importance of push, they provide expo push service. this is good in most case. But, it does not as good enough as onesignal.

- Firstly, one have to take care of the ARN and FCM by oneself though it is easy. 

- Secondly, expo push does not support idempotent message. 
So in a cluster environment, if one encounter the problem, one have to implement the idempotent message by oneself.

### Expo Push API did not triggered correctly when App is not open.
See [this issue](https://github.com/expo/expo/issues/9866)

### launchImageLibraryAsync response different between ios and android
This is easy to cause the problem of [Network Request Failed while uploading image to server](https://forums.expo.io/t/network-request-failed-while-uploading-image-to-server/30737). It is a pretty annoying issue that may drive one nuts if he does not know the cause. 

### It give a feel that expo team is small and have not sufficient capacity to handle the requests from the developer
When encountered issue, I always look into the forumn ask for help. there are many issue that I found that have been know by the developer, but there are few response from the expo team. We have considered many times if it time to eject to bareflow when can not find a solution for a problem.

## Conclusion
Expo is a good tool to start with, but for a production, it should consider more in depth. We feel that we are lucky ones that need not to eject the project so far.

We hope expo team is able to have more capacity to improve expo managed flow and easy to make react native developer to involved in. 
