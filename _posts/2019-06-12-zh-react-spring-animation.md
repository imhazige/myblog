---
published: true
layout: post
comments: true
date: '2019-06-12 00:00 +08:00'
type: post
title: 'react-spring介绍'
categories:
  - 前端
  - frontend
tags:
  - react
  - animation
---
[react spring](https://www.react-spring.io/)是使用于reactjs的动画工具库。

spring这里是弹簧的意思
![](/assets/react-spring.gif)
因为依据[ react-motion](https://github.com/chenglou/react-motion)作者Cheng Lou的演讲观点，>95%以上的动画特效使用spring即可达到可用的效果，以往那种时间间隔和曲线的动画理念生硬又复杂。

## 使用
### web的例子
```javascript
// 最常用的使用react hook的方式
// 最常用的useSpring接口
import {useSpring, animated} from 'react-spring'

function App() {
  const props = useSpring({opacity: 1, from: {opacity: 0}})
  return <animated.div style={props}>I will fade in</animated.div>
}
// animated.div表示的是'animated.'前缀 + 'div' 标签,
// div可以是任何合法的html标签（这里是web,如果用于react native也可以是react native里的标签）
// react spring就是通过这种方式识别需要应用动画的标签

```
用于文本
```javascript
const props = useSpring({ number: 1, from: { number: 0 } })
return <animated.span>{props.number}</animated.span>
```

作用于自定义组件的例子
```javascript
// React components
const AnimatedDonut = animated(Donut)

// React-native
const AnimatedView = animated(View)

// styled-components, emotion, etc.
const AnimatedHeader = styled(animated.h1)`
  ...;
`
```

### 完整的例子
<iframe src="https://codesandbox.io/embed/88lmnl6w88?fontsize=14" title="88lmnl6w88" allow="geolocation; microphone; camera; midi; vr; accelerometer; gyroscope; payment; ambient-light-sensor; encrypted-media" style="width:100%; height:500px; border:0; border-radius: 4px; overflow:hidden;" sandbox="allow-modals allow-forms allow-popups allow-scripts allow-same-origin"></iframe>


[更多例子](https://www.react-spring.io/docs/hooks/examples)