import test from 'ava'
import nock from 'nock'
import subSeconds from 'date-fns/sub_seconds'
import data from './fixtures/data'
import Onionoo from '../'

test('Cache can be disabled', async t => {
  const onionoo = new Onionoo({ cache: false })

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

  const scope2 = nock(data.defaultBaseUrl)
    .get(`/${defaultEndpoint}`)
    .reply(200, data.dummyResponse, responseHeaders)

  const response2 = await onionoo[defaultEndpoint]()

  t.deepEqual(response2.body, data.dummyResponse)
  t.truthy(scope2.isDone())
})

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

test('Responses older than max-age are not cached', async t => {
  const onionoo = new Onionoo()

  const defaultEndpoint = data.defaultEndpoints[0]
  const responseHeaders = {
    date: subSeconds(new Date(), 15).toUTCString(),
    age: 0,
    'cache-control': 'public, max-age=10'
  }

  const scope = nock(data.defaultBaseUrl)
    .get(`/${defaultEndpoint}`)
    .reply(200, data.dummyResponse, responseHeaders)

  const response = await onionoo[defaultEndpoint]()

  t.deepEqual(response.body, data.dummyResponse)
  t.truthy(scope.isDone())

  const scope2 = nock(data.defaultBaseUrl)
    .get(`/${defaultEndpoint}`)
    .reply(200, data.dummyResponse, responseHeaders)

  const response2 = await onionoo[defaultEndpoint]()

  t.deepEqual(response2.body, data.dummyResponse)
  t.truthy(scope2.isDone())
})
