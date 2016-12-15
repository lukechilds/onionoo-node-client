const got         = require('got');
const NodeCache   = require('node-cache');
const querystring = require('querystring');
const pkg         = require('../package.json');

class Onionoo {

  // Constructor returns a new object so instance properties are private
  constructor(options = {}) {

    // Set default options
    this.options = Object.assign({}, {
      baseUrl:    'https://onionoo.torproject.org',
      endpoints:  [
        'summary',
        'details',
        'bandwidth',
        'weights',
        'clients',
        'uptime'
      ]
    }, options);
    if(typeof this.options.cache == 'undefined') {
      this.options.cache = new NodeCache();
    }

    // Return object containing endpoint methods
    return this.options.endpoints.reduce((onionoo, endpoint) => {
      onionoo[endpoint] = this.createEndpointMethod(endpoint);

      return onionoo;
    }, {});
  }

  // Returns cache max age from response headers
  checkResponseMaxAge(response) {
    const cacheControl = response.headers['cache-control'];
    const maxAgeRegex = /max-age=(\d+)/;
    const maxAge = cacheControl && cacheControl.match(maxAgeRegex);
    return maxAge && maxAge[1];
  }

  // Returns a function to make requests to a given endpoint
  createEndpointMethod(endpoint) {
    return args => new Promise((resolve, reject) => {

      // Build query string (don't encode ':' for search filters)
      const qs = querystring.encode(args).replace(/%3A/g, ':');

      // Build url
      const url = `${this.options.baseUrl}/${endpoint}?${qs}`;

      // Check for url in cache
      const cachedResult = this.options.cache.get(url);
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
            const ttl = this.checkResponseMaxAge(response);
            if(ttl) {
              this.options.cache.set(url, response.body, ttl);
            }

            // Resolve response
            return response.body;
          }));
      }
    });
  }
}

module.exports = Onionoo;
