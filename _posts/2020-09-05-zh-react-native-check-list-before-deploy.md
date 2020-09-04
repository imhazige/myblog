---
published: true
layout: post
comments: true
date: "2020-09-05 00:00 +08:00"
type: post
title: "高质量React Native项目发布之前的检查步骤"
categories:
  - mobile
tags:
  - react native
---
> 本文摘译自[React Native Final Steps](https://shift.infinite.red/react-native-final-steps-691a01f9d895)

## 在React Native发布上线之前的优化步骤:

### 移除日志
#### [官方方法](https://reactnative.dev/docs/performance.html#using-consolelog-statements)
```json
{
  "env": {
    "production": {
      "plugins": ["transform-remove-console"]
    }
  }
}
```
#### 非官方方法
将console.log函数写成空函数
```javascript
if (!__DEV__){console.log={}}
```

### 压缩图片
除了自动化压缩外，最后再用[Squoosh.app](https://squoosh.app/)手动压缩一下

### [依据具体情况删除默认的安卓权限](https://reactnative.dev/docs/removing-default-permissions)
```xml
<manifest xmlns:android="http://schemas.android.com/apk/res/android"
    package="com.myappid"
+   xmlns:tools="http://schemas.android.com/tools"
    >

    <uses-permission android:name="android.permission.INTERNET" />
    <uses-permission android:name="android.permission.SYSTEM_ALERT_WINDOW" />
+   <uses-permission tools:node="remove" android:name="android.permission.READ_PHONE_STATE" />
+   <uses-permission tools:node="remove" android:name="android.permission.WRITE_EXTERNAL_STORAGE" />
+   <uses-permission tools:node="remove" android:name="android.permission.READ_EXTERNAL_STORAGE" />

    <application
      android:name=".MainApplication"
      android:label="@string/app_name"
      android:icon="@mipmap/ic_launcher"
      android:allowBackup="false"
      android:theme="@style/AppTheme">
      <activity
        android:name=".MainActivity"
        android:label="@string/app_name"
        android:configChanges="keyboard|keyboardHidden|orientation|screenSize"
        android:windowSoftInputMode="adjustResize">
        <intent-filter>
            <action android:name="android.intent.action.MAIN" />
            <category android:name="android.intent.category.LAUNCHER" />
        </intent-filter>
      </activity>
      <activity android:name="com.facebook.react.devsupport.DevSettingsActivity" />
    </application>

</manifest>
```

### 使用[ProGuard](https://reactnative.dev/docs/signed-apk-android#enabling-proguard-to-reduce-the-size-of-the-apk-optional) 和 [Hermes](https://reactnative.dev/docs/hermes#docsNav) 加固压缩优化安卓

### 质量检查

#### [检查性能](https://reactnative.dev/docs/performance)
![](https://reactnative.dev/docs/assets/PerfUtil.png)

#### 打开In-Call Status Bar检查布局

#### 低速网络环境检查
可使用[Network Link Conditioner](https://nshipster.com/network-link-conditioner/)配合测试

#### [可达性检查](https://reactnative.dev/docs/accessibility)
![](https://miro.medium.com/max/778/1*SW07Oqn5BZVWWSvdnlvXew.gif)

### 启动性能优化
#### 检查bundle大小，最好不要超过10M
```shell
# Generate your Android production bundle (just code no assets)
$ yarn react-native bundle --platform android --dev false --entry-file index.js --bundle-output ./index.android.bundle

# Generate your iOS production bundle (just code no assets)
$ yarn react-native bundle --platform ios --dev false --entry-file index.js --bundle-output ./index.ios.bundle
```

#### 考虑[开启inline require](https://reactnative.dev/docs/ram-bundles-inline-requires#configure-preloading-and-inline-requires)

#### 对于安卓考虑使用[ABI分割](https://proandroiddev.com/reducing-apk-size-by-using-abi-filters-and-apk-split-74a68a885f4e)

#### 掌控崩溃情况
##### 使用[App Center](https://appcenter.ms/)或者[Firebase Crashlytics](https://firebase.google.com/docs/crashlytics)收集崩溃报告

##### 优雅的崩溃
使用 [React Native Exception Handler.](https://github.com/a7ul/react-native-exception-handler)
![](https://github.com/master-atul/react-native-exception-handler/raw/master/screens/WITH_EH.gif)

### 禁止生产环境localhost访问
![](https://miro.medium.com/max/2000/1*AYzC6ucAA8umMk05tAt0eA.png)
[可使用fastlane自动修改plist](https://docs.fastlane.tools/actions/update_info_plist/)