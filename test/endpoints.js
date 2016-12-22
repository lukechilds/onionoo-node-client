import test from 'ava'
import data from './fixtures/data'
import Onionoo from '../'

test('Onionoo instance contains default endpoints', t => {
  const onionoo = new Onionoo()

  t.deepEqual(Object.keys(onionoo), data.defaultEndpoints)
})

test('Can pass in custom endpoint array', t => {
  const endpoints = [
    'foo',
    'bar'
  ]
  const onionoo = new Onionoo({ endpoints })

  t.deepEqual(Object.keys(onionoo), endpoints)
})
