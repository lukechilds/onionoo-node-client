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

test('Onionoo instance contains endpoint methods', t => {
  const onionoo = new Onionoo()

  Object.keys(onionoo).forEach(endpoint => {
    t.is(typeof onionoo[endpoint], 'function')
  })
})
