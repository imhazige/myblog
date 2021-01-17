---
published: true
layout: post
comments: true
date: "2020-01-17 00:00 +08:00"
type: post
title: "CI/CD of a EXPO managed-flow project based on tag"
categories:
  - mobile
tags:
  - expo
---
I was thought that expo managed flow CI/CD should be very easy than the vanilla React Native project.

But I found I was wrong, it encountered some cavets that spend much time to solve. 

Anyway, it is true easier than vanilla React Native Project.

## The build strategy
We have many environments(develop,staging,production) which have different api endpoint. So we will build different APP with corresponding APPID/package name:  
production: com.kazge  
staging: com.kazge.staging  
develop: com.kazge.develop  

For iOS, only production APP will go to release after tested. others will only available on testflight to test.

For Android, all is available as apk to download to test.

We will use the tag name as the command name, like `<environemnt>-<platform>-<action>-<build-number>`.
So one build pipeline will handle different build action(build,upload,update-over-the-air) for different environment, the version will bump up by the tag, also the build number which have to be ascending number value.

What another tag name format I think may be better is like `<environemnt>/<platform>/<action>/<build-number>` which will have a good structure in a git desktop UI.


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
The most complex part that is easy to get wrong is to prepare the credentials required to run expo command to build ipa and apk. 

### iOS - App Store
For iOS, what we need to do is mannually set up Certificates and identifiers etc. on apple developer console.
- create a account(apple id) who have permission(developer resources) to access certificates, identifiers, this account will be used by CI/CD tool to login to apple to fetch these information.
- Set up APP in appstoreconnect
- Set up PUSH key in apple developer console
- Set up Distribution Certificate, Identifiers(enable PUSH,associate domains, icloud etc.) in apple developer console

After set them up.

We use expo to handle the profile creation automatically.
```
yarn expo build:ios --non-interactive --no-wait -t archive \
    --release-channel "${RELEASE_CHANNEL}" \
    --apple-id "${IOS_APPLE_ID}" \
    --team-id "${IOS_TEAM_ID}" \
```
set the apple id and [team id](https://docs.expo.io/workflow/expo-cli/#expo-buildios) will help expo cli to identify which team and app you are try to build.


### [Android - Google Play Store](https://docs.expo.io/distribution/building-standalone-apps/#if-you-choose-to-build-for-android)
It is better to ["Use app signing by Google Play".](https://support.google.com/googleplay/android-developer/answer/9842756)

If you create the key by yourself, run command
`yarn expo build:android -t apk` will prompt the choice to let you upload the key. this will only happen at the first time you run the build without build key not upload to expo yet. But of course you could run `yarn expo build:android -c` to clear the keystore and reupload again. BE SURE to make a backup of your keys(`expo fetch:android:keystore`) before clear them.

## Build
Once you set up the cedentials correctly to expo, the build is pretty straight forward. expo will build based on the configuration and credentials on __expo's server__

### iOS Build
```sh
yarn expo build:ios --non-interactive --no-wait -t archive \
    --release-channel "${RELEASE_CHANNEL}" \
    --apple-id "${IOS_APPLE_ID}" \
    --team-id "${IOS_TEAM_ID}" \
```

### Android Build
`yarn expo build:android --release-channel ${RELEASE_CHANNEL} -t apk`


### [Update Over the Air](https://docs.expo.io/distribution/release-channels/)
In the command we all specified the `release-channel`, this is related to update over the air.

```bash
export RELEASE_CHANNEL="${STAGE_NAME}_${DEVICE_PLATFORM}_${VER_NAME}_${APP_BUILD_NUMBER}"
```
Our strategy is, OTA is based on build number, not the semver.
This make sure the build is strict to each build.

In this way, it is safe to make ota build to each semiver that have been released. also for staging, the ota will not affect many build - it only affect the one sepecified with the build number value.

## Upload to Testflight
To upload the ipa file to testflight, we first need get the download url of ipa file. 

### Get the build status and ipa download url
But expo have not a good command to let us know when the ipa is ready to donwload.

So we have to write a shell to do poll the status
```bash
IPA_URL=''
DCOUNT=0
while [[ $IPA_URL != http* ]] && [[ $DCOUNT -le 20 ]]
do
    sleep 20
    IPA_URL="$( yarn expo url:ipa --non-interactive | tail -2 )"
    echo "url:ipa reponse ..."
    echo $IPA_URL
    IPA_URL="$( echo $IPA_URL | head -n 1 )"
    echo "download url ..."
    echo $IPA_URL
    DCOUNT=`expr $DCOUNT + 1`
    echo "COUNT $DCOUNT"
done

if [[ $IPA_URL != http* ]];
then
    echo "exit as URL is not correct $IPA_URL"
    exit 1
fi

echo "got original url $IPA_URL"
```
aha! that's it, an loop run `expo url:ipa` to get the url, and check if it is a correct download link, :joy: 

### Upload by fastlane
As we know, `expo upload:ios` should do this task, but... actually it does not work in most case, it will response a error `Upload iOs: [iTMSTransporter] -Djava.ext.dirs=……/ext is not supported. Use -classpath instead.`

So what we are doing is use fastlane, in `bitrise`, this is pretty simple as it is a build in widget.

## Upload to Google Play Store
This have the same problem like ios, need get the download link by a loop
### Get the build status and apk download url
```bash
getApkUrl(){
    IPA_URL=''
    DCOUNT=0
    while [[ $IPA_URL != http* ]] && [[ $DCOUNT -le 20 ]]
    do
        sleep 20
        IPA_URL="$( yarn expo url:apk --non-interactive | tail -2 )"
        echo "url:apk reponse ..."
        echo $IPA_URL
        IPA_URL="$( echo $IPA_URL | head -n 1 )"
        echo "download url ..."
        echo $IPA_URL
        DCOUNT=`expr $DCOUNT + 1`
        echo "COUNT $DCOUNT"
    done

    if [[ $IPA_URL != http* ]];
    then
        echo "exit as URL is not correct $IPA_URL"
        exit 1
    fi

    echo "got original url $IPA_URL"

    _arrCMDS=(${IPA_URL// / })
    IPA_URL="${_arrCMDS[0]}"
    eval "$1=$IPA_URL"
}
```

### Upload apk to Google Play
Fortunately, expo is able to upload apk to google play without error.
`yarn expo upload:android --latest --key "$_GOOGLE_AUTH_JSON"`
_GOOGLE_AUTH_JSON is the key you get from your google play account.

## Conclusion
expo CI/CD should to be much more eaiser if they solve the upload to ios problem. After we setup the credentials correctly once, the subsequent build steps is very straight forward.