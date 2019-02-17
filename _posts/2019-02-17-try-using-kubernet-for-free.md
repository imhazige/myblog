---
published: true
layout: post
comments: true
date: '2019-02-17 20:00 +08:00'
type: post
title: 'Try Using Kubernetes for Free'
categories:
  - distributed
  - cloud
  - devops
tags:
  - kubernetes
---

[kubesail](https://kubesail.com/) provide a [Free](https://kubesail.com/pricing) plan to allow us to start trying kubernete, amazing! Here we will create a simple nignix web service and expose to the internet.

### [Install kubectl on MacOS](https://kubernetes.io/docs/tasks/tools/install-kubectl/#install-with-homebrew-on-macos)

`brew install kubernetes-cli`

`kubectl version` to ensure installed and up-to-date

Normally, it will response like:  
`Client Version: version.Info{Major:"1", Minor:"10", GitVersion:"v1.10.3", GitCommit:"2bba0127d85d5a46ab4b778548be28623b32d0b0", GitTreeState:"clean", BuildDate:"2018-05-21T09:17:39Z", GoVersion:"go1.9.3", Compiler:"gc", Platform:"darwin/amd64"} Unable to connect to the server: dial tcp 192.168.99.100:8443: i/o timeout`

It shows kubectl installed, ignore the error `Unable to connect to the server: dial tcp 192.168.99.100:8443: i/o timeout` because we have not set up the kubernet cluster config yet.

### Kubectl Config

Login into kubesail then click `GET KUBECTL CONFIG`, copy the config to your local config file `~/.kube/config`. Then you could check your Kubernetes cluster manager by type `kubectl config current-context` ; `kubectl cluster-info` ; `kubectl get deployments`. For more information, please refer to the [official document](https://kubernetes.io/docs/reference/kubectl/cheatsheet/#viewing-finding-resources).

> 💡 Hint: When you encounter error like `cannot list resource "pods" in API group ""` when you run `kubectl pods`, there are a possbile reason is that you have not create any pods, services yet.

### Start a Simple Http Server

`kubectl run first-deployment --image=katacoda/docker-http-server --port=80`

After that you can see the deployment by
`kubectl get pods` or
`kubectl get deployments`

### View the Logs of one pod:

`kubectl logs -f first-deployment-5bc5c8cd58-stbqp`
Note here the pod name maybe different in your cluster, you should get the name by `kubectl get pods`

### Expose to Internet

We need create a service to expose the port, refer the [official document](https://kubernetes.io/docs/concepts/services-networking/service/#publishing-services-service-types)

However, currently, we can not create service (refer to [here](https://kubernetes.io/docs/reference/kubectl/docker-cli-to-kubectl/)) by `kubectl expose deployment first-deployment --port=80 --type=NodePort`
directly on kubesail, instead, we can set it up on our web tool on kubesail site.(Go to Home of your account, click the deployment you have created here should be `first-deployment`, then you will see the `ports` button click it, you have the choice to expose the port to internet or internally).

After you do that, after a while, you should be able to see the web service home page, Congratulations!

### Remove a Deployment

`kubectl delete first-deployment`
