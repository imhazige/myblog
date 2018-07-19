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
运行命令即可开始安装box`ubuntu/xenial64`
`vagrant box add ubuntu/xenial64`

#### 然而网络环境原因，下载很慢怎么办?
上面的命令会打印出原始下载url,使用各种技巧（🤦‍♂️🤦‍♀️）（例如迅雷）直接下载到本地。
然后使用[add](https://www.vagrantup.com/docs/cli/box.html#box-add)命令直接加载
`vagrant box add 'D:\path\trusty-server-cloudimg-amd64-vagrant-disk1.box'  --name  ubuntu/xenial64`

### 使用box  
#### 初始化box
`vagrant init ubuntu/xenial64` 会在当前文件夹下创建Vagrant文件，这个是配置文件，一般应该将此文件提交到版本控制中，则其他小伙伴可以直接使用
#### 启动box  
`vagrant up`
#### ssh登录到box 
`vagrant ssh`

#### 共享文件夹
这个不需要什么额外操作，默认Vagrant配置文件所在文件夹会被同步到虚拟环境中的/vagrant目录中（注意，ssh登录的用户名字叫vagrant,所以默认用户文件夹是/home/vagrant，这个与/vagrant目录不同）。

到了这一步，大部分需要的功能都具备了，就是这么简单，不需要像virtualbox那样还要安装addon，安装addon还要安装gcc，共享文件夹还要重启，重启了还要解决权限问题，要将用户加入vboxsf组,要ssh还要配置防火墙(UFW),越扯越多……

#### [provisioning](https://www.vagrantup.com/docs/provisioning/)
provisioning用于在box初始化时执行某些操作，例如运行脚本，上传文件等，默认只在初次运行vagrant up时加载，您可以通过`vagrant up --provision`或`vagrant reload --provision`参数进行强制加载

##### 测试provision
有时候您已经建立了虚拟环境，现在想增加一个provision,可以使用provision命令
`sh vagrant provision --provision-with file `
这就在当前虚拟环境上运行file provision(您在Vagrantfile里的file配置)

##### 存在的问题 
- provision 脚本加载安装的，有的命令遇到长时间没反应，没输出（命令在运行，但是无法判断进行到哪一步）,未找到解决方法，还是得在虚拟机启动以后再手动安装，这样很不方便，没有达到配置运行环境的目的。

### Vagrant示例
```yml
# -*- mode: ruby -*-
# vi: set ft=ruby :

# All Vagrant configuration is done below. The "2" in Vagrant.configure
# configures the configuration version (we support older styles for
# backwards compatibility). Please don't change it unless you know what
# you're doing.
Vagrant.configure("2") do |config|
  # The most common configuration options are documented and commented below.
  # For a complete reference, please see the online documentation at
  # https://docs.vagrantup.com.

  # Every Vagrant development environment requires a box. You can search for
  # boxes at https://vagrantcloud.com/search.
  config.vm.box = "ubuntu/xenial64"

  # Disable automatic box update checking. If you disable this, then
  # boxes will only be checked for updates when the user runs
  # `vagrant box outdated`. This is not recommended.
  # config.vm.box_check_update = false

  # Create a forwarded port mapping which allows access to a specific port
  # within the machine from a port on the host machine. In the example below,
  # accessing "localhost:8080" will access port 80 on the guest machine.
  # NOTE: This will enable public access to the opened port
  # config.vm.network "forwarded_port", guest: 80, host: 8080

  # Create a forwarded port mapping which allows access to a specific port
  # within the machine from a port on the host machine and only allow access
  # via 127.0.0.1 to disable public access
  # config.vm.network "forwarded_port", guest: 80, host: 8080, host_ip: "127.0.0.1"

  # Create a private network, which allows host-only access to the machine
  # using a specific IP.
  config.vm.network "private_network", ip: "192.168.33.10"

  # Create a public network, which generally matched to bridged network.
  # Bridged networks make the machine appear as another physical device on
  # your network.
  # config.vm.network "public_network"

  # Share an additional folder to the guest VM. The first argument is
  # the path on the host to the actual folder. The second argument is
  # the path on the guest to mount the folder. And the optional third
  # argument is a set of non-required options.
  # config.vm.synced_folder "../data", "/vagrant_data"

  # Provider-specific configuration so you can fine-tune various
  # backing providers for Vagrant. These expose provider-specific options.
  # Example for VirtualBox:
  #
  # config.vm.provider "virtualbox" do |vb|
  #   # Display the VirtualBox GUI when booting the machine
  #   vb.gui = true
  #
  #   # Customize the amount of memory on the VM:
  #   vb.memory = "1024"
  # end
  #
  # View the documentation for the provider you are using for more
  # information on available options.

  config.vm.synced_folder ".", "/vagrant", type: "rsync",
    rsync__exclude: [".git/",".meteor/","node_modules/"]

  # Enable provisioning with a shell script. Additional provisioners such as
  # Puppet, Chef, Ansible, Salt, and Docker are also available. Please see the
  # documentation for more information about their specific syntax and use.
  # config.vm.provision "shell", inline: <<-SHELL
  #   apt-get update
  #   apt-get install -y apache2
  # SHELL
  config.vm.provision "shell", path: "vagrant.provision.sh",privileged: "false"
  
  config.vm.provision "file", source: ".meteor", destination: "/vagrant/.meteor"
end


```



#### [symbolic-links问题](https://www.vagrantup.com/docs/synced-folders/basic_usage.html#symbolic-links)
对于provider virtualbox,默认依然用的是virtualbox的共享文件机制,所以symbolic问题依然存在。解决方案参见[这里](https://blog.rudylee.com/2014/10/27/symbolic-links-with-vagrant-windows/)
- vagrantp配置文件里添加
  `config.vm.provider "virtualbox" do |v|
    v.customize ["setextradata", :id, "VBoxInternal2/SharedFoldersEnableSymlinksCreate/v-root", "1"]
  end`
- `vagrant reload` 重新加载配置
- `sudo vagrant up`  admin启动windows下sudo来自scoop工具

或使用[rsync](https://www.vagrantup.com/docs/synced-folders/rsync.html)
- windows下需要安装CGWin以安装rsync


## 销毁原来的，重新加载vagrant配置
`vagrant destroy`  
由于Vagrant配置文件已经保存，只需运行
`vagrant up`


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


## PS:
实际使用一段时间后，弃用！具体痛点（pain point）:
- 依然未能很好地解决symbolic-links问题,rsync还是不太方便。[而docker也存在这个问题,npm构建方式的毛病](https://stackoverflow.com/questions/38142610/how-can-avoid-symlink-problems-with-npm-running-in-docker-on-a-windows-host)。
- ssh操作比较长时间的命令，几乎次次不是这里就是那里没反应，控制台无输出了，不知道进行到哪里了
- windows下,mac下都试过，感觉网络速度比较慢
- 各项目对vagrant支持非常少，很少有文档提到，别人用的少，你用起来就痛苦

## Refs:   
[Vagrant入门](https://www.cnblogs.com/davenkin/p/vagrant-virtualbox.html)
