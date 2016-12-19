import test from 'ava'
import Onionoo from '../'

test('Onionoo is a function', t => {
  t.is(typeof Onionoo, 'function')
})

test('Onionoo cannot be invoked without \'new\'', t => {
  t.throws(() => Onionoo())
  t.notThrows(() => new Onionoo())
})

test('Onionoo instance is an object', t => {
  const onionoo = new Onionoo()

  t.is(typeof onionoo, 'object')
})

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
