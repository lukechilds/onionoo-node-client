import test from 'ava';
import nock from 'nock';
import Onionoo from '../';
import data from './fixtures/data';

test('Onionoo instance contains default endpoints', t => {
	const onionoo = new Onionoo();

	t.deepEqual(Object.keys(onionoo), data.defaultEndpoints);
});

test('Default endpoint makes correct request', async t => {
	const onionoo = new Onionoo();

	const defaultEndpoint = data.defaultEndpoints[0];
	const scope = nock(data.defaultBaseUrl)
    .get(`/${defaultEndpoint}`)
    .reply(200, data.dummyResponse);

	const response = await onionoo[defaultEndpoint]();

	t.deepEqual(response.body, data.dummyResponse);
	t.true(scope.isDone());
});

test('Can pass in custom endpoint array', t => {
	const endpoints = [
		'foo',
		'bar'
	];
	const onionoo = new Onionoo({ endpoints });

	t.deepEqual(Object.keys(onionoo), endpoints);
});

test('Custom endpoint makes correct request', async t => {
	const customEndpoint = 'foo';
	const onionoo = new Onionoo({ endpoints: [customEndpoint] });

	const scope = nock(data.defaultBaseUrl)
    .get(`/${customEndpoint}`)
    .reply(200, data.dummyResponse);

	const response = await onionoo[customEndpoint]();

	t.deepEqual(response.body, data.dummyResponse);
	t.true(scope.isDone());
});
