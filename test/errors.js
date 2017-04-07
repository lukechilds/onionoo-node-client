import test from 'ava';
import nock from 'nock';
import Onionoo from '../';
import data from './fixtures/data';

test('Handle HTML responses for errors', async t => {
	const onionoo = new Onionoo();

	const defaultEndpoint = data.defaultEndpoints[0];
	const scope = nock(data.defaultBaseUrl)
    .get(`/${defaultEndpoint}`)
    .reply(400, data.dummy400Response);

	try {
		await onionoo[defaultEndpoint]();
	} catch (err) {
		t.deepEqual(err.response.body, data.dummy400Response);
	}

	t.truthy(scope.isDone());
});

test('Throw useful errors for HTTP response codes', async t => {
	const onionoo = new Onionoo();

	const defaultEndpoint = data.defaultEndpoints[0];
	const responseCodes = {
		400: 'Bad Request',
		404: 'Not Found',
		500: 'Internal Server Error',
		503: 'Service Unavailable'
	};

	const requests = Object.keys(responseCodes).map(async responseCode => {
		const scope = nock(data.defaultBaseUrl)
      .get(`/${defaultEndpoint}`)
      .reply(responseCode);

		try {
			await onionoo[defaultEndpoint]();
		} catch (err) {
			t.is(err.message, `Response code ${responseCode} (${responseCodes[responseCode]})`);
			t.is(err.statusCode, parseInt(responseCode, 10));
			t.is(err.statusMessage, responseCodes[responseCode]);
		}
		t.truthy(scope.isDone());
	});

	await Promise.all(requests);
});
