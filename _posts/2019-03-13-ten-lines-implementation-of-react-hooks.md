---
published: true
layout: post
comments: true
date: '2019-03-13 20:00 +08:00'
type: post
title: 'Ten Lines Implementation of React Hooks'
categories:
  - front-end
tags:
  - react
  - hooks
---

[Code is the best explanation](https://github.com/imhazige/node-examples/blob/master/react-hooks-implementation/index.js)

Inspired by [10 lines implemention of hooks](https://twitter.com/swyx/status/1100833207451185152)

```javascript
export const React = (function() {
  const hooks = [];

  let currentHook = 0;
  return {
    render(Component) {
      const App = Component();
      // run effects
      App.render();
      currentHook = 0;
      // reset for next render
      return App;
    },
    /**
     * similar to https://reactjs.org/docs/hooks-reference.html#conditionally-firing-an-effect
     * @param {*} callback
     * @param {*} depArray
     */
    useEffect(callback, depArray) {
      const hasNoDeps = !depArray;
      let deps = hooks[currentHook]; // type: array | undefined
      const hasChangedDeps = deps
        ? !depArray.every((el, i) => el === deps[i])
        : true;
      if (hasNoDeps || hasChangedDeps) {
        callback();
        deps = depArray;
      }
      currentHook++; // done with this hook
    },
    /**
     * similar to https://reactjs.org/docs/hooks-state.html
     * @param {*} init
     */
    useState(init) {
      hooks[currentHook] = hooks[currentHook] || init; // type: any
      const setStateHookIndex = currentHook; // for setState's closure!
      const setState = newState => (hooks[setStateHookIndex] = newState);
      return [hooks[currentHook++], setState];
    }
  };
})();
```

Array did the magic!
