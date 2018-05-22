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

Then I found [DBeaver](https://dbeaver.io/), it is so good, and it have community version which is FREE! It have many useful tool included in the free version which I will introduce in this article. As a javaer, I know it is based on eclipse, how familiar when I see its UI.

## create a connection to postgres on heroku
### add addtional ssl option
For heroku postgres database, you need specify addtional options
?ssl=true&v=w&sslfactory=org.postgresql.ssl.NonValidatingFactory
otherwise you will not be able to connect.
so you need specify these options in the connection panel
![Screen Shot 2018-05-22 at 06.40.06.gif]({{site.baseurl}}/assets/Screen Shot 2018-05-22 at 06.40.06.gif)

### hide non-default database
Right click the connection, edit the connection, show the connection panel.
there are a option shouw non-default database. unckeck it.
![Screen Shot 2018-05-22 at 12.41.34.gif]({{site.baseurl}}/assets/Screen Shot 2018-05-22 at 12.41.34.gif)

What a useful and smart feature! it must be developed by the people who really use it, lol.

## import data from other database
You can import data from one database to another, but they should have the same schema of the tables that you are going to import.

Steps:
- right click the table(only be able to choose one table). 
- select the Import Table Data menu.
then you know how to do the next steps.

## create mock data
A amazing feature of DBeaver is that you can create mock data.
Steps:
- select a table, right click
- select tools menu, then select the Generate Mock Data sub menu.
it will open a wizard to create the mock data. allow you specify data template for each column.
amazing!amazing!amazing!

## export connections configuration
The DBeaver did not provide a UI to export conenctions, but you can do it in this way:
open DBeaver preference panel.
![jjj.gif]({{site.baseurl}}/assets/jjj.gif)
here you found the workplace folder, go to there.
the connections are stored in the file {workspace}/General/.dbeaver-data-sources.xml
you can copy the file to another DBeaver workplace, then you will see all the connections.

I will add more words in this article about DBeaver if I found.