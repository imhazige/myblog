---
published: false
layout: post
comments: true
date: '2018-07-03 20:00 +08:00'
type: post
title: The Python Dependency Tool
categories:
  - python
tags:
  - pyenv
---
## The shitty python dependency management
### pip install dependency globally, no version

### 

## [pipenv](https://github.com/pypa/pipenv)

## The mysqlclient problem
pipenv is like a life saver -- But! it still can not resolve such a problem:
[Can't open 'mysql.h' - and Can't open : 'config-win.h': No such file or directory](https://stackoverflow.com/questions/51118963/issues-installing-mysqldb-with-python-3-6-5-cant-open-mysql-h-and-cant-op)  
When I use command `pipenv install mysqlclient`, this problem happen.  

I check mysql version by running ```sql SELECT version();   ```, it shows 5.7, not a problem, then I read the [mysqlclient document](https://pypi.org/project/mysqlclient/), hmm, it need install [mysqlconnector/c](https://dev.mysql.com/downloads/connector/c/), but I remember I have installed it, I run the installer again and confirmed it, what's going on?  

Then I download the latest installer, but I can not found the option of connector/c in the installer wizard, what? Are you kidding me - Oracle?

### Use wheel
As the 
https://www.lfd.uci.edu/~gohlke/pythonlibs/#mysqlclient

## Refs  
[Why is python dependency management so shit?](https://www.reddit.com/r/Python/comments/51ae8b/why_is_python_dependency_management_so_shit/)

[Better Python dependency while packaging your project](https://medium.com/python-pandemonium/better-python-dependency-and-package-management-b5d8ea29dff1)