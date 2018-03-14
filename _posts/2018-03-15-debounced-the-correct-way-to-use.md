---
layout: post
comments: true
title: "debounce throttle function - the correct way to use"
date: 2018-03-15 20:00 +08:00
type: post
published: true
status: publish
categories:
- 'front-end'
- 'Javascript'
tags:
- 'web'
---
# The difference between debounce and throttle function:
- debounce - will have delay and wait a while to see if there are new invoke, if there are, renew the delay.  
- throttle - will guarantee execute at the giving period.

here is a good [explanation](http://drupalmotion.com/article/debounce-and-throttle-visual-explanation):

> - Debounce: Think of it as "grouping multiple events in one". Imagine that you go home, enter in the elevator, doors are closing... and suddenly your neighbor appears in the hall and tries to jump on the elevator. Be polite! and open the doors for him: you are debouncing the elevator departure. Consider that the same situation can happen again with a third person, and so on... probably delaying the departure several minutes.
> - Throttle: Think of it as a valve, it regulates the flow of the executions. We can determine the maximum number of times a function can be called in certain time. So in the elevator analogy.. you are polite enough to let people in for 10 secs, but once that delay passes, you must go!


# The mostly wrong usage of debounce or throttle
```javascript
$(window).on('click',function(){
    let debounced = debounce(funtion(){
        //do something
    },100);
    
    debounced(); //aha, why it did not work!!!, becasue you create a new debounce funtion every time the event triggered.
}
             
             
```

# The correct way
```javascript
//create the debounced funtion outside the event
let debounced = debounce(funtion(){
        //do something
    },100);

$(window).on('click',debounced}
             
             
```

We need not more explanation, the reason is simple, just look into the implementation for [undersacore](https://github.com/jashkenas/underscore/blob/master/underscore.js#L882)
or a simpler one:
```javascript
function debounce(func, wait, immediate) {
	var timeout;
	return function() {
		var context = this, args = arguments;
		var later = function() {
			timeout = null;
			if (!immediate) func.apply(context, args);
		};
		var callNow = immediate && !timeout;
		clearTimeout(timeout);
		timeout = setTimeout(later, wait);
		if (callNow) func.apply(context, args);
	};
};
```