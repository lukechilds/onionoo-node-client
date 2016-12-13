const got         = require('got');
const NodeCache   = require('node-cache');
const querystring = require('querystring');
const pkg         = require('../package.json');

const cache = new NodeCache();

const baseUrl   = 'https://onionoo.torproject.org';
const endpoints = [
  'summary',
  'details',
  'bandwidth',
  'weights',
  'clients',
  'uptime'
];

// Returns cache max age from response headers
function checkResponseCache(response) {
  const cacheControl = response.headers['cache-control'];
  const maxAgeRegex = /max-age=(\d+)/;
  const maxAge = cacheControl && cacheControl.match(maxAgeRegex);
  return maxAge && maxAge[1];
}

// Returns a function to make requests to a given endpoint
function createEndpointMethod(endpoint) {
  return args => new Promise((resolve, reject) => {

    // Build query string (don't encode ':' for search filters)
    const qs = querystring.encode(args).replace(/%3A/g, ':');

    // Build url
    const url = `${baseUrl}/${endpoint}?${qs}`;

    // Check for url in cache
    const cachedResult = cache.get(url);
    if(cachedResult) {
      resolve(cachedResult);
    } else {

      // Make request
      const options = {
        json: true,
        'user-agent': `onionoo-node-client v${pkg.version} (${pkg.homepage})`
      };
      resolve(got(url, options)
        .then(response => {

          // Cache response
          const ttl = checkResponseCache(response);
          if(ttl) {
            cache.set(url, response.body, ttl);
          }

          // Resolve response
          return response.body;
        }));
    }
  });
}

// Return object containing endpoint methods
module.exports = endpoints.reduce((onionoo, endpoint) => {
  onionoo[endpoint] = createEndpointMethod(endpoint);

  return onionoo;
}, {});
