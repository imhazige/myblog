---
published: true
layout: post
comments: true
date: "2020-10-25 00:00 +08:00"
type: post
title: "CI/CD of a EXPO managed-flow project based on tag"
categories:
  - mobile
tags:
  - expo
---
I was thought that expo managed flow CI/CD should be very easy than the React Native project.

But I found I am wrong, it still encountered some cavets that spend much time to solve. 

Anyway, it is true easier than vanilla React Native Project.

## The build strategy
We have many environments(develop,staging,production) which have different api endpoint. So we will build different APP with corresponding APPID/package name:
production: com.kazge
staging: com.kazge.staging
develop: com.kazge.develop

For iOS, only production APP will go to release after tested. others will only available on testflight to test.

For Android, all is available as apk to download to test.

We will use the tag name as the command name, like `<environemnt>-<platform>-<action>-<build-number>`.
So one build pipeline will handle different build action(build,upload,update-over-the-air) for different environment, the version will bump up by the tag, also the build number which have to be ascending value.


## The [app.config.js](https://docs.expo.io/versions/v40.0.0/config/app/)
expo support dynamic app config which is easy to build based on environment.

We use both `app.json`(put immutable config) and `app.config.js`(parse value from build environment).

`app.json`
```json
{
  "expo": {
    "entryPoint": "./index.ts",
    "name": "Kazge",
    "slug": "kazge",
    "orientation": "portrait",
    "icon": "./src/assets/icons/icon-1024.png",
    "scheme": "kazge",
    "splash": {
      "image": "./src/assets/images/splash.png",
      "resizeMode": "contain",
      "backgroundColor": "#ffffff"
    },
    "updates": {
      "fallbackToCacheTimeout": 0
    },
    "assetBundlePatterns": [
      "**/*"
    ],
    "notification": {
      "icon": "./src/assets/icons/icon-1024.png"
    }
  }
}
```

`app.config.js`
```javascript
const expoAppConfig = ({ config }) => {
  //

  const result = {
    ...config,
    version: process.env.KAZGE_VERSION,
    name: process.env.KAZGE_NAME,
    slug: process.env.KAZGE_SLUG,
    ios: {
      bundleIdentifier: process.env.KAZGE_IOS_BUNDLE_ID,
      usesIcloudStorage: true,
      supportsTablet: true,
      config: {
        usesNonExemptEncryption: false,
      },
      buildNumber: process.env.KAZGE_BUILD_NUMBER,
    },
    android: {
      package: process.env.KAZGE_ANDROID_PACKAGE,
      googleServicesFile: process.env.KAZGE_ANDROID_FCM_JSON_PATH,
      // eslint-disable-next-line radix
      versionCode: parseInt(process.env.KAZGE_BUILD_NUMBER),
      useNextNotificationsApi: true,
      permissions: [
        'CAMERA',
        'READ_EXTERNAL_STORAGE',
        'WRITE_EXTERNAL_STORAGE',
        'RECEIVE_BOOT_COMPLETED',
      ],
    },

    // All values in extra will be passed to your app.
    extra: {
      app: {
        apiBaseURL: process.env.KAZGE_API_BASEURL,
      },
      bugsnag: {
        apiKey: process.env.BUGSNAG_API_KEY,
      },
    },
    hooks: {
      postPublish: [
        {
          file: '@bugsnag/expo/hooks/post-publish.js',
          config: {},
        },
      ],
    },
  };

  return result;
};

export default expoAppConfig;

```
As ypu see, the app version, app name, build number, api path, bugsnag key, google FCM key are all build into the app as build environment.

## Prepare for the credentials
The most important 

### iOS - App Store
### Android - Google Play Store

## Build
### Update Over the Air

## Upload to Testflight
## Upload to Google Play Store
