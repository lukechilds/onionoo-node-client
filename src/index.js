const got = require('got')
const cacheManager = require('cache-manager')
const querystring = require('querystring')
const pkg = require('../package.json')
const addSeconds = require('date-fns/add_seconds')
const isFuture = require('date-fns/is_future')
const deepAssign = require('deep-assign')

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

  // Returns expirey date from response headers
  expires (headers) {
    const originDate = new Date(headers.date)

    // Get max age ms
    let maxAge = headers['cache-control'] && headers['cache-control'].match(/max-age=(\d+)/)
    maxAge = parseInt(maxAge ? maxAge[1] : 0)

    // Calculate expirey date
    return addSeconds(new Date(originDate), maxAge)
  }

  // Returns a function to make requests to a given endpoint
  createEndpointMethod (endpoint) {
    return options => {
      // Build query string (don't encode ':' for search filters)
      const qs = querystring.encode(options).replace(/%3A/g, ':')

      // Build url
      const url = `${this.options.baseUrl}/${endpoint}?${qs}`

      // If caching is enabled, check for url in cache
      if (this.options.cache) {
        return this.options.cache.get(url)
          .then(cachedResult => {
            // If we have it cached
            if (cachedResult) {
              // Return the cached entry if it's still valid
              if (isFuture(this.expires(cachedResult.headers))) {
                return cachedResult

              // If it's stale, do a new request with our last-modified date
              } else {
                const options = {
                  headers: {
                    'if-modified-since': cachedResult.headers['last-modified']
                  }
                }
                return this.makeRequest(url, options)
                  .then(response => {
                    // If we get a 304, fill in the body and cache the response
                    if (response.statusCode === 304) {
                      response.body = cachedResult.body
                      this.options.cache.set(url, response)
                    }

                    // Return response
                    return response
                  })
              }
            // If it's not in the cache, just make the request
            } else {
              return this.makeRequest(url)
            }
          })

      // If caching is disabled, just make the request
      } else {
        return this.makeRequest(url)
      }
    }
  }

  // Returns a promise for a request
  makeRequest (url, options = {}) {
    options = deepAssign({
      headers: {
        'user-agent': `onionoo-node-client v${pkg.version} (${pkg.homepage})`
      }
    }, options)

    return got(url, options)
      .catch(error => {
        // Don't throw 304 responses
        if (error.statusCode === 304) {
          return error.response
        } else {
          throw error
        }
      })
      .then(response => {
        // Format response
        response = {
          statusCode: response.statusCode,
          statusMessage: response.statusMessage,
          headers: response.headers,
          body: response.body && JSON.parse(response.body)
        }

        // Cache response
        if (this.options.cache && response.statusCode === 200) {
          this.options.cache.set(url, response)
        }

        // Resolve response
        return response
      })
  }
}

module.exports = Onionoo
