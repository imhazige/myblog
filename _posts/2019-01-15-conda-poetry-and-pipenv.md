---
published: false
---
Last year, I have used python more, mostly related to the AI domain, I am just a novice, but I frequently have the feel that the python is not as popular as its great reputation, it did not mature as a language of a softengineering. I know my opinion should be wrong, but when I encounter problems and try to google, there are few good anwser in a engineering point of view.  

## [Pipenv](https://pypi.org/project/pipenv/)  

The most headache is the dependencies management, I have wrote a post in 2018 [The Python Dependency Tool]({% post_url 2018-07-03-the-python-dependency-tool %}), I was thinking that I found the solution with pipenv, but after a few project, I found pipenv also have problems:  
- It still hard to setup corectlly on Windows, mac, linux. Some days you make it work easily, and suddenly, it will throw an error when you create a new project. Because it also depends on the python you installed on the machine.

- With the above issue, it not easy to set up a pipenv project easily across different platform. and this make it worse when you try to deploy project to the product server, found it is unable to run in the target server. Then you found you still have to use docker.

- It have version management problem. for example `Could not find a version that matches numpy<=1.14.5,==1.15.1,>=1.13.3,>=1.9.0`

- It easy to hang for a long long long time when run `pipenv install`, [see this issue](https://github.com/pypa/pipenv/issues/1816)


## [Conda](https://conda.io)  

These problem is enough for me to try to find another better tool. I had know conda before the pipenv, but strangely, [there are little discussion about the conda](https://www.reddit.com/r/Python/comments/93u6sn/as_we_talk_about_pipenvpoetry_why_not_conda_am_i/), that's make me have a mistaken feel that it may be not popular at all. 

I finally did try [mini conda](https://conda.io/miniconda.html), I feel it is good. It is better than pipenv, but it also can not make you project work in other machine easily, the `environment.yml` is not going to resolve the difference between different platforms, you still need run pip install manually in a new machine when you encounter the problem  

### The common tasks    

Usually we just need use mini conda, it will be smaller to install and we also can add other dependency by pip in the conda enviorment. 

#### Create a environment  

