const querystring = require('querystring');
const got = require('got');
const cacheManager = require('cache-manager');
const expired = require('expired');
const deepAssign = require('deep-assign');
const pkg = require('../package.json');

class Onionoo {

	// Constructor returns a new object so instance properties are private
	constructor(options = {}) {
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
		}, options);
		if (options.cache !== false) {
			this.options.cache = cacheManager.caching(Object.assign({}, {
				store: 'memory',
				max: 500
			}, options.cache));
		}

		// Return object containing endpoint methods
		return this.options.endpoints.reduce((onionoo, endpoint) => {
			onionoo[endpoint] = this.createEndpointMethod(endpoint);

			return onionoo;
		}, {});
	}

	// Returns a function to make requests to a given endpoint
	createEndpointMethod(endpoint) {
		return options => {
			// Build query string (don't encode ':' for search filters)
			const qs = querystring.encode(options).replace(/%3A/g, ':');

			// Build url
			let url = `${this.options.baseUrl}/${endpoint}`;
			url += qs ? `?${qs}` : '';

			// If caching is enabled, check for url in cache
			if (this.options.cache) {
				return this.options.cache.get(url)
					.then(cachedResult => {
						let options = {};

						// If we have it cached
						if (cachedResult) {
							// Return the cached entry if it's still valid
							if (!expired(cachedResult.headers)) {
								return cachedResult;

								// If it's stale, add last-modified date to headers
							} else if (cachedResult.headers['last-modified']) {
								options.headers = {
									'if-modified-since': cachedResult.headers['last-modified']
								};
							}
						}

						// Make a request
						return this.makeRequest(url, options)
							.then(response => {
								// If we get a 304, fill in the body
								if (response.statusCode === 304) {
									response.body = cachedResult.body;
								}

								//  If we get a 200 or 304, cache it
								if ([200, 304].includes(response.statusCode)) {
									this.options.cache.set(url, response);
								}

								return response;
							});
					});
			}
			// If caching is disabled, just make the request
			return this.makeRequest(url);
		};
	}

	// Returns a promise for a request
	makeRequest(url, options = {}) {
		options = deepAssign({
			headers: {
				'user-agent': `onionoo-node-client v${pkg.version} (${pkg.homepage})`
			}
		}, options);

		return got(url, options)
			.catch(err => {
				// Don't throw 304 responses
				if (err.statusCode === 304) {
					return err.response;
				}
				throw err;
			})
			.then(response => {
				// Format response
				response = {
					statusCode: response.statusCode,
					statusMessage: response.statusMessage,
					headers: response.headers,
					body: response.body && JSON.parse(response.body)
				};

				return response;
			});
	}
}

module.exports = Onionoo;
