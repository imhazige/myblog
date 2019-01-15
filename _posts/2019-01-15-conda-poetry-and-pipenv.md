---
published: false
---
Last year, I have used python more, mostly related to the AI domain, I am just a novice, but I frequently have the feel that the python is not as popular as its great reputation, it did not mature as a language of a softengineering. I know my opinion should be wrong, but when I encounter problems and try to google, there are few good anwser in a engineering point of view.  

The most headache is the dependencies management, I have wrote a post in 2018 [The Python Dependency Tool]({% post_url 2018-07-03-the-python-dependency-tool %}), I was thinking that I found the solution with pipenv, but after a few project, I found pipenv also have problems:  
- It still hard to setup corectlly, Windows, mac, linux. sone days you make it work easily, and suddenly, it will throw an error when you create a new project.

- With the above issue, it not easy to set up a pipenv project easily across different platform. and this make it worse when you try to deploy project to the product server, found it is unable to run in the target linux/server 
