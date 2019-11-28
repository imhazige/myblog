---
published: true
layout: post
comments: true
date: '2019-11-28 00:00 +08:00'
type: post
title: 'Custom Build Meteor via Docker and Deploy to Heroku'
categories:
  - nodejs
tags:
  - docker
  - meteor
---
[Meteor](https://www.meteor.com/developers) is a amazing and stable nodejs framework to build enterprise APP.

Here I will discuss the way to deploy a meteor APP and some problem it have.

It is easy to deploy with source code mode like use many stable docker tool:

## [Normal Deploy](https://guide.meteor.com/deployment.html)

As inllustrate in the [official document](https://guide.meteor.com/deployment.html), there are following popular used tools:

### [Meteor Up](https://guide.meteor.com/deployment.html#mup)
This is the simplest way, you just need set up a config file, provide the information to the server which have ssh enabled, the meteor up will do `meteor build` and upload the compiled APP to the server.

## Docerize

### Tools
I have tried many docker image, currently, I only found [`johnnyutahio/meteor-launchpad`](https://github.com/jshimko/meteor-launchpad/issues/121) worked well.
The others docker image list on Meteor official site are all not maintained.

But this way have some problem:
- It need put your source code to the docker
- It always take more than 10 minutes to start up the app after you start the container.

Another good choice maybe [meteor base](https://github.com/disney/meteor-base) which is from Disney.
But it still need you put your source code into the docker. It will use [multiple stage build](https://docs.docker.com/develop/develop-images/multistage-build/).

### Deploy Custom deployment with Docker
When you don't want put your source code into the docker, you should use [Custom Deployment](https://guide.meteor.com/deployment.html#custom-deployment).

There are things need take care:
- Use `meteor build --architecture os.linux.x86_64` to build the target app which will run on a linux container. (with meteor build --help you could see all the available value)
- The Node version should match the Meteor version, It contained in the file `bundle/README` which created by the build command.
- In the docker container, need run the command `(cd programs/server && npm install)` to install the dependency.(Why? mostly is the` fibers` and some other native module like bycrpt need compile on the target system)

But many problems will happen by the issue 3, when comiple fibers, it need python. then it need gcc... and there are permission problem then...

#### A Working Dockfile to Do Custom Deployment
```Dockerfile
# https://www.docker.com/blog/keep-nodejs-rockin-in-docker/

FROM node:8.15.1-slim
# https://hub.docker.com/_/node/?tab=tags&page=1&name=8.15
# meteor 1.5.1   === Node 4.8.4
# meteor 1.6     === Node 8.8.1
# meteor 1.6.0.1 === Node 8.9.3
# meteor 1.6.1   === Node 8.9.4
# meteor 1.6.1.1 === Node 8.11.1
# meteor 1.6.1.3 === Node 8.11.3
# meteor 1.7     === Node 8.11.2
# meteor 1.7.0.2 === Node 8.11.3
# meteor 1.7.0.5 === Node 8.11.4
# meteor 1.8.1   === Node 8.15.1
# see https://docs.meteor.com/changelog.html

ENV APP_DIR=/meteor						\
    NODE_ENV=production \
    PORT=3000
EXPOSE $PORT

# Install as root (otherwise node-gyp gets compiled as nobody)
USER root
WORKDIR $APP_DIR/bundle/programs/server/

# Copy bundle and scripts to the image APP_DIR(assume bundle in the same folder as Dockerfile)
COPY bundle $APP_DIR/bundle

# the install command for debian
RUN echo "Installing the node modules..." \
    && npm install -g node-gyp \
    && npm install --production \
    && echo \
    && echo \
    && echo \
    && ls -a \
    && echo "Updating file permissions for the node user..." \
    && chmod -R 750 $APP_DIR \
    && chown -R node.node $APP_DIR \
    && cd $APP_DIR/bundle \
    && ls -la

# start the app
WORKDIR $APP_DIR/

USER node

WORKDIR $APP_DIR/bundle
RUN ls -a
WORKDIR $APP_DIR/

CMD node bundle/main.js --port $PORT
```

### Deploy Docker to Heroku