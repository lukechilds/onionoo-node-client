import test from 'ava';
import nock from 'nock';
import subSeconds from 'date-fns/sub_seconds';
import delay from 'delay';
import Onionoo from '../';
import data from './fixtures/data';

test('Cache can be disabled', async t => {
	const onionoo = new Onionoo({cache: false});

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

	t.deepEqual(response.body, data.dummyResponse);
	t.truthy(scope.isDone());

	const scope2 = nock(data.defaultBaseUrl)
    .get(`/${defaultEndpoint}`)
    .reply(200, data.dummyResponse, responseHeaders);

	const response2 = await onionoo[defaultEndpoint]();

	t.deepEqual(response2.body, data.dummyResponse);
	t.truthy(scope2.isDone());
});

test('Responses with future max-age are cached', async t => {
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

	t.deepEqual(response.body, data.dummyResponse);
	t.truthy(scope.isDone());

	const cachedResponse = await onionoo[defaultEndpoint]();

	t.deepEqual(cachedResponse.body, data.dummyResponse);
});

test('Responses older than max-age are not cached', async t => {
	const onionoo = new Onionoo();

	const defaultEndpoint = data.defaultEndpoints[0];
	const responseHeaders = {
		date: subSeconds(new Date(), 15).toUTCString(),
		age: 0,
		'cache-control': 'public, max-age=10'
	};

	const scope = nock(data.defaultBaseUrl)
    .get(`/${defaultEndpoint}`)
    .reply(200, data.dummyResponse, responseHeaders);

	const response = await onionoo[defaultEndpoint]();

	t.deepEqual(response.body, data.dummyResponse);
	t.truthy(scope.isDone());

	const scope2 = nock(data.defaultBaseUrl)
    .get(`/${defaultEndpoint}`)
    .reply(200, data.dummyResponse, responseHeaders);

	const response2 = await onionoo[defaultEndpoint]();

	t.deepEqual(response2.body, data.dummyResponse);
	t.truthy(scope2.isDone());
});

test('When expired, add last-modified date to headers and handle 304', async t => {
	const onionoo = new Onionoo();

	const defaultEndpoint = data.defaultEndpoints[0];
	const initialDate = new Date().toUTCString();
	const responseHeaders = {
		date: initialDate,
		age: 0,
		'cache-control': 'public, max-age=1',
		'last-modified': initialDate
	};

	const scope = nock(data.defaultBaseUrl)
    .get(`/${defaultEndpoint}`)
    .reply(200, data.dummyResponse, responseHeaders);

	const response = await onionoo[defaultEndpoint]();

	t.deepEqual(response.body, data.dummyResponse);
	t.truthy(scope.isDone());

	const requestHeaders = {
		'if-modified-since': initialDate
	};
	const responseHeaders304 = {
		date: new Date().toUTCString(),
		age: 0,
		'cache-control': 'public, max-age=10',
		'last-modified': initialDate
	};

	const scope2 = nock(data.defaultBaseUrl, {requestHeaders})
    .get(`/${defaultEndpoint}`)
    .reply(304, null, responseHeaders304);

	const response2 = await delay(2000).then(onionoo[defaultEndpoint]);

	t.deepEqual(response2.body, data.dummyResponse);
	t.truthy(scope2.isDone());

	const cachedResponse = await onionoo[defaultEndpoint]();

	t.deepEqual(cachedResponse.body, data.dummyResponse);
});
