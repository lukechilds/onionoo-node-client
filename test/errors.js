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

test('Throw useful errors for HTTP response codes', async t => {
  const onionoo = new Onionoo()

  const defaultEndpoint = data.defaultEndpoints[0]
  const responseCodes = {
    400: 'Bad Request',
    404: 'Not Found',
    500: 'Internal Server Error',
    503: 'Service Unavailable'
  }

  for (const responseCode in responseCodes) {
    const scope = nock(data.defaultBaseUrl)
      .get(`/${defaultEndpoint}`)
      .reply(responseCode)

    try {
      await onionoo[defaultEndpoint]()
    } catch (e) {
      t.is(e.message, `Response code ${responseCode} (${responseCodes[responseCode]})`)
      t.is(e.statusCode, parseInt(responseCode, 10))
      t.is(e.statusMessage, responseCodes[responseCode])
    }
    t.truthy(scope.isDone())
  }
})
