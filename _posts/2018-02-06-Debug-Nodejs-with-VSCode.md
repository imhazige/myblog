layout: post
comments: true
title: 'Debug Nodejs with VSCode'
date: 2018-02-06 10:00 +08:00
type: post
published: true
status: publish
categories:
- 'Node.js'
  tags:
- 'javascript'
- 'nodejs'
- 'VSCode'
---
Now Node.js support inspector protocol (>= 6.3 (Windows: >= 6.9)), we can add inspector by run script like this ```shell node --inspect app.js```.

then in the console it will print a url to allow you to inspect from chrome or anyother tool.
```shell
Debugger listening on ws://127.0.0.1:9229/f3155756-0109-41d3-8183-954e04467ab0
For help see https://nodejs.org/en/docs/inspector
```

then we open chrome, type chrome://inspect
it will show the local apps have inspector enabled. select the one you just started, click inspect.
then select source tab, and in the network tab,(ok, I already feel boring.)select the js file, then you can set breakpoint.

It obviously not  handy at all, eveytime you start a app, you need choose, choose...

## So let's try VSCode debug.

first in the package.json

add dev script like this

```json 
"scripts": {
    "dev": "nodemon  --inspect app.js"   
  }
```
then click left debug icon to open debug panel, you will see there are no config, you can click add configration or open launch.json button, if you have not a launch.json, it will create one for you, you select the "Node.js > Launch via NPM" menu from the dropdown list. it will create a configuration.
change the script name to dev which  we have just created in the package.json, also you can chnage the name to the one you like.
```json
"configurations": [
        {
            "type": "node",
            "request": "launch",
            "name": "Debug-Dev",
            "runtimeExecutable": "npm",
            "runtimeArgs": [
                "run-script",
                "dev"
            ],
            "port": 9229
        }
    ]
```
now we can see there are a Debug-Dev launch item in the left debug panel. click the start button, here we go. then you can set breakpoint the vscode. that's all.


### Refs:

https://code.visualstudio.com/docs/nodejs/nodejs-debugging
https://nodejs.org/en/docs/inspector/
https://nodejs.org/api/debugger.html

