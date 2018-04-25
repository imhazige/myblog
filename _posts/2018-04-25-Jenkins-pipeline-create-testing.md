---
published: false
layout: post
comments: true
date: '2018-04-25 10:00 +08:00'
type: post
status: publish
categories:
  - Devops
tags:
  - Jenkins
  - Groovy
---
Nowadays, Jenkins is powerful and is like a standard tool for continue integration. this article is going to introduce the way to create, testing a pipeline. the pipeline will use jenkins pipeline script syntax to define, and use replay feature to test. 

## Setup Jenkins
First, you need a Jenkins, there are installer for different OS. but as I am a javaer, I choose install it via a war package. Jenkins document have mentioned how to setup at [here](https://jenkins.io/doc/pipeline/tour/getting-started/).

## Use pipeline and Blue Ocean
As you see, the official Jenkins document have put the Blue Ocean and Pipeline at the striking place, because pipeline is proved to be the most useful and popular way in Jenkins, so, we should use pipeline and Blue Ocean. To me, Blue Ocean is just a beautiful UI than the old pipeline UI, it is not included in the  Jenkins by default, we need install the Blue Ocean as a plugin, we can find it in the plugin managing panel of Jenkins.

## Where is the "Document"
When I getstarted with Jenkins, I am very confused and boring with its bad document, the web site is in a style decade years ago, like a antique J2EE service. the document said something, but finally I got nothing with the important information like the pipeline reference, the script syntax.

Finally I found the document is in the Jenkins server, when you go into a pipeline, you will find a line like "Pipeline Syntax", it have the detailed reference of pipeline, especially the "DSL Reference" which is not on the official document. What's a joke!


## Define pipeline and testing


## Refs:

[Groovy Syntax](http://groovy-lang.org/syntax.html)  




