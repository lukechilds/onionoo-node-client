import test from 'ava'
import nock from 'nock'
import data from './fixtures/data'
import Onionoo from '../'

test('Responses with future max-age are cached', async t => {
  const onionoo = new Onionoo()

  const defaultEndpoint = data.defaultEndpoints[0]
  const responseHeaders = {
    date: new Date().toUTCString(),
    age: 0,
    'cache-control': 'public, max-age=300'
  }

  const scope = nock(data.defaultBaseUrl)
    .get(`/${defaultEndpoint}`)
    .reply(200, data.dummyResponse, responseHeaders)

  const response = await onionoo[defaultEndpoint]()

  t.deepEqual(response.body, data.dummyResponse)
  t.truthy(scope.isDone())

  const cachedResponse = await onionoo[defaultEndpoint]()

  t.deepEqual(cachedResponse.body, data.dummyResponse)
})
