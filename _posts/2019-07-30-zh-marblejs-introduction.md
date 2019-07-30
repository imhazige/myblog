---
published: true
layout: post
comments: true
date: '2019-07-30 00:00 +08:00'
type: post
title: 'marblejs介绍'
categories:
  - nodejs
tags:
  - websocket
  - RxJs
---

## 什么是 marblejs

[marblejs](https://github.com/marblejs/marble)是 nodejs 的服务端框架，使用 typescript，[RxJs](http://reactivex.io/rxjs)。
其作用类似于 expressjs 等。

## 特点

一切皆为流，使用管道的方式处理 http 请求流。

### helloworld

路径 `/`的 `GET`请求返回`{ body: 'Hello, world!' }`

```javascript
import { r } from '@marblejs/core';
import { mapTo } from 'rxjs/operators';

export const api$ = r.pipe(
  r.matchPath('/'),
  r.matchType('GET'),
  r.useEffect(req$ => req\$.pipe(
mapTo({ body: 'Hello, world!' }),
)));
```

### 流处理中加入日志打印

```javascript
const logger$ = (
  req$: Observable<HttpRequest>,
  res: HttpResponse
): Observable<HttpRequest> =>
  req$.pipe(tap(req => console.log(`${req.method} ${req.url}`)));

const middlewares = [
  // 👇 注册中间件(middleware)
  logger$
];

const app = httpListener({ middlewares, effects });
```

`tap`将返回原始请求流，因此 logger\$透明的在处理流中打印了请求。

### 提前返回处理

举个例子，如果验证不通过，想要直接跳转

```javascript
const middleware$: HttpMiddlewareEffect = (req$, res) =>
req\$.pipe(
switchMap(() => res.send({ body: 💩, status: 304, headers: /_ ... _/ }),
);
```

`res.send`会导致忽略后面的流处理，直接返回相应。

### 错误处理

```javascript
import { HttpError, HttpStatus } from '@marblejs/core';

const authorize$: HttpMiddlewareEffect = req$ =>
  req$.pipe(
    switchMap(req =>
      iif(
        () => !isAuthorized(req),
        throwError(new HttpError('Unauthorized', HttpStatus.UNAUTHORIZED)),
        of(req)
      )
    )
  );
```

通过内置函数`throwError`，即可返回错误。

404 也是通过这种方式处理的

```javascript
const notFound$ = r.pipe(
  r.matchPath('*'),
  r.matchType('*'),
  r.useEffect(req$ =>
    req$.pipe(
      mergeMap(() =>
        throwError(new HttpError('Route not found', HttpStatus.NOT_FOUND))
      )
    )
  )
);
```

如果要自定义错误处理

```javascript
const customError$: HttpErrorEffect<ThrownError> = (req$, res, meta) =>
  req$.pipe(
    mapTo(meta.error),
    map(error => ({
     status: error.status
     body: error.data
    }),
  );

httpListener({
  middlewares,
  effects,
  // 注册自定义错误处理 👇
  error$: customError$,
});
```

## 高级特性

### [上下文依赖注入](https://docs.marblejs.com/advanced/context)

```javascript
import { createContextToken, reader } from '@marblejs/core';

export const d1Token = createContextToken<string>();
export const d2Token = createContextToken<string>();

//生成两个函数
export const d1 = reader.map(() => 'Hello');
export const d2 = reader.map(ask =>
  ask(d1Token).map(v => v + ', world!').getOrElse('')
);


import { bindTo createServer } from '@marblejs/core';
createServer({
  // ...
  dependencies: [
    //注入依赖
    bindTo(d1Token)(d1),
    bindTo(d2Token)(d2),
  ],
  // ...
});

import { r } from '@marblejs/core';
import { d2Token } from './example';

export const example$ = r.pipe(
  r.matchPath('/'),
  r.matchType('GET'),
  //使用依赖
  r.useEffect((req$, _, { ask }) => req$.pipe(
    mapTo(ask(d2Token).getOrElse('')),
    map(msg => ({ body: msg })),
  )));
```

### [输出拦截](https://docs.marblejs.com/advanced/output)

```javascript
import { HttpOutputEffect, httpListener } from '@marblejs/core';

const output$: HttpOutputEffect = res$ =>
  res$.pipe(
    map(res =>  ... ),
  );

export default httpListener({
  middlewares: [ ... ],
  effects: [ ... ],
  //注册拦截器
  output$,
});
```

## [Websocket](https://docs.marblejs.com/websockets)

Websocket 只支持标准的[RFC 6455](https://www.google.com/url?sa=t&rct=j&q=&esrc=s&source=web&cd=1&ved=2ahUKEwiByOfquMPgAhWBpIsKHXWED_wQFjAAegQICRAB&url=https%3A%2F%2Ftools.ietf.org%2Fhtml%2Frfc6455&usg=AOvVaw06SuiDfKSSeLd0cvyIYrrM) 协议
因此不兼容`Socket.io`。

开启 websocket 是通过 context 注入实现的

```javascript
import { bindTo createServer } from '@marblejs/core';
import { WebSocketServerToken } from './tokens.ts';
import httpListener from './http.listner.ts';
import webSocketListener from './webSocket.listner.ts';

const server = createServer({
  // ...
  httpListener,
  dependencies: [
    bindTo(WebSocketServerToken)(webSocketListener({ port: 8080 }).run),
  ],
  // ...
});

server.run();
```

通过 effect 处理请求

```javascript
export const hello$: WsEffect = event$ =>
  event$.pipe(
    //匹配HELLO事件
    matchEvent('HELLO'),
    mapTo({ type: 'HELLO', payload: 'Hello, world!' })
  );
```

请求的格式为

```json
{
  "type": "HELLO"
}
```

目前已是 2.0 版本。
