---
published: true
layout: post
comments: true
date: '2019-11-01 00:00 +08:00'
type: post
title: 'A Way of Meteor DDP page-by-page Pagination'
categories:
  - nodejs
tags:
  - meteor
  - ddp
  - pagination
---
## Idea
The [Meteor document](https://guide.meteor.com/data-loading.html#pagination) have discuss `infinite-scroll` pagination in detail.

Here I want to discuss a way of page-by-page pagination support sort, condition with limited data(page size).

- Shortly, the idea is query the page with skip and limit, only fecth the ObjectID.
- another query is the published cursor only include the data of that page which query based on the ObjectID. 
- And there are another query to find out the total count of the query.
- Also there are a collection to store the total count of the query , the ids and the real page index.

## Detail

### Build query options based on params
```typescript
export type PaginatingParams = {
  // page size
  size: number;
  // page index
  index: number;
  // sort field name
  sort?: string;
  // order
  order?: 'asc' | 'desc'
};

export function buildPaginatingOptions(paginatingParams: PaginatingParams, ops: any = {}) {
  ops = {
    ...ops,
     fields: { '_id': 1 }
  };

  if (paginatingParams.size > -1) {
    ops.skip = paginatingParams.index * paginatingParams.size;
    ops.limit = paginatingParams.size;
  }

  if (paginatingParams.sort) {
    ops.sort = { [paginatingParams.sort]: paginatingParams.order == 'asc' ? 1 : -1 }
  }

  return ops;
}
```
As you see, the buildPaginatingOptions function will create pagination options for mongodb query.

### Query
```typescript
Meteor.publish('List.query.pub', function (args) {
const selector = {
      // some params here
    };
    const ids = List.find(selector, buildPaginatingOptions(paginatingParams)).fetch().map(r => r._id.toString());
    // const ops = buildPaginatingOptions(paginatingParams);
    const total = List.find(selector).count();
    const selectorReal = {  _id: { $in: ids } };
    // records = CampaignSessionList.filterPrivateFields(records);

    let pagingSelector = {
        name,
        paramsHash: hash(args),
    };

    PagingList.upsert(pagingSelector, {
        $set: {
            index: paginatingParams.index,
            total,
            ids,
            updatedAt: now
        },
        $setOnInsert: {
            ...pagingSelector,
            createdAt: now,
        }
    });

    const pagingCursor = PagingList.find(pagingSelector);
    const recordsCursor = List.find(selector, selectorReal);

    return [pagingCursor, recordsCursor];
});
```
So there are three query, one for page ObjectID, one for page data will be used as publication, another is the total count.

The `pagingSelector` is the paging data we will use, we will discuss at later.

### The PagingList

```typescript
schema: {        
        // name
        name: { type: String, optional: false, index: true },
        // params hash
        paramsHash: { type: String, optional: false, index: true },
        // page index
        index: { type: Number, optional: false, index: false },
        // IDs
        ids: { type: Array, optional: false, index: false },
        'ids.$': { type: String, blackbox: true, optional: false, index: false },
        // total count
        total: { type: Number, optional: false, index: false }
    }
```
PagingList store the paging data, we use name and params [hash](https://github.com/puleos/object-hash), to unified a publication, so we can use as many different pagination as we want at a time, and they will not disordered.

### The Front-End
Here I use amazing DDP Client [simpleddp](https://github.com/Gregivy/simpleddp) and [sift](https://github.com/crcn/sift.js) to perform ddp subscribe and filter the data.

```javascript
const pubname = 'List.query.pub';
const subHandler = await ddp.subscribe(name, params);

//
const hashedParams = hash(params);

const { index, total , ids} = ddp.collection('PagingList').filter(sift({
  name: pubname,
  paramsHash: hashedParams
})).fetch()[0];

const coll = ddp.collection('List').filter(sift({
  id:{$in{ids}}
}));

```

## Conclusion

We have do lots of meteor based project, mostly, we want a page-per-page style pagination, we are satisfied with the result by the way I described above.