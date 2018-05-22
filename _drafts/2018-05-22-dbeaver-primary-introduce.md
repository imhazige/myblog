---
published: false
layout: post
comments: true
date: '2018-05-22 20:00 +08:00'
title: DBeaver a primary introduce
type: post
categories:
  - database
---
I used pgAdmin to connect to postgres, I think it is good, but when I use it to connect to a heroku database, I was shocked that it do list all the database(about 200) in the heroku server instance even I have choose the dafault database to connect. Imagine you have to scroll over the whole list to find a database name - and it do not support search! I then thought how stupid this tool is.

Then I found [DBeaver](https://dbeaver.io/), it is so good, it have many useful tool which I will introduce in this article. As a javaer, I know it is based on eclipse, how familiar when I see its UI.

## create a connection to postgres on heroku
for heroku postgres database, you need specify addtional options
?ssl=true&v=w&sslfactory=org.postgresql.ssl.NonValidatingFactory
otherwise you will not be able to connect.
so you need specify these options in the connection panel

