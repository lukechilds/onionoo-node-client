import test from 'ava'
import Onionoo from '../'

test('Onionoo is a function', t => {
  t.is(typeof Onionoo, 'function')
})

test('Onionoo cannot be invoked without \'new\'', t => {
  t.throws(() => Onionoo())
  t.notThrows(() => new Onionoo())
})
