---
published: true
layout: post
comments: true
type: post
title: Simple introduction of postgres NoSql and scale feature
categories:
  - database
tags:
  - postgres
date: '2018-05-04 20:00 +08:00'
---
Recent years, I have see many project using postgres instead of Mysql. it is time to have a try by youself if you have not used it yet.

This article is going to have a simple introduction of the "NoSql" feature and the scale out of the postgres database.

## NoSql
When people say nosql feature of postgres, it mostly meaning the json type of postgres start from version 9. 3.

### jsonb operator
```sql
CREATE TABLE public.json_doc
(
  data jsonb
)
```
the above code create a table 'json_doc', have a column 'data' of type jsonb. There are two JSON data types: json and jsonb. 

> The json data type stores an exact copy of the input text, which processing functions must reparse on each execution; while jsonb data is stored in a decomposed binary format that makes it slightly slower to input due to added conversion overhead, but significantly faster to process, since no reparsing is needed. jsonb also supports indexing, which can be a significant advantage.

> In general, most applications should prefer to store JSON data as jsonb, unless there are quite specialized needs, such as legacy assumptions about ordering of object keys.

### index of jsonb

```sql
CREATE INDEX index_key_name
  ON public.json_doc
  USING gin
  (data);
```
the above code create a index on the column 'data'.

Let's insert some test data.
```sql
INSERT INTO public.json_doc(
            data)
    VALUES (
'
{
    "guid": "9c36adc1-7fb5-4d5b-83b4-90356a46061a",
    "name": "Angela Barton",
    "is_active": true,
    "company": "Magnafone",
    "address": "178 Howard Place, Gulf, Washington, 702",
    "registered": "2009-11-07T08:53:22 +08:00",
    "latitude": 19.793713,
    "longitude": 86.513373,
    "tags": [
        "enim",
        "aliquip",
        "qui"
    ]
}
'
    );

```

#### query operator @>
```shell
postgres=# \c example
You are now connected to database "example" as user "postgres".
example=# SELECT data->'guid', data->'name' FROM json_doc WHERE data @> '{"company": "Magnafone"}';
                ?column?                |    ?column?
----------------------------------------+-----------------
 "9c36adc1-7fb5-4d5b-83b4-90356a46061a" | "Angela Barton"
(1 row)
```
the above query, select specified key from the json which match the condition, the operator "@>" meaning "Does the left JSON value contain the right JSON path/value entries at the top level?"


#### query operator ?
```shell
example=# SELECT data->'guid', data->'name' FROM json_doc WHERE data ? 'registered';
                ?column?                |    ?column?
----------------------------------------+-----------------
 "9c36adc1-7fb5-4d5b-83b4-90356a46061a" | "Angela Barton"
(1 row)
```
the operator ? means that is there a key named "registered" on the top level of the object.
More operator refer to [Table 9-41](https://www.postgresql.org/docs/9.5/static/functions-json.html#FUNCTIONS-JSONB-OP-TABLE)

#### not-top-level key query
So, if we want to query with condition in the nested object, how to do? -- We can create index on nested level.
```sql
CREATE INDEX idxgintags ON json_doc USING GIN ((data -> 'tags'));
```
```shell
example=# SELECT data->'guid', data->'name' FROM json_doc WHERE data->'tags' ? 'qui';
                ?column?                |    ?column?
----------------------------------------+-----------------
 "9c36adc1-7fb5-4d5b-83b4-90356a46061a" | "Angela Barton"
(1 row)
```
the above query select object which have nested key 'qui' in the top level json key 'tags'.

## High Availablilty
I am not saying scalability here is because, [it is a RDB](https://serverfault.com/questions/351072/rdbms-is-it-possible-to-scale-out-a-rdb), [and it even harder to scale out than Mysql?](https://serverfault.com/questions/204700/postgres-vs-mysql-which-one-is-more-difficult-to-scale-out). The [official document](https://www.postgresql.org/docs/current/static/high-availability.html) also focus on the HA.

Failover:
>Many failover systems use just two systems, the primary and the standby, connected by some kind of heartbeat mechanism to continually verify the connectivity between the two and the viability of the primary.

## Refs
[Is Postgres NoSQL Better Than MongoDB?](http://www.aptuz.com/blog/is-postgres-nosql-database-better-than-mongodb/)

[8.14. JSON Types](https://www.postgresql.org/docs/9.5/static/datatype-json.html)

[Chapter 26. High Availability, Load Balancing, and Replication](https://www.postgresql.org/docs/current/static/high-availability.html)
