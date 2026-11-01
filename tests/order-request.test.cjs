const { test } = require('node:test')
const assert = require('node:assert/strict')
const fs = require('node:fs')
const path = require('node:path')
const ts = require('typescript')

function load(storage, randomUUID) {
  const code = ts.transpileModule(fs.readFileSync(path.join(__dirname, '../lib/order-request.ts'), 'utf8'), {
    compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2020 },
  }).outputText
  const module = { exports: {} }
  new Function('module', 'exports', 'sessionStorage', 'crypto', code)(module, module.exports, storage, { randomUUID })
  return module.exports
}

test('refresh reuses the request ID for the same cart and changes it for a changed cart', () => {
  const values = new Map()
  const storage = {
    getItem: key => values.get(key) ?? null,
    setItem: (key, value) => values.set(key, value),
    removeItem: key => values.delete(key),
  }
  let counter = 0
  const randomUUID = () => `11111111-1111-4111-8111-${String(++counter).padStart(12, '0')}`
  const cart = [{ id: 'coffee', quantity: 1, sugar_level: 0, notes: '' }]
  const first = load(storage, randomUUID).getOrderRequestId('T1', 'qr', cart)
  const refreshed = load(storage, randomUUID)
  assert.equal(refreshed.getOrderRequestId('T1', 'qr', cart), first)
  const changed = refreshed.getOrderRequestId('T1', 'qr', [{ ...cart[0], quantity: 2 }])
  assert.notEqual(changed, first)
  refreshed.clearOrderRequestId('T1', 'qr', changed)
  assert.notEqual(refreshed.getOrderRequestId('T1', 'qr', [{ ...cart[0], quantity: 2 }]), changed)
})
