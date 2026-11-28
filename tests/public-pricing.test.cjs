const { test } = require('node:test')
const assert = require('node:assert/strict')
const fs = require('node:fs')
const path = require('node:path')
const ts = require('typescript')

function load(file, mocks = {}) {
  const { outputText } = ts.transpileModule(fs.readFileSync(path.join(__dirname, '..', file), 'utf8'), {
    compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2020 },
  })
  const module = { exports: {} }
  new Function('require', 'module', 'exports', outputText)(name => {
    if (!(name in mocks)) throw new Error(`Unexpected import: ${name}`)
    return mocks[name]
  }, module, module.exports)
  return module.exports
}

const active = { id: 'starter', name: 'Starter', price: '12.50', monthly_price: '12.50', billing_interval: 'monthly', offering_type: 'system', staff_limit: 3, table_limit: 10, features: 'QR menu\r\n\nKitchen display\n', status: 'active', private_note: 'never publish' }
const settings = { name: 'Ordering service', support_email: 'support@example.com', onboarding: 'open', private_note: 'secret' }

function fixture({ plans = [active, { ...active, id: 'hidden', status: 'archived' }], config = settings, planError = false, settingsError = false, throws = false, legacy = false, styleError = false } = {}) {
  const reads = []
  const db = { from(table) {
    assert.ok(['platform_plans', 'platform_settings'].includes(table), `Private table read: ${table}`)
    const read = { table, columns: '', filters: [] }
    reads.push(read)
    const query = {
      select(columns) { read.columns = columns; assert.notEqual(columns, '*'); return this },
      eq(key, value) { read.filters.push([key, value]); return this },
      order() { return this }, limit() { return this },
      async maybeSingle() { return { data: config, error: settingsError } },
      then(resolve, reject) {
        const data = plans.filter(row => read.filters.every(([key, value]) => row[key] === value))
        const error = legacy && read.columns.includes('billing_interval') ? { code: '42703' }
          : styleError && read.columns.includes('card_style') ? { code: '42703' } : planError
        return Promise.resolve({ data, error }).then(resolve, reject)
      },
    }
    return query
  } }
  const loader = load('lib/public-pricing.ts', { 'server-only': {}, '@/lib/supabase/admin': { createAdminClient() { if (throws) throw new Error('Missing credentials'); return db } } })
  return { ...loader, reads }
}

test('public pricing returns only active plans and explicit public fields', async () => {
  const f = fixture()
  const result = await f.getPublicPricing()
  assert.equal(result.plans.length, 1)
  assert.deepEqual(result.plans[0], { id: 'starter', name: 'Starter', price: 12.5, billingInterval: 'monthly', offeringType: 'system', staffLimit: 3, tableLimit: 10, features: ['QR menu', 'Kitchen display'], cardStyle: 'standard', accent: '#d98a2b' })
  assert.equal(result.contactEmail, 'support@example.com')
  assert.equal(result.acceptingSubscriptions, true)
  assert.equal(JSON.stringify(result).includes('secret'), false)
  assert.equal(JSON.stringify(result).includes('never publish'), false)
  assert.deepEqual(f.reads[0].filters, [['status', 'active']])
  assert.equal(f.reads[0].columns, 'id, name, price, billing_interval, offering_type, staff_limit, table_limit, features')
  assert.equal(f.reads[1].columns, 'name, support_email, onboarding')
})

test('paused onboarding, missing settings, and invalid email disable subscription requests', async () => {
  for (const config of [{ ...settings, onboarding: 'paused' }, null, { ...settings, support_email: 'bad\r\nBcc:other@example.com' }]) {
    const result = await fixture({ config }).getPublicPricing()
    assert.equal(result.acceptingSubscriptions, false)
    assert.equal(result.plans.length, 1)
  }
  const result = await fixture({ settingsError: true }).getPublicPricing()
  assert.equal(result.contactEmail, null)
  assert.equal(result.acceptingSubscriptions, false)
})

test('empty catalog, failed database, and invalid plan amounts have distinct safe results', async () => {
  assert.equal((await fixture({ plans: [] }).getPublicPricing()).unavailable, false)
  for (const options of [{ planError: true }, { throws: true }]) {
    const result = await fixture(options).getPublicPricing()
    assert.equal(result.unavailable, true)
    assert.deepEqual(result.plans, [])
  }
  for (const changes of [{ price: null }, { price: 'NaN' }, { price: -1 }, { staff_limit: 0 }, { table_limit: 1.5 }, { billing_interval: 'unknown' }, { offering_type: 'unknown' }]) {
    assert.deepEqual((await fixture({ plans: [{ ...active, ...changes }] }).getPublicPricing()).plans, [])
  }
  assert.equal((await fixture({ plans: [{ ...active, price: 0 }] }).getPublicPricing()).plans[0].price, 0)
})

