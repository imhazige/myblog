---
published: true
layout: post
comments: true
date: '2018-07-12 20:00 +08:00'
type: post
title: vagrant快速入门
categories:
  - devops
tags:
  - virtualbox
---
## 简单介绍
[主页](https://www.vagrantup.com)
> Vagrant is a tool for building and managing virtual machine environments in a single workflow. With an easy-to-use workflow and focus on automation, Vagrant lowers development environment setup time, increases production parity, and makes the "works on my machine" excuse a relic of the past.

Vagrant主要目的是更容易地搭建开发环境（通过虚拟技术），使得开发运行环境与实际产品运行环境“几乎”一致。

## 使用
### 安装vagrant
到[这里](https://www.vagrantup.com/downloads.html)下载对应平台安装文件，安装。针对不同的虚拟技术provider，您还要安装对应的虚拟软件，例如，provider是virtualbox,那么您还要装好virtualbox。

### 安装box
安装项目目标运行环境的box，例如，您的产品将要运行于ubuntu上，那就到[这里](https://app.vagrantup.com/boxes/search)搜索，发现排名第一的ubuntu,可获得下载信息。
运行命令即可开始安装box`ubuntu/trusty64x`
`vagrant box add ubuntu/trusty64x`

#### 然而网络环境原因，下载很慢怎么办?
上面的命令会打印出原始下载url,使用各种技巧（🤦‍♂️🤦‍♀️）（例如迅雷）直接下载到本地。
然后使用[add](https://www.vagrantup.com/docs/cli/box.html#box-add)命令直接加载
`vagrant box add 'D:\path\trusty-server-cloudimg-amd64-vagrant-disk1.box'  --name  ubuntu/trusty64x`

### 使用box  
#### 初始化box
`vagrant init` 会在当前文件夹下创建Vagrant文件，这个是配置文件，一般应该将此文件提交到版本控制中，则其他小伙伴可以直接使用
#### 启动box  
`vagrant up`
#### ssh登录到box 
`vagrant ssh`

#### 共享文件夹
这个不需要什么额外操作，默认Vagrant配置文件所在文件夹会被同步到虚拟环境中的/vagrant目录中（注意，ssh登录的用户名字叫vagrant,所以默认用户文件夹是/home/vagrant，这个与/vagrant目录不同）。

到了这一步，大部分需要的功能都具备了，就是这么简单，不需要像virtualbox那样还要安装addon，安装addon还要安装gcc，共享文件夹还要重启，重启了还要解决权限问题，要将用户加入vboxsf组,要ssh还要配置防火墙(UFW),越扯越多……

#### [symbolic-links问题](https://www.vagrantup.com/docs/synced-folders/basic_usage.html#symbolic-links)
对于provider virtualbox,默认依然用的是virtualbox的共享文件机制,所以symbolic问题依然存在。解决方案参见[这里](https://stackoverflow.com/questions/24200333/symbolic-links-and-synced-folders-in-vagrant)
- vagrantp配置文件里添加
  config.vm.provider "virtualbox" do |v|
    v.customize ["setextradata", :id, "VBoxInternal2/SharedFoldersEnableSymlinksCreate/v-root", "1"]
  end
- sudo vagrant reload


## windows下 virtualbox问题
### 无法选择64位系统问题
参见[VirtualBox没有64位选项，无法安装64位Linux CentOS的解决办法](https://blog.csdn.net/zhao1949/article/details/53403828)
- bios中开启VT
- win10禁用hyper-v
- 关机10秒后再启动才能见效果

### linux怎么安装guest扩展
- 在virtualbox菜单中 devices>insert 扩展iso
- 在虚拟机中运行:  
-- `sudo Apt-get install gcc perl make` 安装gcc  
-- `mount /dev/cdrom /mnt` 加载cd  
-- `sudo /mnt/VBoxLinuxAdditions.run` 运行  

## 对比docker
我之愚见，docker当初也是说简化开发环境搭建，使得开发者可以使用统一的开发环境，结果它windows7一大堆的毛病，windows10安装起来还是费劲。最主要的是，配置还是太麻烦，并没有对开发环境友好，docker用来部署产品环境，那还行，用来开发，还是算了吧。


## Refs:   
[Vagrant入门](https://www.cnblogs.com/davenkin/p/vagrant-virtualbox.html)
