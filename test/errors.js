import test from 'ava'
import nock from 'nock'
import data from './fixtures/data'
import Onionoo from '../'

test('Handle HTML responses for errors', async t => {
  const onionoo = new Onionoo()

  const defaultEndpoint = data.defaultEndpoints[0]
  const scope = nock(data.defaultBaseUrl)
    .get(`/${defaultEndpoint}`)
    .reply(400, data.dummy400Response)

  try {
    await onionoo[defaultEndpoint]()
  } catch (e) {
    t.deepEqual(e.response.body, data.dummy400Response)
  }

  t.truthy(scope.isDone())
})
