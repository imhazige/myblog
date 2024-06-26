---
published: true
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
```

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
- this is a very useful funtion when start the code from scratch, it will create the database table schema based on the Model definition.
- Note: to sync the Models, the script should imported all the Models definition before invoke the sync function.
- force option is default set to false. `If force is true, each Model will run DROP TABLE IF EXISTS, before it tries to create its own table`

## Jsonb for postgres
[Reference](http://docs.sequelizejs.com/manual/tutorial/querying.html#jsonb)
```javascript
SomeModel.findAll({
  attributes: {
    meta: {
      video: {
        url: {
          [Op.ne]: null
        }
      }
    }
  }
})

SomeModel.findAll({
  attributes: {
    "meta.audio.length": {
      [Op.gt]: 20
    }
  }
})

SomeModel.findAll({
  attributes: {
    "meta": {
      [Op.contains]: {
        site: {
          url: 'http://google.com'
        }
      }
    }
  }
})
```

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
