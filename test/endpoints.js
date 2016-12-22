import test from 'ava'
import Onionoo from '../'

test('Onionoo instance contains expected endpoints', t => {
  const onionoo = new Onionoo()
  const expectedEndpoints = [
    'summary',
    'details',
    'bandwidth',
    'weights',
    'clients',
    'uptime'
  ]

  t.deepEqual(Object.keys(onionoo), expectedEndpoints)
})

test('Can pass in custom endpoint array', t => {
  const endpoints = [
    'foo',
    'bar'
  ]
  const onionoo = new Onionoo({ endpoints })

  t.deepEqual(Object.keys(onionoo), endpoints)
})
