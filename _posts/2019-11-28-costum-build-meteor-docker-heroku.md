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
[Meteor](https://www.meteor.com/developers) is an amazing and stable nodejs framework to build enterprise APP.

Here I will discuss the way to deploy a meteor APP and some problem it have.

It is easy to deploy with source code mode like use many stable docker tool:

## [Normal Deploy](https://guide.meteor.com/deployment.html)

As illustrate in the [official document](https://guide.meteor.com/deployment.html), there are following popular used tools:

### [Meteor Up](https://guide.meteor.com/deployment.html#mup)
This is the simplest way, you just need set up a config file, provide the information to the server which have ssh enabled, the meteor up will do `meteor build` and upload the compiled APP to the server.

## Dockerize

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

## Deploy to Heroku

### Via Buildpacks
When deploy to Heroku, we can not use meteorup, but there are a working buildpacks `admithub/meteor-horse`, it need you push the source code to the git.

Here is the script I use to deploy in this way:
```bash
echo "start deploy to heroku..."
GIT_URL="<your heroku git url>"
ROOT_DIR=`pwd`
echo "deploy... from " $ROOT_DIR
echo "make sure logined to heroku"
echo "assume your built code is under folder dist"
DIST_DIR="$ROOT_DIR/dist"
echo "assume your source code is under folder server"
SERVER_DIR="$ROOT_DIR/server"
HEROKU_APPNAME="<your heroku app name>"
ROOT_URL="<>"
MONGO_URL="<>"
OTHER_ENV="some other env"


echo "clean dist folder..."
rm -rf $DIST_DIR
echo "copy source code to push..."
rsync -av --progress $SERVER_DIR $DIST_DIR --exclude .meteor/local --exclude .git --exclude node_modules

echo "set heroku env..."
heroku buildpacks:set admithub/meteor-horse --app $HEROKU_APPNAME
heroku config:set ROOT_URL=$ROOT_URL  --app $HEROKU_APPNAME
heroku config:set MONGO_URL=$MONGO_URL  --app $HEROKU_APPNAME

echo "go to dist folder"
cd $DIST_DIR
rm -rf .git
echo "push to heroku git"
git init .
git remote add heroku $GIT_URL
echo "commit"
git add .
git commit -am "deploy..."
git push heroku master --force
heroku logs -t --app $HEROKU_APPNAME
```

### Via [Container Registry & Runtime (Docker Deploys)](https://devcenter.heroku.com/articles/container-registry-and-runtime)
This way is straightforward, just push the image you have build to the heroku docker hub.

```bash
echo "push docker image to heroku"
docker tag <you local docker tag> registry.heroku.com/<your heroku app name>/web
echo "push to docker, this may cause uploading a large file to the docker hub"
docker push registry.heroku.com/<your heroku app name>/web


echo "set heroku env..."
#see  https://devcenter.heroku.com/articles/buildpacks
heroku buildpacks:clear --app $HEROKU_APPNAME
echo "set heroku app as docker container by stack:set container"
# https://devcenter.heroku.com/articles/build-docker-images-heroku-yml
heroku stack:set container --app $HEROKU_APPNAME

echo "deploy docker container to heroku app"
heroku container:release web --app <your heroku app name>
```
The problem is, it will upload a large docker image to the heroku hub.

The `heroku.yml`
```yaml
# https://devcenter.heroku.com/articles/build-docker-images-heroku-yml
build:
  docker:
    web: Dockerfile
setup:
  config:
    ROOT_URL: <required>
    MONGO_URL: <required>
    OTHER_ENV: some other env
```

### Via [Building Docker Images with heroku.yml](https://devcenter.heroku.com/articles/build-docker-images-heroku-yml)

#### The Way not Working
While build the docker with the Dockerfile above in this article works well on a normal linux container, it did not on heroku.

The problem I have encountered:
```shell
npm WARN lifecycle meteor-dev-bundle@~install: cannot run in wd meteor-dev-bundle@ node npm-rebuild.js (wd=/meteor/bundle/programs/server)
```

`Error: Cannot find module 'meteor-deque'`

After many tries, I realized that this way won't work.

#### Use Upload node_modules Directly
So I think how about upload node_modules directly so avoid build the native dependency on heroku docker?

The Result is, it works!😄

So I create two dockerfile, one to build the dependency, copy its final built folder to the final docker.

Note, Multiple Stage Build will not work because as illustrate above, build dependency step will not work in heroku container.

The build Dockerfile, mostly same as the one above, just need not the `CMD` directive.
```Dockerfile
# https://www.docker.com/blog/keep-nodejs-rockin-in-docker/
FROM node:8.16.2-slim
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
    NODE_ENV=production
# EXPOSE $PORT

# Install as root (otherwise node-gyp gets compiled as nobody.使用--unsafe-perm可解决)
USER root
WORKDIR $APP_DIR/bundle/programs/server/

# Copy bundle and scripts to the image APP_DIR
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
```

The Run Dockerfile, very simple, just run a node app
```Dockerfile
# https://www.docker.com/blog/keep-nodejs-rockin-in-docker/
# need be same as the build docker
FROM node:8.16.2-slim
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
    NODE_ENV=production

# Copy bundle and scripts to the image APP_DIR
COPY bundle $APP_DIR/bundle

# start the app
WORKDIR $APP_DIR/

# the heroku will assign the $PORT
CMD node bundle/main.js --port $PORT
```

`Build shell`
```bash
echo "build... from " `pwd`

echo "load vars from shared vars, see the shell above in this article"
. ./vars.build.sh

echo "stage one---------------------------------------"

echo "build..."
rm -rf $DIST_DIR 
(cd $SERVER_FOLDER && npm install --production && SKIP_LEGACY_COMPILATION=0 meteor build --server-only --directory $DIST_DIR --architecture os.linux.x86_64)

echo "copy build.Dockerfile, pls make sure it exists under $DOCKER_BUILD_PATH"
cp $DOCKER_BUILD_PATH/build.Dockerfile $DIST_DIR/Dockerfile

echo "build docker"
docker build -t $DOCKER_TAG $DIST_DIR 

echo "stage 2 build running docker---------------------------------------"

echo "clean final dist folder"
rm -rf $BUNDLE_DIR
mkdir -p $BUNDLE_DIR


echo "remove old dokcer..."
docker rm --force $DOCKER_CONTAINER_NAME
echo "create container to copy file"
docker create --name $DOCKER_CONTAINER_NAME $DOCKER_TAG
echo "copy final bundle files from built image"
docker cp $DOCKER_CONTAINER_NAME:/meteor/bundle $BUNDLE_DIR

echo "copy heroku docker yaml"
cp $DOCKER_BUILD_PATH/heroku.yml $BUNDLE_DIR

echo "copy running docker file $DOCKER_BUILD_PATH/run.Dockerfile"
cp $DOCKER_BUILD_PATH/run.Dockerfile $BUNDLE_DIR/Dockerfile

echo "build running docker image to test"
docker build -t $DOCKER_TAG_BUNDLE $BUNDLE_DIR 
```

`vars.build.sh`
```bash
MY_ROOT_PATH=`pwd`

GIT_URL="<your heroku git url>"
SERVER_FOLDER="$MY_ROOT_PATH/server"
APP_NAME="<your heroku app name>"
DIST_DIR="$MY_ROOT_PATH/dist"
DOCKER_TAG="<your build docker image tag>"
DOCKER_CONTAINER_NAME="<your build docker container name>"
DOCKER_TAG_BUNDLE="<your run docker image tag>"
DOCKER_CONTAINER_NAME_BUNDLE="<your run docker container name>"
DOCKER_BUILD_PATH="<where your dockerfile located>"
BUNDLE_DIR="<where to put final dist bundle>"
```

`Deploy shell`
```bash
SCRIPTPATH="$( cd "$(dirname "$0")" ; pwd -P )"
. $SCRIPTPATH/vars.build.sh

ROOT_DIR=`pwd`
echo "deploy... from " $ROOT_DIR
echo "make sure deployed to heroku"
DATE=`date '+%Y-%m-%d %H:%M:%S'`

echo "set heroku ..."
#see  https://devcenter.heroku.com/articles/buildpacks
heroku buildpacks:clear --app $HEROKU_APPNAME
echo "heroku docker: stack:set container"
# https://devcenter.heroku.com/articles/build-docker-images-heroku-yml
heroku stack:set container --app $HEROKU_APPNAME

cd $BUNDLE_DIR
rm -rf .git
echo "push git"
git init .
git remote add heroku $GIT_URL
echo "commit git"
git add .
git commit -am "deploy... $DATE"
git push heroku master --force
heroku logs -t -a $HEROKU_APPNAME
```

## Conclusion
Meteor depends on fibers, which require install on the native system. This make the custom deployment a bit complex based on the system difference. Docker is a good way to solve this problem.

With the shell script I wrote in this article, you should be easy to reproduce the success of custom deployment via docker to normal docker container even like heroku.