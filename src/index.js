const request   = require('request');
const NodeCache = require('node-cache');

const cache = new NodeCache();

const baseUrl   = 'https://onionoo.torproject.org/';
const endpoints = [
  'summary',
  'details',
  'bandwidth',
  'weights',
  'clients',
  'uptime'
];

function checkResponseCache(response) {
  const cacheControl = response.headers['cache-control'];
  const maxAgeRegex = /max-age=(\d+)/;
  const maxAge = cacheControl && cacheControl.match(maxAgeRegex);
  return maxAge && maxAge[1];
}

module.exports = endpoints.reduce((onionoo, endpoint) => {
  onionoo[endpoint] = args => new Promise((resolve, reject) => {
    const requestOptions = {
      uri:  `${baseUrl}${endpoint}`,
      qs:   args,
      json: true
    };
    const cacheKey = JSON.stringify(requestOptions);

    const cachedResult = cache.get(cacheKey);
    if(cachedResult) {
      resolve(cachedResult);
    }

    request(requestOptions, (error, response, body) => {
      if (!error && response.statusCode == 200) {
        const ttl = checkResponseCache(response);
        if(ttl) {
          cache.set(cacheKey, body, ttl);
        }
        resolve(body);
      } else {
        reject(error || {
          statusCode: response.statusCode,
          statusMessage: response.statusMessage
        });
      }
    })
  });

  return onionoo;
}, {});
