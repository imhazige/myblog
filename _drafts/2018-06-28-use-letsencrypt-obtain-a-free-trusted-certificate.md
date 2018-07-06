---
published: false
layout: post
comments: true
date: '2018-06-28 20:00 +08:00'
type: post
categories:
  - web
tags:
  - https
title: Use letsencrypt obtain a free trusted certificate
---
[Let’s Encrypt](https://letsencrypt.org/about/) is a free, automated, and open certificate authority (CA), run for the public’s benefit. It is a service provided by the [Internet Security Research Group (ISRG)](https://letsencrypt.org/isrg/)

## The easiest way
The easiest way is use [Caddy](https://github.com/mholt/caddy), Caddy is a "Fast, cross-platform HTTP/2 web server with automatic HTTPS"

### Make sure you have set up the domain record correctly
If your DNS is not working yet, you could be instantly throttled by Let’s Encrypt for up to a week. So you can test with http at first.



## Refs:  
[letsencrypt documents](https://letsencrypt.org/docs/)
