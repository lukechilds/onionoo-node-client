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
  cache: false
});
```

## Cache

By default no cache is used. You can easily cache in memory or to a more scalable store like Redis using [Keyv storage adapters](https://github.com/lukechilds/keyv#official-storage-adapters).

Cache in memory:

```js
const Onionoo = require('onionoo');

const memory = new Map();
const onionoo = new Onionoo({ cache: memory });
```

Use persistent Redis cache:

```js
const Onionoo = require('onionoo');
const KeyvRedis = require('@keyv/redis');

const redis = new KeyvRedis('redis://user:pass@localhost:6379');
const onionoo = new Onionoo({ cache: redis });
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

Type: `object`<br>
Default: `false`

[Keyv](https://github.com/lukechilds/keyv) storage adapter instance for storing cached data.

### onionoo.endpoint([query])

*Where endpoint is an item from the endpoints array*

Returns a Promise that will resolve once the Onionoo API has responded. The response object contains `statusCode`, `statusMessage`, `headers` and `body` properties.

#### query

Type: `object`

Query object to be url encoded and appended to the `baseUrl`. You can read up on the vast amount of accepted parameters in the [Onionoo API docs](https://metrics.torproject.org/onionoo.html#parameters).

> Note: Colons are not url encoded to allow for Onionoo's `key:value` search filters.

## Related

- [`Onionite`](https://github.com/lukechilds/onionite) - Explore the Tor network

## License

MIT © Luke Childs
