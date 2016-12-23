# onionoo-node-client

> Node.js client library for the Tor Onionoo API

[![Build Status](https://travis-ci.org/lukechilds/onionoo-node-client.svg?branch=master)](https://travis-ci.org/lukechilds/onionoo-node-client) [![Coverage Status](https://coveralls.io/repos/github/lukechilds/onionoo-node-client/badge.svg?branch=master)](https://coveralls.io/github/lukechilds/onionoo-node-client?branch=master)

Client library for the Tor Onionoo API with backend agnostic caching.

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
    }
});
```

## License

MIT © Luke Childs
