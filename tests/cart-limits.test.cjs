const { test } = require('node:test')
const assert = require('node:assert/strict')
const fs = require('node:fs')
const path = require('node:path')
const ts = require('typescript')

function load(relative, imports = {}) {
  const code = ts.transpileModule(fs.readFileSync(path.join(__dirname, '..', relative), 'utf8'), {
    compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2020 },
  }).outputText
  const loaded = { exports: {} }
  new Function('require', 'module', 'exports', code)(name => {
    if (name in imports) return imports[name]
    throw new Error(`Unexpected import: ${name}`)
  }, loaded, loaded.exports)
  return loaded.exports
}

const sugar = load('lib/sugar.ts')
const limits = load('lib/cart-limits.ts', { './sugar': sugar })
const item = id => ({ id, name_en: id, name_km: id, price: 1, category: 'Coffee', available: true })

test('a line stops at 99 and the cart stops at 100', () => {
  let cart = limits.addCartItemWithinLimits([], item('latte'), 99, '', 0)
  assert.equal(limits.remainingQuantity(cart, item('latte'), '', 0), 0)
  cart = limits.addCartItemWithinLimits(cart, item('latte'), 1, '', 0)
  assert.equal(cart[0].quantity, 99)
  cart = limits.addCartItemWithinLimits(cart, item('tea'), 4, '')
  assert.equal(cart[1].quantity, 1)
  assert.equal(limits.remainingQuantity(cart, item('coffee'), ''), 0)
})

test('a new selection stops when the cart has 30 lines', () => {
  const cart = Array.from({ length: 30 }, (_, index) => ({ ...item(`item-${index}`), quantity: 1 }))
  assert.equal(limits.remainingQuantity(cart, item('new'), ''), 0)
  assert.equal(limits.remainingQuantity(cart, item('item-0'), ''), 70)
})
