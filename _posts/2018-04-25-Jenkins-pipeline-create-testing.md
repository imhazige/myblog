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
With pipeline script, you can dfine a pipeline for everything include the parameters, but you need create the pipeline in the Jenkins UI at first. give it a name, and add a simple pipeline script -- just simple, because we need a fast and successful build to replay for complex jenkins file testing.

So as we create a initial script and make it build successfully. then we can start write complex script in our local machine. But before that we need download the jenkins cli client jar. the Jenkins support CLI command, we can run it by ssh or a jenkins client ci jar via http.

I prefer the client jar as it need not additional setting for the ssh, we can download the jar from the JENKINS_URL/jnlpJars/jenkins-cli.jar. 

Then, we create a groovy file named abc.groovy which will be the place to jot down our pipeline script. the script is a groovy script, first, we could write the parameters definition of the pipeline. The pipeline parameters are going to be shown on the step when you start run your pipeline task, it allow you set parameters. so the pipeline is able to run dynamically based on your inputed parameters.

```groovy
#!/usr/bin/env groovy

// Script //
//build parameters, comment when all have been set.
properties([
      parameters([
            string(defaultValue: 'branch-abc', description: 'branch name', name: 'Branch'),
            booleanParam(defaultValue: true, description: 'skip maven test', name: 'SkipTest'),
            choice(name: 'Service', choices: "a-service\nb-service", description: 'What service you want to deploy?')
            ])
])
```
the above code define 3 type of parameters, a string which let you input the branch name, the bloolean value  let you choose if need skip the maven test. the choice have two lines a-service and b-service, joined by a NEWLINE character "\n", as per the Jenkins document, the first line of the choice will be the default value.

So, we can run this script and to see what will happen. Again, We need make sure the pipeline we created have a a successful build already, then we can replay.

Run the command:
`java -jar jenkins-cli.jar -s <your jenkins url>  -auth <jenkins user name>:<jenkins password> replay-pipeline  "<pipeline name>" < <your groovy script file path>`

The command will run the groovy script to the jenkins pipeline by the feature of replay, after that you can go to the Jenkins pipeline panel or the Blue Ocean Panel, you will see a new build have started. also you can see the parameters have defined on the pipeline. This is great! we can save our pipeline as a script, and save in to the SCM, which is Jenkins recommended [Single_Source_of_Truth](https://en.wikipedia.org/wiki/Single_source_of_truth).

The next task is to write the build/deploy script, to complete the task. the most useful command we may using is git, sh, sshPublisher. git let you clone code from git SCM, sh allow you package the war(for Java) and any other thing a linux or windows shell can do. sshPublisher allow you upload packaged file to remote server and exec shell remotely.


## Refs:

[Groovy Syntax](http://groovy-lang.org/syntax.html)
