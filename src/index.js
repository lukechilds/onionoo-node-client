const request = require('request');

const baseUrl   = 'https://onionoo.torproject.org/';
const endpoints = [
  'summary',
  'details',
  'bandwidth',
  'weights',
  'clients',
  'uptime'
];

module.exports = endpoints.reduce((onionoo, endpoint) => {
  onionoo[endpoint] = args => new Promise((resolve, reject) => {
    request({
      uri:  `${baseUrl}${endpoint}`,
      qs:   args,
      json: true
    }, (error, response, body) => {
      if (!error && response.statusCode == 200) {
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
