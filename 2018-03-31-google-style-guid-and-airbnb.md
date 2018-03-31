---
layout: post
comments: true
title: "Google Javascript style guid and airbnb"
date: 2018-03-31 20:00 +08:00
type: post
published: true
status: publish
categories:
- 'Node.js'
- 'Javascript'
tags:
- 'style'
---
[Google Javascript style guid](https://google.github.io/styleguide/jsguide.html) and [more](https://github.com/google/styleguide)  
[Airbnb Javascript style guid](https://github.com/airbnb/javascript) 

[this article](https://medium.freecodecamp.org/google-publishes-a-javascript-style-guide-here-are-some-key-lessons-1810b8ad050b) have a summary about google style guid.

I am glad that almost all the issue match my style. and I did a rough comparation to auirbnb at here.

### Semicolons ARE required  
- Airbnb - [Same](http://airbnb.io/javascript/#semicolons)

### Don’t use ES6 modules (yet)
- Airbnb - [Not mentioned](http://airbnb.io/javascript/#modules)

### Don’t use var anymore
- Airbnb - [Same](http://airbnb.io/javascript/#references--prefer-const)

### Arrow functions are preferred
- Airbnb - [Same](http://airbnb.io/javascript/#arrows--use-them)

### Use template strings instead of concatenation
- Airbnb - [Same](http://airbnb.io/javascript/#es6-template-literals)

### Don’t use line continuations for long strings (use concatenation)
- Airbnb - [Disagree on - no concatenation, let it be](http://airbnb.io/javascript/#strings--line-length)

### “for… of” is the preferred type of ‘for loop’
- Airbnb - [Disagree on - use loop function instead of for loop](http://airbnb.io/javascript/#iterators--nope)

### Use single quotes, not double quotes
- Airbnb - [Same](http://airbnb.io/javascript/#strings--quotes)

### One variable per declaration
- Airbnb - Not mentioned

About Generators  
[Google did not mentioned](https://google.github.io/styleguide/jsguide.html#features-functions-generators) but 
Airbnb suggest 
[Don’t use generators for now](http://airbnb.io/javascript/#generators--nope)



