---
published: true
layout: post
comments: true
date: '2019-03-03 20:00 +08:00'
type: post
title: 'MobX Redux and React Hook'
categories:
  - web
  - front-end
  - javascript
tags:
  - mobx
  - redux
  - react
---

## React Hooks

Since React v16.7.0-alpha, [Hooks](https://reactjs.org/docs/hooks-overview.html#state-hook) appears and try to provide a tool to support easily [reuse stateful logic between components](https://reactjs.org/docs/hooks-intro.html#its-hard-to-reuse-stateful-logic-between-components).

Hooks are javascript **funtions**, it have the hint as I think that it prefer function programming.

It have two rules:

- Should always use Hooks at the top level of your React **function**.
- Only call Hooks from React **Functions**.

See, word **function** appear many times.

There are two native hooks:

- [state hook](https://reactjs.org/docs/hooks-state.html): useState return a reactive getter and a setter. when change the value via the setter, the value referenced by the getter will able to notice the render to update.
- [effect hook](https://reactjs.org/docs/hooks-effect.html): useEffect make a callback when the component render happen.

We can use state hook and effect hook to build our own custom hook, that mean, hooks can be nested.

## MobX and Redux

### MobX

[MobX](https://mobx.js.org) and [Redux](https://redux.js.org/) are both state management tool. Mobx is so terse and easy to use that it did not want to be call as a framework while Redux should.

MobX is easy to understand and get started, **action** modify **state** and update the **computed values** trigger reactions.
![](https://mobx.js.org/docs/flow.png)

- @observerble making a data structure observable(infective)
- @computed define values that will be derived automatically when relevant data is modified
- autorun will only observe data that is used during the execution of the provided function. use autorun if you have a function that should run automatically but that doesn't result in a new value.
- reaction produces a callback(side effect) only will run after the data expression returns a new value for the first time
- @observer can be used to turn ReactJS components into reactive components. It wraps the component's render function in mobx.autorun to make sure that any data that is used during the rendering of a component forces a re-rendering upon change.
- action should only, and always, be used on functions that modify state.

unlike Redux, in MobX, you can create [store](https://mobx.js.org/best/store.html) as you need, one or many, simply to say, **The main responsibility of stores is to move logic and state out of your components into a standalone testable unit that can be used in both frontend and backend JavaScript.**

### Use Mobx with Hooks

[mobx-react-lite](https://github.com/mobxjs/mobx-react-lite) is maintained by MobX team. it make hooks more easy to use.

```jsx
import { Observer, useObservable } from 'mobx-react-lite';

function ObservePerson(props) {
  const person = useObservable({ name: 'John' });
  return (
    <div>
      {person.name}
      <Observer>{() => <div>{person.name}</div>}</Observer>
      <button onClick={() => (person.name = 'Mike')}>No! I am Mike</button>
    </div>
  );
}
```

### Redux

Redux is more verbose than MobX, It only have one store, when store became large, need reducer or split to small app each with its own store.

Redux need more times lines of code to do the same thing than MobX.

There are already many [comparison](https://www.educba.com/mobx-vs-redux/)

Some one said big team big app should use Redux to make it under control. I don't agree.

Simple is the best!
