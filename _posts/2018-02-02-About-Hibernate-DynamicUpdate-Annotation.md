---
layout: post
comments: true
title: "About Hibernate DynamicUpdate Annotation"
date: 2018-02-02 10:00 +00:00
type: post
published: true
status: publish
categories:
- java
- database
tags:
- hibernate
- spring
- JPA
---
### tl;dr:

>  [@DynamicUpdate](https://docs.jboss.org/hibernate/orm/5.2/userguide/html_single/Hibernate_User_Guide.html#pc-managed-state-dynamic-update) in Hibernate will check value change based a reference. not the simple rule that if a field is null.

Normally, Hibernate will build sql include all the fields of a table when invoke ```java repository.save ```, if we want to update the fields which only have not null value. We may think of using @DynamicUpdate, but it did not work. Why?

Because, DynamicUpdate is not work in a way that check a value is null or not, but "The dynamic update allows you to set just the columns that were modified in the associated entity." So question is, how the hibernate estimate that a field is changed, it need a reference, so one case is you get a entity from hibernate(from database or cache), then change some value. Hibernate know what fields have changed; another case is you create a new object, in this way, hibernate of course will not know how many fields changed, so it will include all except the id.

## More need to know:

> The default UPDATE statement containing all columns has two advantages:
>
> - it allows you to better benefit from JDBC Statement caching.
> - it allows you to enable batch updates even if multiple entities modify different properties.
>
> However, there is also one downside to including all columns in the SQL UPDATE statement. If you have multiple indexes, the database might update those redundantly even if you don’t actually modify all column values.
>

["How dynamic-update=true works internally in hibernate?"](https://stackoverflow.com/questions/41633250/how-dynamic-update-true-works-internally-in-hibernate)

You also can look at this project -[**benchmark-test-java-php-nodejs**](https://github.com/imhazige/benchmark-test-java-php-nodejs/tree/master/java/springboot) to see the simple example.