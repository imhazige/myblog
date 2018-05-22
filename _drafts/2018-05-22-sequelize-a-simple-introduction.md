---
published: false
layout: post
comments: true
type: post
title: Sequelize a Simple Introduction
categories:
  - front-end
tags:
  - nodejs
date: '2018-05-22 20:00 +08:00'
---
[Sequelize](https://github.com/sequelize/sequelize) "An easy-to-use multi SQL dialect ORM for Node.js"

## Set up connection
[Reference](http://docs.sequelizejs.com/class/lib/sequelize.js~Sequelize.html#instance-constructor-constructor)
```javascript
import Sequelize, { Op } from 'sequelize';

const sequelize = new Sequelize('postgres://postgres:postgres@localhost:5432/postgres', {
  dialect: 'postgres',
  define: {
    freezeTableName: true,
  },
})
```
- The above example set up a database connection with a uri. the dialect specify the database type.
- define option: define the default options of [Model](http://docs.sequelizejs.com/class/lib/model.js~Model.html)
- freezeTableName: `If freezeTableName is true, sequelize will not try to alter the model name to get the table name. Otherwise, the model name will be pluralized`

## Logging sql
### Global setting
```javascript
import Sequelize, { Op } from 'sequelize';

const sequelize = new Sequelize('postgres://postgres:postgres@localhost:5432/postgres', {
  dialect: 'postgres',
  define: {
    freezeTableName: true,
  },
  logging: sql => {
    log.debug(`SQL:${sql}`);
  },
})
### Per-query setting
[Reference](http://docs.sequelizejs.com/class/lib/model.js~Model.html#static-method-upsert)
```javascript
Model.upsert({}, {
   logging: false,
})
```
this options is available for most of the command of the Model.

## Sync database schema
[Reference](http://docs.sequelizejs.com/class/lib/sequelize.js~Sequelize.html#instance-method-sync)
```javascript
import sequelize from '../sequelize';
import User from './User';
import UserLogin from './UserLogin';
import UserClaim from './UserClaim';
import UserProfile from './UserProfile';


function sync(...args) {
  return sequelize.sync(...args);
}
```
Note: to sync the Models, the script should imported all the Models definition before invoke the sync function.

## Jsonb for postgres


## Distinct
[Reference](http://docs.sequelizejs.com/class/lib/sequelize.js~Sequelize.html#static-method-fn)
```javascript
  Model.findAll({
    attributes: [
      [Sequelize.fn('DISTINCT', Sequelize.col('someColumnName')), 'aliasName'],
    ],
  })
    .then(dr => {

    })
    .catch(err => {

    });
```