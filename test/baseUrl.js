import test from 'ava'
import nock from 'nock'
import data from './fixtures/data'
import Onionoo from '../'

test('Can pass in custom endpoint', async t => {
  const baseUrl = 'http://foo.com'
  const defaultEndpoint = data.defaultEndpoints[0]
  const onionoo = new Onionoo({ baseUrl })

  const scope = nock(baseUrl)
    .get(`/${defaultEndpoint}`)
    .reply(200, data.dummyResponse)

  const response = await onionoo[defaultEndpoint]()

  t.deepEqual(response.body, data.dummyResponse)
  t.truthy(scope.isDone())
})
