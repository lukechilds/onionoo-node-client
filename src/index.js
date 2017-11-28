const querystring = require('querystring');
const got = require('got');
const pkg = require('../package.json');

class Onionoo {

	// Constructor returns a new object so instance properties are private
	constructor(options = {}) {
		// Set default options
		this.options = Object.assign({
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

		// Return object containing endpoint methods
		return this.options.endpoints.reduce((onionoo, endpoint) => {
			onionoo[endpoint] = options => this.get(endpoint, options);

			return onionoo;
		}, {});
	}

	// Make requests to a given endpoint
	get(endpoint, options) {
		// Build query string (don't encode ':' for search filters)
		const qs = querystring.encode(options).replace(/%3A/g, ':');

		// Build url
		let url = `${this.options.baseUrl}/${endpoint}`;
		url += qs ? `?${qs}` : '';

		// Make request
		return got(url, {
			headers: {
				'user-agent': `onionoo-node-client v${pkg.version} (${pkg.homepage})`
			},
			json: true
		});
	}
}

module.exports = Onionoo;
