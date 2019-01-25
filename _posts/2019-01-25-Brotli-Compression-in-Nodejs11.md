---
published: true
layout: post
comments: true
date: '2019-01-25 20:00 +08:00'
type: post
title: 'Brotli Compression in Nodejs11'
categories:
  - nodejs
tags:
  - compression
---

## What's Brotli Format

From [WIKI](https://en.wikipedia.org/wiki/Brotli)

> Brotli is a data format specification[1] for data streams compressed with a specific combination of the general-purpose LZ77 lossless compression algorithm, Huffman coding and 2nd order context modelling. Brotli was initially developed to decrease the size of transmissions of WOFF2 web fonts, and in that context was a continuation of the development of zopfli, which **is a zlib-compatible implementation** of the standard gzip and deflate specifications.

## Nodejs Native Support

[Node v11.7.0](https://nodejs.org/en/blog/release/v11.7.0/) start to support Brotli format natively.

### How to Use

[Code Example](https://github.com/imhazige/node-examples/blob/master/misc_examples/src/nodejs11/brotli.js)

```javascript
const zlib = require('zlib');
const fs = require('fs');

const filename = 'testdata.txt';

async function compressFile1() {
  return new Promise((resolve, reject) => {
    const compress = zlib.createBrotliCompress();
    const input = fs.createReadStream(filename);
    const output = fs.createWriteStream(filename + '.br');

    input.pipe(compress).pipe(output);
    output.on('finish', () => {
      resolve();
    });
    output.on('error', ex => {
      reject(ex);
    });
  });
}

async function uncompressFile1() {
  return new Promise((resolve, reject) => {
    const decompress = zlib.createBrotliDecompress();
    const input = fs.createReadStream(filename + '.br');
    const output = fs.createWriteStream(filename + '.br.txt');

    input.pipe(decompress).pipe(output);
    output.on('finish', () => {
      resolve();
    });
    output.on('error', ex => {
      reject(ex);
    });
  });
}

(async () => {
  console.log('start compress');
  await compressFile1();
  console.log('start uncompress');
  await uncompressFile1();
  console.log('done');
})();

setTimeout(() => {}, 5000);
```

The result is, as it promised, the brotli compression outperform gzip.

[The Official Document](https://nodejs.org/api/zlib.html#zlib_class_zlib_brotlicompress)
