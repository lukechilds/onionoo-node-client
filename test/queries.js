import test from 'ava'
import nock from 'nock'
import data from './fixtures/data'
import Onionoo from '../'

test('Query string is built correctly', async t => {
  const onionoo = new Onionoo()

  const defaultEndpoint = data.defaultEndpoints[0]
  const scope = nock(data.defaultBaseUrl)
    .get(`/${defaultEndpoint}?foo=bar`)
    .reply(200, data.dummyResponse)

  const response = await onionoo[defaultEndpoint]({ foo: 'bar' })

  t.deepEqual(response.body, data.dummyResponse)
  t.truthy(scope.isDone())
})

test('":" char isn\'t url encoded so filters work', async t => {
  const onionoo = new Onionoo()

  const defaultEndpoint = data.defaultEndpoints[0]
  const scope = nock(data.defaultBaseUrl)
    .get(`/${defaultEndpoint}?foo=key:value`)
    .reply(200, data.dummyResponse)

  const response = await onionoo[defaultEndpoint]({ foo: 'key:value' })

  t.deepEqual(response.body, data.dummyResponse)
  t.truthy(scope.isDone())
})
