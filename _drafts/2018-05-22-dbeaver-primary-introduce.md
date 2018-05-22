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
### add addtional ssl option
for heroku postgres database, you need specify addtional options
?ssl=true&v=w&sslfactory=org.postgresql.ssl.NonValidatingFactory
otherwise you will not be able to connect.
so you need specify these options in the connection panel
![Screen Shot 2018-05-22 at 06.40.06.gif]({{site.baseurl}}/assets/Screen Shot 2018-05-22 at 06.40.06.gif)

### hide non-default database
right click the connection, edit the connection, show the connection panel.
there are a option shouw non-default database. unckeck it.
![Screen Shot 2018-05-22 at 12.41.34.gif]({{site.baseurl}}/assets/Screen Shot 2018-05-22 at 12.41.34.gif)



## import data from other database

## create mock data

## export connections configuration