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
As the mysqlclient suggested, we can use a wheel file to install directly.
I download thew wheel file from https://www.lfd.uci.edu/~gohlke/pythonlibs/#mysqlclient
I try it by running `pipenv install <pathotthedownloadedwheelfilepath>`, it throw error `mysqlclient-1.3.13-cp37-cp37m-win32.whl is not a supported wheel on this platform.` tried amd_64, not working too ...

I found I am going to back to the old way of compile a c project. 

Found the same problem at [Python Connector for Django 1.9 and Python 3.5? [closed]](https://stackoverflow.com/questions/34456770/python-connector-for-django-1-9-and-python-3-5), the python version I running is 3.6(64 bit).

The root cause is > mysqlclient can not currently be compiled on Python 3.5 for Windows because the MySQL Connector/C is not yet compatible with the Visual Studio 2015 compiler required by Python 3.5. The solution is use mysqlclient 1.3 which have add support for python3.3~

Then I tried `pipenv install mysqlclient==1.3.12` it works!!!!!

### The final solution
- make sure connect/c is installed(the old version of windows mysql server installer have this option)  
- `pipenv install mysqlclient==1.3.12`

## Refs  
[Why is python dependency management so shit?](https://www.reddit.com/r/Python/comments/51ae8b/why_is_python_dependency_management_so_shit/)

[Better Python dependency while packaging your project](https://medium.com/python-pandemonium/better-python-dependency-and-package-management-b5d8ea29dff1)