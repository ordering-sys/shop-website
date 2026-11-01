const { test } = require('node:test')
const assert = require('node:assert/strict')
const fs = require('node:fs')
const path = require('node:path')
const ts = require('typescript')

function action({ authorized = true, orderTable = 'T1', delivered = true } = {}) {
  const sent = []
  const code = ts.transpileModule(fs.readFileSync(path.join(__dirname, '..', 'app/(site)/tracking/[id]/actions.ts'), 'utf8'), {
    compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2020 },
  }).outputText
  const loaded = { exports: {} }
  const imports = {
    '@/lib/telegram': { sendTelegram: async message => { sent.push(message); return delivered } },
    '@/lib/table-access': { checkTableAccess: async () => {
      if (!authorized) throw new Error('Invalid table access')
      return { number: 'T1' }
    } },
    '@/lib/supabase/admin': { createAdminClient: () => ({ from: () => ({
      select: () => ({ eq: () => ({ single: async () => ({ data: { id: '12345678-1234-1234-1234-123456789abc', table_id: orderTable, status: 'preparing' }, error: null }) }) }),
    }) }) },
  }
  new Function('require', 'module', 'exports', code)(name => imports[name], loaded, loaded.exports)
  return { sendWaiterAlert: loaded.exports.sendWaiterAlert, sent }
}

const orderId = '12345678-1234-1234-1234-123456789abc'
const access = { table: 'T1', token: 'qr', location: { latitude: 11.5, longitude: 104.9, accuracy: 10 } }

test('waiter alerts require verified access to the order table', async () => {
  const denied = action({ authorized: false })
  await assert.rejects(denied.sendWaiterAlert(orderId, access))
  assert.equal(denied.sent.length, 0)

  const wrongTable = action({ orderTable: 'T2' })
  await assert.rejects(wrongTable.sendWaiterAlert(orderId, access))
  assert.equal(wrongTable.sent.length, 0)

  const allowed = action()
  await allowed.sendWaiterAlert(orderId, access)
  assert.equal(allowed.sent.length, 1)

  const failedDelivery = action({ delivered: false })
  await assert.rejects(failedDelivery.sendWaiterAlert(orderId, access), /could not be delivered/)
  assert.equal(failedDelivery.sent.length, 1)
})