test('admin plan changes are read on the next request and enquiry text is URL encoded', async () => {
  const plans = [{ ...active }]
  const f = fixture({ plans })
  assert.equal((await f.getPublicPricing()).plans[0].price, 12.5)
  plans[0].price = '18.00'
  const plan = (await f.getPublicPricing()).plans[0]
  assert.equal(plan.price, 18)
  plans[0].status = 'archived'
  assert.deepEqual((await f.getPublicPricing()).plans, [])
  const { subscriptionEmail } = load('lib/pricing-types.ts')
  const href = subscriptionEmail('support+plans@example.com', { ...plan, name: 'Cafe & Tea? #1' })
  const query = new URLSearchParams(href.slice(href.indexOf('?') + 1))
  assert.equal(query.get('subject'), 'Pricing enquiry: Cafe & Tea? #1')
  assert.ok(query.get('body').includes('$18.00 USD / month'))
  assert.ok(query.get('body').includes('Plan reference: starter'))
  assert.equal([...query.keys()].length, 2)
})

test('one-time builds and recurring add-ons retain their actual amount and frequency', async () => {
  const f = fixture({ plans: [
    { ...active, id: 'build', price: '999.50', monthly_price: 0, billing_interval: 'one_time' },
    { ...active, id: 'care', price: '90.25', monthly_price: 0, billing_interval: 'yearly', offering_type: 'addon', staff_limit: null, table_limit: null },
  ] })
  const result = await f.getPublicPricing()
  assert.equal(result.plans[0].price, 999.5)
  assert.equal(result.plans[0].billingInterval, 'one_time')
  assert.equal(result.plans[1].offeringType, 'addon')
  assert.equal(result.plans[1].staffLimit, 0)
  const { subscriptionEmail, paymentLabel } = load('lib/pricing-types.ts')
  const buildBody = new URLSearchParams(subscriptionEmail('hello@example.com', result.plans[0]).split('?')[1]).get('body')
  assert.ok(buildBody.includes('$999.50 USD one-time'))
  assert.equal(buildBody.includes('/ month'), false)
  const careBody = new URLSearchParams(subscriptionEmail('hello@example.com', result.plans[1]).split('?')[1]).get('body')
  assert.ok(careBody.includes('$90.25 USD / year'))
  assert.ok(careBody.includes('Optional add-on service'))
  assert.equal(paymentLabel('one_time', 'km'), 'បង់ម្តង')
})

test('pre-migration catalog falls back to monthly system pricing only for missing columns', async () => {
  const result = await fixture({ legacy: true }).getPublicPricing()
  assert.equal(result.unavailable, false)
  assert.equal(result.plans[0].price, 12.5)
  assert.equal(result.plans[0].billingInterval, 'monthly')
  assert.equal(result.plans[0].offeringType, 'system')
  const f = fixture({ planError: { code: '42501' } })
  assert.equal((await f.getPublicPricing()).unavailable, true)
  assert.equal(f.reads.length, 2)
})

test('plan card style and colour are read separately and fall back safely', async () => {
  const plans = [
    { ...active, card_style: 'popular', accent: 'teal' },
    { ...active, id: 'hex', name: 'Hex', card_style: 'premium', accent: '#1E90FF' },
    { ...active, id: 'odd', name: 'Odd', card_style: 'flashy', accent: 'toString' },
  ]
  const f = fixture({ plans })
  const result = await f.getPublicPricing()
  assert.deepEqual(result.plans.map(plan => [plan.id, plan.cardStyle, plan.accent]), [['starter', 'popular', '#119c88'], ['hex', 'premium', '#1e90ff'], ['odd', 'standard', '#d98a2b']])
  const styleRead = f.reads.find(read => read.columns === 'id, card_style, accent')
  assert.ok(styleRead, 'style columns are read with an explicit list')
  assert.deepEqual(styleRead.filters, [['status', 'active']])
  // Before PLAN-STYLE-SETUP.sql (or any style read error) every card is standard amber.
  assert.deepEqual((await fixture({ plans, styleError: true }).getPublicPricing()).plans.map(plan => [plan.cardStyle, plan.accent]), [['standard', '#d98a2b'], ['standard', '#d98a2b'], ['standard', '#d98a2b']])
})
