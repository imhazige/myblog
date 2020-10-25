---
published: true
layout: post
comments: true
date: "2020-10-25 00:00 +08:00"
type: post
title: "My flow of test/publish Expo project with release channel and Update Over-The-Air(OTA)"
categories:
  - mobile
tags:
  - expo
---
Expo support the Update Over The Air (OTA) out of the box, this is a amazing feature that make the test/puslish more easy and faster.

Here I want to discuss the detail and some issue I want to improve.

## Expo release Channel
Expo have a good [Official Document](https://docs.expo.io/workflow/publishing/) describe publish with release  channel.

First we premise have two environment/channel and we will not use any continue integrate tool here:
- `staging` for tesing before publish to real users(connect to api `test-api.myproduct.com`)
- `product` for oneline product(connect to `api.myproduct.com`)

## The outline of the flow
> The yarn script will all be list at later.

- For iOS:
  - Check(Update if required) the build number in the app.json(`ios.buildNumber`)
  - Build staging by `yarn build:staging:ios`
  - Upload to Apple by `yarn upload:ios`
  - Test staging with the app published to testflight(done in last step)
  - Check(Update if required) the build number in the app.json(`ios.buildNumber`)
  - Build product by `yarn build:product:ios`
  - Upload to Apple by `yarn upload:ios`
  - Test production with the app published to testflight(done in last step)
  - Publish manually in the iTune connect
- For android:
  - Check(Update if required) build number in the app.json(`android.versionCode`)
  - Build staging by `yarn build:staging:and`, this will made a apk
  - Transfer the apk to the tester
  - Build production by `yarn build:product:and`, this will made a apk
  - Transfer the apk to the tester
  - Upload to google play by `yarn upload:and`(Note, [make sure upload to google play store manually at the first time](https://docs.expo.io/distribution/uploading-apps/#manually-uploading-your-app-for-the-first))

### yarn scripts
```javascript
"scripts": {
  // optimize the assets before build
  "optimize": "npx expo-optimize",
  "publish:staging": "expo publish --release-channel staging",
  "build:staging:and": "expo build:android --release-channel staging -t apk",
  "build:product:and": "expo build:android --release-channel product -t apk",
  "build:staging:ios": "expo build:ios --release-channel staging -t archive",
  "build:product:ios": "expo build:ios --release-channel product -t archive",
  "upload:and": "expo upload:android --key google-play-key.json",
  "upload:ios": "expo upload:ios --sku app.myproduct.com",
}

```

### React Native code to connect corresponding api by release-channel
```javascript
// config.js
import Constants from 'expo-constants';

export const appConfig = {
  DEBUG: false,
  API_URL: '',
};

// check
const { releaseChannel } = Constants.manifest;

// DEV:
if (releaseChannel === undefined) { 
  // no releaseChannel (is undefined) in dev,
  appConfig.API_URL = 'http://localhost:3000/api';
} else

// STAGING
if (releaseChannel.indexOf('staging') !== -1) { 
  // matches staging-v1, staging-v2
  appConfig.API_URL = 'http://test-api.myproduct.com';
} else

// PROD
if (releaseChannel.indexOf('prod') !== -1) { 
  // matches prod-v1, prod-v2, prod-v3
  appConfig.API_URL = 'http://api.myproduct.com';
}
```

## The issue maybe able to be improved

### Have to maually update the build number everytime deploy
The build number is require to be bumpped up when deploy to Apple or Google, if you forget, you will not able to upload as the old build number already exists in the Apple or Google.

There are a expo community provided tool [
standard-version-expo](https://github.com/expo-community/standard-version-expo) is able to automate updating the version, Android versionCode, and/or iOS buildNumber.

### To test, have to iterate twice
So before publish to real user, have to build with a staging version connect to staging api, after tested, again need to build a product version conneting to production api. Is there a good way? Welcome your suggestion! 😊