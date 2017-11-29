import test from 'ava';
import nock from 'nock';
import Onionoo from '../';
import data from './fixtures/data';

test('Can pass in custom endpoint', async t => {
	const baseUrl = 'http://foo.com';
	const defaultEndpoint = data.defaultEndpoints[0];
	const onionoo = new Onionoo({ baseUrl });

	const scope = nock(baseUrl)
    .get(`/${defaultEndpoint}`)
    .reply(200, data.dummyResponse);

	const response = await onionoo[defaultEndpoint]();

	t.deepEqual(response.body, data.dummyResponse);
	t.true(scope.isDone());
});
