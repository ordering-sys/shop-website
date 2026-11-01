import { test } from 'node:test'
import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import { runInNewContext } from 'node:vm'
import ts from 'typescript'

function load(file, globals = {}, imports = {}) {
  const source = readFileSync(new URL(file, import.meta.url), 'utf8')
  const code = ts.transpileModule(source, { compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022 } }).outputText
  const context = { exports: {}, process: { env: {} }, console: { warn() {}, error() {} }, URL, AbortSignal, require: name => {
    if (!(name in imports)) throw new Error(`Unexpected import: ${name}`)
    return imports[name]
  }, ...globals }
  runInNewContext(code, context)
  return context.exports
}

function telegram(env, fetch) {
  return load('../lib/telegram.ts', { process: { env }, fetch }, {
    '@/lib/server-secret': { serverSecret: name => env[name] },
  })
}

test('sends a text-only alert without link previews to each distinct staff chat', async () => {
  const calls = []
  const api = telegram({ TELEGRAM_BOT_TOKEN: 'test-only', TELEGRAM_CHAT_ID: ' 1 ', TELEGRAM_ADMIN_CHAT_ID: '1', TELEGRAM_KITCHEN_CHAT_ID: '2' }, async (url, init) => {
    calls.push({ method: url.split('/').at(-1), ...JSON.parse(init.body) })
    return { ok: true }
  })
  assert.equal(await api.sendTelegram('<b>Order</b>'), true)
  for (const id of ['1', '2']) {
    const sent = calls.filter(call => call.chat_id === id)
    assert.deepEqual(sent.map(call => call.method), ['sendMessage'])
    assert.equal(sent[0].text, '<b>Order</b>')
    assert.equal(sent[0].link_preview_options.is_disabled, true)
  }
  assert.equal(calls.length, 2)
})

test('network failure does not stop alerts to other chats', async () => {
  const calls = []
  const api = telegram({ TELEGRAM_BOT_TOKEN: 'test-only', TELEGRAM_CHAT_ID: '1', TELEGRAM_KITCHEN_CHAT_ID: '2' }, async (_url, init) => {
    const body = JSON.parse(init.body)
    calls.push(body)
    if (body.chat_id === '1') throw new Error('Network unavailable')
    return { ok: true }
  })
  assert.equal(await api.sendTelegram('Order'), true)
  assert.equal(calls.filter(call => call.chat_id === '2').length, 1)
})

test('missing Telegram configuration makes no requests', async () => {
  let calls = 0
  assert.equal(await telegram({}, async () => { calls++; return { ok: true } }).sendTelegram('Order'), false)
  assert.equal(calls, 0)
})

test('reports failure when every staff chat rejects the alert', async () => {
  const api = telegram({ TELEGRAM_BOT_TOKEN: 'test-only', TELEGRAM_CHAT_ID: '1' }, async () => ({ ok: false, status: 500 }))
  assert.equal(await api.sendTelegram('Order'), false)
})

async function submitWithMenu(menuResult) {
  const alerts = [], inserts = []
  const api = load('../types/order/actions.ts', {}, {
    '@/lib/table-access': { checkTableAccess: async () => ({ number: 'T1' }) },
    '@/lib/supabase/admin': { createAdminClient: () => ({ from: table => table === 'orders'
      ? {
        select: () => ({ eq: () => ({ maybeSingle: async () => ({ data: null, error: null }) }) }),
        insert: value => { inserts.push(value); return { select: () => ({ single: async () => ({ data: { id: value.id }, error: null }) }) } },
      }
      : { select: () => { const query = { in: () => query, eq: async () => menuResult }; return query } } }) },
    '@/lib/telegram': { sendTelegram: async (...args) => alerts.push(args) },
    '@/lib/sugar': load('../lib/sugar.ts'),
  })
  const result = await api.submitOrder({ tableId: 'T1', token: 'valid-token', requestId: '11111111-1111-4111-8111-111111111111', location: { latitude: 11.5564, longitude: 104.9282, accuracy: 20 }, items: [{ id: 'coffee', price: 0.01, name_en: 'Fake', quantity: 2, notes: 'Less sugar', image_url: 'https://untrusted.example.com/client.jpg' }] })
  return { result, alerts, inserts }
}

test('order alert contains order details without image attachments', async () => {
  const { result, alerts, inserts } = await submitWithMenu({ data: [{ id: 'coffee', name_en: 'Coffee <milk>', name_km: 'Coffee', price: 4, category: 'Coffee', available: true, image_url: 'https://images.example.com/saved.jpg' }], error: null })
  assert.equal(result.success, true)
  assert.equal(inserts[0].total, 8)
  assert.equal(inserts[0].items[0].price, 4)
  assert.equal(alerts[0].length, 1)
  assert.match(alerts[0][0], /2 × Coffee/)
  assert.match(alerts[0][0], /Less sugar/)
  assert.doesNotMatch(alerts[0][0], /images\.example\.com/)
  assert.match(alerts[0][0], /Coffee &lt;milk&gt;/)
})

test('menu lookup failure rejects the order before insert and alert', async () => {
  const { result, alerts, inserts } = await submitWithMenu({ data: null, error: { message: 'unavailable' } })
  assert.equal(result.success, false)
  assert.equal(inserts.length, 0)
  assert.equal(alerts.length, 0)
})
