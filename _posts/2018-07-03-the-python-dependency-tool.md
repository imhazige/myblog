---
published: true
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
For java, we have maven, gradle. for nodejs, we have npm, npm is so good, that why I feel python package management is so ugly.

### pip install dependency globally by default
Although python3 have [venv](https://docs.python.org/3/library/venv.html), you need activate the venv and then the pip will install package in that venv.

Aslo you can use [--target](https://pip.pypa.io/en/latest/reference/pip_install/#cmdoption-t) to specify a folder.

All these seems to like many patch on a old clothes -- ugly.

## [pipenv](https://github.com/pypa/pipenv)
> Pipenv is a tool that aims to bring the best of all packaging worlds (bundler, composer, npm, cargo, yarn, etc.) to the Python world. Windows is a first–class citizen, in our world.

> **It automatically creates and manages a virtualenv for your projects**, as well as adds/removes packages from your Pipfile as you install/uninstall packages. It also generates the ever–important Pipfile.lock, which is used to produce deterministic builds.

This is the one I need, the project have over 12K stars on github.

### Basic usage

#### Install  pipenv
`sudo pip install pipenv` (windows need sudo, need [scoop](https://github.com/lukesampson/scoop) to install sudo command)

#### Setup a pipenv project
Go to the root folder of the python project.
run `pipenv --three` for a python3 project
run `pipenv --two` for a python2 project

#### Like npm install
`pipenv install`

#### Like yarn add
`pipenv install <packagename>`
`pipenv install <packagename>=<versionname> --dev`

#### Load the shell
`pipenv shell`

#### Like yarn remove
`pipenv uninstall <packagename>`
`pipenv uninstall all`

#### See the graph
`pipenv graph`

#### [generate a requirements.txt](https://docs.pipenv.org/advanced/#generating-a-requirements-txt)
pipenv lock -r > requirements.txt

#### Remove pipenv for vcurrent project
pipenv --rm

#### 

#### VSCode setting
To let VSCode understand the venv created by pipenv, see [Configuring Pipenv in Visual Studio Code](https://olav.it/2017/03/04/pipenv-visual-studio-code/)  
`pipenv --venv` to show the venv path  
then in the .vscode directory of the project
windows:
```json
{
    "python.pythonPath": "<venvpath>/Scripts/python.exe"
}
```
To let VSCode load pylint for Django, see [Class has no objects member](https://stackoverflow.com/questions/45135263/class-has-no-objects-member)  
`pipenv install pylint-django --dev`  
then in the .vscode directory of the project
windows:
```json
{"python.linting.pylintArgs": [
     "--load-plugins=pylint_django"
],}
```



## The mysqlclient problem
pipenv is like a life saver -- But! it still can not resolve such a problem:
[Can't open 'mysql.h' - and Can't open : 'config-win.h': No such file or directory](https://stackoverflow.com/questions/51118963/issues-installing-mysqldb-with-python-3-6-5-cant-open-mysql-h-and-cant-op)  
When I use command `pipenv install mysqlclient`, this problem happen.  

I check mysql version by running ```sql SELECT version();   ```, it shows 5.7, not a problem, then I read the [mysqlclient document](https://pypi.org/project/mysqlclient/), hmm, it need install [mysqlconnector/c](https://dev.mysql.com/downloads/connector/c/), but I remember I have installed it, I run the installer again and confirmed it, what's going on?  

Then I download the latest installer, but I can not found the option of connector/c in the installer wizard, what? Are you kidding me - Oracle?

### Use [wheel](https://pypi.org/project/wheel/)
As the mysqlclient suggested, we can use a wheel file to install directly.
I download thew wheel file from https://www.lfd.uci.edu/~gohlke/pythonlibs/#mysqlclient
I try it by running `pipenv install <pathotthedownloadedwheelfilepath>`, it throw error `mysqlclient-1.3.13-cp37-cp37m-win32.whl is not a supported wheel on this platform.` tried amd_64, not working too ...

I found I am going to back to the old way of compile a c project. 

Found the same problem at [Python Connector for Django 1.9 and Python 3.5? [closed]](https://stackoverflow.com/questions/34456770/python-connector-for-django-1-9-and-python-3-5), the python version I running is 3.6(64 bit).

The root cause is > mysqlclient can not currently be compiled on Python 3.5 for Windows because the MySQL Connector/C is not yet compatible with the Visual Studio 2015 compiler required by Python 3.5. The solution is use mysqlclient 1.3 which have add support for python3.3~

Then I tried `pipenv install mysqlclient==1.3.12` it works!!!!!

### The final solution
- make sure mysql connector/c is installed(the old version like 5.7 of windows mysql server installer have this option)  
- `pipenv install mysqlclient==1.3.12`

### [The pipenv install slow problem](https://github.com/pypa/pipenv/issues/1816)
~~Mostly, it is because the pipenv did not show any progress of the downloading.
As the pipenv using pip cache, and pip have the progress showing. we can download the dependency at first by pip and then run pipenv install -- hope pipenv resolve this prolem ASAP.
`python3 -m install tensorflow`
`pipenv install tensorflow`~~
this still not working


## Refs  
[Why is python dependency management so shit?](https://www.reddit.com/r/Python/comments/51ae8b/why_is_python_dependency_management_so_shit/)

[Better Python dependency while packaging your project](https://medium.com/python-pandemonium/better-python-dependency-and-package-management-b5d8ea29dff1)
