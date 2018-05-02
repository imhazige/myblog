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

### execute command with ssh
```shell
ssh -i /key/abc.key abc@202.1.1.1 "cd ~/tmp"
```
here we add a command string after the ssh command, it means, after ssh login to the remote server, execute the command on the remote server.

you can execute many command at one time like
```shell
ssh -i /key/abc.key abc@202.1.1.1 "mkdir ~/tmp; \
cd ~/tmp; \
"
```
we can join many commands with semicolon, newline is not required, but need escape the newline with a backslash.

### tunnel
ssh port forward allow you to build tunnel from you local machine to a remote server. 

```shell
ssh  -i /key/abc.key abc@202.1.1.1 -L 13006:localhost:3006
```
The -L option create a tunnel, 13006 means the port will open on local machine. the localhost means the ip address of the remote server(B) related to the ssh server you connecting to(A), the 3006 port means the the port running on the server B.

In the above example, if you connect to local machine port 13006, it will connect to the server B port 3006. this is a very useful feature ssh provided to a developer. We connect to the database, jmx without requiring to open the port to the internet, just need a ssh connection and with the benifits of security of ssh.

Actually, this is a forward forwarding, there are another option -R means reverse forwarding.
```shell
ssh  -i /key/abc.key abc@202.1.1.1 -L 13006:localhost:3006
```
This time, we create a tunnel, which open port on the ssh server(A) we connecting to, forward the port 3006 of local machine to the server A, so within the server A, request to localhost:13006 will send to local machine port 3006.it like the service [ngrok](https://ngrok.com/) provided. But, in most server, you need additional steps to make the port run as a service and public to the internet.


### ssh-add
In some cases, there are some [bastion host](https://en.wikipedia.org/wiki/Bastion_host) stand before the remote servers, and you are only able to connect to the remote servers via the bastion hosts, you need ssh to the bastion host, then run ssh on the bastion host to connect to the remote servers. 



## scp
