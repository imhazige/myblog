---
published: true
layout: post
comments: true
date: "2020-09-27 00:00 +08:00"
type: post
title: "2020-09-27-outline-of-the-important-share-Arguments-for-Meteor"
categories:
  - nodejs
tags:
  - meteor.js
---

This article is the outline or note of the important share about high-performance meteor - ["Arguments for Meteor - Theodor Diaconu, CEO of Cult of Coders: “Redis Oplog, Grapher, and Apollo Live."](https://drive.google.com/file/d/1Tx9vO-XezO3DI2uAYalXPvhJ-Avqc4-q/view), because there are much useful experience on using meteor in production.

## [RedisOplog](https://github.com/cult-of-coders/redis-oplog)

![](https://res.cloudinary.com/kazge/image/upload/v1601185269/blog/redisoplog_lguilb.png)

This is the solution that resolve mongodb oplog performance bottleneck. Simply to say, as the diagram above show, changes will goto mongodb, also noticed to Redis's high-performance pub/sub system and distributed to the clients. [More detail...](https://github.com/cult-of-coders/redis-oplog/blob/master/docs/how_it_works.md)

[It support Outside Mutations](https://github.com/cult-of-coders/redis-oplog/blob/master/docs/outside_mutations.md)

### The improve result with RedisOplog

- Hive.com
  - Avg CPU% has gone from 27% down to 16.5%
  - Peak CPU no longer spikes above 20% (previously, some methods could cause spikes to over 80% cpu pretty regularly)
  - Normalized system CPU has dropped from 12% to 2.5% at full user load
- classcraft.com
  - Number of servers / 1000 Users drop from 5 to less than 2
- classroomapp.com
  - Number of servers / 1000 Users drop from more than 6 to less than 1.5

### With [OplogToRedis](https://github.com/tulip/oplogtoredis)

This program tails the oplog of a Mongo server, and publishes changes to Redis. It's designed to work with the redis-oplog Meteor package.

## GraphQL and Apollo

### [cultofcoders:apollo](https://github.com/cult-of-coders/apollo) - Plug and Play Zero-Config GraphQL Server

```javascript
// file: server/main.js
import { initialize } from "meteor/cultofcoders:apollo";
import { load } from "graphql-load";

load({
  typeDefs: `
    type Query {
      sayHello: String
    }
  `,
  resolvers: {
    Query: {
      sayHello: () => "Hello world!",
    },
  },
});

initialize();
```

### [graphql-load](https://github.com/cult-of-coders/graphql-load) - stitching your type definitions and resolvers together

```javascript
import { makeExecutableSchema } from "graphql-tools";
import { load, getSchema } from "graphql-load";

// anywhere around your code
load({
  typeDefs: `
    type Query {
      sayHello: String
    }
  `,
  resolvers: {
    Query: {
      sayHello: () => "Hello!",
    },
  },
});

// after everything got loaded, create the GraphQLSchema
const schema = makeExecutableSchema(getSchema());
```

### [apollo-live-server](https://github.com/cult-of-coders/apollo-live-server) + [apollo-live-client (React)](https://github.com/cult-of-coders/apollo-live-client)

make graphql subscription reactive with meteor

```javascript
import { asyncIterator } from 'apollo-live-server';

{
  Subscription: {
    notifications: {
      resolve: payload => payload,
      subscribe(_, args, { db }, ast) {
        // We assume that you inject `db` context with all your collections
        // If you are using Meteor, db.notifications is an instance of Mongo.Collection
        const observable = db.notifications.find();

        return asyncIterator(observable);
      }
    }
  }
}
```

## [grapher](https://github.com/cult-of-coders/grapher) - Meteor Collection Joins + Reactive GraphQL like queries

- Blends in with Apollo GraphQL making it highly performant
- Working with cultofcoders:apollo
