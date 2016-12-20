const got = require('got')
const cacheManager = require('cache-manager')
const querystring = require('querystring')
const pkg = require('../package.json')

class Onionoo {

  // Constructor returns a new object so instance properties are private
  constructor (options = {}) {
    // Set default options
    this.options = Object.assign({}, {
      baseUrl: 'https://onionoo.torproject.org',
      endpoints: [
        'summary',
        'details',
        'bandwidth',
        'weights',
        'clients',
        'uptime'
      ]
    }, options)
    if (options.cache !== false) {
      this.options.cache = cacheManager.caching(Object.assign({}, {
        store: 'memory',
        max: 500
      }, options.cache))
    }

    // Return object containing endpoint methods
    return this.options.endpoints.reduce((onionoo, endpoint) => {
      onionoo[endpoint] = this.createEndpointMethod(endpoint)

      return onionoo
    }, {})
  }

  // Returns cache max age from response headers
  calculateResponseMaxAge (headers) {
    // Get max age ms
    const cacheControl = headers['cache-control']
    const maxAgeRegex = /max-age=(\d+)/
    let maxAge = cacheControl && cacheControl.match(maxAgeRegex)
    maxAge = maxAge ? maxAge[1] : 0

    // Take current age into account
    if (headers.age) {
      maxAge -= headers.age
    }

    // Don't return negative values
    return Math.max(0, maxAge)
  }

  // Returns a function to make requests to a given endpoint
  createEndpointMethod (endpoint) {
    return options => {
      // Build query string (don't encode ':' for search filters)
      const qs = querystring.encode(options).replace(/%3A/g, ':')

      // Build url
      const url = `${this.options.baseUrl}/${endpoint}?${qs}`

      // Check for url in cache
      if (this.options.cache) {
        return this.options.cache.get(url).then(cachedResult => cachedResult || this.makeRequest(url))
      } else {
        return this.makeRequest(url)
      }
    }
  }

  // Returns a promise for a request
  makeRequest (url) {
    const options = {
      headers: {
        'user-agent': `onionoo-node-client v${pkg.version} (${pkg.homepage})`
      }
    }
    return got(url, options)
      .then(response => {
        // Format response
        response = {
          statusCode: response.statusCode,
          statusMessage: response.statusMessage,
          headers: response.headers,
          body: JSON.parse(response.body)
        }

        // Cache response
        if (this.options.cache) {
          const ttl = this.calculateResponseMaxAge(response.headers)
          if (ttl) {
            this.options.cache.set(url, response, { ttl })
          }
        }

        // Resolve response
        return response
      })
  }
}

module.exports = Onionoo
