# onionoo-node-client

> Node.js client library for the Tor Onionoo API

[![Build Status](https://travis-ci.org/lukechilds/onionoo-node-client.svg?branch=master)](https://travis-ci.org/lukechilds/onionoo-node-client)
[![Coverage Status](https://coveralls.io/repos/github/lukechilds/onionoo-node-client/badge.svg?branch=master)](https://coveralls.io/github/lukechilds/onionoo-node-client?branch=master)
[![npm](https://img.shields.io/npm/v/onionoo.svg)](https://www.npmjs.com/package/onionoo)

Promise based client library for the Tor Onionoo API. Includes DB agnostic caching.

## Install

```shell
npm install --save onionoo
```

## Usage

```js
const Onionoo = require('onionoo');
const onionoo = new Onionoo();

// Get top 10 relays
const query = {
  limit: 10,
  running: true,
  order: '-consensus_weight'
};

onionoo.summary(query).then(response => {
    console.log(response.body)
    // {
    //   version:'3.1',
    //   relays_published:'2016-12-23 09:00:00',
    //   relays:[
    //     [Object],
    //     [Object],
    //     [Object],
    //     [Object],
    //     [Object],
    //     [Object],
    //     [Object],
    //     [Object],
    //     [Object],
    //     [Object]
    //   ],
    //   bridges_published:'2016-12-23 07:41:03',
    //   bridges:[]
    // }
});
```

You can override the default options when instantiating a new `Onionoo` instance:

```js
const Onionoo = require('onionoo');
const onionoo = new Onionoo({
  baseUrl: 'https://onionoo.torproject.org',
  endpoints: [
    'summary',
    'details',
    'bandwidth',
    'weights',
    'clients',
    'uptime'
  ],
  cache: {
    store: 'memory',
    ttl: 18000,
    max: 500
  }
});
```

## Cache Stores

This module makes use of [`node-cache-manager`](https://github.com/BryanDonovan/node-cache-manager) to support multiple cache stores. By default cached responses are stored in memory. You can easily disable the cache or use a more scalable cache store such as Redis by using `node-cache-manager`'s [store engine](https://github.com/BryanDonovan/node-cache-manager#store-engines) modules.

Disable cache:

```js
const Onionoo = require('onionoo');
const onionoo = new Onionoo({
  cache: false
});
```

Use persistent Redis cache:

```js
const Onionoo = require('onionoo');
const redisStore = require('cache-manager-redis');
const onionoo = new Onionoo({
  cache: {
    store: redisStore
  }
});
```

## API

### new Onionoo([options])

Returns a new `Onionoo` instance

#### options

Type: `object`

##### options.baseUrl

Type: `string`<br>
Default: `'https://onionoo.torproject.org'`

String to use as the base url for all API requests.

##### options.endpoints

Type: `array`<br>
Default: `['summary', 'details', 'bandwidth', 'weights', 'clients', 'uptime']`

Array of endpoints to be returned as methods on the `Onionoo` instance.

##### options.cache

Type: `object`, `boolean`<br>
Default: `{ store: 'memory', ttl: 18000, max: 500 }`

Options object to be merged with default options and passed to [`node-cache-manager`](https://github.com/BryanDonovan/node-cache-manager). Alternatively, if set to false, caching will be disabled.

### onionoo.endpoint([query])

*Where endpoint is an item from the endpoints array*

Returns a Promise that will resolve once the Onionoo API has responded. The response object contains `statusCode`, `statusMessage`, `headers` and `body` properties.

#### query

Type: `object`

Query object to be url encoded and appended to the `baseUrl`. You can read up on the vast amount of accepted parameters in the [Onionoo API docs](https://onionoo.torproject.org/protocol.html#methods).

> Note: Colons are not url encoded to allow for Onionoo's `key:value` search filters.

## License

MIT © Luke Childs
