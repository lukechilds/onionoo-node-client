import test from 'ava';
import nock from 'nock';
import Onionoo from '../';
import data from './fixtures/data';

test('Cache is disabled by default', async t => {
	const onionoo = new Onionoo();

	const defaultEndpoint = data.defaultEndpoints[0];
	const responseHeaders = {
		date: new Date().toUTCString(),
		age: 0,
		'cache-control': 'public, max-age=300'
	};

	const scope = nock(data.defaultBaseUrl)
    .get(`/${defaultEndpoint}`)
    .reply(200, data.dummyResponse, responseHeaders);

	const response = await onionoo[defaultEndpoint]();

	t.false(response.fromCache);
	t.truthy(scope.isDone());

	const scope2 = nock(data.defaultBaseUrl)
    .get(`/${defaultEndpoint}`)
    .reply(200, data.dummyResponse, responseHeaders);

	const response2 = await onionoo[defaultEndpoint]();

	t.false(response2.fromCache);
	t.truthy(scope2.isDone());
});
