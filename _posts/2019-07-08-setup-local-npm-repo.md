---
published: true
layout: post
comments: true
date: '2019-07-08 00:00 +08:00'
type: post
title: 'Use Verdaccio to Publish npm package to a local repository'
categories:
  - nodejs
tags:
  - npm
---

When you want share a javascript package written by yourself among your different projects, you may not want to publish the package to the public npm repository or its paid private repository.

So you can use [verdaccio](https://verdaccio.org/en) to build a local repository.

### Setup

`npm install -g verdaccio`, you may need add `sudo` if there are no permission.

### Run

run `verdaccio` in the bash.

It will show the url of the verdaccio server, and the default config. These two infomation is required at later.

```bash
 warn --- config file  - ~/.config/verdaccio/config.yaml
 warn --- Plugin successfully loaded: verdaccio-htpasswd
 warn --- Plugin successfully loaded: verdaccio-audit
 warn --- http address - http://localhost:4873/ - verdaccio/4.0.4
```

As we see, the default server url is `http://localhost:4873/`, the default config path is `~/.config/verdaccio/config.yaml`

### Steps to Enable Anonymous Pusblish

Edit the config.yaml

```yaml
packages:
  '**':
    access: $anonymous
    publish: $anonymous
    proxy: npmjs
```

Restart the verdaccio server.

### Resolve the problem of anonymous access still need token

According to this [issue](https://github.com/verdaccio/verdaccio/issues/212#issuecomment-308578500), we still need a fake token.

Create a .npmrc file under the project you are going to publish.

```bash
//localhost:4873/:_authToken="fooBar"
```

As you know, the `localhost:4873` is `verdaccio` server url.

### Publish Package to Local

`npm --registry http://localhost:4873 publish`

Note the `--registry` option set the target server to publish - here is the local verdaccio server.

### Download the Package from the Local Repository

`npm install --registry http://localhost:4873`
