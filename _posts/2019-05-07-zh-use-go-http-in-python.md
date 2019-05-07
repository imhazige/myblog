---
published: true
layout: post
comments: true
date: '2019-05-07 20:00 +08:00'
type: post
title: '在python中运行go webserver'
categories:
  - python
  - golang
tags:
  - golang
---

在 python 中使用 go 做 webserver，便利和性能兼得，有没有这种玩法？

答案是肯定的，就有这么个项目[gohttplib](https://github.com/shazow/gohttplib)

使用示例：

```python
from gohttp import route, run

@route('/')
def index(w, req):
    w.write("%s %s %s\n" % (req.method, req.host, req.url))
    w.write("Hello, world.\n")

run(host='127.0.0.1', port=5000)
```

作者还做了个简单的压力测试

| NAME           | TOTAL  | REQ/SEC | TIME/REQ |
| -------------- | ------ | ------- | -------- |
| go-net/http    | 1.115  | 8969.89 | 0.111    |
| gohttp-c       | 1.181  | 8470.97 | 0.118    |
| gohttp-python  | 1.285  | 7779.87 | 0.129    |
| gunicorn-flask | 7.826  | 1277.73 | 0.783    |
| werkzeug-flask | 15.029 | 665.37  | 1.503    |

看起来性能比flask要好。

然而你需要自己管理 c 的一堆依赖，此项目已经三年没更新了，估计实践效果不怎么样。