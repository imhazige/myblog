---
published: false
layout: post
title: The SSH commands you must know
comments: true
date: '2018-04-27 20:00 +08:00'
type: post
categories:
  - linux
tags:
  - shell
---
When I was developing a cloud service which running AWS EC2 servers, I was benefited from the ssh command, I wrote many shell that make our team able to connect to the remote server through a bastion server then connect to the private network in the AWS. With the shells, we are able to deploy, connect to the database, make our local code available to the internet or a thrid party api need web api interaction. 

In this artical I will explain how to do.

In the following words, I will take 202.1.1.1 as a ficticious remote server, also suppose I have a key abc.key located at /key/abc.key for the user abc at remote linux server

### ssh to remote server
First is common and important to login to remote linux server via ssh.
On mac, ssh and scp command is included natively. for Window, you can install git client, which will include the ssh client.

To login to a remote server:
```shell
ssh -i /key/abc.key abc@202.1.1.1
```
if we did not specify the -i option, the terminal will prompt for password of the username. the -i option specify the path of the key will used for ssh login. normally we will need a ssh key, because it is safer than a password, to get the file of a key is more harder than get your password, maybe it is not true, but anyway, you need not input password everytime when you wrote a complex shell script.

### tunnel
### ssh-add

## scp
